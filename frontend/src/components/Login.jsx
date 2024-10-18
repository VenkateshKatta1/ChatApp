import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../data/apiPath";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Login = () => {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      navigate("/", { replace: true });
    }
  }, [authUser, navigate]);

  const handleInput = (e) => {
    setUserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(`${API_URL}/auth/login`, userInput, {
        withCredentials: true,
      });
      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }

      toast.success(data.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/", { replace: true });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-red-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Login <span className="text-gray-950"> Chatters </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-gray-200">
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter your email"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              Password
            </label>
            <input
              id="password"
              type="password"
              onChange={handleInput}
              placeholder="Enter your password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <button
            type="submit"
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg text-white rounded-lg hover: scale-105"
          >
            {loading ? "loading..." : "Login"}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don&apos;t have an Account ?{" "}
            <Link to={"/register"}>
              <span className=" font-bold underline cursor-pointer hover: text-green-950">
                Register Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
