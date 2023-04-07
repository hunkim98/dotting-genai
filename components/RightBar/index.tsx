import React from "react";
import Chats from "./Chats";
import Prompt from "./Prompt";
import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Heading } from "@chakra-ui/react";
import { useChatContext } from "@/context/ChatContext";

interface RightBarProps {
  handleSubmit: (e: React.FormEvent<HTMLElement>) => void;
}

export const RightBar = ({ handleSubmit }: RightBarProps) => {
  const { setIsRightBar } = useChatContext();

  return (
    <Flex
      w="330px"
      h="100vh"
      justify="center"
      align="center"
      backgroundColor={"#EEEEEE"}
      sx={{
        minWidth: "300px",
      }}
    >
      <Flex w="100%" h="100%" flexDir="column">
        <Flex
          w="100%"
          h="66px"
          p="5"
          align="center"
          justifyContent="space-between"
        >
          <Heading as="h5" size="sm" w="180px">
            Dotting AI Assistant
          </Heading>
          <button onClick={() => setIsRightBar(false)}>
            <CloseIcon boxSize={3.5} />
          </button>
        </Flex>

        <Chats />

        <Prompt handleSubmit={handleSubmit} />
      </Flex>
    </Flex>
  );
};

export default RightBar;
