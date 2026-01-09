import { useRef, useState } from "react";
import Button from "../components/ui/Button";
import InputBox from "../components/ui/InputBox";
import Navbar from "../components/ui/Navbar";
import axios from "axios";
import { NavLink, useNavigate } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

const SignIn = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null); // State to store error message
  const navigate = useNavigate();

  const OnButtonClick = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response: any = await axios.post(
        `${apiUrl}/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error.response) {
        // Backend responded with an error
        setError(error.response.data.message); // Display the error message from the backend
      } else {
        // General error (e.g., network error)
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <div className="py-5 flex-shrink-0">
        <Navbar />
      </div>
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign In</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <InputBox
                  placeholder="Email"
                  reference={emailRef}
                  type="text"
                  required={true}
                  extraClasses="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <InputBox
                  placeholder="Password"
                  reference={passwordRef}
                  type="password"
                  required={true}
                  extraClasses="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-center items-center">
                <Button
                  text="Sign In"
                  size="sm"
                  variant="primary"
                  OnClickFn={OnButtonClick}
                  extraClasses=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <NavLink to="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

