import os

files = ["Szczegółowe PRD.md", "TRAFFIC_PRD.md", ".cursorrules.md"]

for f in files:
    if os.path.exists(f):
        size = os.path.getsize(f)
        print(f"File: {f}, Size: {size} bytes")
        if size > 0:
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    print(f"--- Content of {f} ---")
                    print(file.read()[:500]) # Print first 500 chars
                    print("--- End of Content ---")
            except Exception as e:
                print(f"Error reading {f}: {e}")
    else:
        print(f"File not found: {f}")
