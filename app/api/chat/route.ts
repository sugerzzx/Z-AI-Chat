import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < message.length; i++) {
        controller.enqueue(encoder.encode(message[i]));
      }
      controller.close();
    }
  });
  return new Response(stream);
}