import { useState, useEffect } from "react";
import "./FormNewSaleRegister.css";
import { CgAdd, CgRemove } from "react-icons/cg";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import { jwtDecode } from "jwt-decode";

import InputField from "../../InputField/InputField";
import LoadingSpin from '../../LoadingSpin/LoadingSpin';
import SelectFieldClient from "../../SelectField/SelectFieldClient";
import SelectFieldProduct from "../../SelectField/SelectFieldProduct";
import CardSaleRegister from './CardSaleRegister'

function FormNewSaleRegister({ dataSaleRegister , onSubmitSuccess }) {
  const { JwtToken } = useAuth();
  const decoded = jwtDecode(JwtToken);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [ResponsiveSaleRegister, setResponsiveSaleRegister] = useState(true);
  const [PostToUpdate, setPostToUpdate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [ListClients, setListClients] = useState([]);
  const [ListProducts, setListProducts] = useState([]);

  const [NewSaleRegisterSaleId, setNewSaleRegisterSaleId] = useState('');
  const [NewSaleRegisterClient, setNewSaleRegisterClient] = useState('');
  const [NewSaleRegisterSaller, setNewSaleRegisterSaller] = useState(decoded.fullName);
  const [NewSaleRegisterData, setNewSaleRegisterData] = useState('');
  const [NewSaleRegisterDataPrev, setNewSaleRegisterDataPrev] = useState('');
  const [NewSaleRegisterProduct, setNewSaleRegisterProduct] = useState();
  const [NewSaleRegisterQuant, setNewSaleRegisterQuant] = useState(0);
  const [CardItems, setCardItems] = useState([]);
  const [cardId, setCardId] = useState(1);

  const ValuestoUpdate = (values) => {

    setCardItems([]);
    setNewSaleRegisterSaleId(values.id);
    setNewSaleRegisterClient(values.client);
    setNewSaleRegisterSaller(decoded.fullName);
    setNewSaleRegisterDataPrev(values.expectedDeliveryDate);
    setNewSaleRegisterData(values.saleDate);
    setNewSaleRegisterProduct('');
    setNewSaleRegisterQuant('');
    setCardId(1);

    values.saleItems.forEach((value, index) => {
      const NewItemtoCard = {
        id: index + 1,
        productId: value.product.id,
        productName: value.product.name,
        quant: value.quantitySold,
        price: value.salePrice,
        subtotal: value.salePrice * value.quantitySold,
      };
      setCardItems((prevItems) => [...prevItems, NewItemtoCard]);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

  if (!document.getElementById("formSaleRegister").reportValidity()) {
    setError("Preencha todos os campos!");
    setIsLoading(false);
    return;
  }

    try {
      const response = await axios.post(
        `${apiUrl}/api/vendas`,
        {
          expectedDeliveryDate: NewSaleRegisterDataPrev,
          clientId: NewSaleRegisterClient[0].id,
        },
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const clientData = response.data;
              
        const saleRequests = CardItems.map((card) =>
          axios.post(
            `${apiUrl}/api/vendas/${clientData.id}/itens`,
            {
              productId: +card.productId,     
              quantitySold: +card.quant,       
              salePrice: +card.price,         
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
      setSuccess("Venda registrada com sucesso!");
      handleReset();
      setError("");
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.log(err)
      setError("Erro ao registrar itens de venda");
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      }
    } finally {
      setIsLoading(false);
      setError("");
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const salePayload = {
      saleDate: NewSaleRegisterData, 
      expectedDeliveryDate: NewSaleRegisterDataPrev, 
      saleStatus: "pendente",
    };
   if (!document.getElementById("formSaleRegister").reportValidity()) {
    setError("Preencha todos os campos!");
    setIsLoading(false);
    return;
  }
    try {
      const response = await axios.put(
        `${apiUrl}/api/vendas/${NewSaleRegisterSaleId}`,
        salePayload,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Venda atualizada:", response.data.saleItems[0].id);
      let updatedSaleIdList = response.data.saleItems.map((item) => item.id);
      const saleRequestsUpdate = CardItems.map((card, index) =>
        axios.put(
          `${apiUrl}/api/vendas/itens/${updatedSaleIdList[index]}`, 
          {
            productId: +card.productId,
            quantitySold: +card.quant,
            salePrice: +card.price,
          },
          {
            headers: {
              Authorization: `Bearer ${JwtToken}`,
              "Content-Type": "application/json",
            },
          }
        )
      );
  
      await Promise.all(saleRequestsUpdate);
      setSuccess("Venda e itens atualizados com sucesso!");
      handleReset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error("Erro ao atualizar venda:", err);
      setError("Erro ao atualizar itens de venda.");
  
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Erro desconhecido.");
      }
    } finally {
      setError("");
      setIsLoading(false);
    }
  };

  const deleteCardItem = (idToDelete) => {
    setIsLoading(true)
    setCardItems((prevItems) => prevItems.filter(item => item.id !== idToDelete));
    setCardId(cardId - 1);
    setCardItems((prevItems) => {
      const itemToDelete = prevItems.find(item => item.id === idToDelete);
      if (!itemToDelete) return prevItems
      setListProducts((prevProducts) =>
        prevProducts.map((prod) => {
          if (prod.id === itemToDelete.productId) {
            return {
              ...prod,
              availableForSale: Number(prod.availableForSale) + Number(itemToDelete.quant),
            };
          }
          return prod;
        })
      );
      return prevItems.filter(item => item.id !== idToDelete);
    });
    setCardId((prevId) => prevId - 1);
    setIsLoading(!true)
  };

  const handleAddtoCard = (e) => {
    e.preventDefault();
    if (!NewSaleRegisterProduct || NewSaleRegisterProduct.length === 0) {
      setError("Nenhum produto foi selecionado.");
      setIsLoading(false)
      return;
    }
    const selectedProduct = NewSaleRegisterProduct[0];
    const NewItemtoCard = {
      id: cardId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quant: NewSaleRegisterQuant,
      price: selectedProduct.productPrice,
      subtotal: +selectedProduct.productPrice * +NewSaleRegisterQuant,
    };

  
    if (+NewSaleRegisterQuant > +selectedProduct.availableForSale) {

      setError(
        +selectedProduct.availableForSale === 0
          ? "Produto sem estoque disponível!"
          : "Quantidade maior que o estoque disponível!"
      );
      return;
    }

    if (!NewItemtoCard.quant || isNaN(NewItemtoCard.quant) || NewItemtoCard.quant <= 0) {
      setError("A quantidade deve ser preenchida e ser um número positivo.");
      return;
    }

    if (!NewItemtoCard.price || isNaN(NewItemtoCard.price) || NewItemtoCard.price <= 0) {
      setError("O preço deve ser preenchido e ser um número positivo.");
      return;
    }
  
    const updatedProducts = ListProducts.map((prod) => {
      if (prod.id === selectedProduct.id) {
        if (+prod.availableForSale < +NewItemtoCard.quant) {
          setError("Estoque insuficiente para adicionar essa quantidade.");
          throw new Error("Estoque insuficiente");
        }
        return {
          ...prod,
          availableForSale: +prod.availableForSale - +NewItemtoCard.quant,
        };
      }
      return prod;
    });
    console.log("Estoque após atualização:", updatedProducts);
    setListProducts(updatedProducts);
  
    setCardItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === NewItemtoCard.productId
      );
  
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quant: +existingItem.quant + +NewSaleRegisterQuant,
          subtotal: (+existingItem.quant + +NewSaleRegisterQuant) * existingItem.price,
        };
        return updatedItems;
      }
      setCardId(cardId + 1);
      return [...prevItems, NewItemtoCard];
    });
  
    setNewSaleRegisterQuant(0);
    setError("");
    setIsLoading(!true)
  };
  const handleGetClients = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/clientes`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setListClients(response.data.content);
      setIsLoading(!true)
    } catch (err) {
      console.error("Erro ao puxar clientes", err);
    }
  };
  const handleGetProducts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/produtos`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setListProducts(response.data.content);
    } catch (err) {
      console.error("Erro ao puxar produtos", err);
    }finally{
    setIsLoading(!true)}
  };

  const handleReset = () => {
    setNewSaleRegisterClient('');
    setNewSaleRegisterData('');
    setNewSaleRegisterDataPrev('');
    setNewSaleRegisterProduct('');
    setNewSaleRegisterQuant('');
    setCardItems([]);
    setCardId(1);
  };

  useEffect(() => {
    handleGetProducts();
    handleGetClients();
  }, []);

  useEffect(() => {
    if (dataSaleRegister) {
      ValuestoUpdate(dataSaleRegister);
      setPostToUpdate(false);
      console.log(dataSaleRegister)
    }
  }, [dataSaleRegister]);


  return (
    <div className="containerForm">
      <h2 className="tabTitle">
        Vendas de Produtos
        <a className="hide-desktop" onClick={() => setResponsiveSaleRegister(!ResponsiveSaleRegister)}>
          {!ResponsiveSaleRegister ? <CgAdd size={45} /> : <CgRemove size={45} />}
        </a>
      </h2>
      <form
        className={ResponsiveSaleRegister ? "visibleformNewSaleRegister" : "hiddenformNewSaleRegister"}
        id="formSaleRegister"
      >
        <div className="line1 line">
          <SelectFieldClient
            classNameDiv="fieldName"
            label={"Clientes"}
            placeholder="Clientes"
            arrayOptions={ListClients}
            value={!PostToUpdate && NewSaleRegisterClient.fullName}
            onChangeValue={setNewSaleRegisterClient}
          />

          <InputField
            classNameDiv="fieldName"
            label="Vendedor Responsavel:"
            placeholder=""
            name="sellerName"
            value={decoded.fullName}
            disabled={true}
          />
          <InputField
            classNameDiv="fieldDate"
            label="Data de Entrega:"
            name="deliveryDate"
            type="date"
            value={NewSaleRegisterData}
            onChange={(e) => setNewSaleRegisterData(e.target.value)}
          />

        </div>

        <div className="line">
          <InputField
            classNameDiv="fieldDate"
            label="Data Prevista:"
            name="deliveryDate"
            type="date"
            value={NewSaleRegisterDataPrev}
            onChange={(e) => setNewSaleRegisterDataPrev(e.target.value)}
          />

          <SelectFieldProduct
            classNameDiv="fieldProduct"
            label={"Produtos"}
            placeholder="Produtos"
            arrayOptions={ListProducts}
            value={NewSaleRegisterProduct}
            onChangeValue={setNewSaleRegisterProduct}
          />


          <InputField
            classNameDiv="fieldQuantity"
            label="Quantidade:"
            name="quantity"
            placeholder="0"
            value={NewSaleRegisterQuant}
            onChange={(e) => setNewSaleRegisterQuant(e.target.value)}
          />


          <div className="divRegisterButton">
            {isLoading ? <LoadingSpin /> : <button type="submit" className="registerButton" onClick={(e) => handleAddtoCard(e)}>Registrar</button>}
          </div>

        </div>
        <div className="errorsOrSuccess">
          {Error && <p className="error">{Error}</p>}
          {Success && <p className="salesuccess">{Success}</p>}
        </div>
      </form>
      <CardSaleRegister
        saleRegisters={CardItems}
        onDelete={deleteCardItem}
        PostToUpdate={PostToUpdate}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
      />

    </div>
  );
}

export default FormNewSaleRegister;
