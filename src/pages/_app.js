import "@/styles/globals.css";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
