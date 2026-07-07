import A from "@/app/ui/component/Anchor";
import { ProjectEntry } from "@/app/ui/component/document/Article";
import ItchLink from "@/app/ui/component/ItchLink";
import Section from "@/app/ui/component/sections/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "J-Ball",
  description: "A Breakout clone where the ball grows a mouth and starts talking.",
};

export default function Page() {
    return <>
        <ProjectEntry title="J-Ball" description="A Breakout clone where the ball grows a mouth and starts talking.">

            <ItchLink id="1378147"></ItchLink>

            
            <p>
                This was one of my earliest game jams. 
                Its main purpose was to prototype a lip-syncing system in Bevy.
                Each mouth movement was a closed mouth, an "Ee", an "Oo", or an "Aa".
                I timestamped these mouth positions in a file next to the corresponding audio file it described, and loaded/played both together.
            </p>
            {/* <P>As it turns out, transcribing lip movements, especially </P> */}

            <Section h="How I Got that File">
                <p>
                    To produce these timestamped files, I went in Audacity, zoomed in to super small increments of time, looped that increment about 10-to-30 times each, and found exactly when the mouth would have changed position, and hand-added that data to the file. 
                    My dear friend Justin (the voice of J-Ball and the composer for this game) has a bit of a stutter, so this, took, a <b><i>long</i></b> time.
                    In particular, a full day of time, for one file.
                </p>
                <p>
                    If I was to do this project over, I would have made a system similar to what <A href="https://www.twitch.tv/tomthinks">Tom Thinks</A> has on Twitch, where each movement of the mouth is controlled <i>as the speaker talks</i>.
                    This would have saved me leagues of time, and let me work on adding a proper game over state.
                </p>
                <p>
                    Maybe one day the world will see the rest of J-Ball transcribed. Who knows!
                </p>
            </Section>
        </ProjectEntry>
    </>
}

