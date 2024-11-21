import "./ModalProduct.css";

function ModalDetails({ show, onClose, content, title }) {
  if (!show) return null;
  

      const formatarReal = (valor) => {
        const formatado = (valor / 1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        console.log(content.suppliers[0].fullName)
        return formatado;

        
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
              <div className="value">{content && content.name}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">Código do Fornecedor</div>
              <div className="value">{content && content.supplierCode}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="first columnEmployee">
              <div className="label">Unidade de Medida:</div>
              <div className="value">{content && content.unitOfMeasure}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">Preço:</div>
              <div className="value">{`R$ ${formatarReal(content.productPrice)}`}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">Estoque:</div>
              <div className="value">{content && content.stock}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="first columnEmployee">
              <div className="label">Estoque reservado:</div>
              <div className="value">{content && content.reservedStock}</div>
            </div>
            <div className="second columnEmployee">
              <div className="label">Estoque vindo:</div>
              <div className="value">{content && content.incomingStock}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">Nome do fornecedores:</div>
              <div className="value">{content && content.suppliers[0].fullName}</div>
            </div>
          </div>

          <div className="rowEmployee">
            <div className="firstSecond columnEmployee">
              <div className="label">Descrição:</div>
              <div className="value">{content && content.description}</div>
            </div>
            <div className="third columnEmployee">
              <div className="label">Disponíveis para venda:</div>
              <div className="value statusEmployee">
                {content && content.availableForSale}
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