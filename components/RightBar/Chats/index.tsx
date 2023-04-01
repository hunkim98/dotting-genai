import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";
import { AlwaysScrollToBottom } from "@/utils/dom/scroll";

//reference: https://ordinarycoders.com/blog/article/react-chakra-ui
const Chats = ({
  messages,
}: {
  messages: Array<{ text: string; from: string }>;
}) => {
  return (
    <Flex
      w="100%"
      h="80%"
      overflowY="scroll"
      flexDirection="column"
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
      {messages.map((item, index) => {
        if (item.from === "user") {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              <Flex
                bg="#309695"
                color="white"
                minW="100px"
                maxW="250px"
                // my="1"
                mb="2"
                p="3"
                borderRadius="16"
              >
                <Text>{item.text}</Text>
              </Flex>
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                // name="Computer"
                // src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="#309695"
                size="sm"
                mr="1"
              ></Avatar>
              <Flex
                bg="white"
                color="#313033"
                minW="100px"
                maxW="250px"
                mb="2"
                // my="1"
                p="3"
                borderRadius="16"
              >
                <Text>{item.text}</Text>
              </Flex>
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Chats;
