import { Inter } from "next/font/google";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1>Next.js + Tailwind CSS</h1>
      <button onClick={router.reload}>Test</button>
    </div>
  );
}
