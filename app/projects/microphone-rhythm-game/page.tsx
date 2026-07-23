import A from "@/app/ui/component/Anchor";
import { ProjectEntry } from "@/app/ui/component/document/Article";
import Section from "@/app/ui/component/sections/Section";
import Image from "next/image";
import image1 from './image-1.png';
import image2 from './image-2.png';
import { Metadata } from "next";
import backgroundImage from "../../../public/backgrounds/dots.webp";
import { BackgroundImage } from "@/app/ui/component/BackgroundImage";

export const metadata: Metadata = {
  title: "Microphone Rhythm Game",
  description: "A rhythm game made for my Music Information Retrieval class, which is controlled by a guitar.",
};

export default function Page() {
    return <>
        <ProjectEntry 
            title="Microphone Rhythm Game" 
            description={<>A <A href="https://github.com/grace125/csc475_project">rhythm game</A> made for my Music Information Retrieval class, which is controlled by a guitar.</>}
            className="bg-mode-2"
        >
            <Image src={image1} alt="Image of the game" className="my-6" />
            <p>
                Above is the gameplay of the song <i>Sound of Silence</i>. 
                The layout is similar to tab notation, where each note has a number indicating the tab to hold down, and the column indicates the string.
            </p>
            <p>
                At the time, I thought the notes rising, rather than falling, would make it easier to read, because in English (and most written languages) we read from top to bottom. 
                But, in retrospect, the notes moving sideways would match the usual direction a guitar is held, and would make it easier to see which note corresponds to which string.
            </p>
            <Section h="How Does it Work?">
                <p>
                    In a separate thread, the microphone takes in data at a rate of (usually greater than or equal to) 44100 samples per second. 
                    Every 2048 samples, a fast Fourier transform is taken over the most recent 8192 samples (saved in a ring buffer), and the resulting spectrogram is used to calculate if there were any note hits.
                </p>

                <Image src={image2} alt="Image of the homescreen" className="my-6" />

                <p>Above is the spectrogram in red, and the note "score" function graphed in real-time, which takes into account the second and third harmonic.</p>

                <p>
                    This score function, and all of these variables, are in a sense arbitrary. But, they were tuned for the best experience I could get. 
                </p>

                <p>
                    There's a good amount of error in my system, and perhaps better spectral analysis tools (and maybe some machine learning techniques) could get better accuracy for measuring note-hits.
                    But, for what it was, it got the job done.
                </p>
            </Section>
        </ProjectEntry>
        <BackgroundImage src={backgroundImage} />
    </>
}