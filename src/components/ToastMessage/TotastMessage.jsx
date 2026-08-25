import React from "react";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastmessage_style.css";
import { showNotification, showOfflineNotification } from "./showNotification";

const Notification = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      newestOnTop={false}
      closeOnClick
      closeButton={true}
      limit={1}
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

export { showNotification, showOfflineNotification };
export default Notification;
