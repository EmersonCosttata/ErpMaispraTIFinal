import CircleChart from "../../components/Charts/CircleChart";
import './Dashbord.css'
import LineChartGraph from "../../components/Charts/LineChartGraph/LineChartGraph";
import BoxChartValue from "../../components/Charts/LineChartGraph/BoxChartValue/BoxChartValue";
import axios from 'axios'
import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";

import React from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import ExecuteSwapy from "./ExecuteSwapy/ExecuteSwapy";





const Dashbord = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [clients, setClients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  function contarStatusAtivos(vetor) {
    if (!vetor) return 0;
    return vetor.filter(v => v.status === 'ativo').length;
  }

  const handleShowClients = async () => {
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
      const response = await axios.get(`http://localhost:8080/api/fornecedores`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setSuppliers(response.data.content);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar fornecedores!");
    }
  };


  useEffect(() => {
    handleShowClients();
    handleShowSuppliers();
  }, []);

  const totalClients = clients.length;
  const totalActiveClients = contarStatusAtivos(clients);
  const totalSuppliers = suppliers.length;
  const totalActiveSuppliers = contarStatusAtivos(suppliers);


  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Após o componente ser montado, definimos que o conteúdo foi renderizado
    setIsRendered(true);
  }, []);


  return (
    <>


      <div className="containerSwapy" id="containerSwapy">

        <div className="slot slot1 big-slot" data-swapy-slot="slot1">
          <div className="itemSwapy item1" data-swapy-item="item1">
            <div className="graphs">
              <LineChartGraph
                labels={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
                  'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                labelData1={'Vendas Registradas'}
                labelData2={'Vendas Canceladas'}
                colorData1='#0E1D25' colorData2='#80728A' />
            </div>

          </div>
        </div>

        <div className="slot slot2 medium-slot" data-swapy-slot="slot2">
          <div className="itemSwapy item2" data-swapy-item="item2">
            <div className="graphs">
              <CircleChart
                title={'Clientes'}
                total={totalClients}
                totalActive={totalActiveClients}
                colorTotal={'#80728A'}
                colorTotalActive={'#0E1D25'}
              />
            </div>
          </div>
        </div>

        <div className="slot slot3 medium-slot" data-swapy-slot="slot3">
          <div className="itemSwapy item3" data-swapy-item="item3">

            <div className="graphs">
              <CircleChart
                title={'Fornecedores'}
                total={totalSuppliers}
                totalActive={totalActiveSuppliers}
                colorTotal={'#B4D3E4'}
                colorTotalActive={'#1B3B4B'}
              />
            </div>


          </div>
        </div>
        <div>

          <div className="slot slot4 small-slot" data-swapy-slot="slot4">
            <div className="itemSwapy item4" data-swapy-item="item4">

              <div className="graphs">
                <BoxChartValue
                  title={'Valor em caixa'}
                  isCredit={true}
                  value={'15610485'}
                /> </div>


            </div>
          </div>

          <div className="slot slot5 small-slot" data-swapy-slot="slot5">
            <div className="itemSwapy item5" data-swapy-item="item5">

              <div className="graphs">
                <BoxChartValue
                  title={'Valor Gasto'}
                  isCredit={false}
                  value={'7610485'}
                />
              </div>


            </div>
          </div>
        </div>

      </div>

      {isRendered && <ExecuteSwapy />}

      {/* <div className="dashContent">
        <Draggable bounds="parent">
          <ResizableBox width={1000} height={500} minConstraints={[100, 100]}>
            <div className="graphs">
              <LineChartGraph
                labels={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
                  'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
                labelData1={'Vendas Registradas'}
                labelData2={'Vendas Canceladas'}
                colorData1='#0E1D25' colorData2='#80728A' />
            </div>
          </ResizableBox>
        </Draggable>
        <Draggable bounds="parent" >
          <ResizableBox width={320} height={100} minConstraints={[100, 100]} >
            <div className="graphs">
              <CircleChart
                title={'Clientes'}
                total={totalClients}
                totalActive={totalActiveClients}
                colorTotal={'#80728A'}
                colorTotalActive={'#0E1D25'}
              />
            </div>
          </ResizableBox>
        </Draggable>


        <Draggable bounds="parent" >
          <ResizableBox width={320} height={100} minConstraints={[100, 100]}>
            <div className="graphs">
              <CircleChart
                title={'Fornecedores'}
                total={totalSuppliers}
                totalActive={totalActiveSuppliers}
                colorTotal={'#B4D3E4'}
                colorTotalActive={'#1B3B4B'}
              />
            </div>
          </ResizableBox>
        </Draggable>

        <Draggable bounds="parent" >
          <ResizableBox width={650} height={120} minConstraints={[100, 100]}>
            <div className="graphs">
              <BoxChartValue
                title={'Valor em caixa'}
                isCredit={true}
                value={'15610485'}
              /> </div>
          </ResizableBox>
        </Draggable>

        <Draggable bounds="parent">
          <ResizableBox width={650} height={120} minConstraints={[100, 100]}>
            <div className="graphs">
              <BoxChartValue
                title={'Valor Gasto'}
                isCredit={false}
                value={'7610485'}
              />
            </div>
          </ResizableBox>
        </Draggable>
      </div> */}
    </>
  );
};

export default Dashbord;
