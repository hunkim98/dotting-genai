import React from "react";
import GenAiImage from "../../GenAiImage";
import { From } from "@/types/aiAssistant";
import { Avatar, Flex } from "@chakra-ui/react";

const GenAiImageType = ({ from, imgUrl }: { from: From; imgUrl: string }) => {
  if (from === From.USER) {
    return (
      <Flex w="100%" justify="flex-end">
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
          <GenAiImage rawImageUrl={imgUrl} initPixelationDegree={3} />
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%">
        <Avatar name="D" bg="#309695" size="sm" mr="2"></Avatar>
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
          <GenAiImage rawImageUrl={imgUrl} initPixelationDegree={3} />
        </Flex>
      </Flex>
    );
  }
};

export default GenAiImageType;
