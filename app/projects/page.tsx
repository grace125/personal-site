import { Article } from "@/app/ui/component/document/Article";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectPage } from "./projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Stuff that I've worked on.",
};

export default function Page() {
    return <Article title="My Projects:" >
        <Suspense fallback={<p>Loading...</p>}>
            <ProjectPage />
        </Suspense>
    </Article>;
}