import BlogEntry from "@/app/ui/component/document/BlogEntry";
import ItchLink from "@/app/ui/component/ItchLink";
import Section from "@/app/ui/component/sections/Section";

export default function Page() {
    return <>
        <BlogEntry author="Grace Schorno" date={new Date("June 8th, 2026")} title="Super Cool Free Platformer!">
            <p className="indent-0">
                A tongue-and-cheek "adware" platformer that interrupts the player with a short, fake-ad minigame every 10 seconds.
            </p>
            <ItchLink id={"2682104"} />

            <Section h="Why?">
                <p>
                    The theme for Ludum Dare 51 (the game jam this game was entered in) was "Every 10 Seconds". 
                    If you ask me, that's an <i>awful</i> theme. 
                    You hear it, and no ideas come to mind. 
                    We felt the same way at the time: We were really struggling to come up with something.
                </p>
                <p>
                    But, floating in the air at the time was the cultural backlash to John Riccitiello, who called developers who don't want to monetize with ads "idiots".
                    So, what if an ad popped up every few seconds?
                </p>
            </Section>

            <Section h="Well, It'd be Annoying">
                <p>
                    Yeah, but, I mean, there are plenty of annoying games that are fun!
                    Ever heard of <i>I Wanna Be the Guy</i>? Probably not, it's pretty bad. 
                    But that's why it's <i>good!</i> 
                </p>
                <p>
                    <i>I Wanna Be The Guy</i> it's one of the earliest rage games ever. 
                    The whole idea is that it's a platformer where random things will fly at you with no notice.
                    You jump over that tree? An apple falls up and hits you. You walk across a seemingly safe screen? The moon falls down and chases you.
                    And don't even get me started on Ryu.
                </p>

                <div className="relative w-full h-0 pb-[56.25%] ">
                    <iframe className="absolute w-full h-full left-0 top-0 my-4 rounded-md" src="https://www.youtube.com/embed/_D7gqtdx_6A?si=1rKyRCYPnKwOeZAM" title="YouTube video player" allow="encrypted-media; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>
                </div>
                
                <p>Now, pardoning that young man's language, and the possibility that this obscure video is lost in the sands of time</p>

            </Section>

            
        </BlogEntry>
    </>
}

