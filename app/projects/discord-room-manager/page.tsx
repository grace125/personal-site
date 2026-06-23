import A from "@/app/ui/component/Anchor";
import BlogEntry from "@/app/ui/component/document/BlogEntry";
import Section from "@/app/ui/component/sections/Section";
import Image from "next/image";
import image1 from './image-1.gif';

export default function Page() {
    return <>
        <BlogEntry author="Grace Schorno" date={new Date("June 9th, 2026")} title="Discord Room Manager">
            <p className="indent-0">
                A <A href="https://github.com/grace125/discord-room-manager">Discord bot</A> that uses roles, voice channels, and permissions to simulate rooms in a house.
            </p>
            <div className="flex justify-center">
                <Image src={image1} alt="Example of the Discord Bot in action" className="my-6" />
            </div>
            <Section h="Trapped Inside">
                <p>
                    The year was 2020, and my brother wanted throw a birthday party despite the pandemic. 
                    The problem? Putting all your friends in one Discord call <b>sucks</b>.
                </p>
                <p>
                    In a real party, people break out naturally into smaller conversations. 
                    But with 20+ people, one call is at best an overly-formal Zoom meeting, hand-raising and all, and at worst it's a yelling match.
                    Proximity chat in some game might work, but not everyone invited was particularly tech-savvy, and it's a big demand to ask people to buy something they might only use once.
                </p>
            </Section>

            <Section h="A Birthday to Remember">
                <p>
                    My idea was simple: there's an "entrance" voice chat, and when you join it, you get the enrtance role. 
                    When you have the "entrance" role, you can see all rooms next to the entrance. You can also see an "entrance" text chat, with some flavor text and maybe an image.
                </p>
                <p>
                    My brother wrote this flavor text, and we found that it did a fantastic job at encouraging attendants to spread out! 
                    Before we knew it, there were small pockets of conversation in rooms people probably shouldn't have been in; 
                    there was crowding in hallways we had to break up (the voicechat had a max of 3 people, so nobody could get by); 
                    and there was casual movement between groups, especially people popping in to say hello to the birthday boy. All in all, it was a success!
                </p>
            </Section>

        </BlogEntry>
    </>
}