import Image from "next/image";
import send from "@/public/send-filled.svg";
import { Flex, Input } from "@chakra-ui/react";
import { setPrompt } from "@/lib/modules/aiAssistant";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

interface PromptProps {
  onSubmit: (e: React.FormEvent<HTMLElement>) => void;
}

const Prompt = ({ onSubmit }: PromptProps) => {
  const dispatch = useAppDispatch();
  const { prompt, isPromptDisabled } = useAppSelector(
    (state) => state.aiAssistant
  );

  return (
    <form onSubmit={onSubmit}>
      <Flex bg="#E9E9E9" minH="72px" w="100%" px="4" pt="3" pb="5">
        <Input
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
