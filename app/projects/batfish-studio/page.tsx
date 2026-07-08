import { ProjectEntry } from "@/app/ui/component/document/Article";
import Section from "@/app/ui/component/sections/Section";
import _katex from "katex"
import A from "@/app/ui/component/Anchor";
import image1 from './image-1.png';
import imageSpreadOut from './image-2.png';
import imageCondensed from './image-3.png';
import Image from "next/image";

export default function Page() {
    return <>
        <ProjectEntry title="Bat-Fish Studio" description={<>A <A href="https://www.batfishstudio.ca/">website</A> I've (re)designed for an eco-friendly sustainable fashion brand.</>} >
            <Image src={image1} alt="Picture of the Bat-Fish Tube*Bella line" className="my-6" />

            <Section h="Log">
                <p>This is where I put little updates about my work on the site.</p>
                <Section h="2026-06-28">
                    <p>
                        Tracy Yerrel, the owner of Bat-Fish Studio, primarily makes her money tabling at events such as artisan fares.
                        She often comes across people who, for some reason or another, can't buy anything right now, but promise to check out her site!
                    </p>
                    <p>
                        ...they're never heard from again.
                    </p>
                    <p>
                        Not a single real sale (so far) has gone through her site, and it's my job to find out why and fix it.
                        Primarily it seems to be a UX issue: people can't figure out <i>how</i> to get to the store.
                    </p>
                    <Section h="The Obvious Stuff">
                        <p>
                            I tested every button and link, and many went to the wrong page, the same page rather than the store page, or nowhere at all.
                        </p>
                        <p>
                            I also tried to buy something from the shop, and it worked!
                            While Squarespace (in my humble opinion) has many downsides, it's strength is accessibility, and the out-of-the-box functionality of things like creating shops is quite useful.
                            But, we discovered a new issue: my order didn't charge me any shipping costs.
                            But, that's something to fix when Tracy decides how she wants to charge her customers.
                        </p>
                    </Section>
                    <Section h="Usage of Space">
                        <p>
                            Some of the bigger changes I made were to the flow and density of information on the site. 
                        </p>
                        <p>
                            Let's take the "Collections" pages for example.
                            They had these long sections taken up by a single photo, perhaps accompanied by some flavour text, which were large enough to make my hand tired from scrolling.
                        </p>
                        <Image src={imageSpreadOut} alt="One photo taking up 1.5x the height of the page on desktop" className="my-6" />
                        <p>
                            The purpose of these sections were to give the reader a sense of what the given collection is
                            — Tube*Bella, for example, is a line of earrings, pendants, and necklaces made from the inner parts of bicycle tire.
                            To keep the intention of these pages, I condensed everything and re-ordered in order of importance, showing:
                        </p>
                        <ol className="list-decimal">
                            <li>a description of the collection;</li>
                            <li>current products in the collection for sale;</li>
                            <li>models wearing/showcasing the product/particularly pretty past products;</li>
                            <li>and a link to commision a custom order.</li>
                        </ol>
                         <Image src={imageCondensed} alt="The improved page" className="my-6" />
                    </Section>
                    <Section h="What's Next?">
                        <p>My next steps will be to play more with how the site looks, making sure everything is consistent, but also trying out some more visually interesting pages.</p>
                        <p>
                            Tracy in a certain sense is the perfect customer, because she has a design background and can articulate what she doesn't like about a page, and what can be improved,
                            while also being open to more experimental aesthetics. 
                            And it doesn't hurt that using Squarespace gives me the opportunity to focus less on technical details like I normally do, and more on specifically design.
                        </p>
                        <p>
                            Until next time.
                        </p>
                    </Section>
                </Section>
            </Section>
        </ProjectEntry>
    </>
}
