import { useState } from "react";

function Header() {
  const [tokenPresent, setTokenPresent] = useState(
    !!localStorage.getItem("token")
  );
  function handleClick() {
    localStorage.removeItem("token");
    setTokenPresent(false);
  }

  return (
    <div>
      {tokenPresent && (
        <button className="float-right mr-5 text-1xl p-3" onClick={handleClick}>
          Log out
        </button>
      )}
    </div>
  );
}

export default Header;
