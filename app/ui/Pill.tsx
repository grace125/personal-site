import { JSX } from "react";

export type PillCloseButton = {
    onClose?: () => void;
}

export type PillProps = {
    label: string,
    icon?: React.ReactNode,
    className?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    close?: PillCloseButton
}

export default function Pill({ label, icon, close, className, onClick }: PillProps) {
    return <button
        className={`m-2 inline-flex center px-2 py-1 b-0 rounded-full ${className ?? "bg-red-500"}`}
        onClick={onClick}
    >
        {icon && <span className="">{icon}</span>}
        <span>{label}</span>
        {close && <span
            aria-label={`Close ${label}`}
            role="button"
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                close.onClose?.();
            }}
        >
        </span>}
    </button>
}