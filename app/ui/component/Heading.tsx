"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Heading(props: { children: ReactNode }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1 className="text-6xl">{props.children}</h1>;
    case 2:
      return <h2 className="text-5xl">{props.children}</h2>;
    case 3:
      return <h3 className="text-4xl">{props.children}</h3>;
    case 4:
      return <h4 className="text-3xl">{props.children}</h4>;
    default:
      return <h5 className="text-2xl">{props.children}</h5>;
  }
}