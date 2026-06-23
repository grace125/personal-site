"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Section(props: { children?: ReactNode, h: ReactNode }) {
  const level = useContext(LevelContext);
  return (
    <section className="block [&>p,&>.math-block]:mt-4 [&>h1+p]:indent-0 [&>p,&>.math-block]:indent-1 [&>ul,&>ol]:my-8 [&>ul,&>ol]:pl-[4ch]"> {/*p-5 rounded-sm border*/}
      <Heading level={level}>{props.h}</Heading>
      <LevelContext value={level + 1}>
        {props.children}
      </LevelContext>
    </section>
  );
}

const Heading = (props: { children: ReactNode, level: number }) => {
  switch (props.level) {
    case 1:
      return <h1 className="text-6xl leading-[0.9em]">{props.children}</h1>
    case 2:
      return <h2 className="text-4xl leading-[1.25em] mt-20 underline">{props.children}</h2>;
    case 3:
      return <h3 className="text-3xl leading-[1.25em] mt-20">{props.children}</h3>;
    case 4:
      return <h4 className="text-2xl leading-[1.25em] mt-10">{props.children}</h4>;
    default:
      return <h5 className="text-2xl leading-[1.25em] mt-8 italic">{props.children}</h5>;
  }
}