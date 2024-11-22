import { useNavigate, useLocation } from "react-router-dom";
import "./navigationMenu.css";
import arrayOptions from "./optionNavigationMenu/OptionsNavigationMenu";

function NavigationMenu() {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <div
      className={`navigationMenu ${
        arrayOptions().length === 6 ? "navigationMenuAdmin" : ""
      }`}
    >
      {arrayOptions().map((option, index) => (
        <div
          key={index}
          className={`option option${index} ${
            location.pathname === option.url ? "selected" : ""
          }`}
          onClick={() => navigate(option.url)}
        >
          <div className="optionResposive">
            <img
              src={option.icon}
              alt={option.description}
              className="optionIcon"
            />
            <label className="optionDescription">{option.description}</label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NavigationMenu;
