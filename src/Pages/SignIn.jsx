import { useState } from "react";
const apiUrl = import.meta.env.VITE_BASE_URL;
import { Link, useNavigate } from "react-router-dom";
function SignIn() {
  const [formData, setformData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };
console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
       
      setError(data);
      setLoading(false);
      if (data.status == 201) {
      
        Navigate("/");
      }

      console.log(data);
    } catch (err) {
      setLoading(false);
      setError(err.message);
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
