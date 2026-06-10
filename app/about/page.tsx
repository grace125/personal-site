import BlogEntry from "../ui/component/BlogEntry";
import BlogTitle from "../ui/component/BlogTitle";
import P from "../ui/component/Paragraph";
import Section from "../ui/component/Section";

export default function Page() {
  return <BlogEntry>
      <BlogTitle author="Grace Schorno" date={new Date("June 8th, 2026")}>Who am I?</BlogTitle>
      <Section>
        
        <P>
          My name is Grace Schorno. I'm a software developer, mathematician, writer, artist, and musician—or, at least I try be all these things.
          I love art, and how it interacts with math and technology. 
        </P>

        <P>
          In particular, I love <b>games</b>, and <b>game development</b>! 
        </P>

        <P>I have a project I'm working on that I'm not ready to talk about, so <i>stay tuned!</i></P>
        
      </Section>
    </BlogEntry>;
}
