import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPage.css";
import { useAuth } from "../../components/AuthContext";
import userIcon from "../../assets/icons/userIcon.svg";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const decoded = jwtDecode(JwtToken);
  let formatedRoles = "N/A";

  const handleShowEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });

      const loggedUser = response.data.content.find(
        (user) => user.email === decoded.sub
      );

      setUserData(loggedUser);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao puxar usuário!");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleShowEmployees();
  }, []);

  if (loading) {
    return (
      <div className="user-page-container">
        <p className="user-page-loading-text">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-page-container">
        <p className="user-page-error-text">{error}</p>
      </div>
    );
  }

  if (userData.roles) {
    formatedRoles = userData.roles
      .map((role) => role.authority.replace("ROLE_", ""))
      .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
      .join(", ");
  }

  return (
    <div className="user-page-container">
      <div className="user-page-profile-picture">
        <img src={userIcon} alt="Ícone do usuário" />
      </div>

      <div className="user-page-info">
        <h1 className="user-page-name">{userData.fullName}</h1>
        <div className="user-page-details">
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Data de Nascimento:</strong>{" "}
            {new Date(userData.birthDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Telefone:</strong> {userData.phoneNumber}
          </p>
          <p>
            <strong>CPF:</strong> {userData.cpf}
          </p>
          <p>
            <strong>Endereço:</strong> {userData.address}, {userData.number},{" "}
            {userData.district}, {userData.city} - {userData.state},{" "}
            {userData.country}, CEP: {userData.zipCode}
          </p>
          <p>
            <strong>Criado em:</strong>{" "}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Atualizado em:</strong>{" "}
            {new Date(userData.updatedAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`user-page-status ${
                userData.status === "ativo"
                  ? "user-page-status-active"
                  : "user-page-status-inactive"
              }`}
            >
              {userData.status}
            </span>
          </p>
          <p>
            <strong>Cargo:</strong> {formatedRoles}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
