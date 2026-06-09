import A from "@/app/ui/component/Anchor";
import BlogEntry from "@/app/ui/component/BlogEntry";
import BlogTitle from "@/app/ui/component/BlogTitle";
import Heading from "@/app/ui/component/Heading";
import ItchEmbed from "@/app/ui/component/ItchEmbed";
import P from "@/app/ui/component/Paragraph";
import Section from "@/app/ui/component/Section";
import Image from "next/image";
import image1 from './image-1.png';
import image2 from './image-2.png';


export default function Page() {
    return <>
        <BlogEntry>
            <BlogTitle author="Grace Schorno" date={new Date("June 9th, 2026")}>Microphone Rhythm Game</BlogTitle>
            <P>
                A <A href="https://github.com/grace125/csc475_project">rhythm game</A> made for my Music Information Retrieval class, controlled by a guitar.
            </P>
            <Image src={image1} alt="Image of the game" className="my-6" />

            <Section>
                <P>
                    Above is the gameplay of the song <i>Sound of Silence</i>. 
                    The layout is similar to tab notation, where each note has a number indicating the tab to hold down, and the column indicates the string.
                </P>

                <P>
                    At the time, I thought the notes rising, rather than falling, would make it easier to read, because in English (and most written languages) we read from top to bottom. 
                    But, in retrospect, the notes moving sideways would match the usual direction a guitar is held, and would make it easier to see which note corresponds to which string.
                </P>
            </Section>

            <Section>
                <Heading>How Does it Work?</Heading>
                <P>
                    In a separate thread, the microphone takes in data at a rate of (usually greater than or equal to) 44100 samples per second. 
                    Every 2048 samples, a fast Fourier transform is taken over the most recent 8192 samples (saved in a ring buffer), and the resulting spectrogram is used to calculate if there were any note hits.
                </P>

                <Image src={image2} alt="Image of the homescreen" className="my-6" />

                <P>Above is the spectrogram in red, and the note "score" function graphed in real-time, which takes into account the second and third harmonic.</P>

                <P>
                    This score function, and all of these variables, are in a sense arbitrary. But, they were tuned for the best experience I could get. 
                </P>

                <P>
                    There's a good amount of error in my system, and perhaps better spectral analysis tools (and maybe some machine learning techniques) could get better accuracy for measuring note-hits.
                    But, for what it was, it got the job done.
                </P>
            </Section>

            


            



        </BlogEntry>
    </>
}