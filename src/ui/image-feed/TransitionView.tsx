import { omit } from "@/lib/Functional";
import { CSSProperties, HTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState } from "react";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "children"> & {
	open: boolean;
	initial?: boolean;
	className?: ((open: boolean) => string | undefined | null) | string;
	style?: ((open: boolean) => CSSProperties | undefined | null) | CSSProperties;
	children?: ((open: boolean) => ReactNode | null | undefined) | ReactNode;
}

export function TransitionView(props: Props) {
	const [ isFirstFrame, setIsFirstFrame ] = useState(props.initial ?? true);
	const [ render, setRender ] = useState(false);
	const openRef = useRef(props.open);
	openRef.current = props.open;

	useEffect(() => {
		if (props.open) {
			requestAnimationFrame(() => requestAnimationFrame(() => setIsFirstFrame(false)));
			setRender(true);
		}
		else {
			setIsFirstFrame(true);
		}
	}, [ props.open ]);

	const open = render && !isFirstFrame;
	const className = ((render && (typeof props.className === "function" ? props.className(open) : props.className)) || (render ? "" : "hidden")) as string;
	const style = (render && (typeof props.style === "function" ? props.style(open) : props.style)) || {};
	const children = (render && (render && typeof props.children === "function" ? props.children(open) : props.children)) || null;

	const handleTransitionComplete = useCallback(() => (!openRef.current) && setRender(false), []);

	return (
		<div 
			{...omit(props, ["children", "initial", "open"])} 
			className={className} 
			style={style} 
			onTransitionEnd={handleTransitionComplete}
		>
			{children as any}
		</div>
	)
}