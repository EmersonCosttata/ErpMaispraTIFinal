import { useState } from "react";
import "./ResetPassbyToken.css";
import ErpLogo from "../../assets/icons/artboard.svg";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import LoadingSpin from "../LoadingSpin/LoadingSpin";
import axios from "axios";

const ResetPassbyToken = ({ token }) => { 
  const apiUrl = import.meta.env.VITE_API_URL;
  const [ResetPassword, setResetPassword] = useState("");
  const [ConfirmResetPassword, setConfirmResetPassword] = useState("");
  const [CpfConfirm, setCpfConfirm] = useState("");
  const [CpfPass, setCpfPass] = useState(false);

  const [Error, setError] = useState("");
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckPassword = (pass) => {
    const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passRegex.test(pass)) {
      setError(
        "A senha deve ter 1 letra maiúscula, 1 minúscula, 1 número e no mínimo 8 caracteres!"
      );
    } else {
      setError("");
    }
  };

  const handleCheckCPF = (cpf) => {
    const cpfRegex =
      /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
    if (!cpfRegex.test(cpf)) {
      setError("CPF Invalidos");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (ResetPassword !== ConfirmResetPassword) {
      setError("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/auth/reset-password?token=${token}`,
        { newPassword: ResetPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Senha alterada com sucesso!");

      setError("");
      setTimeout(() => {
        setIsLoading(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCpfConfirm = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!handleCheckCPF(CpfConfirm)) {
      setError("CPF Inválido");
      setIsLoading(false);
      return;
    }

    try {
      let response = await axios.post(
        `${apiUrl}/auth/validation-user?token=${token}`,
        { cpf: CpfConfirm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCpfPass(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contentReset">
      <div className="ErPlogo">
        <img src={ErpLogo} alt="LogoErp" />
      </div>
      {CpfPass && (
        <div className="ResetBox">
          <h4>Recuperar Senha</h4>
          <form className="formReset" onSubmit={handleSubmit}>
            <label
              htmlFor="ResetPassword"
              className="inputLabel"
              id="labelNewResetPassword"
            >
              <span className="inputDescription">Nova senha:</span>
              <div className="inputTextPassword">
                <RiLockPasswordLine className="icon" />
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  className="inputText"
                  name="password"
                  value={ResetPassword}
                  required
                  onChange={(e) => {
                    setResetPassword(e.target.value);
                    handleCheckPassword(e.target.value);
                  }}
                />
              </div>
            </label>

            <label
              htmlFor="ResetConfirmPass"
              className="inputLabel"
              id="labelNewResetEmail"
            >
              <span className="inputDescription">Confirme a nova senha:</span>
              <div className="inputTextPassword">
                <RiLockPasswordLine className="icon" />
                <input
                  type="password"
                  placeholder="Confirme a nova senha"
                  className="inputText"
                  name="confirmpassword"
                  value={ConfirmResetPassword}
                  required
                  onChange={(e) => {
                    setConfirmResetPassword(e.target.value);
                    handleCheckPassword(e.target.value);
                  }}
                />
              </div>
            </label>

            <div className="divButtons">
              <button type="submit" className="primaryNormal loginButton">
                Mudar Senha
              </button>
            </div>
          </form>

          {Error && <p className="error">{Error}</p>}
          {SuccessMessage && <p className="success">{SuccessMessage}</p>}

          {isLoading && <LoadingSpin />}
        </div>
      )}

      {!CpfPass && (
        <div
          className="ResetBox"
          id="CPF CHECK - compomente de checar cpf email"
        >
          <h4>Recuperar Senha</h4>
          <form className="formReset" onSubmit={handleCpfConfirm}>
            <label
              htmlFor="ResetCPF"
              className="inputLabel"
              id="labelNewResetPassword"
            >
              <span className="inputDescription">
                Informe o CPF da conta cadastrada:
              </span>
              <input
                type="text"
                placeholder="Digite o cpf para confirmar seu usuario!"
                className="inputText"
                name="password"
                value={CpfConfirm}
                required
                onChange={(e) => {
                  setCpfConfirm(e.target.value);
                  handleCheckCPF(e.target.value);
                }}
              />
            </label>

            <div className="divButtons">
              <button
                type="submit"
                className="primaryNormal loginButton"
                onClick={() => handleCpfConfirm}
              >
                Continuar
              </button>
            </div>
          </form>

          {Error && <p className="error">{Error}</p>}
          {SuccessMessage && <p className="success">{SuccessMessage}</p>}
          {isLoading && <LoadingSpin />}
        </div>
      )}
    </div>
  );
};

export default ResetPassbyToken;
