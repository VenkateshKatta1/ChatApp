import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../data/apiPath";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [inputData, setInputData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authUser) {
      navigate("/", { replace: true });
    }
  }, [authUser, navigate]);

  const selectGender = (selectGender) => {
    setInputData((prev) => ({
      ...prev,
      gender: selectGender === inputData.gender ? " " : selectGender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      inputData.password.toLowerCase() !== inputData.confpassword.toLowerCase()
    ) {
      setLoading(false);
      return toast.error("Passwords doesn't match");
    }
    try {
      const register = await axios.post(`${API_URL}/auth/register`, inputData);
      const data = register.data;
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        console.log(data.message);
      }
      toast.success(data?.message);
      localStorage.setItem("chatapp", JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate("/login", { replace: true });
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const handleInput = (e) => {
    setInputData({
      ...inputData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center mix-w-full mx-auto">
      <div className="w-full p-6 rounded-lg shadow-lg bg-red-600 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Register <span className="text-gray-950"> Chatters </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col text-gray-200">
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              Fullname
            </label>
            <input
              id="fullname"
              type="text"
              onChange={handleInput}
              placeholder="Enter Full Name"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              username
            </label>
            <input
              id="username"
              type="text"
              onChange={handleInput}
              placeholder="Enter UserName"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              Email
            </label>
            <input
              id="email"
              type="email"
              onChange={handleInput}
              placeholder="Enter email"
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
              placeholder="Enter password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div>
            <label className="font-bold text-gray-950 text-xl label-text">
              Confirm Password
            </label>
            <input
              id="confpassword"
              type="password"
              onChange={handleInput}
              placeholder="Confirm password"
              required
              className="w-full input input-bordered h-10"
            />
          </div>
          <div id="gender" className="flex gap-2 justify-evenly mt-5">
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">
                Male
              </span>
              <input
                type="checkbox"
                className="checkbox checkbox-info"
                onChange={() => selectGender("male")}
                checked={inputData.gender === "male"}
              />
            </label>
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">
                Female
              </span>
              <input
                type="checkbox"
                className="checkbox checkbox-info"
                onChange={() => selectGender("female")}
                checked={inputData.gender === "female"}
              />
            </label>
          </div>
          <button
            type="submit"
            className="mt-4 self-center w-auto px-2 py-1 bg-gray-950 text-lg text-white rounded-lg hover: scale-105"
          >
            {loading ? "loading..." : "Register"}
          </button>
        </form>
        <div className="pt-2">
          <p className="text-sm font-semibold text-gray-800">
            Don&apos;t have an Account ?{" "}
            <Link to={"/login"}>
              <span className=" font-bold underline cursor-pointer hover: text-green-950">
                Login Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
