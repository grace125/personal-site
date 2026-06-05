import Heading from "@/app/ui/component/Heading";
import Section from "@/app/ui/component/Section";

export default function Page() {
    return <>
        <Heading>J-Ball</Heading>
        <iframe src="https://itch.io/embed-upload/5172298?color=333333" width="1280" height="740"/>

        <Section>
            <Heading>This</Heading>
            <Heading>That</Heading>
            <Section>
                <Heading>Aaaaa</Heading>
                This that these those
                <Section>
                    <Heading>Bbbbb</Heading>
                    l;kasjfl;kasdl;kasdf
                    <Section>
                        <Heading>Ccccc</Heading>
                        asdfjkljk;asdfkl;jasdl
                        <Section>
                            <Heading>Ddddd</Heading>
                            lasdjkflasdjkjkl;sdf
                        </Section>
                    </Section>
                </Section>
            </Section>
        </Section> 
    </>
}

