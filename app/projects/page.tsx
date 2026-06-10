import Link from "next/link";
import { JSX, ReactElement } from "react";
import Pill from "../ui/Pill";

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
    }
}

type Tag = keyof typeof tagData
type TagData = typeof tagData[Tag]

type Project = { name: string, description: string, href: string, tags: Tag[],  } // date: Date

const projects: Project[] = [
    // { 
    //     name: "Desc", 
    //     description: "A prototype for a dependently typed programming language, written in Rust; my undergrad honours project.",
    //     href: "/projects/desc",
    //     tags: ["Software", "Programming Languages", "Prototype"],
    // },
    {
        name: "Microphone Rhythm Game",
        description: "",
        href: "/projects/microphone-rhythm-game",
        tags: ["Software", "Music", "Prototype"]
    },
    {
        name: "Discord Room Manager",
        description: "",
        href: "/projects/discord-room-manager",
        tags: ["Software", "Writing", "Prototype"]
    },
    // {
    //     name: "Winds of Pilgrimage",
    //     description: "",
    //     href: "",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // },
    // {
    //     name: "JBall",
    //     description: "",
    //     href: "/projects/jball",
    //     tags: ["Software", "Prototype", "Game Dev"]
    // },
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
]

const pill = (content: JSX.Element, color: string) => {
    return <div className="bg"></div>
}

export default function Page() {
  return <>
    <p>These are my projects:</p><br/>
    {projects.map(project => {
        return <p key={project.name}>
            <Link href={project.href} className="text-blue-400 hover:text-blue-200">{project.name}</Link> - {project.description}
            <br/>
            {project.tags.map(tag => {
                const data = tagData[tag]
                return <Pill label={tag} key={tag} className={`${data.color}`} />
            })}
        </p>
    })}
  </>;
}