import { createSwapy } from 'swapy'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../components/AuthContext';

import { debounce } from 'lodash';
import { jwtDecode } from "jwt-decode";



function ExecuteSwapy() {
  const { JwtToken } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState([]);
  const [SwapData, setSwapData] = useState([])
  const container = document.querySelector('#containerSwapy')
  const decoded = jwtDecode(JwtToken);
  const swapy = createSwapy(container)

  const apiGetSwap = async () => {
    try {
      const response = await axios.get(
        `${apiUrl} / api / usuarios / ${userData.id} / cards`,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSwapData(response.content)
      console.log('Dados do dashboard Baixados:');
    } catch (err) {
      console.error('Erro ao baixar dados do dashboard:');
      if (err.response && err.response.data) {
        console.error(`Erro: ${err.response.data.message}`);
      } else {
        console.error('Erro desconhecido');
      }
    }

  }

  const apiResgisterSwap = async (userId, obj) => {
    try {

      const response = await axios.post(
        `${apiUrl} / api / usuarios / ${userId} / cards`,
        obj,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.status)
      console.log('Dados do dashboard registrados:', obj);
    } catch (err) {

      console.error('Erro ao registrar dados do dashboard:', err);

      if (err.response && err.response.data) {
        console.error(`Erro: ${err.response.data.message}`);
      } else {
        console.error('Erro desconhecido');
      }
    }

  }

  const handleShowEmployees = async () => {
    try {
      const response = await axios.get(`${ apiUrl } / api / usuarios`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      const loggedUser = response.data.content.find(
        (user) => user.email === decoded.sub
      );
      console.log(loggedUser)
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
    // apiGetSwap()
  }, []);


  swapy.enable(true)

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

  let timeOutSwap

  let time = (obj) => {
    if (timeOutSwap) {
      clearTimeout(timeOutSwap)
    }

    timeOutSwap = setTimeout(() => {
      apiResgisterSwap(userData.id, obj)
    }, 2000)
  }


}
export default ExecuteSwapy