import { useCallback, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import {
  Text,
  Menu,
  Flex,
  Button,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Heading,
  Container,
} from "@chakra-ui/react";
import logo from "../../assets/logo.png";
import { UserContext } from "../../contexts/user";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../stores/slices/userSlice";
import { RootState } from "../../stores";
import { toggleDarkMode } from "../../stores/slices/darkModeSlice";
import { setLoginRegisterModal, setModalName } from "../../stores/slices/loginRegisterModalSlice";
import { demoUser } from "../../constants/demoUsers";

import { connectToMetamask } from "../../utils/metamaskUtils";
import { disconnectFromMetamask } from "../../utils/metamaskUtils";
import { checkMetamaskConnection } from "../../utils/metamaskUtils";

function NavLink({ text, href }: { text: string; href: string }) {
  return (
    <Link to={href}>
      <Text color="#6459F5" fontWeight="semibold">
        {text}
      </Text>
    </Link>
  );
}

export default function Navbar() {
  const user = useContext(UserContext);
  console.log("RENDER", user);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);
  const isLoginRegisterModalOpen = useSelector(
    (state: RootState) => state.loginRegisterModal.isLoginRegisterModalOpen
  );
  const modalName = useSelector(
    (state: RootState) => state.loginRegisterModal.modalName
  );

  const toggleLoginRegisterModal = useCallback(
    (isOpen: boolean) => {
      dispatch(setModalName("login"));
      dispatch(setLoginRegisterModal(isOpen));
    },
    [dispatch]
  );

  const signOut = async () => {
    localStorage.removeItem("token");
    dispatch(setUser({}));
    // Disconnect MetaMask wallet
    await disconnectFromMetamask();
  };

  const [_isDarkMode, setIsDarkMode] = useState(false);

  const _toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    dispatch(toggleDarkMode());
  };

  const onClickDemoMode = () => {
    dispatch(setUser({...demoUser}));
  };

  const handleMetamaskLogin = async () => {
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
  };

  useEffect(() => {
    const connectMetamask = async () => {
      await checkMetamaskConnection(dispatch);
    };
    connectMetamask();

    return () => {
      checkMetamaskConnection(dispatch);
    };
  }, []);

  return (
    <Container maxW="7xl" zIndex={100}>
      {isLoginRegisterModalOpen && (
        <>
          {modalName === "login" && (
            <SignIn
              isOpen={isLoginRegisterModalOpen}
              setIsOpen={toggleLoginRegisterModal}
            />
          )}
          {modalName === "register" && (
            <SignUp
              isOpen={isLoginRegisterModalOpen}
              setIsOpen={toggleLoginRegisterModal}
            />
          )}
        </>
      )}
      <Flex
        bgColor="transparent"
        flexDirection="row"
        justifyContent="space-between"
        py={5}
        pr={6}
      >
        <Flex alignItems="center">
          <img src={logo} alt="logo" width={40} />
          <Heading fontSize="2xl" fontWeight="bold" ml={2}>
            <Link to="/" className={isDarkMode ? "text-white" : ""}>
              Kaia Scholar
            </Link>
          </Heading>
        </Flex>
        <Flex>
          {/* {!user.username && (
            <Button
              onClick={() => {
                user.signInOrRegister();
              }}
              bg="#6459F5"
              color="#ffffff"
              variant="solid"
            >
              Login with Metamask
            </Button>
          )} */}
          {/* <Button
            onClick={signOut}
            bg="#6459F5"
            color="#ffffff"
            variant="solid"
          >
            Signout
          </Button> */}
          
          {!user.username ? (
            <>
              <div>
                <div className="flex items-center mt-1">
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 border-gray-800"
                        : "bg-gray-300 border-gray-200"
                    } w-14 h-8 rounded-full p-1 duration-300 ease-in-out relative border-2 focus:outline-none focus:ring-2 focus:ring-gray-500`}
                    onClick={_toggleDarkMode}
                  >
                    <div
                      className={`${
                        isDarkMode ? "translate-x-4" : "-translate-x-4"
                      } inline-block w-5 h-5 transform duration-300 ease-in-out bg-white rounded-full shadow-lg`}
                    />
                  </button>
                  <span className={`ml-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                    {isDarkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
              </div>
              <Button
                onClick={handleMetamaskLogin}
                bg="#6459F5"
                color="#ffffff"
                variant="solid"
                className="ml-3"
              >
                Login with Metamask
              </Button>
              <Button
                onClick={onClickDemoMode}
                bg="#6459F5"
                color="#ffffff"
                variant="solid"
                className="ml-3"
              >
                Demo Mode
              </Button>
            </>
          ) : (
            <Flex alignItems="center" gridGap={6}>
              <NavLink text="Home" href="/" />
              <NavLink text="Upload" href="/paper" />
              <NavLink text="Browse" href="/browse" />

              <Menu>
                <MenuButton>
                  <Avatar size="sm"></Avatar>
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    Signed in as &nbsp;
                    <Text fontWeight="bold">{user.username}</Text>
                  </MenuItem>
                  <MenuItem as={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => user.signOut()}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Container>
  );
}
