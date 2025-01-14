import { BiSolidUser } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import { CgAdd, CgRemove } from "react-icons/cg";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListClients.css";
import FormNewClient from "../FormNewClient/FormNewClient.jsx";
import NavigationListClients from "./NavigationListClients.jsx";
import PageOfListClients from "./PageOfListClients.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";

const ListClients = ({ onlyView }) => {
  ListClients.defaultProps = {
    onlyView: false,
  };

  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [clients, setClients] = useState();
  const [clientUpdate, setClientsUpdate] = useState(null);
  const [showAtivos, setShowAtivos] = useState(true);
  const [showInativos, setShowInativos] = useState(true);
  const [searchClients, setsearchClients] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ClienteNameShow, setClienteNameShow] = useState();
  const [listClientsPageSelected, setListClientsPage] = useState(1);

  const handleShowClients = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/clientes`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setClients(response.data.content);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      alert("Erro ao buscar clientes!");
    }
  };

  useEffect(() => {
    handleShowClients();
  }, []);

  const deleteClient = async (client) => {
    setClienteNameShow(client.fullName); // Define o nome do cliente
    const confirmDelete = await new Promise((resolve) => {
      setShowModal(true); // Exibe o modal
      const handleConfirm = (choice) => {
        setShowModal(false); // Fecha o modal
        resolve(choice); // Retorna a escolha do usuário
      };
      window.handleModalConfirm = handleConfirm;
    });
    if (!confirmDelete) {
      return;
    }
    setIsLoading(true);
    try {
      await axios.delete(`${apiUrl}/api/clientes/${client.id}`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setIsLoading(false);
      handleShowClients();
    } catch (err) {
      setIsLoading(false);
      alert("Erro ao deletar");
    }
  };

  const ToFormUpdateClient = (data) => {
    setClientsUpdate(data);
  };

  const [ResponsiveCliente, setResponsiveCliente] = useState(true);

  const resposiveClienteShow = () => {
    setResponsiveCliente(!ResponsiveCliente);
  };

  const filteredClients =
    clients?.filter((client) => {
      const matchesStatus =
        (showAtivos && client.status === "ativo") ||
        (showInativos && client.status === "inativo");
      const matchesSearch = client.fullName
        .toLowerCase()
        .includes(searchClients.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  const maxClientsPerList = 6;
  let contClientPages = Math.ceil(filteredClients.length / maxClientsPerList);

  return (
    <>
      {isLoading && <LoadingSpin />}
      {onlyView ? (
        ""
      ) : (
        <FormNewClient
          dataClient={clientUpdate}
          onSubmitSuccess={handleShowClients}
        />
      )}
      <div className="contentListClients">
        <div className="ListClients">
          <div className="headerListClients">
            <div className="title">
              <BiSolidUser className="userIcon" size={65} />
              <h3>Lista de Clientes </h3>
              <a className="hide-desktop" onClick={resposiveClienteShow}>
                {!ResponsiveCliente ? (
                  <CgAdd size={40} />
                ) : (
                  <CgRemove size={40} />
                )}
              </a>
            </div>
            <section className={ResponsiveCliente ? "" : "None"}>
              <label className="searchClient">
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  required
                  onChange={(e) => setsearchClients(e.target.value)}
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

          <div className={ResponsiveCliente ? "ListClientsTable" : "None"}>
            <table>
              <thead>
                <tr>
                  <th className="formatH4">Nome</th>
                  <th className="formatH4">E-mail</th>
                  <th className="formatH4">Telefone</th>
                  <th className="formatH4">CPF/CNPJ</th>
                  <th className="formatH4"></th>
                </tr>
              </thead>

              <tbody>
                <ModalYesOrNot
                  show={showModal}
                  title="Deletar Cliente?"
                  deleteItem={ClienteNameShow}
                  onConfirm={() => {
                    window.handleModalConfirm(true);
                    setShowModal(false);
                  }}
                  onClose={() => {
                    window.handleModalConfirm(false);
                    setShowModal(false);
                  }}
                />

                <PageOfListClients
                  clients={filteredClients}
                  onEdit={ToFormUpdateClient}
                  onDelete={deleteClient}
                  maxClientsPerList={maxClientsPerList}
                  listClientsPageSelected={listClientsPageSelected}
                  onlyView={onlyView}
                />
              </tbody>
            </table>
          </div>
          <div className={ResponsiveCliente ? "pagination" : "None"}>
            <NavigationListClients
              contClientPages={contClientPages}
              setListClientsPage={setListClientsPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListClients;
