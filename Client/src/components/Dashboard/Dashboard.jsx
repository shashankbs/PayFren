import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const getBalance = async () => {
      const res = await axios.get(
        "http://localhost:3000/api/v1/account/balance",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      setBalance(res.data.balance);
    };

    getBalance();
  }, [balance]);
  useEffect(() => {
    const filteredUsers = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res);
      setUsers(res.data.users);
    };
    filteredUsers();
  }, [filter]);

  function handleTransfer(userName, firstName, lastName) {
    const params = new URLSearchParams({ userName, firstName, lastName });
    navigate(`/payment?${params}`);
  }

  return (
    <div className="p-36">
      <p className="text-3xl mb-5">Dashboard</p>
      <p className="text-2xl mb-5">Your balance is : &#8377;{balance}</p>
      <input
        value={filter}
        placeholder="Search for a user"
        id="filter"
        onChange={(e) => setFilter(e.target.value)}
        className="border p-3 rounded w-80 mb-3"
      />
      {users ? (
        users.map((user) => {
          console.log(user);
          return (
            <div
              key={user.userName}
              className="mb-3"
              onClick={() =>
                handleTransfer(user.userName, user.firstName, user.lastName)
              }
            >
              {user.firstName} {user.lastName}
            </div>
          );
        })
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
}

export default Dashboard;
