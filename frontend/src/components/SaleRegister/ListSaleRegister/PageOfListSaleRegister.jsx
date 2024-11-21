import { BiEdit } from "react-icons/bi";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import ModalDetails from "../ModalSale/ModalSale";
import { BiDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModalDelivery from "../ModalDelivery/ModalDelivery";
function PageOfListSaleRegisters({
  SaleRegisters,
  onEdit,
  onDelete,
  maxSaleRegistersPerList,
  listSaleRegistersPageSelected,
}) {
  const [showModalDetails, setshowModalDetails] = useState(false);
  const [showModalDelivery, setshowModalDelivery] = useState(false);
  const [selectedsaleRegister, setSelectedsaleRegister] = useState("");
  let SaleRegistersToList = ["2"];

  function formatarDataBR(dataString) {
    if (dataString) {
      const data = new Date(dataString);
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0"); 
      const ano = data.getFullYear();
      const horas = String(data.getHours()).padStart(2, "0");
      return `${dia}/${mes}/${ano}`;
    } else {
      return null;
    }
  }

  // for (
  //   let i = (listSaleRegistersPageSelected - 1) * maxSaleRegistersPerList;
  //   i < listSaleRegistersPageSelected * maxSaleRegistersPerList;
  //   i++
  // ) {
  //   if (SaleRegisters[i]) {
  //     SaleRegistersToList.push(SaleRegisters[i]);
  //   }
  // }

  return (
    <>
      <ModalDetails
        show={showModalDetails}
        onClose={() => setshowModalDetails(false)}
        content={selectedsaleRegister}
        title="Detalhes Registro da Venda"
      ></ModalDetails>


      <ModalDelivery 
       show={showModalDelivery}
       onClose={() => setshowModalDelivery(false)}
       content={selectedsaleRegister}
      />

      {SaleRegisters &&
        SaleRegisters.map((saleRegister) => (
          <tr key={saleRegister.id}>
            <td className="td-fullName">{saleRegister.saleNumber}</td>
            <td className="td-email">{saleRegister.client.fullName}</td>
            <td className="td-phoneNumber">
              {saleRegister.saleStatus.toUpperCase()}
            </td>
            <td className="td-cpfCnpj">
              {formatarDataBR(saleRegister.saleDate)}
            </td>
            <td className="td-cpfCnpj">
              {saleRegister.saleDelivery ? formatarDataBR(saleRegister.saleDelivery) : "Aguardando Entrega"}
            </td>
            <td className="td-editLine"> 
              {saleRegister.saleStatus ? <Link onClick={() => { setSelectedsaleRegister(saleRegister);  setshowModalDelivery(true)}}>
              <CiDeliveryTruck  className="DeliveryLine" size={30} />
              </Link> : ''}
              <Link onClick={() => { setSelectedsaleRegister(saleRegister);  setshowModalDetails(true);  }}>
                <BiDetail className="editLine" size={30} />
              </Link>
              <a href="#" onClick={() => onEdit(saleRegister)}>
                <BiEdit className="editLine" size={30} />
              </a>
              <Link onClick={() => onDelete(saleRegister)}>
                <MdDeleteOutline className="deleteLine" size={30} />
              </Link>
             
            </td>
          </tr>
        ))}
    </>
  );
}
export default PageOfListSaleRegisters;
