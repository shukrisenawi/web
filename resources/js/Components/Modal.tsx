import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {title && (
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-slate-100">
                            <X className="h-5 w-5 text-slate-500" />
                        </button>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
