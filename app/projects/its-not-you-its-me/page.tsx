import { ProjectEntry } from "@/app/ui/component/document/Article"
import _katex from "katex"
import Image from "next/image";
import image1 from "./image-01.png"
import image2 from "./image-02.png"
import image3 from "./image-03.png"
import image4 from "./image-04.png"
import { Metadata } from "next";
import { BackgroundImage } from "../../ui/component/BackgroundImage";
import backgroundImage from "../../../public/backgrounds/paper-1.webp";

export const metadata: Metadata = {
  title: "It's Not You, It's Me",
  description: `A comic about a girl who decides to run away from home, but doesn't know why.`,
};

export default function Page() {
    return <>
        <ProjectEntry 
            title="It's Not You, It's Me" 
            description="A comic about a girl who decides to run away from home, but doesn't know why." 
            className="bg-mode-2"
        >
            <Image src={image1} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />
            <p>
                My process for making pages like these is a bit unorthodox.
            </p>
            <p>
                I have a large printer that prints on 11x17 paper, and I photocopy found materials and pages from National Geographic onto a page, load that page back into the printer, and print something else on top.
                The result is these strange, hard to parse textures that look super cool.
            </p>
            <p>
                Then I draw and ink a comic page, and photocopy those inks onto a new page with one of these textures.
                The result is a piece of paper with thick black lines (from my drawing) that I can cut out areas from.
                Essentially I'm doing the real-life equivalent of photoshop masking.
            </p>
            <Image src={image3} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />
            <p>
                Some pages are more comic, while others take a sort of script format. 
                I wasn't confident I'd be able to finish the story I had in mind, so my idea was to start with a script, and see "how many words I could boil out".
            </p>
            <Image src={image4} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />
            <p>
                This one was particularly fun. I wanted to create a white outline around this suitcase, so I digitally colour inverted the picture, printed it, drew the outline in black, and color inverted the result again, making my lines white.
            </p>
            <Image src={image2} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />
            <p>
                This story was the first in a hypothetically four part series, but I think I want to finish writing before I work on any more of it.
                I want to make sure I stick the landing.
            </p>
        </ProjectEntry>
        <BackgroundImage src={backgroundImage} z="-z-5000" className="bg-size-[50%] bg-repeat" />
    </>
}
