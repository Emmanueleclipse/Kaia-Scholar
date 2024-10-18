import React, { useContext, useEffect, useState } from "react";

import ReCAPTCHA from "react-google-recaptcha";
import ModalBox from "../../ReactModal";
import axios from "axios";
import { EtherContext } from "../../../contexts/ether";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../stores";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../../stores/slices/userSlice";
import { setLoginRegisterModal, setModalName, updateScholarUrl } from "../../../stores/slices/loginRegisterModalSlice";
import { demoRegisterUser } from "../../../constants/demoUsers";

interface SignUpProps {
  isOpen: boolean;
  setIsOpen?: any;
}

interface User {
  address: string;
  username: string;
  email: string;
  designation: string;
  scholarUrl: string;
  signature: string;
  // Add other properties if necessary
}

const SignUp: React.FC<SignUpProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [value, setValue] = useState("[empty]");
  const { registerScholarUrl } = useSelector((state: RootState) => state.loginRegisterModal);
  const[scholarUrl, setScholarUrl]=useState(registerScholarUrl);
  const [isMnemonicPharseModal, setIsMnemonicPharseModal] =
    useState<boolean>(false);

  const [address, setAddress] = useState("");

  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);

  const handlePasswordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const checkPasswordStrength = (password: any) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber) {
      return 4; // Strong
    } else if (password.length >= 8 && (hasUpperCase || hasLowerCase)) {
      return 3; // Good
    } else if (password.length >= 4) {
      return 2; // Okay
    } else {
      return 1; // Weak
    }
  };

  const isFormValid = () => {
    return (
      username.trim() !== "" &&
      value.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  };



  const TEST_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  const ether = useContext(EtherContext).ether;

  const dispatch = useDispatch();

  const handleOpenLoginModal = () => {
    dispatch(updateScholarUrl(""));
    dispatch(setModalName("login"));
  }

  const handleCloseRegisterModal = () => {
    dispatch(updateScholarUrl(""));
    dispatch(setLoginRegisterModal(false));
  }

  const navigate = useNavigate();
  const handleSubmitDemoSignUp = () =>{
    dispatch(setUser(demoRegisterUser));
      
    setIsOpen(false);
    setValue("");
    navigate("/browse");
  }

  const handleSubmit = async () => {
    try {
      const signature = await ether?.signMessage(
        "Click sign below to authenticate with Kaia Scholar :)"
      );

      if (signature == null) return;

      // const walletAddress = await ether?.connectWallet();
      // if (walletAddress == null) return;

      const response = await axios.post(`http://ec2-54-158-0-218.compute-1.amazonaws.com:3001/user/register`, {
        // address: walletAddress,
        address: address,
        name: username,
        email: email,
        designation: "",
        scholarUrl: registerScholarUrl,
        signature: signature,
      });
      console.log("Registration successful:", response.data);
    } catch (error: any) {
      console.error("Registration failed:", error?.response.data);
    }
  };


  const handleChange = (newValue: any) => {
    console.log("Captcha value:", newValue);
    setValue(newValue);

    if (newValue === null) setValue("");
  };

  return (
    <ModalBox isOpen={isOpen} onRequestClose={handleCloseRegisterModal}>
      <div
        className={` flex items-center justify-center  ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } rounded-lg min-w-96 ${isMnemonicPharseModal ? "hidden" : ""}`}
      >
        <div
          className={` p-8 rounded shadow-md w-full max-w-md ${
            isDarkMode ? "bg-black" : "bg-white"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${isDarkMode && "text-white"}`}
          >
            Create Account
          </h2>

          <div className="mb-4">
            <label
              htmlFor="username"
              className={`block text-sm font-medium  ${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
              placeholder="Username"
            />
          </div>
          {/*
          <div className="mb-4">
          <label
          htmlFor="scholar"
          className={`block text-sm font-medium ${
            isDarkMode ? "text-gray-200" : "text-gray-600"
            }`}
            >
            Scholar Url
            </label>
            <input
            type="text"
            id="scholar"
            name="scholar"
            value={scholarUrl}
            onChange={(e) => setScholarUrl(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
            placeholder="Scholar Url"
            readOnly={registerScholarUrl!==""}
            />
            </div>
            */}
            <div className="mb-4">
            <label
            htmlFor="email"
            className={`block text-sm font-medium ${
              isDarkMode ? "text-gray-200" : "text-gray-600"
              } `}
              >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
              placeholder="email"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
              placeholder="Password"
            />
            <div className="mt-5 flex">
              {[1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className={`h-1 w-1/4 mx-1 ${
                    passwordStrength >= line ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className={`block text-sm font-medium ${
                isDarkMode ? "text-gray-200" : "text-gray-600"
              }`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight"
              placeholder="Confirm Password"
            />
          </div>
          {/* {load && ( */}
            <div className="flex items-center justify-center mx-auto my-7">
              <ReCAPTCHA
                style={{
                  display: "inline-block",
                  width: "100%",
                  margin: "auto",
                }}
                theme={isDarkMode ? "dark" : "light"}
                sitekey={TEST_SITE_KEY}
                onChange={handleChange}
                className="w-full  mx-auto"
              />
            </div>
          {/*  )} */}
          <button
            className={`bg-blue-500 text-white p-2 rounded-md w-full 
            ${isFormValid() ? "" : "opacity-50 cursor-not-allowed"}
            `}
            // ${isFormValid() ? "" : "opacity-50 cursor-not-allowed"}
            disabled={!isFormValid()}
            onClick={handleSubmitDemoSignUp}
          >
            Sign Up
          </button>
          <button
            className="text-black p-2 rounded-md w-full mt-3 bg-gray-300"
            onClick={handleOpenLoginModal}
          >
            Login
          </button>
        </div>
      </div>
    </ModalBox>
  );
};

export default SignUp;
