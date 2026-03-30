import xml.etree.ElementTree as ET
import sys

def validate_xml(file_path):
    try:
        # We need to handle the Blogger-specific namespaces to avoid 'undefined prefix' errors during parsing
        # but ET.parse might still fail on some Blogger tags like <b:if>
        # However, it should catch basic syntax errors.
        with open(file_path, 'r', encoding='utf-8') as f:
            xml_content = f.read()
        
        # Elementary check
        ET.fromstring(xml_content)
        print("XML is well-formed (syntactically).")
    except ET.ParseError as e:
        print(f"Parse Error at {e.position}: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    validate_xml(sys.argv[1])
