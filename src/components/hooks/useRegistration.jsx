import { useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { RegisterUrl } from "../apiUrl/shared";

const useRegistration = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const router = useRouter();

  const register = async (data) => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const response = await fetch(RegisterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage =
          responseData?.errors?.map((error) => error.message) || "Registration failed. Please check your credentials and try again.";
        setRegistrationError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Registration successful
      setIsRegistering(false);
      return responseData;
    } catch (error) {
      setIsRegistering(false);
      setRegistrationError(error.message || "Registration failed.");
    }
  };

  return { register, isRegistering, registrationError };
};

export default useRegistration;
