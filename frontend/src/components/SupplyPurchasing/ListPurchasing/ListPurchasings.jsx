import { BiSolidUser } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListPurchasings.css";
import FormNewPurchasing from "../FormNewPurchasing/FormNewPurchasing.jsx";
import NavigationListPurchasings from "./NavigationListPurchasings.jsx";
import PageOfListPurchasings from "./PageOfListPurchasings.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";
//reacticons
import { FaCoins } from "react-icons/fa";

const ListPurchasings = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [Purchasings, setPurchasings] = useState();
  const [PurchasingUpdate, setPurchasingsUpdate] = useState(null);
  const [showAtivos, setShowAtivos] = useState(true);
  const [showInativos, setShowInativos] = useState(true);
  const [searchPurchasings, setsearchPurchasings] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [PurchasingeNameShow, setPurchasingeNameShow] = useState();
  const [listPurchasingsPageSelected, setListPurchasingsPage] = useState(1);
  const [filteredPurchasings, setFilteredPurchasings] = useState([]);
  const maxPurchasingsPerList = 6;
  const [contPurchasingPages, setContPurchasingPages] = useState(0);

  const handleShowPurchasings = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/usuarios`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });

      setPurchasings(response.data.content);
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar Purchasinges!");
    }
  };

  useEffect(() => {
    handleShowPurchasings();
  }, []);

  const deletePurchasing = async (Purchasing) => {
    setPurchasingeNameShow(Purchasing.fullName);
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
      await axios.delete(`${apiUrl}/api/usuarios/${Purchasing.id}`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setIsLoading(false);
      handleShowPurchasings();
    } catch (err) {
      setIsLoading(false);
      alert("Erro ao deletar");
    }
  };

  const ToFormUpdatePurchasing = (data) => {
    setPurchasingsUpdate(data);
  };

  useEffect(() => {
    const newFilteredPurchasings =
      Purchasings?.filter((Purchasing) => {
        console.log(Purchasing.status);
        const matchesStatus =
          (showAtivos && Purchasing.status === "ativo") ||
          (showInativos && Purchasing.status === "inativo");
        const matchesSearch = Purchasing.fullName
          .toLowerCase()
          .includes(searchPurchasings.toLowerCase());
        return matchesStatus && matchesSearch;
      }) || [];

    setFilteredPurchasings(newFilteredPurchasings);
    setContPurchasingPages(
      Math.ceil(newFilteredPurchasings.length / maxPurchasingsPerList)
    );
  }, [Purchasings, showAtivos, showInativos, searchPurchasings]);

  return (
    <>
      {isLoading && <LoadingSpin />}
      <FormNewPurchasing dataPurchasing={PurchasingUpdate} />
      <div className="contentListPurchasings">
        <div className="ListPurchasings">
          <div className="headerListPurchasings">
            <div className="title">
              <FaCoins size={65} className="userIcon"/>
              <h3>Lista de Pedidos de Compras</h3>
            </div>
            <section>
              <label className="searchPurchasing">
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  required
                  onChange={(e) => setsearchPurchasings(e.target.value)}
                />
                <a>
                  <BiSearch size={35} />
                </a>
              </label>
            </section>
          </div>
          <hr />

          <div className="ListPurchasingsTable">
            <table>
              <thead>
                <tr>
                  <th className="formatH4">N.º Pedido</th>
                  <th className="formatH4">Produto</th>
                  <th className="formatH4">Status</th>
                  <th className="formatH4">Data/prevista</th>
                  <th className="formatH4">Data/entrega</th>
                  <th className="formatH4"></th>
                </tr>
              </thead>

              <tbody>
                <ModalYesOrNot
                  show={showModal}
                  title="Deletar Compra do insulmo?"
                  deleteItem={PurchasingeNameShow}
                  onConfirm={() => {
                    window.handleModalConfirm(true);
                    setShowModal(false);
                  }}
                  onClose={() => {
                    window.handleModalConfirm(false);
                    setShowModal(false);
                  }}
                />

                <PageOfListPurchasings
                  Purchasings={filteredPurchasings}
                  onEdit={ToFormUpdatePurchasing}
                  onDelete={deletePurchasing}
                  maxPurchasingsPerList={maxPurchasingsPerList}
                  listPurchasingsPageSelected={listPurchasingsPageSelected}
                />
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <NavigationListPurchasings
              contPurchasingPages={contPurchasingPages}
              setListPurchasingsPage={setListPurchasingsPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListPurchasings;
