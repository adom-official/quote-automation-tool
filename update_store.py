with open("lib/store.ts", "r") as f:
    c = f.read()

c = c.replace("type State = {", "type State = {\n  users: any[];\n  addUser: (user: any) => void;\n  updateUser: (id: string, user: any) => void;\n  deleteUser: (id: string) => void;")
c = c.replace("quotes: [],", "quotes: [],\n      users: [],\n      addUser: (user) => set((state) => ({ users: [{ id: uuidv4(), createdAt: Date.now(), ...user }, ...state.users] })),\n      updateUser: (id, user) => set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...user } : u) })),\n      deleteUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),")

with open("lib/store.ts", "w") as f:
    f.write(c)
