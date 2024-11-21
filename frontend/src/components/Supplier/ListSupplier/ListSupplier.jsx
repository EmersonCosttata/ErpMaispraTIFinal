import { BiSolidTruck } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListSupplier.css";
import FormNewSupplier from "../FormNewSupplier/FormNewSupplier.jsx";
import NavigationListSupplier from "./NavigationListSupplier.jsx";
import PageOfListSupplier from "./PageOfListSupplier.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";

const ListSupplier = ({ onlyView }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  ListSupplier.defaultProps = {
    onlyView: false,
  };
  const { JwtToken } = useAuth();
  const [suppliers, setSuppliers] = useState();
  const [supplierUpdate, setSupplierUpdate] = useState(null);
  const [showAtivos, setShowAtivos] = useState(true);
  const [showInativos, setShowInativos] = useState(true);
  const [searchSuppliers, setSearchSuppliers] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [supplierNameShow, setSupplierNameShow] = useState();

  const [listSuppliersPageSelected, setListSuppliersPage] = useState(1);

  const handleShowSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/fornecedores`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setSuppliers(response.data.content);
      setIsLoading(!true);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar fornecedores!");
    }
  };

  useEffect(() => {
    handleShowSuppliers();
  }, []);

  const deleteSupplier = async (supplier) => {
    setSupplierNameShow(supplier.fullName);
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
      await axios.delete(`${apiUrl}/api/fornecedores/${supplier.id}`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setIsLoading(false);
      handleShowSuppliers();
    } catch (err) {
      setIsLoading(false);
      alert("Erro ao deletar fornecedor");
    }
  };

  const ToFormUpdateSupplier = (data) => {
    setSupplierUpdate(data);
  };

  const filteredSuppliers =
    suppliers?.filter((supplier) => {
      const matchesStatus =
        (showAtivos && supplier.status === "ativo") ||
        (showInativos && supplier.status === "inativo");
      const matchesSearch = supplier.fullName
        .toLowerCase()
        .includes(searchSuppliers.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  const maxSuppliersPerList = 6;
  let contSupplierPages = Math.ceil(
    filteredSuppliers.length / maxSuppliersPerList
  );

  return (
    <>
      {isLoading && <LoadingSpin />}
      {onlyView ? (
        ""
      ) : (
        <FormNewSupplier
          dataSupplier={supplierUpdate}
          onSubmitSuccess={handleShowSuppliers}
        />
      )}

      <div className="contentListSuppliers">
        <div className="ListSuppliers">
          <div className="headerListSuppliers">
            <div className="title">
              <BiSolidTruck className="userIcon" size={65} />
              <h3>Lista de Fornecedores</h3>
            </div>
            <section>
              <label className="searchSupplier">
                <input
                  type="text"
                  placeholder="Buscar fornecedor..."
                  required
                  onChange={(e) => setSearchSuppliers(e.target.value)}
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

          <div className="ListSuppliersTable">
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
                  title="Deletar Fornecedor?"
                  deleteItem={supplierNameShow}
                  onConfirm={() => {
                    window.handleModalConfirm(true);
                    setShowModal(false);
                  }}
                  onClose={() => {
                    window.handleModalConfirm(false);
                    setShowModal(false);
                  }}
                />

                <PageOfListSupplier
                  suppliers={filteredSuppliers}
                  onEdit={ToFormUpdateSupplier}
                  onDelete={deleteSupplier}
                  maxSuppliersPerList={maxSuppliersPerList}
                  listSuppliersPageSelected={listSuppliersPageSelected}
                  onlyView={onlyView}
                />
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <NavigationListSupplier
              contSupplierPages={contSupplierPages}
              setListSuppliersPage={setListSuppliersPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListSupplier;
