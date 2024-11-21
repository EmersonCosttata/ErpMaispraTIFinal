import { useState, useEffect } from "react";
import "./FormNewEmployee.css";
import { CgAdd, CgRemove } from "react-icons/cg";
import axios from "axios";
import { useAuth } from "../../AuthContext";
import Viacep from "../../Viacep/Viacep";
import InputField from "../../InputField/InputField";
import SelectField from "../../SelectField/SelectField";
import RadioGroup from "../../RadioGroup/RadioGroup";
import LoadingSpin from "../../LoadingSpin/LoadingSpin";
function FormNewEmployee({ dataEmployee, onSubmitSuccess }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [ResponsiveEmployee, setResponsiveEmployee] = useState(true);
  const [PostToUpdate, SetPostToUpdade] = useState(true);

  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeeAddress, setNewEmployeeAddress] = useState("");
  const [newEmployeePhone, setNewEmployeePhone] = useState("");
  const [newEmployeeCPF, setNewEmployeeCPF] = useState("");
  const [newEmployeeAddressNumber, setNewEmployeeAddressNumber] = useState("");
  const [newEmployeeDistrict, setNewEmployeeDistrict] = useState("");
  const [newEmployeeCity, setNewEmployeeCity] = useState("");
  const [newEmployeeCEP, setNewEmployeeCEP] = useState("");
  const [newEmployeeRole, setNewEmployeeRole] = useState("");
  const [newEmployeeState, setNewEmployeeState] = useState("");
  const [newEmployeeBirthDate, setNewEmployeeBirthDate] = useState("");
  const [newEmployeeStatus, setNewEmployeeStatus] = useState("ativo");
  const [isLoading, setIsLoading] = useState(false);
  const [updateEmployeeId, setUpdateEmployeeId] = useState();

  const [Error, setError] = useState();
  const [Success, setSuccess] = useState();

  const { JwtToken } = useAuth();

  const roleList = [
    { id: 1, label: "ROLE_ADMIN" },
    { id: 2, label: "ROLE_MANAGER" },
  ];

  const statusOptions = [
    { value: "ativo", label: "Ativo" },
    { value: "inativo", label: "Inativo" },
  ];

  const getCep = async (cep) => {
    try {
      const adress = await Viacep(cep);
      setNewEmployeeCity(adress.cidade);
      setNewEmployeeAddress(adress.logradouro);
      setNewEmployeeDistrict(adress.bairro);
      setNewEmployeeState(adress.estado);
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      alert("CEP inválido ou não encontrado.");
    }
  };

  useEffect(() => {
    if (newEmployeeCEP.length == 8) {
      getCep(newEmployeeCEP);
    }
  }, [newEmployeeCEP]);

  const isInvalid = (e) => {
    e.target.className = "isInvalid";
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className);
      e.target.classList.remove("isInvalid");
    }
  };

  const CheckEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(email)) {
      setError(null);
    } else {
      setError("Formato de Email Inválido!");
      return;
    }
  };

  const CheckTelephone = (phone) => {
    const phoneRegex =
      /^\(?\+?(\d{1,3})?\)?[-.\s]?(\d{2})[-.\s]?(\d{4,5})[-.\s]?(\d{4})$/;
    if (phoneRegex.test(phone)) {
      setError(null);
    } else {
      setError("Formato de Telefone Inválido!");
      return;
    }
  };

  const CheckCpf = (cpf) => {
    const cpfRegex =
      /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
    if (cpfRegex.test(cpf)) {
      setError(null);
    } else {
      setError("Formato de Cpf Inválido!");
      return;
    }
  };

  const handleReset = () => {
    let form = document.getElementById("formNewEmployee");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }

    setNewEmployeeName("");
    setNewEmployeeEmail("");
    setNewEmployeeAddress("");
    setNewEmployeePhone("");
    setNewEmployeeCPF("");
    setNewEmployeeAddressNumber("");
    setNewEmployeeDistrict("");
    setNewEmployeeCity("");
    setNewEmployeeCEP("");
    setNewEmployeeState("");
    setNewEmployeeBirthDate("");
    setNewEmployeeRole("");
    SetPostToUpdade(true);
    setError(null);
  };

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const newEmployeeData = {
      fullName: newEmployeeName,
      email: newEmployeeEmail,
      birthDate: newEmployeeBirthDate,
      phoneNumber: newEmployeePhone,
      cpf: newEmployeeCPF,
      address: newEmployeeAddress,
      number: newEmployeeAddressNumber,
      district: newEmployeeDistrict,
      zipCode: newEmployeeCEP,
      city: newEmployeeCity,
      state: newEmployeeState,
      country: "Brasil",
      roles: newEmployeeRole,
      status: newEmployeeStatus,
      password: "12345",
    };
    try {
      const response = await axios.post(
        `${apiUrl}/api/usuarios`,
        newEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Usuário adicionado com sucesso!");
      setIsLoading(false);
      handleReset();
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      } else {
        setError("Erro ao adicionar Usuário! Tente novamente.");
        setSuccess(null);
      }
    }
  };

  const resposiveEmployeeShow = () => {
    setResponsiveEmployee(!ResponsiveEmployee);
  };

  const SetValuestoUpdate = (values) => {
    setUpdateEmployeeId(values.id);
    setNewEmployeeName(values.fullName);
    setNewEmployeeEmail(values.email);
    setNewEmployeeAddress(values.address);
    setNewEmployeeDistrict(values.district);
    setNewEmployeePhone(values.phoneNumber);
    setNewEmployeeCPF(values.cpf);
    setNewEmployeeAddressNumber(values.number);
    setNewEmployeeCEP(values.zipCode.replace(/\D/g, ""));
    setNewEmployeeCity(values.city);
    setNewEmployeeBirthDate(values.birthDate);
    setNewEmployeeState(values.state);

    setNewEmployeeRole(values.roles);

    setNewEmployeeStatus(values.status);
    document.getElementById(values.status).checked = true;
  };

  const handleUpdate = async (event) => {
    setIsLoading(true);
    event.preventDefault();

    const newEmployeeData = {
      fullName: newEmployeeName,
      email: newEmployeeEmail,
      birthDate: newEmployeeBirthDate,
      phoneNumber: newEmployeePhone,
      cpf: newEmployeeCPF,
      address: newEmployeeAddress,
      number: newEmployeeAddressNumber,
      district: newEmployeeDistrict,
      zipCode: newEmployeeCEP,
      city: newEmployeeCity,
      state: newEmployeeState,
      country: "Brasil",
      roles: newEmployeeRole,
      status: newEmployeeStatus,
      password: "12345",
    };
    const TelephoneRegex =
      /^\(?\+?(\d{1,3})?\)?[-.\s]?(\d{2})[-.\s]?(\d{4,5})[-.\s]?(\d{4})$/;
    if (TelephoneRegex.test(newEmployeeData.phoneNumber)) {
      setError(null);
    } else {
      setError("Formato de Telefone Inválido!");
      return;
    }

    try {
      console.log(JwtToken);
      const response = await axios.put(
        `${apiUrl}/api/usuarios/${updateEmployeeId}`,
        newEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${JwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Usuário atualizado com sucesso!");
      setIsLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      setError(null);
      SetPostToUpdade(true);
      handleReset();
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      } else {
        setError("Erro ao atualizar usuário! Tente novamente.");
        setSuccess(null);
      }
    }
  };

  useEffect(() => {
    if (dataEmployee) {
      SetValuestoUpdate(dataEmployee);
      SetPostToUpdade(false);
    }
  }, [dataEmployee]);

  return (
    <div className="containerFormEmployee">
      {isLoading && <LoadingSpin />}
      <h2 className="tabTitleEmployee">
        Adicionar Usuario
        <a className="hideDesktopEmployee" onClick={resposiveEmployeeShow}>
          {" "}
          {!ResponsiveEmployee ? <CgAdd size={45} /> : <CgRemove size={45} />}
        </a>
      </h2>
      <form
        className={
          ResponsiveEmployee
            ? "visibleFormNewEmployee"
            : "hiddenFormNewEmployee"
        }
        id="formNewEmployee"
        onSubmit={PostToUpdate ? handleSubmit : handleUpdate}
        onReset={handleReset}
      >
        <div className="line1Employee lineEmployee">
          <InputField
            label={"Nome:"}
            placeholder={"Digite o nome do usuário"}
            name={"nome"}
            idInput={"newEmployeeName"}
            classNameDiv={"fieldNameEmployee"}
            value={newEmployeeName}
            onChange={(e) => {
              setNewEmployeeName(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"E-mail:"}
            placeholder={"Digite o e-mail do usuário"}
            name={"email"}
            idInput={"newEmployeeEmail"}
            classNameDiv="fieldEmailEmployee"
            type={"email"}
            value={newEmployeeEmail}
            onChange={(e) => {
              setNewEmployeeEmail(e.target.value);
              isValid(e);
              CheckEmail(newEmployeeEmail);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>
        <div className="line2Employee lineEmployee">
          <InputField
            label={"Data de Nascimento:"}
            name={"dataNascimento"}
            idInput={"newEmployeeBirthDate"}
            classNameDiv="fieldDateEmployee"
            type={"date"}
            value={newEmployeeBirthDate}
            onChange={(e) => {
              setNewEmployeeBirthDate(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Telefone:"}
            placeholder={"Digite o telefone do usuário"}
            name={"telefone"}
            idInput={"newEmployeePhone"}
            classNameDiv="fieldPhone"
            type={"tel"}
            value={newEmployeePhone}
            onChange={(e) => {
              setNewEmployeePhone(e.target.value);
              isValid(e);
              CheckTelephone(newEmployeePhone);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"CPF:"}
            placeholder={"Digite o CPF do usuário"}
            name={"cpf"}
            idInput={"newEmployeeCPF"}
            classNameDiv="fieldCpf"
            type={"text"}
            value={newEmployeeCPF}
            onChange={(e) => {
              setNewEmployeeCPF(e.target.value);
              isValid(e);
              CheckCpf(e.target.value);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>
        <div className="line3Employee lineEmployee">
          <InputField
            label={"CEP:"}
            name={"CEP"}
            placeholder={"00000-000"}
            idInput={"newEmployeeCEP"}
            classNameDiv={"fieldCepEmployee"}
            type={"text"}
            value={newEmployeeCEP}
            onChange={(e) => {
              setNewEmployeeCEP(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Cidade:"}
            name={"cidade"}
            placeholder={"Digite a cidade do usuário"}
            idInput={"newEmployeeCity"}
            classNameDiv={"divSelectCityEmployee"}
            value={newEmployeeCity}
            onInvalid={(e) => isInvalid(e)}
            onChange={(e) => {
              setNewEmployeeCity(e.target.value);
              isValid(e);
            }}
          />
          <InputField
            label={"Bairro:"}
            name={"bairro"}
            placeholder={"Digite o bairro do usuário"}
            idInput={"newEmployeeDistrict"}
            classNameDiv="fieldDistrictEmployee"
            type={"text"}
            value={newEmployeeDistrict}
            onChange={(e) => {
              setNewEmployeeDistrict(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
        </div>
        <div className="line4Employee lineEmployee">
          <InputField
            label={"Logradouro:"}
            name={"logradouro"}
            placeholder={"Digite o endereço do usuário"}
            idInput={"newEmployeeAddress"}
            classNameDiv={"fieldAddressEmployee"}
            type={"text"}
            value={newEmployeeAddress}
            onChange={(e) => {
              setNewEmployeeAddress(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />
          <InputField
            label={"Número:"}
            name={"numero"}
            placeholder={"0000"}
            idInput={"newEmployeeAddressNumber"}
            classNameDiv={"fieldAddressNumberEmployee"}
            type={"text"}
            value={newEmployeeAddressNumber}
            onChange={(e) => {
              setNewEmployeeAddressNumber(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
          />

          <SelectField
            label={"Cargo:"}
            name={"cargo"}
            id={"newEmployeeRole"}
            classnameDiv={"divSelectRoleEmployee"}
            classNameSelect={"selectRoleEmployee"}
            value={newEmployeeRole ? JSON.stringify(newEmployeeRole[0]) : ""}
            onInvalid={(e) => selectIsInvalid(e)}
            onChange={(e) => {
              const selectedRole = JSON.parse(e.target.value);
              setNewEmployeeRole([selectedRole]);
              isValid(e);
            }}
            arrayOptions={roleList}
          />

        </div>
        <div className="line5 line">
          <div className="divStatusAndButtons">
            <div className="divStatusEmployee">
              <label
                htmlFor="newEmployeeStatus"
                className="inputLabelEmployee"
                id="labelNewEmployeeStatus"
              >
                <span className="inputDescription">Status:</span>
                <div className="divRadiosEmployee">
                  <RadioGroup
                    name={"ativoInativo"}
                    options={statusOptions}
                    defaultValue={"ativo"}
                    onChange={(selectedValue) =>
                      setNewEmployeeStatus(selectedValue)
                    }
                  />
                </div>
              </label>
            </div>

            <div className="errorsOrSuccessEmployee">
              <p style={{ color: "red" }}>{Error && Error}</p>
              <p style={{ color: "green" }}>{Success && Success}</p>
            </div>
            <div className="divButtonsEmployee">
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
    </div >
  );
}

export default FormNewEmployee;
