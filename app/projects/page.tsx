import { Article } from "@/app/ui/component/document/Article";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectPage } from "./projects";
import { BackgroundImage } from "../ui/component/BackgroundImage";
import backgroundImage from "../../public/backgrounds/numbers.webp";
// import backgroundImage2 from "../../public/backgrounds/letters.webp";

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
        <BackgroundImage src={backgroundImage} className="bg-repeat bg-size-[1200px] animate-repeating-image-scroll-right adur-100 bg-scroll" />
        {/* <BackgroundImage src={backgroundImage2} className="bg-repeat bg-size-[2000px] animate-repeating-image-scroll-right adur-100" /> */}
    </>;
}
