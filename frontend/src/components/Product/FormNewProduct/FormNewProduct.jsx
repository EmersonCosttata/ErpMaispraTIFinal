
import { useState, useEffect } from "react";
import "./FormNewProduct.css";
import { CgAdd, CgRemove } from "react-icons/cg";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import InputField from "../../InputField/InputField";
import TextareaField from "../../TextareaField/TextareaField";
import LoadingSpin from '../../LoadingSpin/LoadingSpin'
import SelectFieldSupplier from "../../SelectField/SelectFieldSupplier";

function FormNewProduct({dataProduct, onSubmitSuccess }) {

  const apiUrl = import.meta.env.VITE_API_URL;
  const [ResponsiveProduct, setResponsiveProduct] = useState(true);
  const [PostToUpdate, SetPostToUpdade] = useState(true);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductStock, setNewProductStock] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newUnitofMeasurement, setNewUnitofMeasurement] = useState("");
  const [newProductReservedStock, setNewProductReservedStock] = useState(0);
  const [newProductIncomingStock, setNewProductIncomingStock] = useState(0);
  const [newProducSupplier, setNewProductSupplier] = useState([]);
  const [newProductAvailableForSale, setNewProductAvailableForSale] = useState("");
  const [newProductSupplierCode, setNewProductSupplierCode] = useState("");

  const [ListSupplier, setListSupplier] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateProductId, setUpdateProductId] = useState();
  const [Error, setError] = useState();
  const [Success, setSuccess] = useState();

  const { JwtToken } = useAuth();

  const CheckStock = (stock) => {
    if (stock >= 0) {
      setError(null);
    } else {
      setError('O estoque não pode ser negativo');
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
    setError('')
    setSuccess('')
    setNewProductName("");
    setNewProductPrice("");
    setNewUnitofMeasurement("");
    setNewProductStock("");
    setNewProductReservedStock("");
    setNewProductIncomingStock("");
    setNewProductDescription("");
    setNewProductSupplier([])
    setNewProductSupplierCode("")
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
      unitOfMeasure: newUnitofMeasurement,
      productPrice: newProductPrice,
      stock: newProductStock,
      availableForSale: newProductAvailableForSale,
      suppliers: [
        {
          id: +newProducSupplier.id, 
          fullName: newProducSupplier.fullName, 
        },
      ],
    };
  
    console.log(newProductData);
  
    // Validação do formulário
    if (!document.getElementById("formNewProduct").reportValidity()) {
      setError("Preencha todos os campos!");
      setIsLoading(false);
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
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error("Erro ao adicionar produto", err);
      setError(err.response?.data?.message || "Erro ao adicionar produto");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = async (event) => {
    event.preventDefault();
    const newProductData = {
      supplierCode: newProductSupplierCode,
      name: newProductName,
      description: newProductDescription,
      unitOfMeasure: newUnitofMeasurement,
      productPrice: newProductPrice,
      stock: newProductStock,
      availableForSale: newProductAvailableForSale,
      reservedStock: newProductReservedStock,
      incomingStock: newProductIncomingStock,
      suppliers: [
        {
          id: +newProducSupplier.id, 
          fullName: newProducSupplier.fullName, 
        },
      ],
    };
  
    if (!document.getElementById("formNewProduct").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
  
    setIsLoading(true); 
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
      handleReset();
      setSuccess("Produto atualizado com sucesso!");
      SetPostToUpdade(true); // Flag para indicar que a atualização foi bem-sucedida
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error("Erro ao atualizar produto", err);
      setError(err.response?.data?.message || "Erro ao atualizar produto! Tente novamente.");
      setSuccess(null);
    } finally {
      setIsLoading(false); // Desativa o carregamento
    }
  };
  

  const resposiveProducteShow = () => {
    setResponsiveProduct(!ResponsiveProduct);
  };
  const SetValuestoUpdate = (values) => {
    console.log('setPost',values.suppliers )
    setError('')
    setSuccess('')
    setUpdateProductId(values.id)
    setNewProductSupplierCode(values.supplierCode)
    setNewProductAvailableForSale(values.availableForSale)
    setNewProductName(values.name);
    setNewProductPrice(values.productPrice);
    setNewProductStock(values.stock);
    setNewUnitofMeasurement(values.unitOfMeasure);
    setNewProductDescription(values.description)
    setNewProductSupplier({ suppliersFullName: values.suppliers[0]});
    
    setNewProductIncomingStock(values.incomingStock)
    setNewProductReservedStock(values.reservedStock)
  };

  useEffect(() => {
    if (dataProduct) {
      SetValuestoUpdate(dataProduct);
      SetPostToUpdade(false);
    }
  }, [dataProduct]);

  const handleGetSupplier = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/fornecedores`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setListSupplier(response.data.content);
    } catch (err) {
      console.error("Erro ao puxar forncedores", err);
    }
  };

  useEffect(() => {
    handleGetSupplier();
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
            classNameDiv="fieldSupplierCode"
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
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>

        <div className="line2 line">
          <InputField
            label={"Unidade de Medida:"}
            placeholder={"Digite uma unidade de medida"}
            name={"UnidadeDeMedida"}
            idInput={"newUnitofMeasurement"}
            classNameDiv="fieldUnitofMeasurement"
            value={newUnitofMeasurement}
            onChange={(e) => {
              setNewUnitofMeasurement(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
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
              CheckStock(newProductStock)
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <SelectFieldSupplier
            label={"Fornecedor"}
            placeholder="Fornecedor"
            arrayOptions={ListSupplier}
            value={newProducSupplier}
            onChangeValue={setNewProductSupplier}
            classNameDiv="fieldSupplier"
            onInvalid={(e) => isInvalid(e)}
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
        


        <div className="line line5">
          <div className="divStatusAndButtons">

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
          </div>
        </div>

      </form >
      {isLoading && <LoadingSpin />}
    </div >
  );
}

export default FormNewProduct

