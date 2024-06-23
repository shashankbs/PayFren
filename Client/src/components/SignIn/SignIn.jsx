import { useState } from "react";
import InputBox from "../Common/InputBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function SignIn() {
  const [signInForm, setSignInForm] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signIn",
      signInForm
    );
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  }

  function handleInputChange(property, value) {
    const signInObj = { ...signInForm };
    setSignInForm({
      ...signInObj,
      [property]: value,
    });
  }
  return (
    <div className="p-20 mt-3 border text-center mr-60 ml-60">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl">SignIn</h1>
        <InputBox
          value={signInForm.userName}
          type="email"
          placeholder="Username"
          id="userName"
          onChange={handleInputChange}
        ></InputBox>
        <InputBox
          value={signInForm.password}
          type="text"
          placeholder="Password"
          id="password"
          onChange={handleInputChange}
        ></InputBox>
        <button className="bg-blue-500 text-white font-bold px-4 py-2 rounded mt-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default SignIn;
