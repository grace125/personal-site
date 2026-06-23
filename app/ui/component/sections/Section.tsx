"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Section(props: { children?: ReactNode, h: ReactNode, noleading?: boolean }) {
  const level = useContext(LevelContext);
  return (
    <section className="block [&>p,&>.math-block]:mt-4 [&>h1+p]:indent-0 [&>p,&>.math-block]:indent-1 [&>ul,&>ol]:my-8 [&>ul,&>ol]:pl-[4ch]"> {/*p-5 rounded-sm border*/}
      <Heading level={level} noleading={props.noleading}>{props.h}</Heading>
      <LevelContext value={level + 1}>
        {props.children}
      </LevelContext>
    </section>
  );
}

export const Heading = (props: { children: ReactNode, level: number, className?: string, noleading?: boolean, center?: boolean,}) => {
  const center = props.center ? "flex justify-center" : ""
  switch (props.level) {
    case 1:
      return <h1 className={`${center} ${props.noleading ? "" : "leading-[0.9em ]"} ${props.className ?? ""} text-6xl`}>{props.children}</h1>
    case 2:
      return <h2 className={`${center} ${props.noleading ? "" : "leading-[1.25em] mt-20"} ${props.className ?? ""} text-4xl underline`}>{props.children}</h2>;
    case 3:
      return <h3 className={`${center} ${props.noleading ? "" : "leading-[1.25em] mt-20"} ${props.className ?? ""} text-3xl`}>{props.children}</h3>;
    case 4:
      return <h4 className={`${center} ${props.noleading ? "" : "leading-[1.25em] mt-10"} ${props.className ?? ""} text-2xl`}>{props.children}</h4>;
    default:
      return <h5 className={`${center} ${props.noleading ? "" : "leading-[1.25em] mt-8"} ${props.className ?? ""} text-2xl italic`}>{props.children}</h5>;
  }
}