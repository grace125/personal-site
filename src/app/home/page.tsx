import { Article } from "@/ui/component/document/Article";
import A from "@/ui/component/Anchor";
import { Metadata } from "next";
import { BackgroundImage } from "@/ui/component/BackgroundImage";
import backgroundImage from "public/backgrounds/squares.webp";
import ImageFeed from "@/ui/image-feed/ImageFeed";
import { redirect } from "next/navigation";

export const metadata: Metadata = {

};

export default function Home() {
  redirect("/about", "replace")
  return <>
    <Article title="Hello!" className="bg-mode-2">
      <p>
        This is my website! It's a work in progress, but I have big plans for it.
      </p>

      <p>If you're looking for any of my <b>projects</b>, I'd recommend you head <A href="/projects">here</A>, and if you want to know more about <b>me</b> I'd suggest you go <A href="/about">here</A>!</p>

      <p></p>
      <br/>

      <ImageFeed feed={["backgrounds/squares.webp", "backgrounds/dots.webp"]} lightbox={false} />
      
      
    </Article>
    <BackgroundImage src={backgroundImage} z="-z-5000" className="bg-repeat" />
  </>
}