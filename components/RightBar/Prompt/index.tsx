import Image from "next/image";
import send from "@/public/send-filled.svg";
import { Flex, Input } from "@chakra-ui/react";
import { setPrompt } from "@/lib/modules/aiAssistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useRef } from "react";

interface PromptProps {
  onSubmit: (e: React.FormEvent<HTMLElement>) => void;
}

const Prompt = ({ onSubmit }: PromptProps) => {
  const dispatch = useAppDispatch();
  const { prompt, isPromptDisabled, messages } = useAppSelector(
    (state) => state.aiAssistant
  );
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const lastMessageContent = lastMessage.content;
      console.log(lastMessageContent);
      if (lastMessageContent === "Please input your prompt.") {
        inputRef.current?.focus();
      }
    }
  }, [messages]);

  return (
    <form onSubmit={onSubmit}>
      <Flex
        bg={isPromptDisabled ? "#E9E9E9" : "#ddd"}
        minH="72px"
        w="100%"
        px="4"
        pt="3"
        pb="4"
      >
        <Input
          /// <reference path="" />
          ref={inputRef}
          disabled={isPromptDisabled}
          autoFocus
          placeholder="Type a Message"
          mr="2"
          size="md"
          bg="#FFF"
          borderRadius="32"
          _focusVisible={{
            outline: "none",
          }}
          value={prompt}
          onChange={(e) => dispatch(setPrompt(e.target.value))}
        />
        <button type="submit" onClick={onSubmit} disabled={isPromptDisabled}>
          <Image src={send} width={24} height={24} alt="send" />
        </button>
      </Flex>
    </form>
  );
};

export default Prompt;
