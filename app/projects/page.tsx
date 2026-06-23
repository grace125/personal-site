import { JSX, ReactElement } from "react";
import BlogEntry from "../ui/component/document/BlogEntry";
import A from "../ui/component/Anchor";
import Card from "../ui/component/Card";
import { mod } from "../lib/Math";
import { dbg } from "../lib/Debug";

const tagData = {
    Writing: { 
        color: "bg-red-200"
    }, 
    Music: {
        color: "bg-blue-200"
    },
    Software: {
        color: "bg-amber-200"
    },
    Art: {
        color: "bg-green-200"
    }, 
    "Programming Languages": {
        color: "bg-cyan-200",
    }, 
    Prototype: {
        color: "bg-gray-200"
    }, 
    "Game Dev": {
        color: "bg-purple-200"
    },
    Tool: {
        color: "bg-gray-200"
    }
}

type Tag = keyof typeof tagData
type TagData = typeof tagData[Tag]

type Project = { name: string, description: string, href: string, tags: Tag[],  } // date: Date

const projects: Project[] = [
    { 
        name: "Zine Generator", 
        description: "A tool for generating foldable zine layouts.",
        href: "/projects/zine-generator",
        tags: ["Art", "Tool", "Software"],
    },
    { 
        name: "Scythe", 
        description: "A prototype for a dependently typed programming language, written in Rust; my undergrad honours project.",
        href: "/projects/scythe",
        tags: ["Software", "Programming Languages", "Prototype"],
    },
    {
        name: "Microphone Rhythm Game",
        description: "A rhythm game controlled by a real guitar.",
        href: "/projects/microphone-rhythm-game",
        tags: ["Software", "Music", "Prototype"]
    },
    {
        name: "Discord Room Manager",
        description: "A Discord bot that uses roles, voice channels, and permissions to simulate rooms in a house.",
        href: "/projects/discord-room-manager",
        tags: ["Software", "Writing", "Prototype"]
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
        tags: ["Software", "Prototype", "Game Dev"]
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

    dbg({ name: "Zine Generator2", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], }),
    { name: "Zine Generator3", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator4", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator5", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator6", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator7", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator8", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator9", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator10", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
    { name: "Zine Generator11", description: "A tool for generating foldable zine layouts.", href: "/projects/zine-generator", tags: ["Art", "Tool", "Software"], },
]

export default function Page() {
  return <BlogEntry date={new Date("June 12th, 2026")} author="Grace Schorno" title="My Projects:" >
    <div className="mt-[2.1em] space-y-4">
        {projects.map(project => <ProjectCard key={project.name} {...project} />)}
    </div>

  </BlogEntry>;
}

const ProjectCard = (p: Project) => <Card key={p.name} className="">
    <p className="hang-1 m-2"  >
        <A href={p.href}>{p.name}</A> - {p.description}
        
    </p>
    <div className="flex flex-row content-stretch align-middle justify-end mt-4 m-2 overflow-clip">
        {p.tags.map((tag, i) => {
            const data = tagData[tag]
            return <Pill key={tag} label={tag} color={data.color} className={`${data.color}`} idx={i} />
        })}
    </div>
</Card>

const Pill = (p: { label: string, color: string, className?: string, idx: number} ) => 
    <div className={`${p.color} p-0 rounded-2xl text-nowrap flex-wrap min-w-fit max-w-[50%] grow text-center animate-flex timeline-view view-25%/75% ${mod(p.idx, 2) === 0 ? "anim-timing-lin" : "anim-timing-linrev"}`}>
        {p.label}
    </div>
