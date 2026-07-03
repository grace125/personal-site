import { Article } from "../ui/component/document/Article";
import A from "../ui/component/Anchor";

export default function Home() {
    return <Article title="Hello!">
      <p>
        This is my website! 
        It's not much at the moment, but I have big plans for it.
      </p>
      <p>If you're looking for any of my <b>projects</b>, I'd recommend you head <A href="/projects">here</A>, and if you want to know more about <b>me</b> I'd suggest you go <A href="/about">here</A>!</p>
      <p>Have a great day!</p>
    </Article>
}