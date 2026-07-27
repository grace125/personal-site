import { getImageProps } from 'next/image'
import { StaticImageData } from 'next/image'


export type BackgroundImageProps = {
    src: StaticImageData
    z?: `${"-" | ""}z-${number}`
    className?: string
    alt?: string
}

export function BackgroundImage(props: BackgroundImageProps) {
    const { props: image } = getImageProps({
        src: props.src,
        alt: props.alt ?? "", // Background images are purely aesthetic.
        loading: "eager",
        // TODO
        // width: 256,  
        // height: 256,
    })

    return <div 
        className={`inset-0 absolute min-h-full w-full ${props.z ?? "-z-1000"} ${props.className ?? ""}`} 
        style={{ backgroundImage: `url(${image.src})` }}
    />
}