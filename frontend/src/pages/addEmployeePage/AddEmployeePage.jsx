
import ListEmployees from "../../components/employee/ListEmployee/ListEmployees";
import { useAuth } from "../../components/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import ButtonBackPage from "../../components/ButtonBackPage/ButtonBackPage";

function AddEmployeePage() {
  const navigate = useNavigate();
  const { JwtToken } = useAuth();
  const decoded = jwtDecode(JwtToken);
  const userProfile = decoded.roles[0].authority;
  if (userProfile !== "ROLE_OPERATOR" && userProfile !== "ROLE_ADMIN") {
    navigate("/home");
    return;
  }
  return (
    <>
    <ButtonBackPage/>
      <ListEmployees/>
    </>
  );
}

export default AddEmployeePage;
