import { Link } from "react-router-dom";
import Header from "./Common/Header";
function Home() {
  return (
    <>
      <Header />
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-80">
        <span className="text-5xl mr-60 text-orange-50">PayFren</span>
        <Link to="/signUp" className="mr-5 text-2xl text-gray-800">
          SignUp
        </Link>
        <Link to="/signIn" className="text-2xl text-gray-800">
          SignIn
        </Link>
      </div>
    </>
  );
}

export default Home;
