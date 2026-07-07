import { ProjectEntry } from "@/app/ui/component/document/Article";
import Section from "@/app/ui/component/sections/Section";
import _katex from "katex"
import A from "@/app/ui/component/Anchor";
import image1 from './image-1.png';
import Image from "next/image";

export default function Page() {
    return <>
        <ProjectEntry title="Bat-Fish Studio" description={<>A <A href="https://www.batfishstudio.ca/">website</A> I've (re)designed for an eco-friendly sustainable fashion brand.</>} >
            <Image src={image1} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />
            
            <Section h="What is Bat-Fish Studio?">
                <p>
                    Tracy Yerrel, before starting Bat-Fish Studio, worked as a designer. She's been an invaluable source of wisdom, and a fantastic client to learan from because she has a clear sense of what seh wants, what prolems she's facing, and a whole ton of photos I can pull from.
                </p>
                <p>
                    The biggest changes I've made so far are to the UX of the site—namely, making sections smaller. 
                    Before, the average page on the site was easy to get lost on, becuse pieces of content were so far apart that you couldn't easily tell of there was a section before or after something.
                    I mean, it was physically exhausting to scroll so much.
                </p>
                <p>
                    I changed the layout so that every section would either have the next section in-view, or would show a list of similar elements that'd indicate some sort of easy-to-identify pattern.
                    To keep everything grounded.
                </p>
                <p>
                    A common experience for Tracy is that she tables at events, and  soneone's super excited about her product! They're on a budget at the moment, but they promise they'll check out the website!
                </p>
                <p>...they're never heard from again.</p>
                <p>
                    While they sounds like the start of a campfire story, the end  is far scarier: no money. Zero. Not a single sale had ever gone through that site.
                    No follow-up 80% of the time is normal—expected, even, from the flaky passers-by at your typical artisan fare—but 100% of the time?
                    That's a retention cliff, and a big one. 
                    The average person couldn't figure out <b>how</b> to buy something from the site. This is not a ghost story, this is a murder-mystery.
                </p>
                <p>
                    Let's get the obvious stuff out of the way. 
                    I tested every button and link, and many went to the wrong place, the same plce, or nowhere at all. 
                    I tried to buy something from the shop, and it worked! 
                    Nothing too big neded fixing, but after the congratulations email about her first sale, we realised that the customers aren't charged for shipping.
                    Something to fix later.
                </p>
                <p>
                    Another issue I noticed was how static the content was on her collection pages.
                    Shop items would explicitly be put on pages, and many of them out of date.
                    I replaced these with dynamic views of products in-stock in her collections.
                </p>
                <p>
                    Tracy was sure shewanted pages for each of her lines, where she explains the idea behind each of them, and showcases examples from that line. 
                    For example, Tube*Bella is Bat-Fish Studio's line of [earrings, pendants, and keychains(?)] that are made of recycled bicycle tire.

                    The structure of the site is the home page, to the collection pages, where each collection page:
                    <ol>
                        <li>Describes the collection</li>
                        <li>Showcases curent products in the collection (linking to each product)</li>
                        <li>Shoes past products/models and runways</li>
                        <li>Links to a way to commision custom products</li>
                    </ol>
                </p>
            </Section>
            <Section h="Where Art Meets Product">
                <p>
                    Aside from the limitations of using Squarespace (it's not my first choice, but it's what I was given),
                    my only limitations are the fucntionality of the site, and the wants fo my customer. 
                    I decided to give everything I could a background, to give everything a more textural feeling to it.
                </p>
            </Section>
            <Section h="asdfjkl;sad;fklj">
                <p>
                    I'm having a blast working with Bat-Fish Studio. 
                    Working in a less technical environment has given me a lot more freedom to focus on design in particular. 
                    It's good for me.
                </p>
                <p>
                    (TODO: recommend videos on design)
                </p>
            </Section>

            <p></p>

        </ProjectEntry>
    </>
}
