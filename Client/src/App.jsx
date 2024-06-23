import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import PayAmount from "./components/PayAmount/PayAmount";

const payFrenRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signIn",
    element: <SignIn />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/payment",
    element: <PayAmount />,
  },
]);
function App() {
  return <RouterProvider router={payFrenRouter} />;
}

export default App;
