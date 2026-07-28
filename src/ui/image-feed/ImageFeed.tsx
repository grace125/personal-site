import { imageSize } from "@/lib/Image";
import ImageFeedView from "./ImageFeedView";

type Props = {
    feed: string[];
    colWidth?: number;
    gap?: number;
    eager?: boolean;
    lightbox?: boolean;
};

// TODO: reformat ImageFeed to work better with site
// TODO: make carousel
// TODO: make variation of ImageFeed that shows a feed of other things
// TODO: come up with more consistent naming scheme for files
export default async function ImageFeed(props: Props) {
    const imgSizes = await Promise.all(props.feed.map(path => imageSize(`public/${path}`)));

    return (
        <ImageFeedView
            {...props}
            paths={props.feed}
            lightbox={props.lightbox ?? true}
            intrinsicSizes={imgSizes}
        />
    );
}