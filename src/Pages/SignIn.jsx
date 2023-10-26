import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const apiUrl = import.meta.env.VITE_BASE_URL;
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../Redux/User/userSlice";
import GoogleAuth from "../Components/GoogleAuth";

function SignIn() {
  const [formData, setformData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };
  console.log(formData);

  console.log(error);
  const handleSubmit = async (e) => {
    // prevent default feature
    e.preventDefault();
    try {
      // setLoading(true);
      // dispatch signin start function
      dispatch(signInStart());
      // call the api endpoint
      const res = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);

      // check if status code 201 then its successfully loged in
      if (data.status == 201) {
        dispatch(signInSuccess(data));
        Navigate("/");
      } else {
        dispatch(signInFailure(data));
      }

      // console.log(data);
    } catch (err) {
      dispatch(signInFailure(err));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
        <input
          type="text"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <GoogleAuth />
      </form>
      <div className="flex gap-2 mt-5">
        {" "}
        <p>Don't have an account ?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && (
        <p className={error.status == 201 ? "text-green-700" : "text-red-700"}>
          {error.message}
        </p>
      )}
    </div>
  );
}

export default SignIn;
