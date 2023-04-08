import { ForwardedRef, forwardRef, useRef } from "react";
import { Button, Flex, Input } from "@chakra-ui/react";
import { OptionType } from "@/types/aiAssistant";

interface InputTypeProps {
  option: OptionType;
  isLastOption: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputType(
  { option, onChange, isLastOption }: InputTypeProps,
  ref: ForwardedRef<HTMLInputElement | null>
) {
  const { title, action } = option;

  return (
    <Flex direction="column" alignItems="center">
      <Input
        ref={ref}
        type="file"
        id="uploadImg"
        accept="image/*"
        onChange={onChange}
        display="none"
      />
      <label htmlFor="uploadImg" style={{ cursor: "pointer" }}>
        <Button
          px="5"
          my="2.5"
          size="md"
          height="8"
          fontSize="12"
          borderRadius="20"
          onClick={action}
          colorScheme="teal"
        >
          {title}
        </Button>
      </label>

      {!isLastOption && (
        <hr
          style={{
            width: "170px",
            border: "0.5px solid rgba(196, 196, 196, 0.8)",
          }}
        />
      )}
    </Flex>
  );
}
export default forwardRef<HTMLInputElement, InputTypeProps>(InputType);
