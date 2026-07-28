"use client";

import { imageSize } from "@/lib/Image";
import NextImage from "next/image";
import React, { CSSProperties, MouseEventHandler, useState } from "react";
import { Lightbox } from "./Lightbox";

type Props = {
    path: string;
    style?: CSSProperties;
    className?: string;
    eager?: boolean;
    quality?: number;
    intrinsicSize: [ width: number, height: number ];
    lightbox?: boolean;
    onClick?: MouseEventHandler<HTMLImageElement>;
}

/** You *probably* want to use LocalImage instead of this. */
export function ImageView(props: Props) {
    const [ width, height ] = props.intrinsicSize;
    const [ lightboxOpen, setLightboxOpen ] = useState(false);

    return (
        <>
            {props.lightbox && <Lightbox
                open={lightboxOpen}
                path={props.path}
                intrinsicSize={props.intrinsicSize}
                onClose={() => setLightboxOpen(false)}
            />}
            <NextImage
                alt=""
                onClick={props.onClick ?? (props.lightbox ? () => setLightboxOpen(l => !l) : undefined)}
                className={props.className}
                style={{ aspectRatio: Math.round(width / height * 100) / 100, objectFit: "cover", ...props.style }}
                sizes="100vw"
                src={`/${props.path}`}
                width={width}
                height={height}
                quality={props.quality ?? 90}
                loading={props.eager ? "eager" : "lazy"}
            />
        </>
    );
}