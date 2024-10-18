import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

export const Footer = () => {
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  return (
    <Flex
      bg={isDarkMode ? "#151515" : "#f0effd"}
      w="100vw"
      justifyContent="center"
      flexDirection="column"
      mt="5rem"
    >
      <Flex justifyContent="center">
        <Stack
          spacing="8"
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: "12", md: "16" }}
        >
          <Stack align="start" className={isDarkMode?"text-gray-200":""}>
            <img width="72" height="72" src={logo} alt="logo" />
            <Text color="muted">A Decentralized</Text>
            <Text>Academic Publishing System</Text>
            <Text>Using The Kaia Platform
</Text>
          </Stack>
          <Stack
            direction={{ base: "column-reverse", md: "column", lg: "row" }}
            spacing={{ base: "12", md: "8" }}
          >
            <Stack direction="row" spacing="8">
              <Stack spacing="4" minW="36" flex="1">
                <Text fontSize="sm" fontWeight="semibold" color={isDarkMode?"white":"subtle"}>
                  Product
                </Text>
                <Stack spacing="3" shouldWrapChildren>
                  <Button variant="link">How it works</Button>
                  <Button variant="link">Pricing</Button>
                  <Button variant="link">Use Cases</Button>
                </Stack>
              </Stack>
              <Stack spacing="4" minW="36" flex="1">
                <Text fontSize="sm" fontWeight="semibold" color={isDarkMode?"white":"subtle"}>
                  Legal
                </Text>
                <Stack spacing="3" shouldWrapChildren>
                  <Button variant="link">Privacy</Button>
                  <Button variant="link">Terms</Button>
                  <Button variant="link">License</Button>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Flex>
      <Flex display="block">
        <Divider />
        <Stack
          pt="8"
          pb="12"
          justify="center"
          direction={{ base: "column-reverse", md: "row" }}
          align="center"
        >
          <Text fontSize="sm" color={isDarkMode?"white":"subtle"}>
            &copy; {new Date().getFullYear()} Kaia Scholar Inc. All rights
            reserved.
          </Text>
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              href="#"
              aria-label="LinkedIn"
              icon={<FaLinkedin fontSize="1.25rem" className={`${isDarkMode&&"text-white"}`} />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" className={`${isDarkMode&&"text-white"}`}/>}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" className={`${isDarkMode&&"text-white"}`}/>}
            />
          </ButtonGroup>
        </Stack>
      </Flex>
    </Flex>
  );
};
