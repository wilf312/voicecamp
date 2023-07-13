import {
  ImageMagick,
  IMagickImage,
  initialize,
  MagickFormat,
} from "https://deno.land/x/imagemagick_deno@0.0.24/mod.ts";

await initialize(); // make sure to initialize first!

/**
 * AVIFに変換して画像のクオリティを30にして、1000x1000にリサイズする
 * @param imageBuffer
 * @returns
 */
export function 画像の圧縮(imageBuffer: Uint8Array, quality = 30) {
  return new Promise<Uint8Array>((resolve) => {
    ImageMagick.read(imageBuffer, (img: IMagickImage) => {
      img.quality = quality;
      img.resize(1000, 1000);
      img.write(MagickFormat.Avif, (d) => resolve(d));
    });
  });
}

export function modifyImage(imageBuffer: Uint8Array) {
  return new Promise<Uint8Array>((resolve) => {
    const ib = imageBuffer;
    ImageMagick.read(ib, (img) => {
      img.resize(400, 400);
      img.quality = 30;
      img.format;
      img.write(
        img.format === MagickFormat.Png32 ? img.format : MagickFormat.Jpeg,
        (d) => resolve(d),
      );
    });
  });
}

/**
 * @deprecated avifのdecoderが含まれていない？
 * @param imageBuffer
 * @returns
 */
export function getImageSize(
  imageBuffer: Uint8Array,
) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    ImageMagick.read(imageBuffer, (img) => {
      const size = {
        width: img.width,
        height: img.height,
      };
      console.log(size);
      resolve(size);
    });
  });
}

export const getImageUrl = (podcast: any) => {
  if (podcast["image"] && podcast["image"]["url"]) {
    console.log("aa");
    return podcast["image"]["url"];
  } else if (podcast["itunes:image"]) {
    console.log("a");
    return podcast["itunes:image"]["@href"];
  } else if (podcast["media:thumbnail"]) {
    console.log("b");
    return podcast["media:thumbnail"]["@url"];
  } else if (podcast["image"]) {
    console.log("c");
    return podcast["image"]["url"];
    // } else if (podcast.item[0] && podcast.item[0]["itunes:image"]) {
    //   imageUrl = podcast.item[0]["itunes:image"]["@href"];
    // } else if (podcast.item[0]["media:thumbnail"]["@url"] != null) {
    //   imageUrl = podcast.item[0]["media:thumbnail"]["@url"];
    // } else if (podcast.item[0]["media:thumbnail"]["@href"] != null) {
    //   imageUrl = podcast.item[0]["itunes:image"]["@href"];
  } else {
    console.log("thumbnail is not found", podcast);
    return ``;
  }
};
