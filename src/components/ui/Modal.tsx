import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    children: ReactNode;
    bgClass?: string;
    zIndex?: string;
}

export default function Modal({ isOpen = true, onClose, children, bgClass = 'bg-black/50', zIndex = 'z-[100]' }: ModalProps) {

    return createPortal(
        <div className={`fixed inset-0 ${bgClass} ${zIndex} flex items-center justify-center p-4`}>
            <div className="absolute inset-0" onClick={onClose} />
            <div className="relative w-full flex justify-center">
                {children}
            </div>
        </div>,
        document.body
    );
}
