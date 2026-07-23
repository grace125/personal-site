import A from "@/app/ui/component/Anchor";
import { BackgroundImage } from "@/app/ui/component/BackgroundImage";
import { ProjectEntry } from "@/app/ui/component/document/Article";
import Math from "@/app/ui/component/Math";
import Section from "@/app/ui/component/sections/Section";
import _katex from "katex"
import { Metadata } from "next";
import backgroundImage from "../../../public/backgrounds/dots.webp";

export const metadata: Metadata = {
  title: "Scythe",
  description: "A prototype for a dependently typed programming language; my undergrad honours project.",
};

export default function Page() {
    return <>
        <ProjectEntry 
            title="Scythe" 
            description={<>A prototype for a dependently typed <A href="https://github.com/grace125/scythe">programming language</A>; my undergrad honours project.</>}
            className="bg-mode-2"
        >
            
            <p>
                (Note: this page is under construction. For some more in-depth writing on the topic, you can find the paper I wrote for my project <A href="/Honours_Paper.pdf">here</A>.)
            </p>

            <Section h="What is a Dependent Type?">
                <p>
                    A dependent type, put simply, is a type that depends on a value. There are many kinds of dependent types, such as <A href="https://en.wikipedia.org/wiki/Generalized_algebraic_data_type">GADTs</A>, but <u>consider the following function f:</u>
                </p>

                <Math>{"$$\\func{(b\\is \\type{Bool})}{\\ifthenelse{b}{5}{\\str{hi}}}$$"}</Math>

                <Section h="In What Kinds of Languages Does This Typecheck?">
                    <p>
                        Well, in a <b>dynamically-typed</b> language, there is no "typechecking" in the way that there is for statically typed languages, so you can do stuff like this to your heart's content.
                    </p>

                    <p>
                        That said, in these languages, there's nothing stopping you from using this function in a place where it'd throw a runtime error, so you'll never really sleep at night without thinking of that Boeing plane you worked on.
                    </p>

                    <Math>
                        In your average <b>statically-typed</b> language, this would throw a type error. 
                        That's because all functions for these languages are of the form {"$$\\ftype{A}{B},$$"}
                        and what could (B) possibly be? 
                    </Math>
                    
                    <p>
                        If (B: Nat), then ("hi") doesn't typecheck, and if (B: Str), then (5) doesnt typecheck. They are terms with different types, so this shouldn't typecheck.
                    </p>
                    <Math>
                        But in a <b>dependently-typed</b> language (or, at least the one that I was working on with general dependent types), you could have it so that the type of this function is
                        {"$$f\\is (\\ftype{(b\\is \\Bool)}{\\ifthenelse{b}{\\Nat}{\\Str}}).$$"}
                        That is, (f)'s return type <i>changes</i> depending on what the value given to (f) is.
                    </Math>

                </Section>
                
                <Section h="What Can We Do With This?">
                    <p>
                        For this to be useful, a couple of things need to be true. 
                    </p>

                    <ul className="space-y-[1em] list-disc list-outside px-[2ch]">
                        <li>If I write (f(true)), the compiler needs to figure out that the type of this term is (Nat).</li>
                        <li>If I write (f(false)), it needs to know its type is (Str).</li>
                        <li>If I write (f(c)) for some variable (c), the type should stay (if b then Nat else Str).</li>
                    </ul>
                    
                    <p>
                        How can we do this? Well, we can <i>evaluate</i> (f)'s type during the typechecking process!
                        We can first evaluate (c) as an expression, 
                        and then we can substitute that value in for (b) to get (if c then Nat else Str), 
                        and evaluate that! 
                        If c is true or false, the type will collapse to either (Nat) or (Str)!
                    </p>
                </Section>

            </Section>

            <Section h="The Implications of Dependent Types">
                <p>
                    The implication of this is that Scythe has <i>arbitrary compile-time execution</i>, which is generally considered bad.
                </p>

                <p>
                    <i>But</i> would you rather have an infinite loop that never terminates in your compiler, <b>OR</b> an infinite loop on that Boeing plane?
                    Sure, it's not ideal, but if this level of type-expressivity is able to guarantee more correctness, I'd argue it's a feature and not a bug.
                </p>

                <p>
                    However, having a type of types has another issue: you can't erase types by the end of compilation.
                    If a function can return a type, and the type it can return <i>could</i> be the type of types itself, then it's necessary that types have to be available at runtime.
                    And, truth be told, that sucks.
                </p>

                <p>
                    If I was to do this project again, I'd probably do an <A href="https://en.wikipedia.org/wiki/ATS_(programming_language)">ATS</A>-style two-level type theory.
                </p>
            </Section>
        </ProjectEntry>
        <BackgroundImage src={backgroundImage} />
    </>
}