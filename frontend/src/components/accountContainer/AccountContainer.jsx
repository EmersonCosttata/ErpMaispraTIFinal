import userIcon from "../../assets/icons/userIcon.svg";
import "./accountContainer.css";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../AuthContext";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineMail } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RxExit } from "react-icons/rx";

function AccountContainer({ isLoggedIn }) {
  const { JwtToken } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const openMenuRef = useRef(null);

  const decoded = jwtDecode(JwtToken);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      openMenuRef.current &&
      !openMenuRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <div className="account-container">
          <div className="account" onClick={toggleMenu} ref={openMenuRef}>
            <img src={userIcon} alt="" className="userIcon" />
            <label>
              Olá,
              <br />
              {decoded.fullName}
            </label>
          </div>
          {isMenuOpen && (
            <div className="account-menu" ref={menuRef}>
              <div className="menu-item" onClick={() => navigate("/perfil")}>
                <RxAvatar className="menu-icon" />
                Perfil
              </div>
              <div
                className="menu-item"
                onClick={() => navigate("/notificacao")}
              >
                <AiOutlineMail className="menu-icon" />
                Notificações
              </div>
              <div className="menu-item">
                <IoIosHelpCircleOutline className="menu-icon" />
                Suporte
              </div>
              <div
                className="menu-item"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <RxExit className="menu-icon" />
                Sair
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <img src={userIcon} alt="" />
          <p>Faça login</p>
        </div>
      )}
    </>
  );
}

export default AccountContainer;
