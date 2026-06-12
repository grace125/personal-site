import BlogEntry from "@/app/ui/component/document/BlogEntry";
import Heading from "@/app/ui/component/Heading";
import ItchLink from "@/app/ui/component/ItchLink";
import P from "@/app/ui/component/Paragraph";
import Section from "@/app/ui/component/sections/Section";


export default function Page() {
    return <>
        <BlogEntry 
            title="Smaller title"
            author="Grace Schorno" 
            date={new Date("June 7th, 2026")}
        >
            <Section>
                
                <P>
                    JBall is a Breakout clone where the ball grows a mouth and starts talking. 
                </P>

                <Heading>H2</Heading>

                <P> This is a test that I am doing</P>


                {/* <ItchEmbed src="https://itch.io/embed-upload/5172298?color=333333" allowFullScreen={false}></ItchEmbed> */}

                <Heading>This is also a really long text so I could test the text wrapping</Heading>

                {/* <iframe src="https://itch.io/embed/1378147" width="100%" height="167"></iframe> */}
                <Section>
                    
                    <P>
                        I made it between classes in my third year of Computer Science, and its main purpose was to prototype a lip-syncing system in Bevy.
                        The system I used to make the mouth look like it was moving
                    </P>
                    <P>As it turns out, transcribing lip movements, especially </P>
                    <Heading>This is also a really long text so I could test the text wrapping of headings</Heading>
                    <Section>
                        <Heading>This is also a really long text so I could test the text wrapping of headings</Heading>
                        <P>This that these those</P>
                        <Section>
                            <Heading>This is also a really long text so I could test the text wrapping of headings</Heading>
                            <P>This that these those</P>
                            <Section>
                                <Heading>This is also a really long text so I could test the text wrapping of headings</Heading>
                                <P>This that these those</P>
                                <Section>
                                    <Heading>This is also a really long text so I could test the text wrapping of headings</Heading>
                                    <P>This that these those</P>
                                </Section>
                            </Section>
                        </Section>
                    </Section>
                </Section> 
            </Section>
        </BlogEntry>
    </>
}

