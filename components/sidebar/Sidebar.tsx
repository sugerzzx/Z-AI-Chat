import SwitchAndNewChat from "./SwitchAndNewChat";
import ChatGpt from "./ChatGpt";
import ChatHistory from "./ChatHistory";
import Container from "./Container";
import { ScrollArea } from "@/components/ui/ScrollArea";

const SideBar = ({}) => {
  return (
    <Container>
      <SwitchAndNewChat />
      <ScrollArea className="flex-col flex-1 transition-opacity duration-500 -mr-3 pr-4">
        <ChatGpt />
        <ChatHistory />
      </ScrollArea>
    </Container>
  );
};

export default SideBar;
