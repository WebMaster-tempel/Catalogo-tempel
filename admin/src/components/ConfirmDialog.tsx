interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-danger" onClick={onConfirm}>Eliminar</button>
          <button className="btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
