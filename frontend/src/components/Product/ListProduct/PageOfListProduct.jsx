import { BiEdit, BiAt, BiPhone, BiFileBlank  } from "react-icons/bi";

import { MdDeleteOutline } from "react-icons/md";
import { BiDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModalProduct from "../ModalProduct/ModalProduct";
function PageOfListProducts({
  products,
  onEdit,
  onDelete,
  maxProductsPerList,
  listProductsPageSelected,
}) {
//   const formatarReal = (valor) => {
//     const formatado = (valor / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//     return formatado;
// }

  const [showModalDetails, setshowModalDetails] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState('');
console.log(products)
  let productsToList = [];

  for (
    let i = (listProductsPageSelected - 1) * maxProductsPerList;
    i < listProductsPageSelected * maxProductsPerList;
    i++
  ) {
    if (products[i]) {
      productsToList.push(products[i]);
    }
  }

  return (
    <>
      <ModalProduct
      show={showModalDetails}
      onClose={()=>setshowModalDetails(false)}
      content={selectedProduct}
      title={"Detalhes de "+selectedProduct.name}
      />

      {productsToList.map((products) => (
        <tr key={products.id}>
          <td className="td-fullName">{products.name}</td>
          <td className="td-price">{products.stock}</td>
          <td className="td-stock">R$ {products.productPrice}</td>

          <td className="td-editLine">
            <Link onClick={() => {
              setSelectedProduct(products)
              setshowModalDetails(true)
            }
            }>
              <BiDetail className="editLine" size={30} />
            </Link>
            <a href="#" onClick={() => onEdit(products)}>
              <BiEdit className="editLine" size={30} />
            </a>
            <Link onClick={() => onDelete(products)}>
              <MdDeleteOutline className="deleteLine" size={30} />
            </Link>

          </td>
        </tr>
      ))}
    </>
  );
}
export default PageOfListProducts;
