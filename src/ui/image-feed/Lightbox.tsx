"use client";

import clsx from "clsx";
import Portal from "./Portal";
import { TransitionView } from "./TransitionView";
import { ImageView } from "./ImageView";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

type Props = {
	open: boolean;
	onClose: () => void;
} & ({
	path: string;
	intrinsicSize: [ width: number, height: number ];
} | {
	paths: string[];
	index?: number;
	intrinsicSizes: [ width: number, height: number ][];
});

function LightboxImg(props: { 
	path: string;
	intrinsicSize: [ width: number, height: number ];
	ind: number;
	activeInd: number;
	className: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const initialInd = useMemo(() => props.activeInd, []);

	const aspect = props.intrinsicSize[0] / props.intrinsicSize[1];
	const isActive = props.ind === props.activeInd;

	const [ [ fixedWidth, fixedHeight ], setFixedSize ] = useState([ 0, 0 ]);

	useLayoutEffect(() => {
		const container = ref.current;
		if (!container) return;
		const containerAspect = container.clientWidth / container.clientHeight;
		if (containerAspect <= aspect) setFixedSize([ container.clientWidth, container.clientWidth / aspect ]);
		else setFixedSize([ container.clientHeight * aspect, container.clientHeight ]);
	}, [ aspect ]);

	return (
		<div 
			ref={ref}
			className={clsx("grid-1 flex justify-center items-center contain-size transition duration-150", props.className, isActive ? (props.activeInd !== initialInd ? "delay-50" : "") : props.activeInd > props.ind ? "opacity-0 -translate-x-8 interact-none" : "opacity-0 translate-x-8 interact-none")} 
		>
			<ImageView
				onClick={(e) => (e.preventDefault(), e.stopPropagation())}
				style={{ width: fixedWidth, height: fixedHeight }}
				className={clsx("rounded-xl shadow-xl shadow-black/40 transition duration-150 bg-gray-600/70")}
				intrinsicSize={props.intrinsicSize}
				path={props.path}
				eager={isActive}
				lightbox={false}
				quality={100}
			/>
		</div>
	);
}

export function Lightbox(props: Props) {
	const paths = "path" in props ? [ props.path ] : props.paths;
	const sizes = "intrinsicSize" in props ? [ props.intrinsicSize ] : props.intrinsicSizes;
	const [ ind, setInd ] = useState("index" in props ? props.index ?? 0 : 0);
	useLayoutEffect(() => setInd("index" in props ? props.index ?? 0 : 0), [ props.open ]);

	const handleSetInd = (ind: number) => setInd((ind + paths.length) % paths.length);

	return (
		<Portal selector="#portal">
			<TransitionView 
				open={props.open} 
				className={open => clsx("isolate grid-1 size-full bg-gray-800/90 backdrop-blur-lg contain-size grid transition overflow-hidden duration-150 p-4 md:p-8 @container", open ? "opacity-100" : "opacity-0", paths.length > 1 && "pb-28 md:px-20 md:pb-8")}
				onClick={props.onClose}
			>{(open) => <>
				{paths.length > 1 && <>
					<button 
						onClick={(e) => (e.preventDefault(), e.stopPropagation(), handleSetInd(ind - 1))} 
						className="absolute bottom-6 left-6 md:bottom-auto md:absolute-center-y z-50 md:left-2 text-white text-3xl cursor-pointer aspect-square grid place-items-center w-16 scale-90 hover:invert-95 hover:scale-100 active:opacity-75 active:scale-90 rounded-full leading-none"
					>
						<img src="/next-button.webp" width={64} height={64} alt="Previous Image" className="-scale-x-100 interact-none"/>
					</button>
					<button 
						onClick={(e) => (e.preventDefault(), e.stopPropagation(), handleSetInd(ind + 1))} 
						className="absolute bottom-6 right-6 md:bottom-auto md:absolute-center-y z-50 md:right-2 text-white text-3xl cursor-pointer aspect-square grid place-items-center w-16 scale-90 hover:invert-95 hover:scale-100 active:opacity-75 active:scale-90 rounded-full leading-none"
					>
						<img src="/next-button.webp" width={64} height={64} alt="Next Image" className="interact-none"/>
					</button>
				</>}
				{paths.map((p, i) => <LightboxImg 
					key={i} 
					ind={i} 
					activeInd={ind} 
					path={p} 
					intrinsicSize={sizes[i]!}
					className={clsx(!open && "scale-75 opacity-0")}
				/>)}
			</>}</TransitionView>
		</Portal>
	)
}