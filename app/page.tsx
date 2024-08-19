"use client";
import MsgAndExamContainer from "@/components/common/page/MsgAndExamContainer";
import ExampleComp from "@/components/example/ExampleComp";
import { useEffect, useState } from "react";
import { useEventBusContext } from "@/components/EventBusContext";
import Conversation from "@/components/chatPage/Conversation";
import { useAppContext } from "@/components/AppContextProvider";
import { ActionType } from "@/lib/appReducer";

export default function Home() {
  const { dispatch } = useAppContext();
  const { subscribe, unsubscribe } = useEventBusContext();
  const [isConversation, setIsConversation] = useState<boolean>(false);

  useEffect(() => {
    const callback = (conversationId: string) => {
      dispatch({ type: ActionType.UPDATE, field: 'messageList', value: [] });
      setIsConversation(true);
    };
    subscribe("newConversation", callback);
    return () => {
      unsubscribe("newConversation", callback);
    };
  }, []);

  return <MsgAndExamContainer>
    {isConversation ? <Conversation /> : <ExampleComp />}
  </MsgAndExamContainer>;
}
