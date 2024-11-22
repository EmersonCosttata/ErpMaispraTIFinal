import "./ModalSupplier.css";

function ModalDetails({ show, onClose, content, title }) {
  if (!show) return null;
  console.log(content);

  return (
    <div className="modalDetailsOverlaySupplier">
      <div className="modalDetailsContentSupplier">
        <div className="modalDetailsHeader">
          <h2>{title}</h2>
        </div>
        <div className="modalDetailsBodySupplier">
          <div className="rowSupplier">
            <div className="first columnSupplier">
              <div className="label">Nome:</div>
              <div className="value">{content && content.fullName}</div>
            </div>
            <div className="second columnSupplier">
              <div className="label">E-mail:</div>
              <div className="value">{content && content.email}</div>
            </div>
          </div>

          <div className="rowSupplier">
            <div className="first columnSupplier">
              <div className="label">Telefone:</div>
              <div className="value">{content && content.phoneNumber}</div>
            </div>
            <div className="second columnClient">
              <div className="label">
                {content && content.typePfOrPj === "PJ" ? "CNPJ:" : "CPF:"}
              </div>
              <div className="value">{content && content.cpfCnpj}</div>
            </div>
            {content && content.typePfOrPj === "PJ" && (
              <div className="third columnClient">
                <div className="label">Inscrição Estadual:</div>
                <div className="value">
                  {content && content.stateRegistration}
                </div>
              </div>
            )}
          </div>

          <div className="rowSupplier">
            <div className="first columnSupplier">
              <div className="label">CEP:</div>
              <div className="value">{content && content.zipCode}</div>
            </div>
            <div className="second columnSupplier">
              <div className="label">Cidade:</div>
              <div className="value">{content && content.city}</div>
            </div>
            <div className="third columnSupplier">
              <div className="label">Estado:</div>
              <div className="value">{content && content.state}</div>
            </div>
          </div>
          <div className="rowSupplier">
            <div className="first columnSupplier">
              <div className="label">Rua:</div>
              <div className="value">{content && content.address}</div>
            </div>
            <div className="second columnSupplier">
              <div className="label">Bairro:</div>
              <div className="value">{content && content.district}</div>
            </div>
            <div className="third columnSupplier">
              <div className="label">Numero:</div>
              <div className="value">{content && content.number}</div>
            </div>
          </div>

          <div className="rowSupplier">
            <div className="firstSecond columnClient">
              <div className="label">Notas:</div>
              <div className="value">{content && content.notes}</div>
            </div>
            <div className="firstSecond columnClient">
              <div className="label">Pais:</div>
              <div className="value">{content && content.country}</div>
            </div>
            <div className="third columnSupplier">
              <div className="label">Status:</div>
              <div className="value statusSupplier">
                {content && content.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalDetailsCloseButtonSupplier" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetails;
