import React from "react";
import Chats from "./Chats";
import Prompt from "./Prompt";
import { From } from "../types";
import { CloseIcon } from "@chakra-ui/icons";
import { Flex, Heading } from "@chakra-ui/react";

interface RightBarProps {
  keyword: string;
  children: React.ReactNode;
  setIsRightBarActive: (v: boolean) => void;
  messages: Array<{ content: React.ReactNode; from: From }>;
  handleSubmit: (e: React.FormEvent<HTMLElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RightBar = ({
  keyword,
  children,
  messages,
  handleSubmit,
  handleChange,
  setIsRightBarActive,
}: RightBarProps) => {
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
          <button onClick={() => setIsRightBarActive(false)}>
            <CloseIcon boxSize={3.5} />
          </button>
        </Flex>

        <Chats messages={messages}>{children}</Chats>

        <Prompt
          keyword={keyword}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </Flex>
    </Flex>
  );
};

export default RightBar;
