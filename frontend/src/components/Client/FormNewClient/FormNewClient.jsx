import { useState, useEffect } from "react";
import "./FormNewClient.css";
import { CgAdd, CgRemove } from "react-icons/cg";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import Viacep from "../../Viacep/Viacep";
import InputField from "../../InputField/InputField";
import RadioGroup from "../../RadioGroup/RadioGroup";
import TextareaField from "../../TextareaField/TextareaField";
import LoadingSpin from '../../LoadingSpin/LoadingSpin'

function FormNewClient( { dataClient, onSubmitSuccess }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [ResponsiveCliente, setResponsiveCliente] = useState(true);
  const [PostToUpdate, SetPostToUpdade] = useState(true)

  const [CPForCNPJ, setOption] = useState("cpf");
  const [newClientName, setNewClientName] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientAddress, setNewClientAddress] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientCPForCNPJ, setNewClientCPForCNPJ] = useState("");
  const [newClientAddressNumber, setNewClientAddressNumber] = useState("");
  const [newClientDistrict, setNewClientDistrict] = useState("");
  const [newClientCity, setNewClientCity] = useState("");
  const [newClientCEP, setNewClientCEP] = useState("");
  const [newClientState, setNewClientState] = useState("");
  const [newClientBirthDate, setNewClientBirthDate] = useState("");
  const [newClientNotes, setNewClientNotes] = useState("");
  const [newClientStatus, setNewClientStatus] = useState("ativo");
  const [newClientCreditLimit, setnewClientCreditLimit] = useState(100);

  const [newClientIE, setNewClientIE] = useState("");
  
  const [UpdateClientId, setUpdateClientId] = useState();
  const [Error, setError] = useState();
  const [Success, setSuccess] = useState();
  const [isLoading, setIsLoading] =  useState(false);

  const { JwtToken } = useAuth();

  const cityList = [{ id: 1, city: newClientCity }];

  const cpfCnpjOptions = [
    { value: "cpf", label: "CPF" },
    { value: "cnpj", label: "CNPJ" },
  ];
  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
  ];

  const getCep = async (cep) => {
    try {
      const adress = await Viacep(cep);
      setNewClientCity(adress.cidade);
      setNewClientAddress(adress.logradouro);
      setNewClientDistrict(adress.bairro);
      setNewClientState(adress.estado);
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      alert("CEP inválido ou não encontrado.");
    }
  };

  useEffect(() => {
    if (newClientCEP.length == 8) {
      getCep(newClientCEP);
    }
  }, [newClientCEP]);

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className)
      e.target.classList.remove("isInvalid");
    }
  };

  const CheckEmail = (email)=> {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(email)) {
      setError(null);
    } else {
      setError('Formato de Email Inválido!');
      return
    }
  }

  const CheckTelephone = (phone)=> {
    const phoneRegex = /^(\(?\d{2}\)?[\s-]?(\d{4,5})[\s-]?(\d{4})|\d{4,5}-\d{4})$/;
    if (phoneRegex.test(phone)) {
      setError(null);
    } else {
      setError('Formato de Telefone Inválido!');
    }
  }

  const CheckCpf = (cpf)=> {
  const cpfRegex = /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
  if (cpfRegex.test(cpf)) {
    setError(null);
  } else {
    setError('Formato de Cpf Inválido!');
    return
  }
  }

  const handleReset = () => {
    let form = document.getElementById("formNewClient");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }

    setNewClientName("");
    setNewClientEmail("");
    setNewClientAddress("");
    setNewClientPhone("");
    setNewClientCPForCNPJ("");
    setNewClientAddressNumber("");
    setNewClientDistrict("");
    setNewClientCity("");
    setNewClientCEP("");
    setNewClientState("");
    setNewClientBirthDate('');
    setNewClientNotes("")
    setNewClientIE("")
    setnewClientCreditLimit('')
    SetPostToUpdade(true)
    setError(null)
    };
    
  const handleSubmit = async (event) => {
    event.preventDefault();
    const newClientData = {
      fullName: newClientName,
      typePfOrPj: CPForCNPJ === "cpf" ? "PF" : "PJ",
      gender: "NAO INFORMADO",
       cpfCnpj: CPForCNPJ === "cpf" 
      ? newClientCPForCNPJ.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : newClientCPForCNPJ.replace(/\D/g, "").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
      stateRegistration: newClientIE,
      phoneNumber: newClientPhone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
      email: newClientEmail,
      address: newClientAddress,
      number: newClientAddressNumber,
      district: newClientDistrict,
      zipCode: newClientCEP,
      city: newClientCity,
      state: newClientState,
      country: "Brasil",
      birthDate: newClientBirthDate,
      creditLimit: newClientCreditLimit,
      notes: newClientNotes,
      status: newClientStatus,
    };
  
    
    const cpfRegex = /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
    const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;
    if (CPForCNPJ === "cpf") {
      if (!document.getElementById("formNewClient").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      
      setIsLoading(true);
      
      if (cpfRegex.test(newClientData.cpfCnpj)) {
        setError(null);
      } else {
        setIsLoading(false);
        setError('Formato de CPF Inválido');
        return;
      }
      
    } else {
      if (!document.getElementById("formNewClient").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      
      setIsLoading(true);
      
      if (cnpjRegex.test(newSupplierData.cpfCnpj)) {
        setError(null);
      } else {
        setIsLoading(false);
        setError('Formato de CNPJ Inválido');
        return;
      }
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/clientes`,
        newClientData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleReset();
      setSuccess("Cliente adicionado com sucesso!");
      setIsLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setIsLoading(false);
        setError(`${err.response.data.message}`);
      } else {
        setError('Formato de Cpf Invalido');
        setIsLoading(false) 
        return
      }
    }
      
  }
  const handleUpdate = async (event) => {
    setIsLoading(true)

    event.preventDefault();
    const newClientData = {
      fullName: newClientName,
      typePfOrPj: CPForCNPJ === "cpf" ? "PF" : "PJ",
      gender: "NAO INFORMADO",
      cpfCnpj: CPForCNPJ === "cpf" 
      ? newClientCPForCNPJ.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      : newClientCPForCNPJ.replace(/\D/g, "").replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5"),
      stateRegistration: newClientIE,
      phoneNumber: newClientPhone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
      email: newClientEmail,
      address: newClientAddress,
      number: newClientAddressNumber,
      district: newClientDistrict,
      zipCode: newClientCEP,
      city: newClientCity,
      state: newClientState,
      country: "Brasil",
      birthDate: newClientBirthDate,
      creditLimit:  newClientCreditLimit,
      notes: newClientNotes,
      status: newClientStatus,
    }
    ;
    const cpfRegex = /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
    const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;
    if (CPForCNPJ === "cpf") {
      if (!document.getElementById("formNewClient").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      
      setIsLoading(true);
      
      if (cpfRegex.test(newClientData.cpfCnpj)) {
        setError(null);
      } else {
        setIsLoading(false);
        setError('Formato de CPF Inválido');
        return;
      }
      
    } else {
      if (!document.getElementById("formNewClient").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      
      setIsLoading(true);
      
      if (cnpjRegex.test(newClientData.cpfCnpj)) {
        setError(null);
      } else {
        setIsLoading(false);
        setError('Formato de CNPJ Inválido');
        return;
      }
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/clientes/${UpdateClientId}`,
        newClientData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleReset();
      setSuccess("Cliente atualizado com sucesso!");
      setIsLoading(!isLoading)
      setError(null);
      SetPostToUpdade(true)
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setIsLoading(!isLoading);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      } else {
        setError("Erro ao atualizar cliente! Tente novamente.");
        setSuccess(null);
      }
    }finally {
      setIsLoading(false);
    }

  };

  const resposiveClienteShow = () => {
    setResponsiveCliente(!ResponsiveCliente);
  };
  
 const SetValuestoUpdate = (values) => {
   setUpdateClientId(values.id)
   setNewClientName(values.fullName);
   setNewClientEmail(values.email);
   setNewClientIE(values.stateRegistration)
   setNewClientAddress(values.address);
   setNewClientDistrict(values.district)
   setNewClientPhone((values.phoneNumber.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")));
   setNewClientCPForCNPJ(values.cpfCnpj);
   setNewClientAddressNumber(values.number);
   setNewClientCEP(values.zipCode.replace(/\D/g, ''))
   setNewClientCity(values.city)
   setOption(values.typePfOrPj.toLowerCase());
   setNewClientBirthDate(values.birthDate)
   setnewClientCreditLimit(values.creditLimit)
   setNewClientState(values.state);
   setNewClientNotes(values.notes)
   
   setOption(values.typePfOrPj == "PF" ? "cpf" : "cnpj")
   setNewClientStatus(values.status)
   document.getElementById(values.typePfOrPj == "PF" ? "cpf" : "cnpj").checked = true;
   document.getElementById(values.status).checked = true;
   
  };

  useEffect(() => {
  if(dataClient){
    SetValuestoUpdate(dataClient);
    SetPostToUpdade(false)
  }
}, [dataClient]);


  return (
    <div className="containerForm">
      <h2 className="tabTitle">
        Adicionar Cliente
        <a className="hide-desktop" onClick={resposiveClienteShow}>
          {!ResponsiveCliente ? <CgAdd size={45} /> : <CgRemove size={45} />}
        </a>
      </h2>
      <form
        className={
          ResponsiveCliente ? "visibleformNewClient" : "hiddenformNewClient"
        }
        id="formNewClient"
        onReset={handleReset}
        onSubmit={PostToUpdate ? handleSubmit :  handleUpdate}
      >
        <div className="line1 line">
          <InputField
            label={"Nome:"}
            placeholder={"Digite o nome do cliente"}
            name={"nome"}
            idInput={"newClientName"}
            classNameDiv="fieldName"
            value={newClientName}
            onChange={(e) => {
              setNewClientName(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"E-mail:"}
            placeholder={"Digite o e-mail do cliente"}
            name={"email"}
            idInput={"newClientEmail"}
            classNameDiv={"fieldEmail"}
            type={"email"}
            value={newClientEmail}
            onChange={(e) => {
              setNewClientEmail(e.target.value);
              isValid(e);
              CheckEmail(newClientEmail);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>
        <div className="line2 line">
          <InputField
            label={"Data de Nascimento:"}
            name={"dataNascimento"}
            idInput={"newClientBirthDate"}
            classNameDiv="fieldDate"
            type={"date"}
            value={newClientBirthDate}
            onChange={(e) => {
              setNewClientBirthDate(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />

          <InputField
            label={"Telefone:"}
            placeholder={"Digite o telefone do cliente"}
            name={"telefone"}
            idInput={"newClientPhone"}
            classNameDiv="fieldPhone"
            type={"tel"}
            value={newClientPhone}
            onChange={(e) => {
              setNewClientPhone(e.target.value);
              isValid(e);
              CheckTelephone(newClientPhone);
            }}
            onInvalid={(e) => isInvalid(e)}
          />

          <div className="divCpfOrCnpj">
            <RadioGroup
              name={"cpfCnpj"}
              options={cpfCnpjOptions}
              defaultValue={"cpf"}
              onChange={(selectedValue) => setOption(selectedValue)}
              clasnameDiv={"aaa"}
            />
      
            <InputField
              type={"text"}
              placeholder={"Digite o CPF/CNPJ do cliente"}
              name={"cpf/cnpj"}
              idInput={"newClientCPForCNPJ"}
              value={newClientCPForCNPJ}
              onInvalid={(e) => isInvalid(e)}
              onChange={(e) => {
                setNewClientCPForCNPJ(e.target.value);
                isValid(e);
                CheckCpf(e.target.value)
              }}
              label={""}
              classNameDiv="inputFieldNoLabel"
            />
          </div>
          {CPForCNPJ === "cnpj" && <div className="divIE">
          <InputField
              type={"text"}
              placeholder={"Digite a Inscrição Estadual"}
              name={"IE"}
              label={"Inscrição Estadual:"}
              idInput={"newClientIE"}
              value={newClientIE}
              onInvalid={(e) => isInvalid(e)}
              onChange={(e) => {
                setNewClientIE(e.target.value);
                isValid(e);
              }}
              classNameDiv="inputFieldNoLabel"
            /></div>}
        </div>

        <div className="line3 line">
        <InputField
            label={"CEP:"}
            name={"CEP"}
            placeholder={"00000-000"}
            idInput={"newClientCEP"}
            classNameDiv={"fieldCep"}
            type={"text"}
            value={newClientCEP}
            onChange={(e) => {
              setNewClientCEP(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />

          <InputField
            label={"Logradouro:"}
            name={"logradouro"}
            placeholder={"Digite o endereço do cliente"}
            idInput={"newClientAddress"}
            classNameDiv={"fieldAddress"}
            type={"text"}
            value={newClientAddress}
            onChange={(e) => {
              setNewClientAddress(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>

        <div className="line4 line">
        <InputField
            label={"Número:"}
            name={"numero"}
            placeholder={"0000"}
            idInput={"newClientAddressNumber"}
            classNameDiv={"fieldAddressNumber"}
            type={"text"}
            value={newClientAddressNumber}
            onChange={(e) => {
              setNewClientAddressNumber(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Bairro:"}
            name={"bairro"}
            placeholder={"Digite o bairro do cliente"}
            idInput={"newClientDistrict"}
            classNameDiv="fieldDistrict"
            type={"text"}
            value={newClientDistrict}
            onChange={(e) => {
              setNewClientDistrict(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />

          <InputField
            label={"Cidade:"}
            name={"cidade"}
            id={"newClientCity"}
            classNameDiv={"divSelectCity"}
            classNameSelect={"selectCity"}
            value={newClientCity}
            onInvalid={(e) => isInvalid(e)}
            onChange={(e) => {
              setNewClientCity(e.target.value);
              isValid(e);
            }}
            arrayOptions={cityList}
          />

      <InputField
            label={"Limite Credito:"}
            name={"Limite Credito"}
            id={"newClientCreditLimit"}
            classNameDiv={"divSelectCredit"}
            classNameSelect={"selectCredit"}
            value={newClientCreditLimit}
            onInvalid={(e) => isInvalid(e)}
            onChange={(e) => {
              setnewClientCreditLimit(e.target.value);
              isValid(e);
            }}
          />
        </div>

        <div className="line5 line">
          <TextareaField
            label={"Notas:"}
            name={"notas"}
            placeholder={"Digite notas sobre o cliente"}
            idInput={"newClientNotes"}
            classNameDiv={"fieldNotes"}
            value={newClientNotes}
            onChange={(e) => {
              setNewClientNotes(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <div className="divStatusAndButtons">
            <div className="divStatus">
              <label
                htmlFor="newClientStatus"
                className="inputLabel"
                id="labelNewClientStatus"
              >
                <span className="inputDescription">Status:</span>
                <div className="divRadios">
                  <RadioGroup
                    name={"ativoInativo"}
                    options={statusOptions}
                    defaultValue={"ativo"}
                    onChange={(selectedValue) =>
                      setNewClientStatus(selectedValue)
                    }
                  />
                </div>
              </label>
            </div>

            <div className="errorsOrSuccess">
              <p style={{ color: "red" }}>{Error && Error}</p>
              <p style={{ color: "green" }}>{Success && Success}</p>
            </div>
            <div className="divButtons">
              <button
                type="submit"
                className="primaryNormal"
                onClick={PostToUpdate ? handleSubmit :  handleUpdate}
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
      </form>
      {isLoading && <LoadingSpin/>}
    </div>
  );
}

export default FormNewClient
