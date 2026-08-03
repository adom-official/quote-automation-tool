import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Có',
  cancelText = 'Không',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xl flex items-center justify-center z-[100] p-4">
      <div className="bg-white border border-slate-200 shadow-md w-full max-w-sm overflow-hidden rounded-xl animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1 ">{title}</h3>
              <p className="text-sm text-slate-900 font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 text-slate-700 font-medium hover:bg-slate-100 rounded-xl text-sm transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="px-4 py-2 bg-red-600 text-white font-medium hover:bg-red-700 rounded-xl text-sm transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
