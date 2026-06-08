import { ReactNode } from 'react';

export default function BlogTitle(props: { children: ReactNode, author: string, date: Date }) {
  return <>
    <h1 className="text-6xl leading-[0.9em]">{props.children}</h1>
  </>;
}