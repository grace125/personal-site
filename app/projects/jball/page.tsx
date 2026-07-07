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
                I did this for a game jam in my third year of Computer Science, and its main purpose was to prototype a lip-syncing system in Bevy.
                The system I used was to get a sprite for a closed mouth, an "Ee" sound, an "Oo" sound, and an "Aa" sound. 
                Then I put a list of timestamps and associated mouth positions in a file, next to the corresponding audio file it transcribed, and loaded both in at the same time.
            </p>
            {/* <P>As it turns out, transcribing lip movements, especially </P> */}

            <Section h="But How Did You Get That File?">
                <p>
                    Well, you see, I went in Audacity, zoomed in to super small increments of time, looped that increment about 10-to-30 times each to find when exactly the mouth would have moved, and hand-added that data to the file. 
                    And my dear friend Justin has a bit of a stutter, so it, took, a <b><i>long</i></b> time.
                    A full day of time, for one file.
                </p>
                <p>
                    Does this game have more than one level? No. 
                    Does it use more than one of the many recordings Justin gave me? No. 
                    Does it have a game over screen, or a pause button? <i>Nope.</i> Does it at least feel good to play? No, not that either.
                </p>
                <p>Where was I going with this?</p>
                <p>Oh yeah. But is the game funny? Yes. And that's all I really wanted.</p>
            </Section>
        </ProjectEntry>
    </>
}

