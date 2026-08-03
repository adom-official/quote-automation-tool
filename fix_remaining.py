import re

def rep(file, search, replace):
    with open(file, 'r') as f:
        c = f.read()
    c = re.sub(search, replace, c, flags=re.DOTALL)
    with open(file, 'w') as f:
        f.write(c)

rep("app/dashboard/quotes/new/page.tsx", r"const newDocRef = doc.*?setDoc\(newDocRef, \{(.*?)\}\);", r"const id = addQuote({\1});")
rep("app/dashboard/quotes/new/page.tsx", r"router\.push\(`/quote/\$\{newDocRef\.id\}`\);", r"router.push(`/quote/${id}`);")
rep("app/dashboard/quotes/new/page.tsx", r"import \{ doc, setDoc, serverTimestamp, collection \} from 'firebase\/firestore';", "")
rep("app/dashboard/quotes/new/page.tsx", r"import \{ db \} from '@\/lib\/firebase';", "")

rep("app/dashboard/quotes/page.tsx", r"await deleteDoc\(doc\(db, 'quotes', itemToDelete\)\)\.catch.*?;", r"deleteQuote(itemToDelete);")
rep("app/dashboard/packages/page.tsx", r"updateDoc\(doc\(db, 'packages', editingPackage\.id\), \{(.*?)\}\)\.catch.*?;", r"updatePackage(editingPackage.id, {\1});")
rep("app/dashboard/packages/page.tsx", r"deleteDoc\(doc\(db, 'packages', itemToDelete\.id\)\)\.catch.*?;", r"deletePackage(itemToDelete.id);")

rep("app/dashboard/clients/page.tsx", r"deleteDoc\(doc\(db, 'clients', itemToDelete\.id\)\)\.catch.*?;", r"deleteClient(itemToDelete.id); setItemToDelete(null);")

rep("app/quote/[id]/page.tsx", r"await updateDoc\(doc\(db, 'quotes', quote\.id\), \{ status \}\);", r"updateQuote(quote.id, { status });")
rep("app/quote/[id]/page.tsx", r"setQuote\({\n\s*...quote,\n\s*status\n\s*}\);", "") # No need to set local state if zustand is used, wait, let's keep it just in case, wait, if it uses zustand, quote is directly from quotes.find, so setting state isn't needed.

# For users/page.tsx, let's just make it do nothing or use simple local state since users might not be in the store yet.
# Actually I can just add users to store.
