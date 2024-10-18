import {
  Box,
  Text,
  Heading,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

export default function FeatureCard({
  title,
  content,
  image,
}: {
  title: string;
  content: string;
  image: any;
}) {
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  const bgColor = useColorModeValue("white", "gray.900");
  const darkBgColor = useColorModeValue("#343434", "gray.200");

  const colorTitle = useColorModeValue("gray.700", "white");
  const darkColorTitle = useColorModeValue("gray.200", "white");
  return (
    <Box
      // h="45vh"
      w="300px"
      bg={isDarkMode ? darkBgColor : bgColor}
      boxShadow={"2xl"}
      rounded={"md"}
      p={10}
      overflow={"hidden"}
    >
      <Flex h={100} mb={6} justifyContent="center">
        <img src={image} alt="logo" />
      </Flex>
      <Stack height={100} mb={6}>
        <Stack>
          <Heading
            size="md"
            color={isDarkMode ? darkColorTitle : colorTitle}
            fontFamily={"body"}
          >
            {title}
          </Heading>
          <Text color={isDarkMode? "gray.400":"gray.500"} noOfLines={[1, 5]}>
            {content}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
