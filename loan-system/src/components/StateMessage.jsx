export default function StateMessage({ type = "empty", title, message }) {
  const isLoading = type === "loading";

  return (
    <div className={`state-message state-message-${type}`} style={isLoading ? styles.loading : undefined}>
      {!isLoading && <strong>{title}</strong>}
      {message && <span>{message}</span>}
    </div>
  );
}

const styles = {
  loading: {
    minHeight: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
};
