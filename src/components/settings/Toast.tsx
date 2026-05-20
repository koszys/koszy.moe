import { CheckIcon, XIcon } from './Icons';

interface ToastProps {
    toast: { type: 'success' | 'error'; message: string } | null;
}

export default function Toast({ toast }: ToastProps) {
    if (!toast) return null;

    return (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-xl text-sm font-bold z-[200] flex items-center gap-2 transition-all duration-300 animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600/90 border border-green-500 text-white' : 'bg-red-600/90 border border-red-500 text-white'}`}>
            {toast.type === 'success' ? (
                <CheckIcon className="w-5 h-5" />
            ) : (
                <XIcon className="w-5 h-5" />
            )}
            {toast.message}
        </div>
    );
}
