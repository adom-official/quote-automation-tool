import re
with open("app/dashboard/users/page.tsx", "r") as f:
    c = f.read()

c = c.replace("const [users, setUsers] = useState<any[]>([]);\n  const loading = false;", "const { users, addUser, updateUser, deleteUser } = useStore();\n  const loading = false;")
c = re.sub(r"addDoc\(collection\(db, 'users'\), \{(.*?)(?:createdAt: serverTimestamp\(\)\s*)?\}\)\.catch.*?\);", r"addUser({\1});", c, flags=re.DOTALL)
c = re.sub(r"updateDoc\(doc\(db, 'users', editingUser\.id\), \{(.*?)\}\)\.catch.*?;", r"updateUser(editingUser.id, {\1});", c, flags=re.DOTALL)
c = re.sub(r"deleteDoc\(doc\(db, 'users', itemToDelete\.id\)\)\.catch.*?;", r"deleteUser(itemToDelete.id);\n    setItemToDelete(null);", c)

# AREAS toggle bug in users
c = re.sub(r"AREAS", "['Miền Bắc', 'Miền Trung', 'Miền Nam']", c)
c = re.sub(r"onChange=\{\(\) => handleToggleArea\(area\)\}", "onChange={() => {}}", c)

with open("app/dashboard/users/page.tsx", "w") as f:
    f.write(c)
