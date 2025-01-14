import { useContext, useEffect, useRef, useState } from "react";
import { ApiContext } from "../../contexts/api";
import { EtherContext } from "../../contexts/ether";
import { LinkIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Button,
  OrderedList,
  ListItem,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Select,
  Textarea,
  Text,
  Box,
  Container,
} from "@chakra-ui/react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { IoIosPaper } from "react-icons/io";
import { BsFilePersonFill } from "react-icons/bs";
import { CloseIcon, CheckIcon } from "@chakra-ui/icons";
import PaperView from "../../components/PaperView/PaperView";
import { UserContext } from "../../contexts/user";
import illustration from "../../assets/Research paper-cuate.png";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";

export default function UploadPaperScreen() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [abstract, setAbstract] = useState("");
  const user = useContext(UserContext);
  const [hash, setHash] = useState("https://peer-review-chainlink.infura-ipfs.io/ipfs/");
  const [pages, setPages] = useState(0);
  const file = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reviewFileScreen, setReviewFileScreen] = useState(false);
  const [abstractScreen, setAbstractScreen] = useState(false);
  const ether = useContext(EtherContext).ether;
  const api = useContext(ApiContext).api;
  const [loading, setLoading] = useState(true);

  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  const navigate = useNavigate();

  const MySwal = withReactContent(Swal);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });

  if (loading) {
    return <LoadingScreen />;
  }

  const showOptions = () => {
    return (
      <Select
        placeholder="Select from dropdown"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={isDarkMode ? "text-gray-300" : ""}
      >
        {[
          "Physical, Chemical and Earth Sciences",
          "Humanities and Creative Arts",
          "Social Sciences",
          "Business and Management",
          "Engineering and Technology",
          "Education",
          "Law",
          "Health and Medicine",
          "Agriculture and Environment",
          "Other",
        ].map((category) => (
          <option key={category}>{category}</option>
        ))}
      </Select>
    );
  };

  const retrieveFile = async (e: any) => {
    // Check if user is in demo mode or ether is null
    if (!user.isDemo && ether == null) return;

    // Ensure files are present in the event target
    if (!e.target.files || e.target.files.length === 0) return;

    file.current = e.target.files[0];
    setProgress(0);
    e.preventDefault();
  };

  const reviewFile = async () => {
    console.log(file.current);
    if(user.isDemo && file.current && title && category){
      setTimeout(() => setAbstractScreen(true), 500);
      if (abstract) {
        setReviewFileScreen(true);
      }
    }else if (file.current && title && category) {
      if (ether == null) return;

      if (!file.current) return;

      const url = await ether.add(file.current, (progress) =>
        setProgress(progress)
      );
      setHash(`https://peer-review-chainlink.infura-ipfs.io/ipfs/${url}`);

      setProgress(100);

      setTimeout(() => setAbstractScreen(true), 500);
      if (abstract) {
        setReviewFileScreen(true);
      }
    } else {
      MySwal.fire({
        icon: "error",
        title: <p>Oops!</p>,
        html: <div>Required fields are not filled.</div>,
      });
    }
  };

  const onMySwalEscape=()=>{
    MySwal.close();
    navigate("/browse");
  }

  const uploadFile = async () => {
    if(user.isDemo){
      MySwal.fire({
        icon: "success",
        title: <p>Good Job!</p>,
        willClose: onMySwalEscape,
        html: (
          <div>
            Your paper has been uploaded successfully{" "}
            <a style={{ color: "blue" }} href="#">
              here
            </a>
          </div>
        ),
      }).then((val) => {
        console.log(val);
        if (val.isConfirmed) {
          navigate("/browse");
        }
      });
    }
    if (ether == null) return;

    const res = await ether.deployPaper(hash);

    const papers = await ether.getPapers();

    for (const paper of papers) {
      const ipfsHash = await paper.ipfsHash();

      if (ipfsHash === hash) {
        const paperAddress = paper.address;
        await api?.submitPaper(title, abstract, category, hash, paperAddress);
        break;
      }
    }
    MySwal.fire({
      icon: "success",
      title: <p>Good Job!</p>,
      html: (
        <div>
          Your paper has been uploaded successfully{" "}
          <a style={{ color: "blue" }} href={hash}>
            here
          </a>
        </div>
      ),
    }).then((val) => {
      console.log(val);
      if (val.isConfirmed) {
        navigate("/browse");
      }
    });
  };

  if (reviewFileScreen) {
    return (
      <>
        <Flex
          py={8}
          justifyContent="space-around"
          className={isDarkMode ? "text-gray-300" : ""}
        >
          <PaperView
            file={file.current}
            setPages={(pages) => setPages(pages)}
            heading="Review your paper"
          />
          <Flex justifyContent="flex-start" flexDirection="column" w="40vw">
            <Text fontSize="3xl">{title}</Text>
            <Flex mb="1rem" alignItems="center">
              <Text>Published on: {new Date().toLocaleString()}</Text>
              <Flex mx="1rem" alignItems="center">
                <Box
                  as={IoIosPaper}
                  size="26px"
                  color={isDarkMode ? "gray.300" : "gray.800"}
                  mr="0.5rem"
                />
                <Text>{pages} pages</Text>
              </Flex>
            </Flex>
            <Text color="gray.500">Published in {category} by</Text>
            <Flex alignItems="center">
              <Box>
                <Text>
                  <strong>{user.username}</strong> ({user.email})
                </Text>
                <Text>{user.designation}</Text>
              </Box>
            </Flex>
            <Text fontSize="md" mt={16} mb="0.5rem">
              Abstract
            </Text>
            <Box maxW="30vw" borderTop="2px solid gray">
              <Text mt="0.5rem" fontSize="xs">
                {abstract}
              </Text>
            </Box>

            <Flex flexDirection="row" mt={6}>
              <Button
                mt={4}
                mb={4}
                mr={4}
                bg="#1AAF9E"
                color="#ffffff"
                variant="solid"
                onClick={uploadFile}
              >
                <CheckIcon mr={2} />
                Submit
              </Button>
              <Button
                mt={4}
                mb={4}
                bg="#d3455b"
                color="#ffffff"
                variant="solid"
                onClick={()=>setReviewFileScreen(false)}
              >
                <CloseIcon w={3} h={3} mr={2} />
                Cancel
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </>
    );
  }

  if (abstractScreen) {
    return (
      <>
        <Container maxW="7xl" className={isDarkMode ? "min-h-screen" : ""}>
          <Flex alignItems="flex-start">
            <Flex py="3rem" flexDirection="column" w="50vw">
              <Flex flexDirection="row" alignItems="center">
                <Heading
                  as="h1"
                  size="xl"
                  className={isDarkMode ? "text-gray-300" : ""}
                >
                  Enter the abstract
                </Heading>
              </Flex>
              <Flex mt="2rem">
                <Flex flexDirection="column">
                  <FormControl isRequired onChange={retrieveFile}>
                    <FormLabel className={isDarkMode ? "text-gray-300" : ""}>
                      Abstract
                    </FormLabel>
                    <Textarea
                      w="35rem"
                      h="20rem"
                      d="block"
                      placeholder="Write your abstract here"
                      value={abstract}
                      onChange={(e) => setAbstract(e.target.value)}
                      className={isDarkMode ? "text-gray-300" : ""}
                    />
                    <Button
                      mt={4}
                      bg="#6459F5"
                      color="#ffffff"
                      variant="solid"
                      onClick={reviewFile}
                    >
                      Continue
                    </Button>
                  </FormControl>
                </Flex>
              </Flex>
            </Flex>
            <Flex
              mt="-7rem"
              h="100vh"
              bg="#F6F6FA"
              w="50vw"
              zIndex={-1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box w="25vw" h="25vh">
                <img src={illustration} alt="illustration" />
              </Box>
              <Flex flexDirection="column" mt="12rem">
                <Heading mb="1rem">Steps to follow</Heading>
                <OrderedList spacing={3} fontSize="md">
                  <ListItem>Enter the title of the paper.</ListItem>
                  <ListItem>Upload your paper.</ListItem>
                  <ListItem>Fill the abstract of the paper.</ListItem>
                  <ListItem>
                    Wait for the Kaia scholar process to complete.
                  </ListItem>
                </OrderedList>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </>
    );
  }

  return (
    <>
      <Flex
        alignItems="flex-start"
        className={isDarkMode ? "min-h-screen" : ""}
      >
        <Flex ml="7rem" py="6rem" flexDirection="column" w="50vw">
          <Heading as="h1" size="xl" className={isDarkMode ? "text-white" : ""}>
            Upload your paper
          </Heading>
          <Flex mt="3rem">
            <Flex flexDirection="column">
              <FormControl isRequired onChange={retrieveFile}>
                <FormLabel className={isDarkMode ? "text-gray-300" : ""}>
                  Title
                </FormLabel>
                <Input
                  w="30vw"
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={isDarkMode ? "text-gray-300" : ""}
                />
                <FormLabel
                  mt="1rem"
                  className={isDarkMode ? "text-gray-300" : ""}
                >
                  Category
                </FormLabel>
                {showOptions()}
                <FormLabel
                  mt="1rem"
                  className={isDarkMode ? "text-gray-300" : ""}
                >
                  Attach your paper <LinkIcon />
                </FormLabel>

                <Input
                  border="none"
                  type="file"
                  id="formFile"
                  onChange={retrieveFile}
                  className={isDarkMode ? "text-gray-300" : ""}
                />
                <FormLabel
                  mt="1rem"
                  className={isDarkMode ? "text-gray-300" : ""}
                >
                  Progress
                </FormLabel>
                <Progress
                  colorScheme="green"
                  size="md"
                  value={progress}
                  rounded={"2xl"}
                />
                <Button
                  mt={4}
                  bg="#6459F5"
                  color="#ffffff"
                  variant="solid"
                  onClick={reviewFile}
                >
                  Continue
                </Button>
              </FormControl>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          zIndex={-1}
          mt="-7rem"
          h="104vh"
          bg="#F6F6FA"
          w="50vw"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Box w="25vw" h="25vh">
            <img src={illustration} alt="illustration" />
          </Box>
          <Flex flexDirection="column" mt="12rem">
            <Heading mb="1rem">Steps to follow</Heading>
            <OrderedList spacing={3} fontSize="md">
              <ListItem>Enter the title of the paper.</ListItem>
              <ListItem>Upload your paper.</ListItem>
              <ListItem>Fill the abstract of the paper.</ListItem>
              <ListItem>
                Wait for the Kaia scholar process to complete.
              </ListItem>
            </OrderedList>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
