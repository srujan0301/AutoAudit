from pathlib import Path
import sys

REQUIRED_SECTIONS = [
    "## Purpose",
    "## Starter Mapping",
    "## Future Opportunities",
    "## Conclusion",
]


def check_required_sections(file_path: Path) -> bool:
    if not file_path.exists():
        print(f"FAIL: File not found: {file_path}")
        return False

    content = file_path.read_text(encoding="utf-8")

    missing_sections = [
        section for section in REQUIRED_SECTIONS if section not in content
    ]

    if missing_sections:
        print("FAIL: Missing required sections:")
        for section in missing_sections:
            print(f"- {section}")
        return False

    print("Pass, Documentation does have all required sections.")
    return True


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python tools/check_report_doc_quality.py <markdown-file-path>")
        raise SystemExit(1)

    result = check_required_sections(Path(sys.argv[1]))
    raise SystemExit(0 if result else 1)