"use client";

import A from "../ui/component/Anchor";
import Card from "../ui/component/Card";
import { clamp } from "../lib/Math";
import { Heading } from "../ui/component/sections/Section";
import { CSSProperties, Fragment, MouseEventHandler, ReactNode } from "react";
import { List } from "../lib/datatypes/List";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShortMonthStr, YearMonthStr } from "../lib/Date";

const tagData = {
    Writing: { 
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-red-100 hover:bg-red-200",
    }, 
    Music: {
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-blue-100 hover:bg-blue-200",
    },
    Software: {
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-amber-100 hover:bg-amber-200"
    },
    Art: {
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-green-100 hover:bg-green-200"
    }, 
    "Programming Languages": {
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-cyan-100 hover:bg-cyan-200",
    }, 
    Prototype: {
        color: "bg-yellow-100 hover:bg-yellow-200"
    }, 
    "Game Dev": {
        color: "bg-yellow-100 hover:bg-yellow-200" // "bg-purple-100 hover:bg-purple-200"
    },
    Tool: {
        color: "bg-yellow-100 hover:bg-yellow-200"
    },
    Design: {
        color: "bg-yellow-100 hover:bg-yellow-200"
    },
    Story: {
        color: "bg-yellow-100 hover:bg-yellow-200"
    }
}

// TODO: move to lib
const objectKeys = <T extends {}>(t: T) => {
    return Object.keys(t) as (keyof typeof t)[]
}

type Tag = keyof typeof tagData
const allTags = objectKeys(tagData)
type TagData = typeof tagData[Tag]

type Project = { name: string, description: ReactNode, href: string, tags: List<Tag>, date: ProjectDateRange } // date: Date

type ProjectDateRange = 
    | { type: "done", start: Date, end: Date } 
    | { type: "ongoing", start: Date }

const projects: List<Project> = List.from([
    {
        name: "Bat-Fish Studio",
        description: <>A <A href="https://www.batfishstudio.ca/">website</A> I've (re)designed for an eco-friendly sustainable fashion brand</>,
        href: "/projects/batfish-studio",
        tags: List.from<Tag>(["Design", "Art", "Software"]),
        date: { type: "ongoing", start: new Date(2026, 5) }
    },
    { 
        name: "Zine Generator", 
        description: "A tool for generating foldable zine layouts.",
        href: "/projects/zine-generator",
        tags: List.from<Tag>(["Art", "Tool", "Software"]),
        date: { type: "done", start: new Date(2026, 5), end: new Date(2026, 5) }
    },
    {
        name: "It's Not You, It's Me",
        description: "A comic about a girl who decides to run away from home, but doesn't know why.",
        href: "/projects/its-not-you-its-me",
        tags: List.from<Tag>(["Art", "Story"]),
        date: { type: "done", start: new Date(2026, 0), end: new Date(2026, 4)}
    },
    {
        name: "Launch-a-Krampus",
        description: `A "turn-based platformer" where you launch Krampus through the air to steal Santa's cookies.`,
        href: "https://orabidon-games.itch.io/launch-a-krampus",
        tags: List.from<Tag>(["Software", "Prototype", "Game Dev"]),
        date: { type: "done", start: new Date(2025, 11), end: new Date(2025, 11) }
    },
    { 
        name: "Scythe", 
        description: "A prototype for a dependently typed programming language, written in Rust; my undergrad honours project.",
        href: "/projects/scythe",
        tags: List.from<Tag>(["Software", "Programming Languages", "Prototype"]),
        date: { type: "done", start: new Date(2024, 0), end: new Date(2024, 4)}
    },
    {
        name: "Microphone Rhythm Game",
        description: "A rhythm game controlled by a real guitar.",
        href: "/projects/microphone-rhythm-game",
        tags: List.from<Tag>(["Software", "Music", "Prototype"]),
        date: { type: "done", start: new Date(2024, 0), end: new Date(2024, 4)}
    },
    {
        name: "Winds of Pilgrimage",
        description: <>A <i>calming</i> puzzle game about exploring an island and solving runic puzzles.</>,
        href: "https://medow.itch.io/winds-of-pilgrimage",
        tags: List.from<Tag>(["Software", "Prototype", "Game Dev"]),
        date: { type: "done", start: new Date(2023, 9), end: new Date(2023, 9) }
    },
    {
        name: "JBall",
        description: "A Breakout clone where the ball grows a mouth and starts talking. ",
        href: "/projects/jball",
        tags: List.from<Tag>(["Software", "Prototype", "Game Dev"]),
        date: { type: "done", start: new Date(2022, 9), end: new Date(2022, 9) }
    },
    {
        name: "Discord Room Manager",
        description: "A Discord bot that uses roles, voice channels, and permissions to simulate rooms in a house.",
        href: "/projects/discord-room-manager",
        tags: List.from<Tag>(["Software", "Writing", "Prototype"]),
        date: { type: "done", start: new Date(2020, 11), end: new Date(2020, 11)}
    },
    // {
    //     name: "Super Cool Free Platformer",
    //     description: "",
    //     href: "/projects/free-platformer",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // }
])

