with open("app/dashboard/packages/page.tsx", "r") as f: c = f.read()
import re
c = re.sub(r"const \[packages, setPackages\].*?const loading = false;", "const { packages, updatePackage, deletePackage, items } = useStore();\n  const loading = false;", c, flags=re.DOTALL)
with open("app/dashboard/packages/page.tsx", "w") as f: f.write(c)
