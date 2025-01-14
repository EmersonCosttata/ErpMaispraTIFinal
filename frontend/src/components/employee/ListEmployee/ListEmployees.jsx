import { BiSolidUserAccount } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListEmployees.css";
import FormNewEmployee from "../formNewEmployee/FormNewEmployee.jsx";
import NavigationListEmployees from "./NavigationListEmployees.jsx";
import PageOfListEmployees from "./PageOfListEmployees.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";

const ListEmployees = ({ onlyView }) => {
  ListEmployees.defaultProps = {
    onlyView: false,
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [employees, setEmployees] = useState();
  const [employeeUpdate, setEmployeesUpdate] = useState(null);
  const [showAtivos, setShowAtivos] = useState(true);
  const [showInativos, setShowInativos] = useState(true);
  const [searchEmployees, setsearchEmployees] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [EmployeeeNameShow, setEmployeeeNameShow] = useState();
  const [listEmployeesPageSelected, setListEmployeesPage] = useState(1);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const maxEmployeesPerList = 6;
  const [contEmployeePages, setContEmployeePages] = useState(0);

  const handleShowEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });

      setEmployees(response.data.content);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar employeees!");
    }
  };

  useEffect(() => {
    handleShowEmployees();
  }, []);

  const deleteEmployee = async (employee) => {
    setEmployeeeNameShow(employee.fullName);
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
      alert("Erro ao deletar");
    }
  };

  const ToFormUpdateEmployee = (data) => {
    setEmployeesUpdate(data);
  };

  useEffect(() => {
    const newFilteredEmployees =
      employees?.filter((employee) => {
        console.log(employee.status);
        const matchesStatus =
          (showAtivos && employee.status === "ativo") ||
          (showInativos && employee.status === "inativo");
        const matchesSearch = employee.fullName
          .toLowerCase()
          .includes(searchEmployees.toLowerCase());
        return matchesStatus && matchesSearch;
      }) || [];

    setFilteredEmployees(newFilteredEmployees);
    setContEmployeePages(
      Math.ceil(newFilteredEmployees.length / maxEmployeesPerList)
    );
  }, [employees, showAtivos, showInativos, searchEmployees]);

  return (
    <>
      {isLoading && <LoadingSpin />}
      {onlyView ? (
        ""
      ) : (
        <FormNewEmployee
          dataEmployee={employeeUpdate}
          onSubmitSuccess={handleShowEmployees}
        />
      )}

      <div className="contentListEmployees">
        <div className="ListEmployees">
          <div className="headerListEmployees">
            <div className="title">
              <BiSolidUserAccount className="userIcon" size={65} />
              <h3>Lista de usuários</h3>
            </div>
            <section>
              <label className="searchEmployee">
                <input
                  type="text"
                  placeholder="Buscar employeee..."
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
                  <th className="formatH4">Nome</th>
                  <th className="formatH4">E-mail</th>
                  <th className="formatH4">Telefone</th>
                  <th className="formatH4">CPF</th>
                  <th className="formatH4"></th>
                </tr>
              </thead>

              <tbody>
                <ModalYesOrNot
                  show={showModal}
                  title="Deletar Usuario?"
                  deleteItem={EmployeeeNameShow}
                  onConfirm={() => {
                    window.handleModalConfirm(true);
                    setShowModal(false);
                  }}
                  onClose={() => {
                    window.handleModalConfirm(false);
                    setShowModal(false);
                  }}
                />

                <PageOfListEmployees
                  employees={filteredEmployees}
                  onEdit={ToFormUpdateEmployee}
                  onDelete={deleteEmployee}
                  maxEmployeesPerList={maxEmployeesPerList}
                  listEmployeesPageSelected={listEmployeesPageSelected}
                  onlyView={onlyView}
                />
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
