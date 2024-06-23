import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PayAmount() {
  const [sendAmount, setSendAmount] = useState("");
  const navigate = useNavigate();
  const query = useQuery();

  async function transferAmount() {
    const res = await axios.post(
      "http://localhost:3000/api/v1/account/transaction",
      {
        amount: sendAmount,
        recipient: query.get("userName"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.status == 200) {
      console.log("Transfer successful");
      navigate(-1);
    }
  }

  return (
    <div className="p-10">
      <p className="text-xl">
        <b>Name:</b> {query.get("firstName")} {query.get("lastName")}
      </p>
      <p className="text-xl">
        <b>Username:</b> {query.get("userName")}
      </p>
      <input
        className="border rounded p-3 mt-5"
        placeholder="Enter the amount to send"
        value={sendAmount}
        onChange={(e) => setSendAmount(e.target.value)}
      />
      <button onClick={transferAmount} className="bg-blue-500 p-3 ml-3 rounded">
        Transfer amount
      </button>
    </div>
  );
}

export default PayAmount;
