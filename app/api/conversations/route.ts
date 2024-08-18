import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("page");
  const page = param ? parseInt(param) : 1;
  const items = await prisma.conversation.findMany({
    skip: (page - 1) * 20,
    take: 20,
    orderBy: {
      updateTime: "desc"
    }
  });
  return NextResponse.json({ code: 0, items: items.map(item => ({ ...item, updateTime: item.updateTime.getTime() })) });
}