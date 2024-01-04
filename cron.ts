Deno.cron('cron', '*/10 * * * *', async () => {
  console.log('cron job executed every 10 minutes')

  const deleteUrl = `https://voicecamp.love/api/kv?delete=1`
  const res = await fetch(deleteUrl)
  const json = await res.json()

  console.log(json)
})
