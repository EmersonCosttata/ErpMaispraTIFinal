import "./ModalYesOrNot.css";

function ModalYesOrNot({ show, onClose, title, deleteItem, onConfirm }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        <div className="modal-body">
          <h6>{`Confirma Exclusão de ${deleteItem}?`}</h6>
        </div>
        <div className="modal-footer">
          <button className="confirm-button" onClick={onConfirm}>
            Sim
          </button>
          <button className="cancel-button" onClick={onClose}>
            Não
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalYesOrNot;
