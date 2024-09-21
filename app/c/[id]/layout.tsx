import MsgAndExamContainer from "@/components/page/MsgAndExamContainer";
import { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

const Layout: FC<LayoutProps> = ({ children, params }) => {
  return <MsgAndExamContainer conversationId={params.id}>{children}</MsgAndExamContainer>;
};

export default Layout;
