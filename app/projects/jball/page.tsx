import BlogEntry from "@/app/ui/component/BlogEntry";
import BlogTitle from "@/app/ui/component/BlogTitle";
import Heading from "@/app/ui/component/Heading";
import ItchEmbed from "@/app/ui/component/ItchEmbed";
import P from "@/app/ui/component/Paragraph";
import Section from "@/app/ui/component/Section";


export default function Page() {
    return <>
        <BlogEntry>
            <BlogTitle author="Grace Schorno" date={new Date("June 7th, 2026")}>J-Ball</BlogTitle> 
            <Section>
                <P>
                    JBall is a Breakout clone where the ball grows a mouth and starts talking. 
                </P>

                <iframe src="https://itch.io/embed/1378147" width="100%" height="167" className="my-6 border-2 bg-white border-dashed rounded-md"/>

                <Section>
                    <P>
                        I did this for a game jam in my third year of Computer Science, and its main purpose was to prototype a lip-syncing system in Bevy.
                        The system I used was to get a sprite for a closed mouth, an "Ee" sound, an "Oo" sound, and an "Aa" sound. 
                        Then I put a list of timestamps and associated mouth positions in a file, next to the corresponding audio file it transcribed, and loaded both in at the same time.
                    </P>
                    {/* <P>As it turns out, transcribing lip movements, especially </P> */}
                </Section> 

                <Section>
                    <Heading>But How Did You Get That File?</Heading>
                    <P>
                        Well, you see, I went in Audacity, zoomed in to super small increments of time, looped that increment about 10-to-30 times each to find when exactly the mouth would have moved, and hand-added that data to the file. 
                        And my dear friend Justin has a bit of a stutter, so it, took, a <b><i>long</i></b> time.
                        A full day of time, for one file.
                    </P>
                    <P>
                        Does this game have more than one level? No. 
                        Does it use more than one of the many recordings Justin gave me? No. 
                        Does it have a game over screen, or a pause button? <i>Nope.</i> Does it at least feel good to play? No, not that either.
                    </P>
                    <P>Where was I going with this?</P>
                    <P>Oh yeah. But is the game funny? Yes. And that's all I really wanted.</P>
                </Section>
            </Section>
        </BlogEntry>
    </>
}

