import { cache } from "react";
import { imageSizeFromFile } from "image-size/fromFile";

export const imageSize = cache(async (path: string): Promise<[ width: number, height: number ]> => {
    const { width, height } = await imageSizeFromFile(path);
    return [ width, height ];
});