import { Metadata } from "next";
import { Article } from "../ui/component/document/Article";
import { BackgroundImage } from "../ui/component/BackgroundImage";
import backgroundImage from "../../public/backgrounds/diamonds.webp";

export const metadata: Metadata = {
  title: "About",
  description: `About me, Grace Schorno.`,
};

export default function Page() {
  return <>
    <Article title="Who am I?" className="bg-mode-2">
        <p>
          My name is Grace Schorno. I'm a software developer, mathematician, writer, artist, and musician—or, at least I try be all these things.
          I love art, and how it interacts with math and technology. 
        </p>
        <p>
          In particular, I love <b>games</b>, and <b>game development</b>! 
        </p>
        <p>I have a project I'm working on that I'm not ready to talk about, so <i>stay tuned!</i></p>
    </Article>
    <BackgroundImage src={backgroundImage} scroll className="bg-cover" />
    </>;
}
