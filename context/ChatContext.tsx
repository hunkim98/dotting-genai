import React, { useMemo, useState, createContext, useContext } from "react";
import { Img } from "@chakra-ui/react";
import { From } from "@/components/types";

interface ChatContext {
  keyword: string;
  setKeyword: React.Dispatch<React.SetStateAction<string>>;
  isRightBar: boolean;
  setIsRightBar: React.Dispatch<React.SetStateAction<boolean>>;
  messages: MessageType;
  setMessages: React.Dispatch<React.SetStateAction<MessageType>>;
}

type MessageType = Array<{ from: From; content: React.ReactNode }>;

export const ChatContext = createContext({} as ChatContext);

function ChatContextProvier({ children }: { children: React.ReactNode }) {
  // DESC: search keyword for prompt
  const [keyword, setKeyword] = useState<string>("");
  const [isRightBar, setIsRightBar] = useState(false);
  const [messages, setMessages] = useState<MessageType>([
    {
      from: From.AI,
      content: "Hello this is Dotting Ai, how may I help you?",
    },
    {
      from: From.AI,
      content: "How would you like to create an asset?",
    },
    {
      from: From.USER,
      content: "Create me an asset.",
    },
    {
      from: From.AI,
      content: (
        <Img
          width="200"
          height={"200"}
          src="https://post-phinf.pstatic.net/MjAxODAzMDJfMzcg/MDAxNTE5OTI4OTY5NTI2.wAmNqnMG0QX0snU_mPDk6PUrzbEY6buIQoFl5pRdKJwg.y8mu7rj35I0wSMUY1isb0Fw9ZGxVcpzRSh8rmJh3jDAg.JPEG/IQFkIuo9jfMHN4VfUe2kbNZ7bNm8.jpg?type=w400"
          alt="sample"
        />
      ),
    },
  ]);

  const value = useMemo(
    () => ({
      keyword,
      setKeyword,
      isRightBar,
      setIsRightBar,
      messages,
      setMessages,
    }),
    [isRightBar, keyword, messages]
  );
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChatContext = () => useContext(ChatContext);
export default ChatContextProvier;
