export default function StateMessage({ type = "empty", title, message }) {
  return (
    <div className={`state-message state-message-${type}`}>
      <strong>{title}</strong>
      {message && <span>{message}</span>}
    </div>
  );
}
