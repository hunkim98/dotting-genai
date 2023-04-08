import { Button, Flex } from "@chakra-ui/react";
import { OptionType } from "@/types/aiAssistant";

interface OptionsProps {
  options: OptionType[];
}

const Options = ({ options }: OptionsProps) => {
  return (
    <>
      {options?.map(({ title, action }, index) => {
        return (
          <Flex key={index} direction="column" alignItems="center">
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
            {index === options?.length - 1 ? (
              <></>
            ) : (
              <hr
                style={{
                  width: "170px",
                  border: "0.5px solid rgba(196, 196, 196, 0.8)",
                }}
              />
            )}
          </Flex>
        );
      })}
    </>
  );
};

export default Options;
