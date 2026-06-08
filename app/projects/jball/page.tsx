import BlogEntry from "@/app/ui/component/BlogEntry";
import BlogTitle from "@/app/ui/component/BlogTitle";
import Heading from "@/app/ui/component/Heading";
import ItchEmbed from "@/app/ui/component/ItchEmbed";
import P from "@/app/ui/component/Paragraph";
import Section from "@/app/ui/component/Section";


export default function Page() {
    return <>
        <BlogEntry>

            <Section>
                <BlogTitle author="Grace Schorno" date={new Date("June 7th, 2026")}>J-Ball</BlogTitle>
                <P>
                    JBall is a Breakout clone where the ball grows a mouth and starts talking. 
                </P>

                {/* <ItchEmbed src="https://itch.io/embed-upload/5172298?color=333333" allowFullScreen={false}></ItchEmbed> */}

                {/* TODO: find the hydration error: is it just because of the link? */}
                <iframe src="https://itch.io/embed/1378147" width="100%" height="167"><a href="https://grace-schorno.itch.io/jball">JBall by Grace</a></iframe>
                <Section>
                    
                    <P>
                        I made it between classes in my third year of Computer Science, and its main purpose was to prototype a lip-syncing system in Bevy.
                        {/* The system I used to make the mouth look like it was moving */}
                    </P>
                    {/* <P>As it turns out, transcribing lip movements, especially </P> */}
                </Section> 
            </Section>

            
        </BlogEntry>
    </>
}

