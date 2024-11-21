import { useState } from "react";
import "./Login.css";
import ErpLogo from "../../../assets/icons/artboard.svg";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";
import { useAuth } from "../../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [LoginEmail, setLoginEmail] = useState("");
  const [LoginPassword, setLoginPassword] = useState("");
  const [Error, setError] = useState();
  const [Error2, setError2] = useState();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isInvalid = (e) => {
    e.target.className = "isInvalid inputText";
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className !== "inputText") {
      e.target.className = "inputText";
    }
  };

  const handleReset = () => {
    let form = document.getElementById("formNewClient");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
  };

  const handleCheckEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    setLoginEmail(email);
    if (emailRegex.test(email)) {
      setError(null);
    } else {
      setError("Formato de Email Inválido!");
    }
  };
  const handleCheckPass = (pass) => {
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    setLoginPassword(pass);
    if (passRegex.test(pass)) {
      setError(null);
    } else {
      setError(
        "A senha deve ter 1 Letra Maiúscula, 1 Minúscula, 1 Número e no mínimo 8 caracteres!"
      );
    }
  };

  const handleSubmit = async (event) => {
    console.log(`${apiUrl}/auth/login`)
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: LoginEmail,
        password: LoginPassword,
      });
      login(response.data);
      setError(null);
      setError2("Login Efetuado!");
      setIsLoading(false);
      navigate("/home");
    } catch (err) {
      setError(err.response.data.message + ".");
      setLoginPassword("");
      setIsLoading(false);
    }
  };

  return (
    <div className="contentLogin">
      <div className="ErPlogo">
        <img src={ErpLogo} alt="LogoErp"></img>
      </div>

      <div className="LoginBox">
        <h4>Faça seu login</h4>
        <form
          className="formLogin"
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <label
            htmlFor="LoginEmail"
            className="inputLabel"
            id="labelNewLoginEmail"
          >
            <span className="inputDescription">E-mail:</span>
            <input
              type="email"
              placeholder="Digite seu Email"
              className="inputText"
              name="email"
              value={LoginEmail}
              required
              onInvalid={(e) => isInvalid(e)}
              onChange={(e) => {
                isValid(e);
                handleCheckEmail(e.target.value);
              }}
            />
          </label>

          <label
            htmlFor="LoginPassword"
            className="inputLabel"
            id="labelLoginPassword"
          >
            <span className="inputDescription">Senha:</span>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="inputText"
              name="password"
              value={LoginPassword}
              required
              onInvalid={(e) => isInvalid(e)}
              onChange={(e) => {
                isValid(e);
                handleCheckPass(e.target.value);
              }}
            />
          </label>

          <div className="divButtons">
            <button
              type="submit"
              className="primaryNormal loginButton"
              onClick={handleSubmit}
            >
              Login
            </button>
          </div>
        </form>
        <p className="error">{Error && Error}</p>
        <p className="sucess">{Error2 && Error2}</p>
        <p className="pForgotPass">
          <a href="/resetpassword" className="forgotPass">
            Esqueceu sua senha?
          </a>
        </p>
        {isLoading && <LoadingSpin />}
      </div>
    </div>
  );
};

export default Login;
