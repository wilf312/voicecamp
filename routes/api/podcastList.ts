import { HandlerContext } from "$fresh/server.ts";
import { actionDomain } from "../../domain/action.config.ts";
const url = `${actionDomain}/url_list.json`;

const prefix = `url`;
const meaningIsPodcast = `podcast`;

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
  const method = _req.method.toLowerCase();
  if (method === `get`) {
    const start = new Date().getTime();
    const kv = await Deno.openKv();

    // キャッシュから取るか判定する
    const iter = await kv.list(
      { prefix: [prefix, `set`] },
      { reverse: true, limit: 1 },
    );
    const data = [];
    for await (const res of iter) data.push(res);
    console.log({ data });

    const _isCacheOld = data.length > 0 && isCacheOld(new Date(data[0].key[2]));
    console.log({ _isCacheOld });

    // キャッシュを引く
    if (_isCacheOld) {
      const iter = await kv.list<string>({
        prefix: [prefix, meaningIsPodcast],
      });
      let list = [];
      for await (const res of iter) list.push(JSON.parse(res.value));

      return new Response(JSON.stringify({
        success: true,
        list,
        time: (new Date()).getTime() - start,
        cacheType: `cached`,
      }));
    }

    // 既存のキャッシュを削除する
    const deleteiter = await kv.list<string>({
      prefix: [prefix, meaningIsPodcast],
    });
    for await (const res of deleteiter) await kv.delete(res.key);

    // jsonの取得
    const json = await fetch(url, {
      method: "get",
    }).then((res) => res.json()).then((v) => {
      return v;
    }).catch(console.error);

    // 1ポッドキャストごとにオブジェクトを追加
    let count = 0;
    for await (const res of json) {
      await kv.set(
        [prefix, meaningIsPodcast, count++],
        JSON.stringify(res),
      );
    }
    // キャッシュ確認用の日付を追加
    await kv.set(
      [prefix, `set`, new Date().toISOString()],
      1,
    );

    return new Response(JSON.stringify({
      success: true,
      list: json,
      time: (new Date()).getTime() - start,
      cacheType: `noCache`,
    }));
  } else {
    return new Response(
      JSON.stringify({
        success: false,
      }),
      {
        status: 400,
      },
    );
  }
};
