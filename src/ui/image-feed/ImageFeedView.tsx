"use client";

import { useState } from "react";
import { ImageView } from "./ImageView";
import { Lightbox } from "./Lightbox";
import clsx from "clsx";

type Props = {
    paths: string[];
    intrinsicSizes: [ width: number, height: number ][]; 
    colWidth?: number;
    gap?: number;
    eager?: boolean;
    lightbox?: boolean;
};

const ROW_HEIGHT = 4;
const DEFAULT_IMG_GAP = 16;
const DEFAULT_IMG_WIDTH = 300;

/** You probably want `ImageFeed` instead. */
export default function ImageFeedView(props: Props) {
    const [ lightboxInd, setLightboxInd ] = useState(0);
    const [ lightboxOpen, setLightboxOpen ] = useState(false);

    const handleShowLightbox = (ind: number) => {
        setLightboxInd(ind);
        setLightboxOpen(true);
    }

    return (
        <div className="@container grid">
            <div 
                className="grid grid-1 gap-x-(--gap) auto-rows-(--row-height)" 
                style={{
                    ["--row-height" as any]: `${ROW_HEIGHT}px`,
                    ["--min-col-width" as any]: `${props.colWidth ?? DEFAULT_IMG_WIDTH}px`,
                    ["--gap" as any]: `${props.gap ?? DEFAULT_IMG_GAP}px`,
                    ["--num-cols" as any]: `max(round(down, calc((100cqw + var(--gap)) / (var(--min-col-width) + var(--gap)))), 1)`,
                    ["--col-width" as any]: `calc((100cqw - (var(--num-cols) - 1) * var(--gap)) / var(--num-cols))`,
                    gridTemplateColumns: `repeat(var(--num-cols), 1fr)` 
                }}
            >
                {props.paths.map((path, i) => 
                    <div
                        key={`${path}_${i}`} 
                        className="contain-size pb-(--gap) grid"
                        style={{ 
                            ["--aspect" as any]: Math.round(props.intrinsicSizes[i]![0] / props.intrinsicSizes[i]![1] * 100) / 100,
                            ["--span-rows" as any]: `calc(round(up, calc(var(--col-width) / var(--aspect)), var(--row-height)) / var(--row-height) + round(var(--gap) / var(--row-height)))`, 
                            gridRow: `span var(--span-rows)`
                        }}
                    >
                        <ImageView
                            lightbox={false}
                            onClick={() => handleShowLightbox(i)}
                            path={path} 
                            eager={i < 12 && props.eager}
                            intrinsicSize={props.intrinsicSizes[i]!}
                            className={clsx("grid-1 size-full rounded-xl shadow-md shadow-black/20", props.lightbox && "cursor-pointer")}
                        />    
                    </div>
                )}
            </div>
            {props.lightbox && <Lightbox
                open={lightboxOpen}
                index={lightboxInd}
                paths={props.paths}
                intrinsicSizes={props.intrinsicSizes}
                onClose={() => setLightboxOpen(false)}
            />}
        </div>
    )
}