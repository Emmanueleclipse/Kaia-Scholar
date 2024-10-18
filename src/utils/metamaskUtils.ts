import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { setUser } from "../stores/slices/userSlice";
import { demoUser } from "../constants/demoUsers";
import { useEffect } from "react";

export const connectToMetamask = async () => {
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    try {
      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return { address, signer };
    } catch (error) {
      console.error("Failed to connect to Metamask:", error);
      return null;
    }
  } else {
    console.error("Metamask not detected");
    return null;
  }
};

export const disconnectFromMetamask = async () => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        // Revoke permissions
        await ethereum.request({
          method: "wallet_revokePermissions",
          params: [
            {
              eth_accounts: {},
            },
          ],
        });
        console.log("MetaMask disconnected");
      } catch (error) {
        console.error("Failed to disconnect MetaMask:", error);
      }
    }
}


export const checkMetamaskConnection = async (dispatch: any) => {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          // User is already connected with Metamask
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          dispatch(setUser({...demoUser, username: address, name: "Metamask User"}));
        }
      } catch (error) {
        console.error("Error checking Metamask connection:", error);
      }
    }
};

