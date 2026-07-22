import { ReactNode } from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: 'red' | 'blue' | 'amber';
}

const colorClasses: Record<string, string> = {
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    amber: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
};

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = 'Confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = 'red',
}: ConfirmModalProps) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div className="px-6 py-4">
                {message && <div className="text-sm text-slate-600">{message}</div>}
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                    {cancelText}
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-1 ${colorClasses[confirmColor]}`}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
