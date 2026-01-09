import InputBox from "../components/ui/InputBox";
import Button from "../components/ui/Button";
import Navbar from "../components/ui/Navbar";
import { useRef, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const OnButtonClick = async () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    setMessage(null);
    setErrors([]);
    setLoading(true);

    try {
      const response = await axios.post<{ message: string }>(
        `${apiUrl}/signup`,
        {
          username,
          email,
          password,
        }
      );

      setMessage(response.data.message); // Success message
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        // Validation errors
        const validationErrors = error.response.data.errors.map(
          (err: any) => err.message
        );
        setErrors(validationErrors);
      } else if (error.response && error.response.status === 403) {
        // Account already exists
        setMessage(error.response.data.message);
      } else {
        // General error
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <div className="py-5 flex-shrink-0">
        <Navbar />
      </div>

      <div className="flex-grow flex justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden max-h-[calc(100vh-10rem)]">
          <div className="p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-primary">
              Sign Up
            </h2>

            {/* Show Loading Spinner */}
            {loading && (
              <p className="text-blue-500 text-center mb-4">Loading...</p>
            )}

            {/* Show Success or Error Message */}
            {message && (
              <p className="text-center text-green-500 mb-4 p-2 bg-green-100 rounded">
                {message}
              </p>
            )}

            {/* Show Validation Errors */}
            {errors.length > 0 && (
              <div className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <InputBox
                reference={usernameRef}
                placeholder="username"
                type="text"
                required={true}
                extraClasses="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <InputBox
                reference={emailRef}
                placeholder="email"
                type="email"
                required={true}
                extraClasses="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <InputBox
                reference={passwordRef}
                placeholder="password"
                type="password"
                required={true}
                extraClasses="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex items-center justify-center">
                <Button
                  text="Sign Up"
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
              Already have an account?
              <NavLink
                to="/signin"
                className="font-medium text-primary hover:underline">
                 Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

