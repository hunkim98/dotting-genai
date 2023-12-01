import { useState } from "react";
import { ImageDownloadOptions } from "dotting";

import Image from "next/image";
import logo from "@/public/logo.svg";
import {
  Flex,
  Menu,
  Button,
  Portal,
  Tooltip,
  MenuItem,
  MenuList,
  MenuButton,
} from "@chakra-ui/react";
import { DownloadIcon, HamburgerIcon } from "@chakra-ui/icons";

interface HeaderProps {
  downloadImage: (options: ImageDownloadOptions) => void;
  isGridVisible: boolean;
}

const Header = ({ downloadImage, isGridVisible }: HeaderProps) => {
  const [username] = useState("Guest");

  return (
    <>
      <Flex
        width="auto"
        height="45px"
        style={{
          left: "16px",
          top: "16px",
          padding: "8px 20px",
          borderRadius: "10px",
          background: "#fff",
          position: "absolute",
          border: "1px solid #E4E7EC",
          filter: "drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15))",
        }}
      >
        <Image src={logo} width={40} height={27} alt="logo" />
        <Tooltip
          hasArrow
          label="Hello, Guest!"
          aria-label="A tooltip"
          fontSize={12}
        >
          <Button
            ml="5"
            height="7"
            fontSize={12}
            colorScheme="teal"
            borderRadius={15}
          >
            {username}
          </Button>
        </Tooltip>

        <Menu>
          <MenuButton
            ml="5"
            style={{
              width: "24px",
              height: "26px",
              borderRadius: "300px",
            }}
          >
            <HamburgerIcon width="24px" height="auto" color={"#969696"} />
          </MenuButton>
          <Portal>
            <MenuList w={12} py="0" mt="-1" borderRadius={10}>
              <MenuItem
                pl="6"
                icon={<DownloadIcon />}
                fontSize={14}
                borderRadius={10}
                bg="white.500"
                onClick={() => downloadImage({ isGridVisible, type: "png" })}
                _hover={{ bg: "gray.50" }}
              >
                <Flex py="2" pl="4">
                  Download as image
                </Flex>
              </MenuItem>
              <MenuItem
                pl="6"
                icon={<DownloadIcon />}
                fontSize={14}
                borderRadius={10}
                bg="white.500"
                onClick={() => downloadImage({ isGridVisible, type: "svg" })}
                _hover={{ bg: "gray.50" }}
              >
                <Flex py="2" pl="4">
                  Download as svg
                </Flex>
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
    </>
  );
};

export default Header;
