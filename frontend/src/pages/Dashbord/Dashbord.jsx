import CircleChart from "../../components/Charts/CircleChart";
import "./Dashbord.css";
import LineChartGraph from "../../components/Charts/LineChartGraph/LineChartGraph";
import BoxChartValue from "../../components/Charts/LineChartGraph/BoxChartValue/BoxChartValue";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";

import React from "react";
import "react-resizable/css/styles.css";
import ExecuteSwapy from "./ExecuteSwapy/ExecuteSwapy";
import LoadingSpin from "../../components/LoadingSpin/LoadingSpin";
import ComponentItemSwapy from "./ComponentItemSwapy/ComponentItemSwapy";

const Dashbord = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isMobile, setIsMobile] = useState(false);
  function contarStatusAtivos(vetor) {
    if (!vetor) return 0;
    return vetor.filter((v) => v.status === "ativo").length;
  }

  const handleShowClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/clientes`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setClients(response.data.content);
    } catch (err) {
      console.log(err);
      alert("Erro ao chamar clientes!");
    }
  };

  const handleShowSuppliers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/fornecedores`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setSuppliers(response.data.content);
      setIsLoading(!true);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar fornecedores!");
    }
  };

  const totalClients = clients.length;
  const totalActiveClients = contarStatusAtivos(clients);
  const totalSuppliers = suppliers.length;
  const totalActiveSuppliers = contarStatusAtivos(suppliers);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([handleShowClients(), handleShowSuppliers()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setIsRendered(true);
    if (isRendered) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 858);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerWidth]);


  const apiGetSwap = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/usuarios/${userData.id}/cards`,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSwapData(response)
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

  
  

  


  let dashboardLayout = { slot1: "item1", slot2: "item2", slot3: "item3", slot4: "item4", slot5: "item5" }




  return (
    <>
      {isLoading && <LoadingSpin />}
      <div
        className={isMobile ? "containerSwapyNone" : "containerSwapy"}
        id="containerSwapy"
      >
        <div className="slot slot1 big-slot" data-swapy-slot="slot1">
          <ComponentItemSwapy item={dashboardLayout.slot1}
            LineChartGraph={LineChartGraph}
            CircleChart={CircleChart}
            BoxChartValue={BoxChartValue}
            totalClients={totalClients}
            totalActiveClients={totalActiveClients}
            totalSuppliers={totalSuppliers}
            totalActiveSuppliers={totalActiveSuppliers} />
        </div>

        <div className="slot slot2 medium-slot" data-swapy-slot="slot2">
          <ComponentItemSwapy item={dashboardLayout.slot2}
            LineChartGraph={LineChartGraph}
            CircleChart={CircleChart}
            BoxChartValue={BoxChartValue}
            totalClients={totalClients}
            totalActiveClients={totalActiveClients}
            totalSuppliers={totalSuppliers}
            totalActiveSuppliers={totalActiveSuppliers} />
        </div>

        <div className="slot slot3 medium-slot" data-swapy-slot="slot3">
          <ComponentItemSwapy item={dashboardLayout.slot3}
            LineChartGraph={LineChartGraph}
            CircleChart={CircleChart}
            BoxChartValue={BoxChartValue}
            totalClients={totalClients}
            totalActiveClients={totalActiveClients}
            totalSuppliers={totalSuppliers}
            totalActiveSuppliers={totalActiveSuppliers} />
        </div>
        <div className="small-slots">
          <div className="slot slot4 small-slot" data-swapy-slot="slot4">
            <ComponentItemSwapy item={dashboardLayout.slot4}
              LineChartGraph={LineChartGraph}
              CircleChart={CircleChart}
              BoxChartValue={BoxChartValue}
              totalClients={totalClients}
              totalActiveClients={totalActiveClients}
              totalSuppliers={totalSuppliers}
              totalActiveSuppliers={totalActiveSuppliers} />
          </div>

          <div className="slot slot5 small-slot" data-swapy-slot="slot5">
            <ComponentItemSwapy item={dashboardLayout.slot5}
              LineChartGraph={LineChartGraph}
              CircleChart={CircleChart}
              BoxChartValue={BoxChartValue}
              totalClients={totalClients}
              totalActiveClients={totalActiveClients}
              totalSuppliers={totalSuppliers}
              totalActiveSuppliers={totalActiveSuppliers} />
          </div>
        </div>
      </div>
      {isRendered && <ExecuteSwapy />}
      <div className={isMobile ? "conterinerMobile" : "conterinerMobileNone"}>
        <div className="graphsMobile">
          <LineChartGraph
            labels={[
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ]}
            labelData1={"Vendas Registradas"}
            labelData2={"Vendas Canceladas"}
            colorData1="#0E1D25"
            colorData2="#80728A"
          />
        </div>

        <div className="graphsMobile">
          <CircleChart
            title={"Clientes"}
            total={totalClients}
            totalActive={totalActiveClients}
            colorTotal={"#80728A"}
            colorTotalActive={"#0E1D25"}
          />
          <CircleChart
            title={"Fornecedores"}
            total={totalSuppliers}
            totalActive={totalActiveSuppliers}
            colorTotal={"#B4D3E4"}
            colorTotalActive={"#1B3B4B"}
          />
        </div>
        <div className="graphsMobile">
          <BoxChartValue
            title={"Valor em caixa"}
            isCredit={true}
            value={"15610485"}
          />

          <BoxChartValue
            title={"Valor Gasto"}
            isCredit={false}
            value={"10610485"}
          />
        </div>
      </div>
      <br />
    </>
  );
};

export default Dashbord;
