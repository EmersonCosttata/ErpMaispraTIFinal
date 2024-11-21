import "./ModalProduct.css";

function ModalProduct({ show, onClose, content, title }) {
  if (!show) return null;

  const formatarReal = (valor) => {
    const formatado = (valor / 1).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatado;
  };

  return (
    <div className="modalDetailsOverlaySale">
      <div className="modalDetailsContentSale">
        <div className="modalDetailsHeader">
          <h2>{title}</h2>
        </div>
        <div className="modalDetailsBodySale">
          <div className="rowSale">
            <div className="first columnSale">
              <div className="label">Nome:</div>
              <div className="value">{content?.name}</div>
            </div>
            <div className="second columnSale">
              <div className="label">Codigo Produto</div>
              <div className="value">{content?.supplierCode}</div>
            </div>
            <div className="third columnSale">
              <div className="label">Preço:</div>
              <div className="value">{content?.productPrice && `R$ ${formatarReal(content.productPrice)}`}</div>
            </div>
          </div>
          <div className="rowSale">
            <div className="first columnSale">
              <div className="label">Medida:</div>
              <div className="value">{content?.unitOfMeasure?.toUpperCase()}</div>
            </div>
            <div className="second columnSale">
              <div className="label">Estoque:</div>
              <div className="value">
                Total: {content?.stock} Reservados: {content?.reservedStock}
              </div>
            </div>
            <div className="third columnSale">
              <div className="label">Fornecedor:</div>
              <div className="value">{content?.suppliers[0]?.fullName}</div>
            </div>
          </div>
          <div className="rowSale">
            <div className="first columnSale">
              <div className="label">Descrição:</div>
              <div className="value">{content?.description}</div>
            </div>
          </div>
        </div>

        <div className="modalFooter">
          <button className="modalDetailsCloseButtonSale" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalProduct;
