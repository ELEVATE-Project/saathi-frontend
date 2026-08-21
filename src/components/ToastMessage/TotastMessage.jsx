import React from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import i18n from "i18next";
import "react-toastify/dist/ReactToastify.css";
import "./toastmessage_style.css";

const Notification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
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

export const showNotification = ({
  message = "🦄 Default Message",
  type = "warn",
  options = {},
}) => {
  let finalMessage = message;
  let finalType = type;
  let finalOptions = { ...options };

  if (typeof window !== "undefined" && !navigator.onLine) {
    finalMessage = i18n.t("offlineNetwork") || "You are offline. Please check your internet connection.";
    finalType = "error";
    finalOptions = {
      ...finalOptions,
      autoClose: false,
      closeButton: true,
      style: { fontWeight: "bold", color: "#fff" },
      isOfflineToast: true,
    };
  }

  toast.clearWaitingQueue();
  toast.dismiss();
  return toast[finalType](finalMessage, { ...defaultConfig, ...finalOptions }); 
};

export default Notification;
