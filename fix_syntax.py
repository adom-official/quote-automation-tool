import re

files = [
    "app/dashboard/items/page.tsx",
    "app/dashboard/clients/page.tsx",
    "app/dashboard/packages/new/page.tsx",
    "app/dashboard/packages/page.tsx",
    "app/dashboard/quotes/new/page.tsx"
]

for filepath in files:
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Fix items/page.tsx syntax error:
        content = re.sub(r"addItem\({\s*name,\s*price: numericPrice,\s*estimatedTime,\s*}\);\s*}\);", "addItem({\n      name,\n      price: numericPrice,\n      estimatedTime\n    });", content)
        
        # General fix for unbalanced parenthesis from addDoc replacement
        # Find where there's a }); left behind. Actually, it's easier to manually fix them.
        
        with open(filepath, 'w') as f:
            f.write(content)
    except FileNotFoundError:
        pass
