import { useContext, useEffect, useState } from "react";
import { Flex, Text, Button, Box, Container } from "@chakra-ui/react";
import { Heading } from "@chakra-ui/react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import entryGif from "../../assets/Research paper.gif";
import FeatureCard from "../../components/FeatureCard/FeatureCard";
import { Footer } from "../../components/Footer/Footer";
import transparent from "../../assets/transparency.png";
import anonymous from "../../assets/anonymous.png";
import publications from "../../assets/Publications.png";
import { FcDisclaimer } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../stores";
import { setLoginRegisterModal, setModalName } from "../../stores/slices/loginRegisterModalSlice";
import { UserContext } from "../../contexts/user";
import { connectToMetamask } from "../../utils/metamaskUtils";
import { useNavigate } from "react-router-dom";
import { demoUser } from "../../constants/demoUsers";
import { setUser } from "../../stores/slices/userSlice";

export default function SignUpLoginInScreen() {
  const user=useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnClickMetaMaskLogin = async () => {
    if(user.username === ""){
      const result = await connectToMetamask();
      if (result) {
        const { address } = result;
        // Here you would typically send the address to your backend to authenticate
        // For now, we'll just set the user with the address as the username
        dispatch(setUser({...demoUser, username: "Metamask User", name: "Metamask User", metamaskAddress: address}));
      } else {
        // Handle the case where connection failed
        alert("Failed to connect to Metamask. Please make sure it's installed and try again.");
      }
    }else{
      navigate("/browse");
    }
  };

  const handleOnClickRegister = () => {
    dispatch(setLoginRegisterModal(true));
    dispatch(setModalName("scholar"));
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`${isDarkMode && "bg-black"}`}>
      <Box
        zIndex={-1}
        width="35vw"
        height="35vw"
        position="absolute"
        right="10%"
        top="-20%"
        borderRadius="50%"
        bgColor="#f0effd"
      ></Box>
      <Box
        zIndex={-1}
        width="35vw"
        height="35vw"
        position="absolute"
        right="-10%"
        borderRadius="50%"
        bgColor="#f0effd"
      ></Box>
      <Box
        zIndex={-1}
        width="40vw"
        height="40vw"
        position="absolute"
        right="-20%"
        top="-20%"
        borderRadius="50%"
        bgColor="#f0effd"
      ></Box>
      <Container maxW="7xl">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          height="90vh"
        >
          <Flex flexDirection="column">
            <Flex flexDirection="row" alignItems="center">
              <Heading
                as="h1"
                size="4xl"
                className={`${isDarkMode && "text-gray-100"}`}
              >
                Kaia Scholar
              </Heading>
            </Flex>
            <Box fontSize="lg" my={6}>
              <Text
                color={`${isDarkMode ? "gray.300" : "gray.600"}`}
                width={300}
                className={`${isDarkMode && "text-gray-300"}`}
              >
                A new way for{" "}
                <Text color="#6459F5" d="inline" fontWeight="extrabold">
                  academic publishing
                </Text>
                .
              </Text>
              <Text
                color={`${isDarkMode ? "gray.300" : "gray.600"}`}
                width={300}
              >
                {" "}
                Say goodbye 👋 to illegitmate and plagiarized research papers.
              </Text>
            </Box>
            <Button
              mt={6}
              bg="#6459F5"
              color="#ffffff"
              variant="solid"
              width={350}
              onClick={handleOnClickMetaMaskLogin}
            >
              {user.username === "" ? "Login with MetaMask" : "Browse"}
            </Button>
          </Flex>
          <Flex>
            <img width="650px" src={entryGif} alt="entry" />
          </Flex>
        </Flex>
        <Flex justifyContent="center" flexDirection="column">
          <Heading
            textAlign="center"
            className={`${isDarkMode && "text-gray-100"}`}
          >
            Features
          </Heading>
          <Flex justifyContent="space-around" mt="4rem" px={20}>
            <FeatureCard
              image={transparent}
              title="Transparent"
              content="We offer a transparent Kaia scholar process. Your work is visible to all and reviewed by trusted academics"
            />
            <FeatureCard
              image={anonymous}
              title="Anonymous"
              content="The reviews are conducted anonymously. The information of the reviewers is private and safe with us."
            />
            <FeatureCard
              image={publications}
              title="Import Existing Publications"
              content="Import your existing publications/articles from Google Scholar in less than 3 minutes."
            />
          </Flex>
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Flex
            zIndex={isDarkMode ? "auto" : -1}
            width="45vw"
            flexDirection="column"
            mt="6rem"
            p={8}
            borderRadius="15px"
            bg={isDarkMode ? "#343434 " : "#F6F6FA"}
          >
            <Flex alignItems="center">
              <Heading
                textAlign="center"
                className={`${isDarkMode && "text-gray-100"}`}
              >
                Disclaimer
              </Heading>
              <Box ml={2} as={FcDisclaimer} size="3rem" />
            </Flex>
            <Text mt={4} className={`${isDarkMode && "text-gray-300"}`}>
              The data you provide us with does not persist on any server-side
              databases but is completely stored on the blockchain. We respect
              your privacy and strive to achieve the most secure system. Your
              data is safe.
            </Text>
          </Flex>
        </Flex>
      </Container>
      <Footer />
    </div>
  );
}
