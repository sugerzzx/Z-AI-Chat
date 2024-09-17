"use client";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

interface ConversationNotFoundProps {}

const ConversationNotFound: FC<ConversationNotFoundProps> = ({}) => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, [router]);

  return null;
};

export default ConversationNotFound;
