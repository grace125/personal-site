import A from "@/app/ui/component/Anchor";
import { ProjectEntry } from "@/app/ui/component/document/Article";
import ItchLink from "@/app/ui/component/ItchLink";
import Section from "@/app/ui/component/sections/Section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Winds of Pilgrimage",
  description: "A calming puzzle game about exploring an island and solving runic puzzles.",
};

export default function Page() {
    return <>
        <ProjectEntry title="Winds of Pilgrimage" description={<>A <i>calming</i> puzzle game about exploring an island and solving runic puzzles.</>}>

            <ItchLink id="2294703"></ItchLink>

            
            <p>
                You’re an adventurer who has been travelling the world for many years. One day, you came across this island that isn’t on your map. You can’t help yourself, and must figure out the all mysteries of this land and uncover it’s secrets.
            </p>
            <p>    
                Each puzzle has limited space to work in, so tread carefully! To win the game you only need to solve the 5x5 puzzle in the middle of the map. But to do that you’ll have to figure out what rules all the runes follow.
            </p>
            <p>
                If you’re looking for a challenge, however try completing all 29 puzzles in the world!
            </p>
            {/* <P>As it turns out, transcribing lip movements, especially </P> */}

        </ProjectEntry>
    </>
}

