import { NextResponse } from "next/server";
import { eventEmitter, Event } from "@/lib/apiEventEmitter";

export async function POST() {
  eventEmitter.emit(Event.STOP_GENERATE);
  return NextResponse.json({ success: true });
}
