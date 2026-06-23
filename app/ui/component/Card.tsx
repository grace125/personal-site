
import { ReactNode } from 'react'

export default function Card(props: { children: ReactNode, className?: string, color?: string }) {
    return <div className={`block p-2 rounded-md border-2 border-dashed border-contrast-2 lg:border-r-2 ${props.color ?? "bg-mode-1"} ${props.className}`} > {/* border-r-2 */}
        {props.children}
    </div>
    
}