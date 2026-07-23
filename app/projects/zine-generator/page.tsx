import { ProjectEntry } from "@/app/ui/component/document/Article";
import Section from "@/app/ui/component/sections/Section";
import _katex from "katex"
import { ZineEditor } from "@/app/ui/art/ZineEditor";
import { Metadata } from "next";
import { BackgroundImage } from "@/app/ui/component/BackgroundImage";
import backgroundImage from "../../../public/backgrounds/dots.webp"

export const metadata: Metadata = {
  title: "Zine Generator",
  description: "A tool for generating foldable zine layouts.",
};

export default function Page() {
    return <>
        <ProjectEntry title="Zine Generator" description="A tool for generating foldable zine layouts.">
            {/* <PageMarginEditor/> */}
            <ZineEditor />

            <Section h="How To Use This Tool" className="bg-mode-2">
                <p>
                    When making a zine of this layout, <b>black lines</b> are lines that you cut, <b>red lines</b> are lines that you "mountain fold" (fold pages away from each other), and <b>green lines</b> are lines that you "valley fold" (fold pages together)
                </p>
                <p>
                    Coming soon is the ability to download this file, and (maybe) the ability to upload images and have them placed in the tool.
                </p>
            </Section>
        </ProjectEntry>
        <BackgroundImage src={backgroundImage} />
    </>
}
