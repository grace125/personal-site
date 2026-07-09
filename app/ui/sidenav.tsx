'use client';

import { InformationCircleIcon, HomeIcon, RocketLaunchIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
    { name: "home", href: "/home", icon: HomeIcon },
    { name: "projects", href: "/projects", icon: RocketLaunchIcon},
    { name: "about", href: "/about", icon: InformationCircleIcon }
]

export default function SideNav() {
    let path = usePathname()
    return <div className="lg:float-right lg:sticky lg:top-4 lg:right-4 lg:ml-4 m-2 lg:w-86 block overflow-auto rounded-md bg-mode-1 border-2 border-dashed border-contrast-2 lg:border-r-2" >
        {links.map((link) => {
            const text_style = path.startsWith(link.href) ? "bg-highlight" : ""
            return <Link 
                key={link.name}
                href={link.href}
                className={`group flex lg:flex-none h-12 grow hover:bg-sidenav-hover hover:hyperlink items-center justify-center lg:justify-start gap-2 p-3 lg:p-2 lg:px-3 text-lg font-medium`}
            >
                <div>
                    <link.icon className="w-[1.5em] inline-block align-middle mr-3"/>
                    <span className={`${text_style}`}>{link.name}</span>
                </div>
            </Link>
        })}
    </div>
        
}