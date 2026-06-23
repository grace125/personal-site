"use client";

import BlogEntry from "../ui/component/document/BlogEntry";
import A from "../ui/component/Anchor";
import Card from "../ui/component/Card";
import { clamp } from "../lib/Math";
import { Heading } from "../ui/component/sections/Section";
import { CSSProperties, Fragment, MouseEventHandler, useState } from "react";
import { List } from "../lib/datatypes/List";
import { HashSet } from "../lib/datatypes/HashSet";

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
    }
}

type Tag = keyof typeof tagData
type TagData = typeof tagData[Tag]

type Project = { name: string, description: string, href: string, tags: List<Tag> } // date: Date

const projects: List<Project> = List.from([
    { 
        name: "Zine Generator", 
        description: "A tool for generating foldable zine layouts.",
        href: "/projects/zine-generator",
        tags: List.from<Tag>(["Art", "Tool", "Software"]),
    },
    { 
        name: "Scythe", 
        description: "A prototype for a dependently typed programming language, written in Rust; my undergrad honours project.",
        href: "/projects/scythe",
        tags: List.from<Tag>(["Software", "Programming Languages", "Prototype"]),
    },
    {
        name: "Microphone Rhythm Game",
        description: "A rhythm game controlled by a real guitar.",
        href: "/projects/microphone-rhythm-game",
        tags: List.from<Tag>(["Software", "Music", "Prototype"])
    },
    {
        name: "Discord Room Manager",
        description: "A Discord bot that uses roles, voice channels, and permissions to simulate rooms in a house.",
        href: "/projects/discord-room-manager",
        tags: List.from<Tag>(["Software", "Writing", "Prototype"])
    },
    // {
    //     name: "Winds of Pilgrimage",
    //     description: "",
    //     href: "",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // },
    {
        name: "JBall",
        description: "A Breakout clone where the ball grows a mouth and starts talking. ",
        href: "/projects/jball",
        tags: List.from<Tag>(["Software", "Prototype", "Game Dev"])
    },
    // {
    //     name: "Krampus Launcher",
    //     description: "",
    //     href: "",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // },
    // {
    //     name: "Super Cool Free Platformer",
    //     description: "",
    //     href: "/projects/free-platformer",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // }
])

export default function Page() {
    const [activeTags, setActiveTags] = useState(HashSet.from<Tag>([]))

    const onActiveTagClick: MouseEventHandler = e => {
        const oldTag = (e.target as HTMLElement).innerText as Tag;
        setActiveTags(activeTags.delete(oldTag))
        e.stopPropagation();
    }

    const ActiveTags = activeTags.size === 0 
        ? <Fragment key="active-tags" />
        : <p onClick={onActiveTagClick}>
            Filtered by:
            {activeTags.map(tag => <Pill label={tag} color={tagData[tag].color} className="border-2 border-black"  />)}
        </p>
            

    const onClick: MouseEventHandler = e => {
        const newTag = (e.target as HTMLElement).innerText as Tag;
        setActiveTags(activeTags.add(newTag))
        e.stopPropagation();
    }

    const filteredProjects = activeTags.size === 0 
        ? projects
        : projects.filter(proj => activeTags.values().every(tag => proj.tags.find(tag2 => tag === tag2).isSome()))

    return <BlogEntry date={new Date("June 12th, 2026")} author="Grace Schorno" title="My Projects:" >
        {ActiveTags}
        <div className="mt-[2.1em] space-y-4 mb-100 perspective-midrange" onClick={onClick} >
            {filteredProjects.map(project => <ProjectCard key={project.name} {...project} />)}
        </div>

    </BlogEntry>;
}

const ProjectCard = (p: Project) => <Card key={p.name} className="aview aname-card-flip atime-in-out">
    <div className="p-2">
        <Heading level={2} noleading><A href={p.href}>{p.name}</A></Heading>
        <p className="hang-1 m-2 mt-4 mb-6">{p.description}</p>
        <hr className="h-2 border-t-2"/>
        <div className="flex flex-row-reverse content-stretch align-middle justify-end mt-2 mb-2-mx-2">
            {p.tags.map((tag, i) => {
                const data = tagData[tag]
                const t = clamp((i + 1) / p.tags.length, 0.2, 0.8)
                const style = {
                    animationTimingFunction:  `linear(${t*0.75}, ${0})` //`cubic-bezier(0.58, ${t}, 0.58, ${1-t})`
                }
                return <Pill key={tag} label={tag} color={data.color} className={`${data.color} aview aname-flex `} style={style} />
            })}
        </div>
    </div>
</Card>

const Pill = (p: { label: string, color: string, className?: string, style?: CSSProperties } ) => {
    return <button className={`${p.color} px-4 py-0 mx-2 rounded-2xl text-nowrap flex-wrap min-w-fit max-w-[50%] grow text-center ${p.className}`} style={p.style}>
        {p.label}
    </button>
}