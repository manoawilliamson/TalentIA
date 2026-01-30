import re

path = "/Users/williamson/Documents/TalentIA/template/src/css/style.css"
with open(path, 'r') as f:
    content = f.read()

# Aggressively remove any space between variant: and !
new_content = re.sub(r'(dark|hover|focus|active):\s+!', r'\1:!', content)

with open(path, 'w') as f:
    f.write(new_content)

print(f"Fixed instances: {len(re.findall(r'(dark|hover|focus|active):\s+!', content))}")
