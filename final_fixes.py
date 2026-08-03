import re

# 1. packages/new/page.tsx
with open("app/dashboard/packages/new/page.tsx", "r") as f: c = f.read()
if "useStore" not in c:
    c = re.sub(r"(import \{ .*?lucide-react.*?;)", r"import { useStore } from '@/lib/store';\n\1", c)
c = c.replace("serverTimestamp()", "Date.now()")
with open("app/dashboard/packages/new/page.tsx", "w") as f: f.write(c)

# 2. packages/page.tsx
with open("app/dashboard/packages/page.tsx", "r") as f: c = f.read()
c = c.replace("const { packages, deletePackage } = useStore();", "const { packages, updatePackage, deletePackage } = useStore();")
with open("app/dashboard/packages/page.tsx", "w") as f: f.write(c)

# 3. quotes/new/page.tsx
with open("app/dashboard/quotes/new/page.tsx", "r") as f: c = f.read()
c = re.sub(r"const \[clients, setClients\] = useState<any\[\]>\(\[\]\);\n\s*const \[packages, setPackages\] = useState<any\[\]>\(\[\]\);\n\s*", "", c)
c = c.replace("serverTimestamp()", "Date.now()")
c = re.sub(r"const id = addQuote\(\{(.*?)\}\)\.catch.*?\}", r"const id = addQuote({\1});", c, flags=re.DOTALL)
with open("app/dashboard/quotes/new/page.tsx", "w") as f: f.write(c)

# 4. users/page.tsx
with open("app/dashboard/users/page.tsx", "r") as f: c = f.read()
c = c.replace("['Miền Bắc', 'Miền Trung', 'Miền Nam']", "[{id: 'mien_bac', label: 'Miền Bắc'}, {id: 'mien_trung', label: 'Miền Trung'}, {id: 'mien_nam', label: 'Miền Nam'}]")
with open("app/dashboard/users/page.tsx", "w") as f: f.write(c)

# 5. quote/[id]/page.tsx
with open("app/quote/[id]/page.tsx", "r") as f: c = f.read()
c = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[id\]\);", "", c, flags=re.DOTALL)
c = re.sub(r"setQuote\(.*?\);", "", c, flags=re.DOTALL)
c = re.sub(r"setLoading\(.*?\);", "", c, flags=re.DOTALL)
with open("app/quote/[id]/page.tsx", "w") as f: f.write(c)

