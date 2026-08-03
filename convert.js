const fs = require('fs');

function convertFile(path, entityName) {
  let content = fs.readFileSync(path, 'utf8');
  
  // Remove firebase imports
  content = content.replace(/import \{ db \} from '@\/lib\/firebase';\n/, '');
  content = content.replace(/import \{ collection, [^\}]+\} from 'firebase\/firestore';\n/, '');
  content = content.replace(/import \{ doc, onSnapshot, updateDoc \} from 'firebase\/firestore';\n/, '');
  
  // Add zustand import
  if (!content.includes('useStore')) {
    content = content.replace(/import \{ Plus/, "import { useStore } from '@/lib/store';\nimport { Plus");
  }

  // Handle specific pages
  if (path.includes('items/page.tsx')) {
    content = content.replace(/const \[items, setItems\] = useState<any\[\]>\(\[\]\);\n\s*const \[loading, setLoading\] = useState\(true\);/, `const { items, addItem, updateItem, deleteItem } = useStore();\n  const loading = false;`);
    content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, '');
    content = content.replace(/addDoc\(collection\(db, 'items'\), \{([\s\S]*?)createdAt: serverTimestamp\(\)\n\s*\}\)\.catch[^\n]+\n\s*\}\);/g, `addItem({$1});`);
    content = content.replace(/updateDoc\(doc\(db, 'items', editingItem\.id\), \{([\s\S]*?)\}\)\.catch[^\n]+;/g, `updateItem(editingItem.id, {$1});`);
    content = content.replace(/deleteDoc\(doc\(db, 'items', itemToDelete\.id\)\)\.catch[^\n]+;/g, `deleteItem(itemToDelete.id); setItemToDelete(null);`);
  }

  // Add more logic for other pages...
  
  fs.writeFileSync(path, content);
}

// Will continue doing it via shell script or Python which is easier for regex
