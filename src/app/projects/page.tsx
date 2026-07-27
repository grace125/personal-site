import { Article } from "@/ui/component/document/Article";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectPage } from "./projects";
import { BackgroundImage } from "@/ui/component/BackgroundImage";
import backgroundImage from "public/backgrounds/numbers.webp";

export const metadata: Metadata = {
  title: "Projects",
  description: "Stuff that I've worked on.",
};

export default function Page() {
    return <>
        <Article title="My Projects:" >
            <Suspense fallback={<p>Loading...</p>}>
                <ProjectPage />
            </Suspense>
        </Article>
        <BackgroundImage src={backgroundImage} className="bg-repeat bg-size-[1200px] animate-scroll-numbers adur-50 bg-scroll" />
    </>;
}
