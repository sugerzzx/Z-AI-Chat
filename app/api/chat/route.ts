import { NextRequest } from "next/server";
import { sleep } from "@/lib/utils";


export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  const message = "Hello, I am a bot. How can I help you?Hello, I am a bot. How can I help you?Hello, I am a bot. How can I help you?Hello, I am a bot. How can I help you?Hello, I am a bot. How can I help you?";

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < message.length; i++) {
        await sleep(10);
        controller.enqueue(encoder.encode(message[i]));
      }
      controller.close();
    }
  });
  return new Response(stream);
}