import { BiSolidUser } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";
import { FaBoxes } from "react-icons/fa";
import ModalYesOrNot from "../../ModalYesOrNot/ModalYesOrNot.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext.jsx";
import "./ListProduct.css";
import FormNewProduct from "../FormNewProduct/FormNewProduct.jsx";
import NavigationListProduct from "./NavigationListProduct.jsx";
import PageOfListProduct from "./PageOfListProduct.jsx";
import LoadingSpin from "../../LoadingSpin/LoadingSpin.jsx";

const ListProduct = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { JwtToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [productUpdate, setProductUpdate] = useState(null);
  const [searchProducts, setSearchProducts] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [productNameShow, setProductNameShow] = useState();

  const [listProductsPageSelected, setListProductsPage] = useState(1);
  const handleShowProducts = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/api/produtos`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      setProducts(response.data.content);
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      alert("Erro ao puxar produtos!");
    }
  };

  useEffect(() => {
    handleShowProducts();
  }, []);

  const deleteProduct = async (product) => {
    console.log(product.id)
    setProductNameShow(product.name);
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
      await axios.delete(`${apiUrl}/api/produtos/${product.id}`, {
        headers: {
          Authorization: `Bearer ${JwtToken}`,
        },
      });
      handleShowProducts(); 
    } catch (err) {
      console.error("Erro ao deletar produtos:", err);
      alert("Erro ao deletar produtos");
    } finally {
      setIsLoading(false); 
    }
  };

  const ToFormUpdateProduct = (data) => {
    setProductUpdate(data);
  };

  const filteredProducts =
    products?.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchProducts.toLowerCase()); 
      return matchesSearch;
    }) || [];

  const maxProductsPerList = 9;
  let contProductPages = Math.ceil(
    filteredProducts.length / maxProductsPerList
  );

  return (
    <>
      {isLoading && <LoadingSpin />}
      <FormNewProduct dataProduct={productUpdate} onSubmitSuccess={handleShowProducts}/>
      <div className="contentListProducts">
        <div className="ListProducts">
          <div className="headerListProducts">
            <div className="title">

              <BiSolidUser className="userIcon" size={75} />
              <h3>Lista de Produtos </h3>
            </div>

            <section>
              <label className="searchProduct">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  required
                  onChange={(e) => setSearchProducts(e.target.value)}
                />
                <a>
                  <BiSearch size={35} />
                </a>
              </label>
            </section>
          </div>
          <hr />

          <div className="ListProductsTable">
            <table>
              <thead>
                <tr>
                  <th className="formatH4">Nome</th>
                  <th className="formatH4">Estoque</th>
                  <th className="formatH4">Preço</th>
                </tr>
              </thead>

              <tbody>
                <ModalYesOrNot
                  show={showModal}
                  title="Deletar Produto?"
                  deleteItem={productNameShow}
                  onConfirm={() => {
                    window.handleModalConfirm(true);
                    setShowModal(false);
                  }}
                  onClose={() => {
                    window.handleModalConfirm(false);
                    setShowModal(false);
                  }}
                />

                <PageOfListProduct
                  products={filteredProducts}
                  onEdit={ToFormUpdateProduct}
                  onDelete={deleteProduct}
                  maxProductsPerList={maxProductsPerList}
                  listProductsPageSelected={listProductsPageSelected}
                />
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <NavigationListProduct
              contProductPages={contProductPages}
              setListProductsPage={setListProductsPage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ListProduct;
