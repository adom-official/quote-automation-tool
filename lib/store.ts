import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

type State = {
  users: any[];
  addUser: (user: any) => void;
  updateUser: (id: string, user: any) => void;
  deleteUser: (id: string) => void;
  clients: any[];
  items: any[];
  packages: any[];
  quotes: any[];
  
  addClient: (client: any) => void;
  updateClient: (id: string, client: any) => void;
  deleteClient: (id: string) => void;

  addItem: (item: any) => void;
  updateItem: (id: string, item: any) => void;
  deleteItem: (id: string) => void;

  addPackage: (pkg: any) => void;
  updatePackage: (id: string, pkg: any) => void;
  deletePackage: (id: string) => void;

  addQuote: (quote: any) => string;
  updateQuote: (id: string, quote: any) => void;
  deleteQuote: (id: string) => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      clients: [],
      items: [],
      packages: [],
      quotes: [],
      users: [],
      addUser: (user) => set((state) => ({ users: [{ id: uuidv4(), createdAt: Date.now(), ...user }, ...state.users] })),
      updateUser: (id, user) => set((state) => ({ users: state.users.map(u => u.id === id ? { ...u, ...user } : u) })),
      deleteUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),

      addClient: (client) => set((state) => ({ clients: [{ id: uuidv4(), createdAt: Date.now(), ...client }, ...state.clients] })),
      updateClient: (id, client) => set((state) => ({ clients: state.clients.map(c => c.id === id ? { ...c, ...client } : c) })),
      deleteClient: (id) => set((state) => ({ clients: state.clients.filter(c => c.id !== id) })),

      addItem: (item) => set((state) => ({ items: [{ id: uuidv4(), createdAt: Date.now(), ...item }, ...state.items] })),
      updateItem: (id, item) => set((state) => ({ items: state.items.map(i => i.id === id ? { ...i, ...item } : i) })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),

      addPackage: (pkg) => set((state) => ({ packages: [{ id: uuidv4(), createdAt: Date.now(), ...pkg }, ...state.packages] })),
      updatePackage: (id, pkg) => set((state) => ({ packages: state.packages.map(p => p.id === id ? { ...p, ...pkg } : p) })),
      deletePackage: (id) => set((state) => ({ packages: state.packages.filter(p => p.id !== id) })),

      addQuote: (quote) => { 
        const id = uuidv4();
        set((state) => ({ quotes: [{ id, createdAt: Date.now(), ...quote }, ...state.quotes] }));
        return id;
      },
      updateQuote: (id, quote) => set((state) => ({ quotes: state.quotes.map(q => q.id === id ? { ...q, ...quote } : q) })),
      deleteQuote: (id) => set((state) => ({ quotes: state.quotes.filter(q => q.id !== id) })),
    }),
    {
      name: 'app-storage',
    }
  )
);
