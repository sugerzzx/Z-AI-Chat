"use client";
import MsgAndExamContainer from "@/components/page/MsgAndExamContainer";
import ExampleComp from "@/components/example/ExampleComp";
import { useEffect, useState } from "react";
import { useEventBusContext } from "@/components/EventBusContext";
import Conversation from "@/components/chatPage/Conversation";
import { useAppContext } from "@/components/AppContextProvider";
import { ActionType } from "@/lib/appReducer";
import { Event } from "@/constant/event.enum";

export default function Home() {
  const { dispatch } = useAppContext();
  const { subscribe, unsubscribe } = useEventBusContext();
  const [isConversation, setIsConversation] = useState<boolean>(false);

  useEffect(() => {
    const callback = () => {
      dispatch({ type: ActionType.UPDATE, field: 'messageList', value: [] });
      setIsConversation(true);
    };
    subscribe(Event.NewConversation, callback);
    return () => {
      unsubscribe(Event.NewConversation, callback);
    };
  }, [dispatch, subscribe, unsubscribe]);

  return <MsgAndExamContainer>
    {isConversation ? <Conversation /> : <ExampleComp />}
  </MsgAndExamContainer>;
}
