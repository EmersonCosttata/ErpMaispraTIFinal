import "./ModalClient.css";

function ModalDetails({ show, onClose, content, title }) {
  if (!show) return null;
  let formatedBDate;
  if (content) {
    formatedBDate = content.birthDate.split("-").reverse().join("/");
  }

  const formatarReal = (valor) => {
    const formatado = (valor / 1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatado;
}
  return (
    <div className="modalDetailsOverlayClient">
      <div className="modalDetailsContentClient">
        <div className="modalDetailsHeader">
          <h2>{title}</h2>
        </div>

        <div className="modalDetailsBodyClient">
          <div className="rowClient">
            <div className="first columnClient">
              <div className="label">Nome:</div>
              <div className="value">{content && content.fullName}</div>
            </div>
            <div className="second columnClient">
              <div className="label">E-mail:</div>
              <div className="value">{content && content.email}</div>
            </div>
            <div className="third columnClient">
              <div className="label">Data de nascimento:</div>
              <div className="value">{content && formatedBDate}</div>
            </div>
          </div>

          <div className="rowClient">
            <div className="first columnClient">
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

          <div className="rowClient">
            <div className="first columnClient">
              <div className="label">CEP:</div>
              <div className="value">{content && content.zipCode}</div>
            </div>
            <div className="second columnClient">
              <div className="label">Cidade:</div>
              <div className="value">{content && content.city}</div>
            </div>
            <div className="third columnClient">
              <div className="label">Estado:</div>
              <div className="value">{content && content.state}</div>
            </div>
          </div>

          <div className="rowClient">
            <div className="firstSecond columnClient">
              <div className="label">Notas:</div>
              <div className="value">{content && content.notes}</div>
            </div>
            <div className="firstSecond columnClient">
              <div className="label">Limite de Credito:</div>
              <div className="value">R$ {content && formatarReal(content.creditLimit)}</div>
            </div>
            <div className="third columnClient">
              <div className="label">Status:</div>
              <div className="value statusClient">
                {content && content.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalDetailsCloseButtonClient" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetails;
