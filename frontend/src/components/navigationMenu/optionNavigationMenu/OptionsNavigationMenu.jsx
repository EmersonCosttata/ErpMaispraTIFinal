import newClientIcon from "../../../assets/icons/newClientIcon.png";
import newSupplierIcon from "../../../assets/icons/newSupplierIcon.png";
import newProductIcon from "../../../assets/icons/newProductIcon.png";
import newBuyIcon from "../../../assets/icons/newBuyIcon.png";
import newSaleIcon from "../../../assets/icons/newSaleIcon.png";
import newUserIcon from "../../../assets/icons/newbiUsericon.png";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../AuthContext";

function OptionsNavigationMenu() {
  const { JwtToken } = useAuth();
  let decoded = jwtDecode(JwtToken);
  const userProfile = decoded.roles[0].authority;
  let options = [
    {
      icon: newClientIcon,
      description: "Clientes",
      url: "/cliente",
    },
    {
      icon: newSupplierIcon,
      description: "Fornecedores",
      url: "/fornecedor",
    },
    {
      icon: newProductIcon,
      description: "Produtos",
      url: "/produtos",
    },
    {
      icon: newBuyIcon,
      description: "Compra de Insumos",
      url: "/comprainsumos",
    },
    {
      icon: newSaleIcon,
      description: "Venda de Produtos",
      url: "/registrodevendas",
    },
  ];

  if (userProfile === "ROLE_OPERATOR" || userProfile === "ROLE_ADMIN") {
    options.push({
      icon: newUserIcon,
      description: "Usuários",
      url: "/funcionario",
    });
  }

  return options;
}

export default OptionsNavigationMenu;
