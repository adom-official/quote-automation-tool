'use client';
import { useState } from 'react';
import { seedInitialData } from '@/lib/seed';

export function SeedData() {
  const [status, setStatus] = useState('Idle');

  const seed = () => {
    setStatus('Seeding...');
    try {
      seedInitialData();
      setStatus('Done!');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
      <h3 className="font-semibold text-lg mb-2">Seed Data</h3>
      <button onClick={seed} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
        Run Seed
      </button>
      <p className="mt-2 text-sm text-slate-500">Status: {status}</p>
    </div>
  );
}
