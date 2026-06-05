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
    console.log("aaaa", path)
    return <>
        {links.map((link) => {
            const text_style = path.startsWith(link.href) ? "bg-yellow-300" : ""
            return <Link 
                key={link.name}
                href={link.href}
                className={`group flex h-[48px] grow bg-gray-50 hover:bg-sky-100 items-center justify-center gap-2 rounded-md p-3 text-sm font-medium hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3`}
            >
                <link.icon className="w-6"/>
                <p className={`${text_style}`}>{link.name}</p>
            </Link>
        })}
    </>
}