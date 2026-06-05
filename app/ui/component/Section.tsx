"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Section(props: { children?: ReactNode }) {
  const level = useContext(LevelContext);
  return (
    <section className="p-5 mx- rounded-sm border block">
      <LevelContext value={level + 1}>
        {props.children}
      </LevelContext>
    </section>
  );
}