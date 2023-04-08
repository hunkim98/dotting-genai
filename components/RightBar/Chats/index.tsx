import React from "react";
import Options from "../Options";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/lib/hooks";
import { Avatar, Flex } from "@chakra-ui/react";
import { AlwaysScrollToBottom } from "@/utils/dom/scroll";

//reference: https://ordinarycoders.com/blog/article/react-chakra-ui
const Chats = () => {
  const { messages, options, isOptionsVisible } = useAppSelector(
    (state) => state.aiAssistant
  );
  const { isReceiving } = useAppSelector((state) => state.genAi);
  console.log('문제의 메시지', messages);
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
          if (item.from === "user") {
            return (
              <Flex key={index} w="100%" justify="flex-end">
                <Flex
                  bg="#309695"
                  color="white"
                  minW="100px"
                  maxW="250px"
                  mb="4"
                  px="4"
                  py="2.5"
                  fontSize="14"
                  borderRadius="16"
                >
                  {item.content}
                </Flex>
              </Flex>
            );
          } else {
            return (
              <Flex key={index} w="100%">
                <Avatar name="D" bg="#309695" size="sm" mr="2"></Avatar>
                <Flex
                  bg="white"
                  color="#313033"
                  minW="100px"
                  maxW="250px"
                  mb="4"
                  px="4"
                  py="2.5"
                  fontSize="14"
                  borderRadius="16"
                >
                  {item.content}
                </Flex>
              </Flex>
            );
          }
        })}
      {isReceiving && <Loading />}
      {isOptionsVisible && <Options options={options} />}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Chats;
