import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams;
  const offset = parseInt(param.get("offset") ?? "0");
  const limit = parseInt(param.get("limit") ?? "20");

  const total = await prisma.conversation.count();
  const items = await prisma.conversation.findMany({
    skip: offset,
    take: limit,
    orderBy: {
      updateTime: "desc"
    }
  });

  return NextResponse.json({
    code: 0,
    items: items.map(item => ({ ...item, updateTime: item.updateTime.getTime() })),
    total,
    offset
  });
}