
import { useState, useEffect } from "react";
import "./FormNewProduct.css";
import { CgAdd, CgRemove } from "react-icons/cg";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import InputField from "../../InputField/InputField";
import TextareaField from "../../TextareaField/TextareaField";
import LoadingSpin from '../../LoadingSpin/LoadingSpin'
import SelectFieldSupplier from "../../SelectField/SelectFieldSupplier";
import SelectFieldUnit from "../../SelectField/SelectFieldUnitofMeasurement";
import ListProduct from "../ListProduct/ListProduct";
function FormNewProduct(dataProduct, onSubmitSuccess) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [ResponsiveProduct, setResponsiveProduct] = useState(true);
  const [PostToUpdate, SetPostToUpdade] = useState(true);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newUnitofMeasurement, setNewUnitofMeasurement] = useState();
  const [newProductReservedStock, setNewProductReservedStock] = useState("");
  const [newProductIncomingStock, setNewProductIncomingStock] = useState("");
  const [newProductSupplier, setNewProductSupplier] = useState();
  const [newProductAvailableForSale, setNewProductAvailableForSale] = useState("");
  const [newProductSupplierCode, setNewProductSupplierCode] = useState("");

 
  const [ListSupplier, setListSupplier] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateProductId, setUpdateProductId] = useState();
  const [Error, setError] = useState();
  const [Success, setSuccess] = useState();

  const { JwtToken } = useAuth();

  const ProductList = [
    { id: 1, unity: "unidade" },
    { id: 2, unity: "barra" },
    { id: 3, unity: "quilo" },
    { id: 4, unity: "metro linear" },
    { id: 5, unity: "metro quadrado" },

  ];

  const formatarReal = (valor) => {
    const formatado = (valor / 1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatado;
}

  const CheckStock = (stock)=> {
    if (stock >= 0) {
      setError(null);
    } else {
      setError('O estoque não pode ser negativo');
      return
    }
  }
  const CheckPrice = (stock)=> {
    if (stock > 0) {
      setError(null);
    } else {
      setError('O preço não pode ser negativo ou nulo');
      return
    }
  }

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className)
      e.target.classList.remove("isInvalid");
    }
  };



  const handleReset = () => {
    let form = document.getElementById("formNewProduct");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNewProductSupplierCode("")
    setNewProductPrice("");
    setNewUnitofMeasurement("");
    setNewProductStock("");
    setNewProductReservedStock("");
    setNewProductIncomingStock("");
    setNewProductDescription("");
    setNewProductSupplier()
    setNewProductAvailableForSale("")
    SetPostToUpdade(true);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const newProductData = {
      supplierCode: newProductSupplierCode,
      name: newProductName,
      description: newProductDescription,
      unitOfMeasure: newUnitofMeasurement[0].unity,
      productPrice: newProductPrice,
      stock: newProductStock,
      suppliers: newProductSupplier
    };
    console.log(newProductData)
    if (!document.getElementById("formNewProduct").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/produtos`,
        newProductData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleReset();
      setSuccess("Produto adicionado com sucesso!");
      console.log(response)
      setIsLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setError(`${err.response.data.message}`);

    }
  }

  const handleUpdate = async (event) => {
    setIsLoading(true)
    event.preventDefault();
    const newProductData = {
      
      supplierCode: newProductSupplierCode,
      name: newProductName,
      description: newProductDescription,
      unitofMeasure: newUnitofMeasurement[0].unity,
      productPrice: newProductPrice,
      stock: newProductStock,
      reservedStock: newProductReservedStock,
      incomingStock: newProductIncomingStock,
      suppliers: newProductSupplier
    }
    console.log(newProductData)
    if (!document.getElementById("formNewProduct").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/produtos/${updateProductId}`,
        newProductData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      setSuccess("Produto Atualizado com sucesso!");
      setIsLoading(false)
      setError(null);
      SetPostToUpdade(true)
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      } else {
        setError("Erro ao atualizar Produto! Tente novamente.");
        setSuccess(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resposiveProducteShow = () => {
    setResponsiveProduct(!ResponsiveProduct);
  };
  const SetValuestoUpdate = (values) => {
    setUpdateProductId(values.id)
    setNewProductSupplierCode(values.supplierCode)
    setNewProductAvailableForSale(values.availableForSale)
    setNewProductName(values.name);
    setNewProductPrice(values.productPrice);
    setNewProductStock(values.stock);
    setNewUnitofMeasurement(values.unitofMeasure);
    setNewProductDescription(values.description)
    setNewProductSupplier(values.suppliers)
    setNewProductIncomingStock(values.incomingStock)
    setNewProductReservedStock(values.reservedStock)
  };

  useEffect(() => {
    if (dataProduct.dataProduct) {
      SetValuestoUpdate(dataProduct.dataProduct);
      SetPostToUpdade(false);
    }
  }, [dataProduct]);
  
    const handleShowSuppliers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/fornecedores",
          {
            headers: {
              Authorization: `Bearer ${JwtToken}`,
            },
          }
        );

        const listSupplier = response.data.content.map((supplier) => ({
          id: supplier.id,
          fullName: supplier.fullName,
        }));

        setListSupplier(listSupplier);
      } catch (err) {
        console.log(err);
        alert("Erro ao puxar fornecedores!");
      }
    };
    useEffect(() => {
      handleShowSuppliers();      
    }, []);
    

  return (
    <div className="containerForm">
      <h2 className="tabTitle">
        Adicionar Produto
        <a className="hide-desktop" onClick={resposiveProducteShow}>
          {!ResponsiveProduct ? <CgAdd size={45} /> : <CgRemove size={45} />}
        </a>
      </h2>
      <form
        className={
          ResponsiveProduct ? "visibleformNewProduct" : "hiddenformNewProduct"
        }
        id="formNewProduct"
        onReset={handleReset}
        onSubmit={PostToUpdate ? handleSubmit : handleUpdate}
      >
        <div className="line1 line">
        <InputField
            label={"Código do Produto:"}
            placeholder={"Digite o código do Produto"}
            name={"codigoDoProduto"}
            idInput={"newProductSupplierCode"}
            classNameDiv="fiedSupplierCode"
            value={newProductSupplierCode}
            onChange={(e) => {
              setNewProductSupplierCode(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Nome:"}
            placeholder={"Digite o nome do Produto"}
            name={"nome"}
            idInput={"newProductName"}
            classNameDiv="fiedSupplier"
            value={newProductName}
            onChange={(e) => {
              setNewProductName(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Preço:"}
            placeholder={"Digite o preço do produto"}
            name={"preco"}
            idInput={"newProductPrice"}
            classNameDiv="fieldPrice"
            type={"number"}
            value={newProductPrice}
            onChange={(e) => {
              setNewProductPrice(e.target.value);
              isValid(e);
              CheckPrice(e.target.value)
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>

        <div className="line2 line">
          <SelectFieldUnit
            label={"Unidade de Medida:"}
            placeholder="Unidade de Medida"
            arrayOptions={ProductList}
            value={newUnitofMeasurement}
            onChangeValue={setNewUnitofMeasurement}
            
          />

          <InputField
            label={"Estoque:"}
            placeholder={"Digite o estoque"}
            name={"estoque"}
            idInput={"newProductStock"}
            classNameDiv="fieldStock"
            type={"number"}
            value={newProductStock}
            onChange={(e) => {
              setNewProductStock(e.target.value);
              isValid(e);
              CheckStock(e.target.value)
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <SelectFieldSupplier
              label={"Fornecedor:"}
              name={"Supplier"}
              id={"Supplier"}
              classnameDiv={"divSelectSupplier"}
              classNameSelect={"selectSupplier"}
              value={newProductSupplier ? JSON.stringify(newProductSupplier[0]) : ""}
              onInvalid={(e) => selectIsInvalid(e)}
              onChange={(e) => {
                const selectedSupplier = JSON.parse(e.target.value);
                setNewProductSupplier([selectedSupplier]);
                console.log(selectedSupplier)
                isValid(e);
              }}
              arrayOptions={ListSupplier}
            />
        </div>

        <div className="line3 line">
          <TextareaField
            label={"Descrição:"}
            name={"descricao"}
            placeholder={"Digite a descrição do produto"}
            idInput={"newProductDescription"}
            classNameDiv={"fieldDescription"}
            value={newProductDescription}
            onChange={(e) => {
              setNewProductDescription(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>

        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <div className="divButtons">
          <button
            type="submit"
            className="primaryNormal"
            onClick={PostToUpdate ? handleSubmit : handleUpdate}
          >
            {PostToUpdate ? "Salvar" : "Atualizar"}
          </button> 
          <button
            type="reset"
            className="primaryLight"
            onClick={() => handleReset()}
          >
            Cancelar
          </button>
        </div>
      </form >
      {isLoading && <LoadingSpin />}
    </div >
  );
}

export default FormNewProduct

