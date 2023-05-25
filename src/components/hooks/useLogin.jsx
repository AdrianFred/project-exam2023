import { useState } from "react";

function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch("https://api.noroff.dev/api/v1/holidaze/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data?.errors?.map((error) => error.message) || "Login failed. Please check your credentials and try again.";
        setLoginError(errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, loginError };
}

export default useLogin;
