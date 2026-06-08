const token = "c472fa9ffd0bc033fb985ea71f4089dfd635d5f21c674ff16cf67ccde111b0c7";

export function GET() {
  return new Response(token, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
