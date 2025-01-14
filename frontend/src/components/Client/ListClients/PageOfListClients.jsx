import { BiEdit, BiAt, BiPhone, BiFileBlank } from "react-icons/bi";

import { MdDeleteOutline } from "react-icons/md";
import ModalDetails from "../ModalClient/ModalClient.jsx";
import { BiDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState } from "react";
function PageOfListClients({
  clients,
  onEdit,
  onDelete,
  maxClientsPerList,
  listClientsPageSelected,
  onlyView
}) {
  const [showModalDetails, setshowModalDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  let clientsToList = [];

  for (
    let i = (listClientsPageSelected - 1) * maxClientsPerList;
    i < listClientsPageSelected * maxClientsPerList;
    i++
  ) {
    if (clients[i]) {
      clientsToList.push(clients[i]);
    }
  }

  return (
    <>
      <ModalDetails
        show={showModalDetails}
        onClose={() => setshowModalDetails(false)}
        content={selectedClient}
        title="Detalhes Cliente"> </ModalDetails>

      {clientsToList.map((client) => (
        <tr key={client.id}>
          <td className="td-fullName">{client.fullName}</td>
          <td className="td-email">
            <BiAt className="td-icon" size={16} />
            {client.email}
          </td>
          <td className="td-phoneNumber">
            <BiPhone className="td-icon" size={16} />
            {client.phoneNumber}
          </td>
          <td className="td-cpfCnpj">
            <BiFileBlank className="td-icon-2" size={16} />
            {client.cpfCnpj}
          </td>

            {onlyView ? "" : (
              
              <td className="td-editLine">
                <Link
                  onClick={() => {
                    setSelectedClient(client);
                    setshowModalDetails(true);
                  }}
                >
                  <BiDetail className="editLine" size={30} />
                </Link>
                <a href="#" onClick={() => onEdit(client)}>
                  <BiEdit className="editLine" size={30} />
                </a>
                <Link onClick={() => onDelete(client)}>
                  <MdDeleteOutline className="deleteLine" size={30} />
                </Link>
              </td> 
              
            )}
        </tr>
      ))}
    </>
  );
}
export default PageOfListClients;
