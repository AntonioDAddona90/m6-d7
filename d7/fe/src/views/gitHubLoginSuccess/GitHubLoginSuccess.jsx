import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../../middlewares/ProtectedRoutes";

const GitHubLoginSuccess = () => {
  // const location = useLocation();
  // const urlParams = new URLSearchParams(location.search);
  // const token = urlParams.get("token");
  const { token } = useParams();
  const navigate = useNavigate();

  const saveUserToLocalStorage = (token) => {
    localStorage.setItem("userLoggedIn", JSON.stringify(token));
  };

  const session = useSession();
  // console.log(session);

  useEffect(() => {
    if (token) {
      saveUserToLocalStorage(token);

      navigate(`/success/${token}`);

      setTimeout(() => {
        navigate("/homepage");
      }, 5000);
    } else {
      navigate("*");
    }
  }, [token, navigate]);

  return (
    <div style={{ paddingTop: "8rem" }}>
      <div>Benvenuto {session?.displayName}</div>
      <div>Login effettuato con successo...</div>
    </div>
  );
};

export default GitHubLoginSuccess;