import { imageSize } from "@/lib/Image";
import NextImage from "next/image";
import { CSSProperties } from "react";
import { ImageView } from "./ImageView";
import clsx from "clsx";

type Props = {
    path: string;
    style?: CSSProperties;
    className?: string;
    eager?: boolean;
    quality?: number;
    /** Whether clicking on this image shows a lightbox. Defaults to true. */
    lightbox?: boolean;

    /** Can be specified to avoid running the imageSize function internally. */
    intrinsicSize?: [ width: number, height: number ];
}

export async function LocalImage(props: Props) {
    const size = props.intrinsicSize ?? await imageSize(`public/${props.path}`);

    return (
        <ImageView
            className={clsx(props.className, (props.lightbox ?? true) && "cursor-pointer")}
            lightbox={props.lightbox ?? true}
            path={props.path}
            intrinsicSize={size}
            eager={props.eager}
            quality={props.quality}
        />
    );
}