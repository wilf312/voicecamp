import { HandlerContext } from "$fresh/server.ts";
import { getImageSize, getImageUrl, modifyImage } from "./_imagick.ts";

const prefix = `image`;

const isCacheOld = (cacheDate: Date, now: Date = new Date()) => {
  const cacheTime = 60 * 60; // 1時間
  // const cacheTime = 60; // 60sec
  // console.log({
  //   "now": now,
  //   "5sec": dateFns.subSeconds(now, cacheTime),
  //   "cacheDate": cacheDate,
  // });

  console.log(`now`, now);
  console.log(`setsecond`, now.setSeconds(now.getSeconds() - cacheTime));

  return (new Date(now.setSeconds(now.getSeconds() - cacheTime))) < cacheDate;
};

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Response => {
  const url = new URL(_req.url);
  const searchParams = new URLSearchParams(url.search);
  const hash = searchParams.get(`hash`);
  const nocache = searchParams.get(`nocache`);
  const method = _req.method.toLowerCase();
  if (method !== `get` || hash == null) {
    return new Response(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      },
    );
  }
  const start = new Date().getTime();
  const kv = await Deno.openKv();

  // TODO: キャッシュがあるか確認する

  const imageText = await kv.get(
    [prefix, hash],
  );
  if (!nocache && imageText && imageText.value) {
    console.log(
      `cache hit!`,
      imageText.key,
      imageText.value.length,
      typeof imageText.value,
      prefix,
      hash,
    );
    // 画像のtextをuint8arrayに変換する
    const imageBuffer = new Uint8Array(imageText.value);

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "content-type": "image/avif",
      },
    });
  }
  // TODO: あればキャッシュを返す
  // TODO: なかったら取得処理を行う

  console.log({ hash });

  // TODO: hashからpodcastのjsonを取得する
  // JSONから画像のURLを取得する
  // fetch(`https://action-ten.vercel.app/${aaaa}.json`)
  const r = await fetch(
    `https://action-ten.vercel.app/${encodeURI(hash)}.json`,
  );

  const json = await r.json();
  // 画像を取得する
  const imageUrl = getImageUrl(json) ||
    `https://cdn2.thecatapi.com/images/c4v.jpg`;

  console.log(imageUrl);

  const rr = await fetch(imageUrl);
  const image = await rr.arrayBuffer();
  const imageBuffer = new Uint8Array(image);
  // 圧縮する
  const compressedImage = await modifyImage(imageBuffer);
  const compressedImage2 = compressedImage.copyWithin();

  // console.log({
  //   compressedImage2,
  //   compressedImage2length: compressedImage2.length,
  //   prefix,
  //   hash,
  // });

  // 圧縮した画像をキャッシュする
  await kv.set(
    [prefix, hash],
    compressedImage2,
  );

  // 画像を返す
  return new Response(compressedImage, {
    status: 200,
    headers: {
      "content-type": "image/avif",
    },
  });

  // // キャッシュから取るか判定する
  // const iter = await kv.list(
  //   { prefix: [prefix, `set`] },
  //   { reverse: true, limit: 1 },
  // );
  // const data = [];
  // for await (const res of iter) data.push(res);
  // console.log({ data });

  // const _isCacheOld = data.length > 0 && isCacheOld(new Date(data[0].key[2]));
  // console.log({ _isCacheOld });

  // // キャッシュを引く
  // if (_isCacheOld) {
  //   const iter = await kv.list<string>({
  //     prefix: [prefix, meaningIsPodcast],
  //   });
  //   let list = [];
  //   for await (const res of iter) list.push(JSON.parse(res.value));

  //   return new Response(JSON.stringify({
  //     success: true,
  //     list,
  //     time: (new Date()).getTime() - start,
  //     cacheType: `cached`,
  //   }));
  // }

  // // 既存のキャッシュを削除する
  // const deleteiter = await kv.list<string>({
  //   prefix: [prefix, meaningIsPodcast],
  // });
  // for await (const res of deleteiter) await kv.delete(res.key);

  // // jsonの取得
  // const json = await fetch(url, {
  //   method: "get",
  // }).then((res) => res.json()).then((v) => {
  //   return v;
  // }).catch(console.error);

  // // 1ポッドキャストごとにオブジェクトを追加
  // let count = 0;
  // for await (const res of json) {
  //   await kv.set(
  //     [prefix, meaningIsPodcast, count++],
  //     JSON.stringify(res),
  //   );
  // }
  // // キャッシュ確認用の日付を追加
  // await kv.set(
  //   [prefix, `set`, new Date().toISOString()],
  //   1,
  // );

  // return new Response(JSON.stringify({
  //   success: true,
  //   list: json,
  //   time: (new Date()).getTime() - start,
  //   cacheType: `noCache`,
  // }));
};
