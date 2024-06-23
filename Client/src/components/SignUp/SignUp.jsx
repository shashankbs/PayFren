import { useState } from "react";
import InputBox from "../Common/InputBox";
import axios from "axios";
function SignUp() {
  const [signUpForm, setSignUpForm] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  async function handleSubmit(e) {
    e.preventDefault();
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signUp",
      signUpForm
    );
    console.log(response);
    localStorage.setItem("token", response.data.token);
  }
  function handleInputChange(property, value) {
    const signInObj = { ...signUpForm };
    setSignUpForm({
      ...signInObj,
      [property]: value,
    });
  }
  return (
    <div className="container p-2 mt-3 border text-center">
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl">SignIn</h1>
        <InputBox
          value={signUpForm.firstName}
          type="text"
          placeholder="First name"
          id="firstName"
          onChange={handleInputChange}
        ></InputBox>
        <InputBox
          value={signUpForm.lastName}
          type="text"
          placeholder="Last name"
          id="lastName"
          onChange={handleInputChange}
        ></InputBox>
        <InputBox
          value={signUpForm.userName}
          type="email"
          placeholder="Username"
          id="userName"
          onChange={handleInputChange}
        ></InputBox>
        <InputBox
          value={signUpForm.password}
          type="text"
          placeholder="Password"
          label="Password"
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

export default SignUp;
