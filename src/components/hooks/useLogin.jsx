import { useState } from "react";

/**
 * Custom hook for handling login functionality.
 * @returns {Object} An object containing login function, loading state, and error state.
 */

function useLogin() {
  /**
   * Function for logging in with provided email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Object} The response data after a successful login.
   * @throws {Error} If login fails, an error is thrown with the corresponding error message.
   */

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
