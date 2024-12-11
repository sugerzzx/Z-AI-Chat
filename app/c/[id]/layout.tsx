import MsgAndExamContainer from "@/components/page/MsgAndExamContainer";
import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const Layout: FC<LayoutProps> = async ({ children, params }) => {
  return <MsgAndExamContainer conversationId={(await params).id}>{children}</MsgAndExamContainer>;
};

export default Layout;
