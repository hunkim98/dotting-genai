import Image from "next/image";
import send from "@/public/send-filled.svg";
import { Flex, Input } from "@chakra-ui/react";
import { useChatContext } from "@/context/ChatContext";

interface PromptProps {
  handleSubmit: (e: React.FormEvent<HTMLElement>) => void;
}

const Prompt = ({ handleSubmit }: PromptProps) => {
  const { keyword, setKeyword } = useChatContext();

  return (
    <form onSubmit={handleSubmit}>
      <Flex bg="#E9E9E9" minH="72px" w="100%" px="4" pt="3" pb="5">
        <Input
          autoFocus
          placeholder="Type a Message"
          mr="2"
          size="md"
          bg="#FFF"
          borderRadius="32"
          _focusVisible={{
            outline: "none",
          }}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          <Image src={send} width={24} height={24} alt="send" />
        </button>
      </Flex>
    </form>
  );
};

export default Prompt;
