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
    return <div className="w-full flex-none lg:w-64">
        <div className="block overflow-auto rounded-md bg-white border-r-2 border-b-2 border-dashed " > {/* border-r-2 */}
            {links.map((link) => {
                const text_style = path.startsWith(link.href) ? "bg-yellow-300" : ""
                return <Link 
                    key={link.name}
                    href={link.href}
                    className={`group flex h-12 grow  hover:bg-sky-100 items-center justify-center gap-2 p-3 text-base font-medium hover:text-blue-600 lg:flex-none lg:justify-start lg:p-2 lg:px-3`}
                >
                    <link.icon className="w-6"/>
                    <p className={`${text_style}`}>{link.name}</p>
                </Link>
            })}
        </div>
    </div>
        
}