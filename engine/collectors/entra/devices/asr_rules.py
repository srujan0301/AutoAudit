"""Attack Surface Reduction (ASR) rules collector.

Essential Eight Benchmark Controls:
    E8-MAC-2.1: Macros are blocked from making Win32 API calls

Connection Method: Microsoft Graph API
Required Scopes: DeviceManagementConfiguration.Read.All
Graph Endpoints:
    /v1.0/deviceManagement/deviceConfigurations (legacy Endpoint Protection list)
    /beta/deviceManagement/deviceConfigurations/{id} (legacy detail; v1.0 omits ASR fields)
"""

from typing import Any

from collectors.base import BaseDataCollector
from collectors.graph_client import GraphClient


def _normalize_state(raw: str) -> str:
    """Map an Intune ASR enum value to block/audit/warn/disabled."""
    raw = (raw or "").lower()
    if "block" in raw:
        return "block"
    if "audit" in raw:
        return "audit"
    if "warn" in raw:
        return "warn"
    if "disable" in raw or "userdefined" in raw or "off" in raw:
        return "disabled"
    return raw or "not_configured"


class ASRRulesDataCollector(BaseDataCollector):
    """Collects ASR rule configurations from Intune.

    Reads the Win32-API-from-macros ASR rule from legacy Endpoint Protection
    device configurations. The v1.0 schema for
    windows10EndpointProtectionConfiguration omits ASR rule properties; the
    beta endpoint exposes defenderOfficeMacroCodeAllowWin32ImportsType.
    """

    async def collect(self, client: GraphClient) -> dict[str, Any]:
        """Collect ASR rule configuration data."""
        configs = await client.get_all_pages("/deviceManagement/deviceConfigurations")
        for config in configs:
            if "endpointprotection" not in config.get("@odata.type", "").lower():
                continue
            config_id = config.get("id")
            if not config_id:
                continue
            full_config = await client.get(
                f"/deviceManagement/deviceConfigurations/{config_id}", beta=True,
            )
            win32_value = full_config.get("defenderOfficeMacroCodeAllowWin32ImportsType")
            if win32_value:
                return {
                    "win32_api_rule_found": True,
                    "win32_api_rule_state": _normalize_state(win32_value),
                    "source": "legacy_endpoint_protection",
                    "policy_name": config.get("displayName"),
                }

        return {
            "win32_api_rule_found": False,
            "win32_api_rule_state": "not_configured",
            "source": None,
            "policy_name": None,
        }
