import { useEffect, useState } from "react";
import "./ModalDelivery.css";
import { Link } from "react-router-dom";
import LoadingSpin from "../../LoadingSpin/LoadingSpin";
import axios from "axios";
import { useAuth } from "../../AuthContext";

function ModalDelivery({ show, onClose, content  }) {  
  const [ModalContent, setModalContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [Error, setError] = useState()
  const [Success, setSuccess] = useState()
  const { JwtToken } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(()=>{
    setModalContent(content)
  },[content])
  if (!show) return null;

  console.log(content);

  const classes = ["first", "second", "third"];

  function formatDate(date) {
    if (date) {
      if (date.includes("T") || date.includes(":")) {
        if (date.includes("T")) {
          const [datePart, timePart] = date.split("T");
          const [year, month, day] = datePart.split("-");
          const [hour, minute] = timePart.split(":");
          return `${day.padStart(2, "0")}/${month.padStart(
            2,
            "0"
          )}/${year} ${hour}:${minute}`;
        }
      }
      return date.split("-").reverse().join("/");
    }
    return "00/00/0000";
  }

  const formatarReal = (valor) => {
    const formatado = (valor / 1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatado;
}

const DeleteProduct = (idToDelete) => {
  setModalContent((prevContent) => ({
    ...prevContent,
    saleItems: prevContent.saleItems.filter((item) => item.id !== idToDelete),
  }));
};

const handleCreateDelivery = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const response = await axios.post(
      `${apiUrl}/api/entregas`,
      {
        saleId: ModalContent.id,
        dateDelivery: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Retorno:", response.data);
    const saleId = response.data.id;

    console.log('Modal',ModalContent.saleItems.id)
    const saleRequests = ModalContent.saleItems.map((sale) =>
      axios.post(
        `${apiUrl}/api/entregas/${saleId}/itens`,
        {
          saleItemId: sale.product.id,
          quantityDelivery: sale.quantitySold,
        },
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      )
    );
    await Promise.all(saleRequests);
    setSuccess("Entrega registrada com sucesso!");
    
  } catch (err) {
    console.error("Erro na entrega:", err);
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Erro ao registrar entrega de itens de venda";
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};



  const saleDate = formatDate(ModalContent.saleDate);
  const saleDeliveryDate = formatDate(ModalContent.saleDeliveryDate);
  return (

    <div className="modalDetailsOverlaySale">  
   {isLoading && <LoadingSpin></LoadingSpin>}
      <div className="modalDetailsContentSale">
        <div className="modalDetailsHeader">
          <h2>Informar entrega do pedido Nº {ModalContent && ModalContent.id}</h2>
        </div>
        <div className="modalDetailsBodySale">
          <h2>Produtos</h2>
          <br/>
          <p>Selecione quais items foram entregues</p>
          <br/>
          {Error && <p className="error">{Error}</p>}
          {Success && <p className="">{Success}</p>}
          <div className="rowSale">
            {ModalContent?.saleItems?.map((item, index) => (
              <div
                key={item.id || index}
                className={`${classes[index % 3]} columnSale`}
              ><div className="cardModalSale">
                <Link className="cardModalSaleA" onClick={()=>DeleteProduct(item.id)}>X</Link>
                  <div className="label">Produto:</div>
                  <div className="value">{item.product.name}</div>
                  <div className="label">Preço:</div>
                  <div className="value">{`R$ ${formatarReal(item.salePrice)}`}</div>
                  <div className="label">Quantidade:</div>
                  <div className="value">{item.quantitySold}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rowSale">

            <div className="first columnSale">
              <div className="label">Cliente:</div>
              <div className="value">{ModalContent && ModalContent.client.fullName}</div>
            </div>

            <div className="second columnSale">
              <div className="label">Data de entrega:</div>
              <div className="value">{ModalContent && saleDate}</div>
            </div>

            <div className="first columnSale">
              <div className="label">Data de Prevista:</div>
              <div className="value">{ModalContent && saleDeliveryDate}</div>
            </div>

              <div className="second columnSale">
                    <div className="label">Valor Total:</div>
                    <div className="value">
                      {ModalContent && `R$ ${formatarReal(ModalContent.totalSaleValue)}`}
                      </div>
              </div>
          </div>
            <div className="third columnSale">
                <button className='modalDetailsButtonConfirm' onClick={(event)=>handleCreateDelivery(event)}>
                Confirmar Entrega
              </button>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalDetailsCloseButtonSale" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDelivery;
