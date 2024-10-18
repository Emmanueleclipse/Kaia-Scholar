import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../stores";
import { setUser } from "../../stores/slices/userSlice";
import { User } from "../../typechain";
import { ApiContext } from "../api";
import { EtherContext } from "../ether";
import { RegisterModal } from "../../components/auth/ScholarRegister/ScholarRegister";
import { setModalName } from "../../stores/slices/loginRegisterModalSlice";
import { disconnectFromMetamask } from "../../utils/metamaskUtils";

export type UserContextProps = {
  signInOrRegister: Function;
  register: Function;
  signIn: Function;
  signOut: Function;
  address: string;
  email: string;
  token: string;
  username: string;
  designation: string;
  scholarUrl: string;
  isDemo: boolean;
  metamaskAddress: string | null;
};

export const UserContext = createContext<UserContextProps>({
  signInOrRegister: () => {},
  register: () => {},
  signIn: () => {},
  signOut: () => {},
  username: "",
  email: "",
  token: "",
  address: "",
  designation: "",
  scholarUrl: "",
  isDemo: false,
  metamaskAddress: null,
});

export const UserContextProvider = ({ children }: { children: any }) => {
  const ether = useContext(EtherContext).ether;
  const api = useContext(ApiContext).api;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const getUser = async (token: string) => {
    if (ether == null || api == null) {
      return;
    }
    api.setToken(token);
    const user = await api?.me();
    if (user?.data) {
      let userContract = (await ether.getMyUser()) as User;
      if (!userContract) {
        console.log("User contract not found, creating");

        await ether.createUser(user.data.scholarUrl);
        userContract = (await ether.getMyUser()) as User;

        if (userContract == null) {
          navigate("/");
          return;
        }
      }

      console.log(await userContract.trust_rating());

      ether.setMyUser(userContract);
      // const trustRatingRes = api.updateTrustRating().then((trustRatingRes) => {
      //     console.log("Update Trust Rating Response", trustRatingRes.data);
      // });
      user.data.token = token;
      dispatch(setUser(user.data));
      navigate("/browse");
    } else {
      navigate("/");
    }
  };
  useEffect(() => {
    if (api) {
      const token = localStorage.getItem("token");
      if (token) {
        getUser(token);
      } else {
        navigate("/");
      }
    }
  }, [api]);



  const [isOpen, setIsOpen] = useState(false);

  const signInOrRegister = async () => {
    // if (ether == null || api == null) return;

    // const address = await ether.connectWallet();
    // if (address == null) return;
    // // Check if address exists already. If it does, then just request to sign message, and then send sign in request.

    // const user = await api.getUser(address);

    // if (user.status == 200) {
    //   return signIn(address);
    // }

    dispatch(setModalName("scholar"));
    dispatch(setIsOpen(true));
    // If it doesn't, then need to register new account
  };

  const register = async (scholarUrl: string) => {
    if (ether == null || api == null) return;
    const signature = await ether.signMessage(
      "Click sign below to authenticate with Kaia Scholar :)"
    );

    if (signature == null) return;

    const address = await ether.connectWallet();
    if (address == null) return;

    const user = await api.register(address, signature, scholarUrl);

    return user.data;
  };

  const signIn = async (address: string) => {
    if (ether == null || api == null) return;

    const signature = await ether.signMessage(
      "Click sign below to authenticate with Kaia Scholar :)"
    );

    if (signature == null) return;

    const res = await api.login(address, signature);
    localStorage.setItem("token", res.data.token);
    getUser(res.data.token);
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    dispatch(setUser({}));
    navigate("/");
    // Disconnect MetaMask wallet
    await disconnectFromMetamask();
  };

  return (
    <UserContext.Provider
      value={{
        signIn,
        signInOrRegister,
        signOut,
        register,
        username: user.username || "",
        address: user.address || "",
        email: user.email || "",
        token: user.token || "",
        designation: user.designation || "",
        scholarUrl: user.scholarUrl || "",
        isDemo: user.isDemo || false,
        metamaskAddress: user.metamaskAddress || null,
      }}
    >
      <RegisterModal />
      {children}
    </UserContext.Provider>
  );
};
