import "./ModalEmployee.css";

function ModalDetails({ show, onClose, content, title }) {
  if (!show) return null;
  let formatedRoles, formatedBDate;
  if (content) {
    formatedRoles = content.roles
      .map((role) => role.authority.replace("ROLE_", ""))
      .map((role) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
      .join(", ");

    formatedBDate = content.birthDate.split("-").reverse().join("/");
  }
  return (
    <div className="modalDetailsOverlayEmployee">
      <div className="modalDetailsContentEmployee">
        <div className="modalDetailsHeader">
          <h2>{title}</h2>
        </div>
        <div className="modalDetailsBodyEmployee">
          <div className="rowEmployee">
            <div className="first columnEmployee">
              <div className="label">Nome:</div>
              <div className="value">{content && content.fullName}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">E-mail:</div>
              <div className="value">{content && content.email}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="first columnEmployee">
              <div className="label">Data de nascimento:</div>
              <div className="value">{formatedBDate}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">Telefone:</div>
              <div className="value">{content && content.phoneNumber}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">CPF:</div>
              <div className="value">{content && content.cpf}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="first columnEmployee">
              <div className="label">CEP:</div>
              <div className="value">{content && content.zipCode}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">Cidade:</div>
              <div className="value">{content && content.city}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">Estado:</div>
              <div className="value">{content && content.state}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="firstSecond columnEmployee">
              <div className="label">Cargos:</div>
              <div className="value">{formatedRoles}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">Status:</div>
              <div className="value statusEmployee">
                {content && content.status.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalDetailsCloseButtonEmployee" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetails;
