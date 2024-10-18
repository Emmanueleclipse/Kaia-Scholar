import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import ModalBox from "../../ReactModal";
import SignUp from "../SignUp";
import { EtherContext } from "../../../contexts/ether";
import axios from "axios";
import { RootState } from "../../../stores";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../../../contexts/user";
import { setUser } from "../../../stores/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { setLoginRegisterModal, setModalName } from "../../../stores/slices/loginRegisterModalSlice";
import { demoLoginUser } from "../../../constants/demoUsers";

interface LoginModalProps {
  isOpen: boolean;
  setIsOpen?: any;
}

const SignInPage: React.FC<LoginModalProps> = ({ isOpen, setIsOpen }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const { isDarkMode } = useSelector((state: RootState) => state.darkMode);


  const handlePasswordChange = (e: any) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const isFormValid = () => {
    return (
      username.trim() !== "" && password.trim() !== ""
    );
  };


  const ether = useContext(EtherContext).ether;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleOpenRegisterModal = () => {
    dispatch(setModalName("scholar"));
  }

  const handleCloseLoginModal = () => {
    dispatch(setLoginRegisterModal(false));
  }

  const handleSubmitDemoLogin = () =>{
    dispatch(setUser(demoLoginUser));
    setIsOpen(false);
    navigate("/browse");
  }


  const handleSubmitlogin = async () => {
    if (ether == null) return;
    const signature = await ether.signMessage(
      "Click sign below to authenticate with Kaia Scholar :)"
    );
    
    if (signature == null) return;
    
    const walletAddress = await ether?.connectWallet();
    if (walletAddress == null) return;
    
    const response = await axios.post(`http://ec2-54-158-0-218.compute-1.amazonaws.com:3001/user/login`, {
      address: walletAddress,
      signature,
    });
    console.log("response", response);
    localStorage.setItem("token", response.data.token);
    setIsOpen(false);
  };

  return (
      <ModalBox isOpen={isOpen} onRequestClose={handleCloseLoginModal}>
        <div
          className={` flex items-center justify-center ${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          } rounded-lg`}
        >
          <div
            className={`${
              isDarkMode ? "bg-black" : "bg-white"
            } p-8 rounded shadow-md w-full`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDarkMode && "text-white"
              }`}
            >
              Login
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
                className="mt-1 p-2 w-full border rounded-md h-12 text-base font-extralight "
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${
                  isDarkMode ? "text-gray-200" : "text-gray-600"
                } `}
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
            </div>
            <button
              className={`bg-blue-500 text-white p-2 rounded-md w-full ${
                isFormValid() ? "" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFormValid()}
              onClick={handleSubmitDemoLogin}
            >
              Login
            </button>
            <button
              className="text-black p-2 rounded-md w-full mt-3 bg-gray-300"
              onClick={handleOpenRegisterModal}
            >
              Sign Up
            </button>
          </div>
        </div>
      </ModalBox>
  );
};

export default SignInPage;
