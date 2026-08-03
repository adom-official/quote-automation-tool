import re
with open("app/dashboard/packages/new/page.tsx", "r") as f: c = f.read()
c = re.sub(r"\.catch\(error => \{.*?(// Navigate)", r"\1", c, flags=re.DOTALL)
with open("app/dashboard/packages/new/page.tsx", "w") as f: f.write(c)
