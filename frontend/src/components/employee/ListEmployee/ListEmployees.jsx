import { BiSolidUser } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListEmployees.css";
import FormNewEmployee from "../formNewEmployee/FormNewEmployee.jsx";
import NavigationListEmployees from "./navigationListEmployees.jsx";
import PageOfListEmployees from "./PageOfListEmployees.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";

const ListEmployees = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [employees, setEmployees] = useState();
  const [employeeUpdate, setEmployeesUpdate] = useState(null);
  const [showAtivos, setShowAtivos] = useState(true);
  const [showInativos, setShowInativos] = useState(true);
  const [searchEmployees, setsearchEmployees] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [EmployeeNameShow, setEmployeeNameShow] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listEmployeesPageSelected, setListEmployeesPage] = useState(1);

  const handleShowEmployees = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });

      setEmployees(response.data.content);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar funcionarios!");
    }
  };

  useEffect(() => {
    handleShowEmployees();
  }, []);

  const deleteEmployee = async (employee) => {
    console.log(employee);
    setEmployeeNameShow(employee.fullName);
    const confirmDelete = await new Promise((resolve) => {
      setShowModal(true);
      const handleConfirm = (choice) => {
        setShowModal(false);
        resolve(choice);
      };
      window.handleModalConfirm = handleConfirm;
    });
    if (!confirmDelete) {
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/usuarios/${employee.id}`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setIsLoading(false);
      handleShowEmployees();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      alert("Erro ao deletar");
    }
  };

  const ToFormUpdateEmployee = (data) => {
    setEmployeesUpdate(data);
  };

  const filteredEmployees =
    employees?.filter((employee) => {
      const matchesStatus =
        (showAtivos && employee.status === "ativo") ||
        (showInativos && employee.status === "inativo");
      const matchesSearch = employee.fullName
        .toLowerCase()
        .includes(searchEmployees.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  const maxEmployeesPerList = 6;
  let contEmployeePages = Math.ceil(
    filteredEmployees.length / maxEmployeesPerList
  );

  return (
    <>
      {isLoading && <LoadingSpin />}
      <FormNewEmployee dataEmployee={employeeUpdate} />
      <div className="contentListEmployees">
        <div className="ListEmployees">
          <div className="headerListEmployees">
            <div className="title">
              <BiSolidUser className="userIcon" size={75} />
              <h3>Lista de funcionarios</h3>
            </div>
            <section>
              <label className="searchEmployee">
                <input
                  type="text"
                  placeholder="Buscar funcionarios..."
                  required
                  onChange={(e) => setsearchEmployees(e.target.value)}
                />
                <a>
                  <BiSearch size={35} />
                </a>
              </label>
              <div className="divRadios divCheckboxes">
                <label htmlFor="ativos" className="labelCheckbox">
                  <input
                    type="checkbox"
                    value={0}
                    name="ativos/inativos"
                    id="ativos"
                    className="inputRadio inputCheckbox"
                    onClick={() => setShowAtivos(!showAtivos)}
                    defaultChecked
                  />
                  <label className="text labelRadio" htmlFor="ativos">
                    Ativos
                  </label>
                </label>

                <label htmlFor="inativos" className="labelCheckbox">
                  <input
                    type="checkbox"
                    value={0}
                    name="ativos/inativos"
                    id="inativos"
                    className="inputRadio inputCheckbox"
                    onClick={() => setShowInativos(!showInativos)}
                    defaultChecked
                  />
                  <label className="text labelRadio" htmlFor="inativos">
                    Inativos
                  </label>
                </label>
              </div>
            </section>
          </div>
          <hr />

          <div className="ListEmployeesTable">
            <table>
              <thead>
                <tr>
                  <th className="formatH4 col1">Nome</th>
                  <th className="formatH4 col2">E-mail</th>
                  <th className="formatH4 col3">Telefone</th>
                  <th className="formatH4 col4">CPF</th>
                  <th className="formatH4 col5"></th>
                </tr>
              </thead>

              <tbody>
                <ModalYesOrNot
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  title="Deletar funcionario?"
                >
                  <h6>
                    Confirma Exclusão de {EmployeeNameShow && EmployeeNameShow}?
                  </h6>
                  <button onClick={() => window.handleModalConfirm(true)}>
                    Sim
                  </button>
                  <button onClick={() => window.handleModalConfirm(false)}>
                    Não
                  </button>
                </ModalYesOrNot>

                <PageOfListEmployees
                  employees={filteredEmployees}
                  onEdit={ToFormUpdateEmployee}
                  onDelete={deleteEmployee}
                  maxEmployeesPerList={maxEmployeesPerList}
                  listEmployeesPageSelected={listEmployeesPageSelected}
                />

                {/* {filteredEmployees.map((employee) => {
                  return (
                    <tr key={employee.id}>
                      <td>{employee.fullName}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phoneNumber}</td>
                      <td>{employee.cpf}</td>
                      <td>
                        <a href="#" onClick={() => ToFormUpdateEmployee(employee)}>
                          <BiEdit className="editLine" size={30} />
                        </a>
                        <a href="#" onClick={() => deleteEmployee(employee.id)}>
                          <MdDeleteOutline className="deleteLine" size={30} />
                        </a>
                      </td>
                    </tr>
                  )
                })} */}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <NavigationListEmployees
              contEmployeePages={contEmployeePages}
              setListEmployeesPage={setListEmployeesPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListEmployees;
