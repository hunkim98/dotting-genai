import React, { useState } from "react";

import Options from "../Options";
import { Avatar, Flex } from "@chakra-ui/react";
import { useChatContext } from "@/context/ChatContext";
import { AlwaysScrollToBottom } from "@/utils/dom/scroll";

//reference: https://ordinarycoders.com/blog/article/react-chakra-ui
const Chats = () => {
  const { messages } = useChatContext();
  const [options, setOptions] = useState<
    { title: string; action: () => void }[]
  >([
    {
      title: "Create me an asset",
      action: () => {
        console.log("Create me an asset");
      },
    },
    {
      title: "Create me a background",
      action: () => {
        console.log("Create me a background");
      },
    },
    {
      title: "Ask for other options",
      action: () => {
        console.log("Ask for other options");
      },
    },
  ]);

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
      {messages.map((item, index) => {
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
              <Avatar
                name="D"
                // src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="#309695"
                size="sm"
                mr="2"
              ></Avatar>
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
      {/* This is the part to be displayed under the CHAT component. */}
      {/* Specify options state for each step as children */}
      <Options options={options} />
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Chats;
