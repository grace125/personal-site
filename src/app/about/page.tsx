import { Metadata } from "next";
import { Article } from "@/ui/component/document/Article";
import { BackgroundImage } from "@/ui/component/BackgroundImage";
import backgroundImage from "../../../public/backgrounds/diamonds.webp";
import A from "@/ui/component/Anchor";

export const metadata: Metadata = {
  title: "About",
  description: `About me, Grace Schorno.`,
};

export default function Page() {
  return <>
    <Article title="Who am I?" className="bg-mode-2">
        <p>
          My name is Grace Schorno. I'm a software engineer, mathematician, writer, artist, and musician—or, at least I try be all these things.
          I love art, and how it interacts with math and technology. 
        </p>
        <p>
          In particular, I love <b>games</b>, and <b>game development</b>! 
          I've done over 10 game jams, nd I've been slowly uploading them here, as well as other related side projects.
          Click <A href="/projects">here</A> to see what I have up so far.
        </p>
        <p>
          When I work on solo projects, I tend to use Bevy. 
          Lurking in the Discord and reading the long, fascinating engine design discussions, as well as reading through prposals, PRs, and the codebase itself, 
          is where I first became comfortable with real-world software development and large codebases.
        </p>
        <p>
          I'm also a programming language nut! 
          For my undergraduate honours project, I made a prototype for a dependently typed programming language in Rust.
          See <A href="/projects/scythe">here</A> for that.
          It's quite rough around the edges, but I've been considerign startn gover on a sequent calulus-based language. 
          I still need to do more research first.
        </p>
        <p>
          Expect in the next couple of weeks for a blog to appear here.
          I've been itching to write, and even if I'm the only one that eads it, I want somewhere to put it.
        </p>
        <p>Have a good day!</p>
    </Article>
    <BackgroundImage src={backgroundImage} className="bg-cover" />
    </>;
}
