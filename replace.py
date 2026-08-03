import re
import os

files = [
    "app/dashboard/users/page.tsx",
    "app/dashboard/quotes/new/page.tsx",
    "app/dashboard/quotes/page.tsx",
    "app/dashboard/packages/new/page.tsx",
    "app/dashboard/packages/page.tsx",
    "app/dashboard/clients/page.tsx",
    "app/dashboard/items/page.tsx",
    "app/dashboard/page.tsx",
    "app/quote/[id]/page.tsx"
]

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r') as f:
        content = f.read()

    # Remove firebase imports
    content = re.sub(r"import \{ db \} from '@\/lib\/firebase';\n?", "", content)
    content = re.sub(r"import \{.*?\} from 'firebase\/firestore';\n?", "", content)

    # Add useStore import
    if "useStore" not in content:
        content = re.sub(r"(import \{ .*?lucide-react.*?;)", r"import { useStore } from '@/lib/store';\n\1", content)
        if "lucide-react" not in content:
            content = re.sub(r"(import \{ .*?date-fns.*?;)", r"import { useStore } from '@/lib/store';\n\1", content)

    # Common loading removals
    content = re.sub(r"const \[loading, setLoading\] = useState\(true\);", "const loading = false;", content)

    # 1. items/page.tsx (already partially done but let's fix it)
    if "items/page.tsx" in filepath:
        content = re.sub(r"const { items, addItem, updateItem, deleteItem } = useStore\(\);\n  const loading = false;\s*const loading = false;", "const { items, addItem, updateItem, deleteItem } = useStore();\n  const loading = false;", content)
        
    # 2. clients/page.tsx
    if "clients/page.tsx" in filepath:
        content = re.sub(r"const \[clients, setClients\] = useState<any\[\]>\(\[\]\);\n\s*const loading = false;", "const { clients, addClient, updateClient, deleteClient } = useStore();\n  const loading = false;", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
        content = re.sub(r"addDoc\(collection\(db, 'clients'\), \{(.*?)(?:createdAt: serverTimestamp\(\)\s*)?\}\)\.catch.*?\);", r"addClient({\1});", content, flags=re.DOTALL)
        content = re.sub(r"updateDoc\(doc\(db, 'clients', editingClient\.id\), \{(.*?)\}\)\.catch.*?;", r"updateClient(editingClient.id, {\1});", content, flags=re.DOTALL)
        content = re.sub(r"deleteDoc\(doc\(db, 'clients', clientToDelete\.id\)\)\.catch.*?;", r"deleteClient(clientToDelete.id);\n    setClientToDelete(null);", content)

    # 3. packages/page.tsx
    if "packages/page.tsx" in filepath:
        content = re.sub(r"const \[packages, setPackages\] = useState<any\[\]>\(\[\]\);\n\s*const loading = false;", "const { packages, deletePackage } = useStore();\n  const loading = false;", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
        content = re.sub(r"deleteDoc\(doc\(db, 'packages', packageToDelete\.id\)\)\.catch.*?;", r"deletePackage(packageToDelete.id);\n    setPackageToDelete(null);", content)

    # 4. packages/new/page.tsx
    if "packages/new/page.tsx" in filepath:
        content = re.sub(r"const \[items, setItems\] = useState<any\[\]>\(\[\]\);", "", content)
        if "const { addPackage, items } = useStore();" not in content:
            content = re.sub(r"export default function NewPackagePage\(\) \{", "export default function NewPackagePage() {\n  const { addPackage, items } = useStore();", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
        content = re.sub(r"addDoc\(collection\(db, 'packages'\), \{(.*?)(?:createdAt: serverTimestamp\(\)\s*)?\}\);", r"addPackage({\1});", content, flags=re.DOTALL)

    # 5. quotes/page.tsx
    if "quotes/page.tsx" in filepath:
        content = re.sub(r"const \[quotes, setQuotes\] = useState<any\[\]>\(\[\]\);\n\s*const loading = false;", "const { quotes, deleteQuote } = useStore();\n  const loading = false;", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
        content = re.sub(r"deleteDoc\(doc\(db, 'quotes', quoteToDelete\.id\)\)\.catch.*?;", r"deleteQuote(quoteToDelete.id);\n    setQuoteToDelete(null);", content)

    # 6. quotes/new/page.tsx
    if "quotes/new/page.tsx" in filepath:
        content = re.sub(r"const \[clients, setClients\] = useState<any\[\]>\(\[\]\);\n\s*const \[packages, setPackages\] = useState<any\[\]>\(\[\]\);\n\s*const \[items, setItems\] = useState<any\[\]>\(\[\]\);", "", content)
        if "const { addQuote, clients, packages, items } = useStore();" not in content:
            content = re.sub(r"export default function NewQuotePage\(\) \{", "export default function NewQuotePage() {\n  const { addQuote, clients, packages, items } = useStore();", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => \{.*?\};\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
        # handle setDoc(doc(collection(db, 'quotes')), ...)
        content = re.sub(r"const newQuoteRef = doc\(collection\(db, 'quotes'\)\);\n\s*await setDoc\(newQuoteRef, \{(.*?)(?:createdAt: serverTimestamp\(\)\s*)?\}\);", r"const id = addQuote({\1});", content, flags=re.DOTALL)
        content = re.sub(r"router\.push\(`/quote/\$\{newQuoteRef\.id\}`\);", r"router.push(`/quote/${id}`);", content)

    # 7. quote/[id]/page.tsx
    if "quote/[id]/page.tsx" in filepath:
        content = re.sub(r"const \[quote, setQuote\] = useState<any>\(null\);\n\s*const loading = false;", "const { quotes, updateQuote } = useStore();\n  const loading = false;", content)
        if "const quote = quotes.find(q => q.id === id);" not in content:
             content = re.sub(r"const params = useParams\(\);", r"const params = useParams();\n  const quote = quotes.find(q => q.id === params.id);", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[id\]\);", "", content, flags=re.DOTALL)
        content = re.sub(r"updateDoc\(doc\(db, 'quotes', id as string\), \{ status \}\);", r"updateQuote(id as string, { status });", content)

    # 8. dashboard/page.tsx
    if "dashboard/page.tsx" in filepath:
        content = re.sub(r"const \[stats, setStats\].*?\}\);", "", content, flags=re.DOTALL)
        if "const { clients, packages, quotes } = useStore();" not in content:
            content = re.sub(r"export default function Dashboard\(\) \{", r"export default function Dashboard() {\n  const { clients, packages, quotes } = useStore();\n  \n  const stats = {\n    clients: clients.length,\n    packages: packages.length,\n    quotes: quotes.length,\n    revenue: quotes.filter(q => q.status === 'Đã duyệt').reduce((acc, q) => acc + (q.totalPrice || 0), 0),\n    approvedQuotes: quotes.filter(q => q.status === 'Đã duyệt').length\n  };\n", content)
        content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => \{.*?\};\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)

    # 9. users/page.tsx - remove completely or leave it since it's users? Let's fix it just in case.
    if "users/page.tsx" in filepath:
         content = re.sub(r"useEffect\(\(\) => \{.*?return \(\) => unsubscribe\(\);\n\s*\}, \[\]\);", "", content, flags=re.DOTALL)
         content = re.sub(r"const \[users, setUsers\] = useState<any\[\]>\(\[\]\);\n\s*const loading = false;", "const [users, setUsers] = useState<any[]>([]);\n  const loading = false;", content)

    with open(filepath, 'w') as f:
        f.write(content)

for f in files:
    process_file(f)
