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
        findings: list[tuple[str, str | None]] = []
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
                findings.append(
                    (_normalize_state(win32_value), config.get("displayName"))
                )

        if not findings:
            return {
                "win32_api_rule_found": False,
                "win32_api_rule_state": "not_configured",
                "source": None,
                "policy_name": None,
            }

        # ASD ML2 requires Block on every profile. If any profile is weaker, the
        # tenant is non-compliant — surface the weakest state and the profile it
        # came from. Order: disabled < audit < warn < block.
        severity = {"disabled": 0, "audit": 1, "warn": 2, "block": 3}
        weakest_state, weakest_name = min(
            findings, key=lambda f: severity.get(f[0], -1)
        )
        return {
            "win32_api_rule_found": True,
            "win32_api_rule_state": weakest_state,
            "source": "legacy_endpoint_protection",
            "policy_name": weakest_name,
        }
