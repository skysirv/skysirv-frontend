export async function POST() {
  return new Response(
    JSON.stringify({
      error: "Webhook handling is not configured on the frontend.",
    }),
    {
      status: 410,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}