const tagParam = "filterBy"

export function ProjectPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const activeTags = (searchParams.get(tagParam)?.split(",") ?? []) as Tag[]

    const onActiveTagClick: MouseEventHandler = e => {
        const target = e.target as HTMLElement
        if (target.tagName !== 'BUTTON') return

        e.stopPropagation();

        const tagToRemove = target.innerText as Tag;
        const newTags = activeTags.filter(tag => tag !== tagToRemove)

        if (newTags.length === 0) {
            router.push(pathname)
        }
        else {
            router.push(pathname + `?${tagParam}=${newTags.join(",")}`)
        }
    }

    const ActiveTags = activeTags.length === 0 
        ? <Fragment key="active-tags" />
        : <p onClick={onActiveTagClick}>
            Filtered by:
            {activeTags.map(tag => <Pill label={tag} key={tag} color={tagData[tag].color} className="border-2 border-black mb-2"  />)}
        </p>
            

    const onClick: MouseEventHandler = e => {
        const target = e.target as HTMLElement
        if (target.tagName !== 'BUTTON') return

        e.stopPropagation();

        const newTag = target.innerText as Tag;
        const newTags = [...activeTags.filter(tag => tag !== newTag), newTag]
        router.push(pathname + `?${tagParam}=${newTags.join(",")}`)
    }

    const filteredProjects = activeTags.length === 0 
        ? projects
        : projects.filter(proj => activeTags.values().every(tag => proj.tags.find(tag2 => tag === tag2).isSome()))

    return <>
        {ActiveTags}
        <div className="mt-[2.1em] space-y-4 mb-10 perspective-midrange" onClick={onClick} >
            {filteredProjects.map(project => <ProjectCard key={project.name} {...project} />)}
        </div>
    </>;
}

const ProjectCard = (p: Project) => <Card key={p.name} className="aview aname-card-flip atime-in-out">
    <div className="p-2">
        <span className="text-contrast-4 text-nowrap ml-4 float-right">{projectDateRangeToString(p.date)}</span>
        <Heading level={2} noleading className="grow"><A href={p.href}>{p.name}</A></Heading>
        
        <p className="hang-1 m-2 mt-4 mb-6">{p.description}</p>
        <hr className="h-2 border-t-2"/>
        <div className="flex flex-row-reverse flex-wrap content-stretch align-middle justify-end mt-2 mx-2">
            {p.tags.map((tag, i) => {
                const data = tagData[tag]
                const t = clamp((i + 1) / p.tags.length, 0.2, 0.8)
                const style = {
                    animationTimingFunction:  `linear(${t*0.75}, ${0})` //`cubic-bezier(0.58, ${t}, 0.58, ${1-t})`
                }
                return <Pill key={tag} label={tag} color={data.color} className={`${data.color} aview aname-flex mb-2`} style={style} />
            })}
        </div>
    </div>
</Card>

const Pill = (p: { label: string, color: string, className?: string, style?: CSSProperties } ) => {
    return <button className={`${p.color} px-4 py-0 mx-2 rounded-2xl text-nowrap min-w-fit max-w-[50%] grow text-center ${p.className}`} style={p.style}>
        {p.label}
    </button>
}

const projectDateRangeToString = (range: ProjectDateRange) => {
    switch (range.type) {
        case "done": {
            if (range.start.getFullYear() === range.end.getFullYear()) {
                if (range.start.getMonth() === range.end.getMonth()) {
                    return YearMonthStr(range.start)
                }
                else {
                    return `${ShortMonthStr(range.start)} \u2013 ${YearMonthStr(range.end)}`
                }
            }
            else {
                return `${YearMonthStr(range.start)} \u2013 ${range.end}`
            }
        }
        case "ongoing": {
            return `${YearMonthStr(range.start)} \u2013 Now`
        }
        default: {
            return range
        }
    }
}