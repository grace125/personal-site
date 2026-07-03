import { ProjectEntry } from "@/app/ui/component/document/Article";
import Section from "@/app/ui/component/sections/Section";


export default function Page() {
    return <ProjectEntry title="Smaller title" description="A Breakout clone where the ball grows a mouth and starts talking." >

        <p> This is a test that I am doing</p>


        {/* <ItchEmbed src="https://itch.io/embed-upload/5172298?color=333333" allowFullScreen={false}></ItchEmbed> */}

        {/* <iframe src="https://itch.io/embed/1378147" width="100%" height="167"></iframe> */}
        <Section h="This is also a really long text so I could test the text wrapping">
            
            <p>
                I made it between classes in my third year of Computer Science, and its main purpose was to prototype a lip-syncing system in Bevy.
                The system I used to make the mouth look like it was moving
            </p>
            <p>As it turns out, transcribing lip movements, especially </p>
            <Section h="This is also a really long text so I could test the text wrapping of headings">
                <p>This that these those</p>
                
                <Section h="This is also a really long text so I could test the text wrapping of headings">
                    <p>This that these those</p>

                    <Section h="This is also a really long text so I could test the text wrapping of headings">
                        <p>This that these those</p>

                        <Section h="This is also a really long text so I could test the text wrapping of headings">
                            <p>This that these those</p>
                            
                        </Section>
                    </Section>
                </Section>
            </Section>
        </Section> 
    
    </ProjectEntry>
    
}

