"use client";

import { ReactNode, useContext } from 'react';
import { LevelContext } from './LevelContext';

export default function Section(props: { children?: ReactNode }) {
  const level = useContext(LevelContext);
  return (
    <section className={`block space-y-4`}> {/*p-5 rounded-sm border*/}
      <LevelContext value={level + 1}>
        {props.children}
      </LevelContext>
    </section>
  );
}