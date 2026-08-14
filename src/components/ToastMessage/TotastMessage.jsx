import React from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastmessage_style.css";

const Notification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      limit={1}
      newestOnTop={false}
      closeOnClick
      closeButton={false}
      hideProgressBar={true}
      rtl={false}
      pauseOnFocusLoss
      draggable
      theme="colored"
      transition={Bounce}
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
    />
  );
};

const defaultConfig = {
  position: "top-center",
  autoClose: 3000,
  closeButton: false,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

const isBadNetworkOrOffline = () => {
  if (typeof window === "undefined") return false;
  if (!navigator.onLine) return true;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection?.effectiveType && (connection.effectiveType === "2g" || connection.effectiveType === "3g")) {
    return true;
  }
  return false;
};

export const showNotification = ({
  message = "🦄 Default Message",
  type = "warn",
  options = {},
}) => {
  if (isBadNetworkOrOffline() && !options?.isOfflineToast) {
    return null;
  }
  toast.dismiss();
  return toast[type](message, { ...defaultConfig, ...options }); 
};

export default Notification;
