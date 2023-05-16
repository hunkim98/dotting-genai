import { Button, Flex } from "@chakra-ui/react";
import { OptionType } from "@/types/aiAssistant";

interface ButtonTypeProps {
  option: OptionType;
  isLastOption?: boolean;
}

const ButtonType = ({ option, isLastOption }: ButtonTypeProps) => {
  const { title, action } = option;

  return (
    <Flex direction="column" alignItems="center">
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
      {/* {!isLastOption && (
        <hr
          style={{
            width: "170px",
            border: "0.5px solid rgba(196, 196, 196, 0.8)",
          }}
        />
      )} */}
    </Flex>
  );
};

export default ButtonType;
