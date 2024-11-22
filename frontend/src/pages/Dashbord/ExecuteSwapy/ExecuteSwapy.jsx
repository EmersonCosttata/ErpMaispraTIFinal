import { createSwapy } from 'swapy';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../components/AuthContext';
import { debounce } from 'lodash';
import { jwtDecode } from "jwt-decode";
function ExecuteSwapy() {
  const { JwtToken } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState({});
  const container = document.querySelector('#containerSwapy');
  const decoded = jwtDecode(JwtToken);
  const swapy = createSwapy(container);

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
      console.log("Usuário logado:", loggedUser);
      setUserData(loggedUser); // Define o estado de `userData`
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }finally{
      console.log(userData)
    }
  };
  useEffect(() => {
    handleShowEmployees();
  }, []);

  const apiResgisterSwap = async (obj) => {
    if (!userData.id) {
      console.error("Usuário não está definido ainda.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/usuarios/2/cards`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Status da resposta:", response.status);
      console.log("Dados registrados com sucesso:", obj);
    } catch (err) {
      console.error("Erro ao registrar dados do dashboard:", err);
      if (err.response && err.response.data) {
        console.error(`Erro: ${err.response.data.message}`);
      } else {
        console.error("Erro desconhecido");
      }
    }
  };

  useEffect(() => {
    if (userData.id) {
      swapy.enable(true);
    }
  }, [userData]);

  const handleSwap = debounce((event) => {
    let items = [];
    const isValidSlots = () => {
      for (let i in event.data.object) {
        if (items.includes(event.data.object[i]) || !event.data.object[i]) {
          return false;
        } else {
          items.push(event.data.object[i]);
        }
      }
      return true;
    };

    if (isValidSlots()) {
      time(event.data.object);
    }
  }, 200);

  swapy.onSwap(handleSwap);

  let timeOutSwap;

  const time = (obj) => {
    if (timeOutSwap) {
      clearTimeout(timeOutSwap);
    }

    timeOutSwap = setTimeout(() => {
      apiResgisterSwap(obj);
    }, 2000);
  };
}


export default ExecuteSwapy;
