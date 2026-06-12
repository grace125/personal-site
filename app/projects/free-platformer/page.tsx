import BlogEntry from "@/app/ui/component/BlogEntry";
import Heading from "@/app/ui/component/Heading";
import ItchEmbed from "@/app/ui/component/ItchEmbed";
import P from "@/app/ui/component/Paragraph";
import Section from "@/app/ui/component/Section";


export default function Page() {
    return <>
        <BlogEntry author="Grace Schorno" date={new Date("June 8th, 2026")} title="Super Cool Free Platformer!">
            <P>
                A tongue-and-cheek "adware" platformer that interrupts the player with a short, fake-ad minigame every 10 seconds.
            </P>
            <iframe height="167" src="https://itch.io/embed/2682104" width="100%" className="my-6 border-2 bg-white border-dashed rounded-md"></iframe>

            <Section>
                <Heading>Why?</Heading>
                <P>
                    The theme for Ludum Dare 51 (the game jam this game was entered in) was "Every 10 Seconds". 
                    If you ask me, that's an <i>awful</i> theme. 
                    You hear it, and no ideas come to mind. 
                    We felt the same way at the time: We were really struggling to come up with something.</P>
                <P>
                    But, floating in the air at the time was the cultural backlash to John Riccitiello, who called developers who don't want to monetize with ads "idiots".
                    So, what if an ad popped up every few seconds?
                </P>
            </Section>

            <Section>
                <Heading>Well, It'd be Annoying</Heading>
                <P>
                    Yeah, but, I mean, there are plenty of annoying games that are fun!
                    Ever heard of <i>I Wanna Be the Guy</i>? Probably not, it's pretty bad. 
                    But that's why it's <i>good!</i> 
                </P>
                <P>
                    <i>I Wanna Be The Guy</i> it's one of the earliest rage games ever. 
                    The whole idea is that it's a platformer where random things will fly at you with no notice.
                    You jump over that tree? An apple falls up and hits you. You walk across a seemingly safe screen? The moon falls down and chases you.
                    And don't even get me started on Ryu.
                </P>

                <div className="relative w-full h-0 pb-[56.25%] ">
                    <iframe className="absolute w-full h-full left-0 top-0 my-4 rounded-md" src="https://www.youtube.com/embed/_D7gqtdx_6A?si=1rKyRCYPnKwOeZAM" title="YouTube video player" allow="encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>
                </div>
                
                <P>Now, pardoning that young man's language, and the possibility that this obscure video is lost in the sands of time</P>


            </Section>

            
        </BlogEntry>
    </>
}

