import React from "react";
import Options from "../Options";
import TextType from "./Type/TextType";
import { Flex } from "@chakra-ui/react";
import Loading from "@/components/Loading";

import { useAppSelector } from "@/lib/hooks";
import GenAiImageType from "./Type/GenAiImageType";
import { ChatType } from "@/types/aiAssistant";
import { AlwaysScrollToBottom } from "@/utils/dom/scroll";

//reference: https://ordinarycoders.com/blog/article/react-chakra-ui
const Chats = () => {
  const { isReceiving } = useAppSelector((state) => state.genAi);
  const { messages, isOptionsVisible } = useAppSelector(
    (state) => state.aiAssistant
  );

  return (
    <Flex
      w="100%"
      overflowY="scroll"
      flexGrow={1}
      flexDirection="column"
      alignItems="center"
      p="3"
      bg="#EEEEEE"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
          height: "3px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#78dea1",
          borderRadius: "2px",
        },
        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      {messages?.map((item, index) => {
        if (item.type === ChatType.TEXT) {
          return (
            <TextType key={index} from={item.from} content={item.content} />
          );
        } else {
          return (
            <GenAiImageType
              key={index}
              from={item.from}
              imgUrl={item.content}
            />
          );
        }
      })}
      {isReceiving && <Loading />}
      {isOptionsVisible && <Options />}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Chats;
