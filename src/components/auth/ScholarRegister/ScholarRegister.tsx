import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Alert, AlertIcon, FormControl, FormLabel, Text, Image, Input, FormErrorMessage, Badge, ModalFooter, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateScholarUrl, setModalName, setLoginRegisterModal } from "../../../stores/slices/loginRegisterModalSlice";
import { generateSimilarAddress } from "../../../utils/addressGenerator";
import VerifyScholarGif from "../../../assets/verifyScholar.gif";
import { RootState } from "../../../stores";

export function RegisterModal() {
  const [scholarUrl, setScholarUrl] = useState("");
  const [address, setAddress] = useState(generateSimilarAddress());

  const [isFormValid, setIsFormValid] = useState(false);
  const { isLoginRegisterModalOpen, modalName } = useSelector((state: RootState) => state.loginRegisterModal);
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setScholarUrl(url);

    // Simple validation for Google Scholar URLs
    const validUrlPattern = /^https:\/\/scholar\.google\.[a-z.]+\/citations\?user=/;
    setIsFormValid(validUrlPattern.test(url));
  };

  const dispatch=useDispatch();
  
  const handleOnClose=()=>{
    setScholarUrl("");
    setIsFormValid(false);
    dispatch(setLoginRegisterModal(false));
  }

  const handleOnClickRegister = () => {
    handleOnClose();
    dispatch(updateScholarUrl(scholarUrl));
    dispatch(setModalName("register"));
    dispatch(setLoginRegisterModal(true));
  };

  useEffect(()=>{
    setAddress(generateSimilarAddress());
  },[isLoginRegisterModalOpen])

  return (
    <Modal isOpen={isLoginRegisterModalOpen && modalName==="scholar"} onClose={handleOnClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Register for a new account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="info">
            <AlertIcon />
            To signup on Kaia Scholar, you need a google scholar account, and
            need to verify ownership of that account.
          </Alert>
          <FormControl mt={4} isInvalid={!isFormValid && scholarUrl !== ''}>
            <FormLabel htmlFor="scholarUrl">Google Scholar Profile URL*</FormLabel>
            <Input
              placeholder="https://scholar.google.co.in/citations?user=G30mwMoAAAAJ&hl=en"
              onChange={handleUrlChange}
              id="scholarUrl"
              type="url"
              value={scholarUrl}
            />
            {!isFormValid && scholarUrl && (
              <FormErrorMessage>URL must start with https://scholar.google.[domain]/citations?user=</FormErrorMessage>
            )}
          </FormControl>
          <Text mt={4}>
            Navigate to Google Scholar, and add your Kaia scholar address to
            your affiliation:
            <Badge>{address}</Badge>
          </Text>

          <Image mt={4} src={VerifyScholarGif} />
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleOnClickRegister}
            disabled={!isFormValid}
          >
            Register
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}