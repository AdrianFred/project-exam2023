import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useLogin from "@/components/hooks/useLogin";

import toast, { Toaster } from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, loginError } = useLogin();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(email, password);
    console.log(data);
    if (data) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("name", data.name);
      toast.success("Login successful!, redirecting...");

      // Update website so it shows that the user is logged in in the navbar
      setTimeout(() => {
        router.refresh();
      }, 1500);

      setTimeout(() => {
        router.push("/");
      }, 1000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto bg-white p-6 rounded shadow min-w-[450px]">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Login</h2>
      {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoggingIn}
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded font-semibold hover:bg-indigo-600 transition duration-300"
      >
        {isLoggingIn ? "Logging in..." : "Login"}
      </button>
      <div className="text-gray-900 mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-indigo-500 hover:text-indigo-600">
          Register here
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
