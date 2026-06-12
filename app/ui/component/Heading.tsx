"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Heading(props: { children: ReactNode }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      throw new Error("Heading should only be used in a Section");
    case 2:
      return <h2 className="text-4xl leading-[1.25em] mt-24 underline">{props.children}</h2>;
    case 3:
      return <h3 className="text-3xl leading-[1.25em] mt-24">{props.children}</h3>;
    case 4:
      return <h4 className="text-2xl leading-[1.25em] mt-12">{props.children}</h4>;
    default:
      return <h5 className="text-2xl leading-[1.25em] mt-10 italic">{props.children}</h5>;
  }
}