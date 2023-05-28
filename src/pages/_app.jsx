import "@/styles/globals.css";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={nunito.className}>
      <Toaster />
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </main>
  );
}
