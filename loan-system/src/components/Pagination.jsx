export default function Pagination({ totalItems, page, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const changePage = (nextPage) => onPageChange(Math.min(totalPages, Math.max(1, nextPage)));

  return (
    <div style={styles.pagination} className="responsive-pagination">
      <button style={{ ...styles.button, ...(page === 1 ? styles.disabled : {}) }} onClick={() => changePage(1)} disabled={page === 1} aria-label="Эхний хуудас">«</button>
      <button style={{ ...styles.button, ...(page === 1 ? styles.disabled : {}) }} onClick={() => changePage(page - 1)} disabled={page === 1} aria-label="Өмнөх хуудас">‹</button>
      <span style={styles.pageInfo}>{page} / {totalPages}</span>
      <button style={{ ...styles.button, ...(page === totalPages ? styles.disabled : {}) }} onClick={() => changePage(page + 1)} disabled={page === totalPages} aria-label="Дараах хуудас">›</button>
      <button style={{ ...styles.button, ...(page === totalPages ? styles.disabled : {}) }} onClick={() => changePage(totalPages)} disabled={page === totalPages} aria-label="Сүүлийн хуудас">»</button>
      <select style={styles.select} value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))} aria-label="Хуудсанд харуулах мөрийн тоо">
        {[10, 20, 50].map((size) => <option key={size} value={size}>{size} мөр</option>)}
      </select>
      <span style={styles.total}>Нийт {new Intl.NumberFormat("mn-MN").format(totalItems)}</span>
    </div>
  );
}

const styles = {
  pagination: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", marginTop: "12px", flexWrap: "wrap" },
  button: { width: "24px", height: "24px", border: "1px solid #e5e7eb", borderRadius: "7px", background: "#fff", color: "#6b7280", cursor: "pointer", fontSize: "16px", lineHeight: 1 },
  disabled: { background: "#fafafa", color: "#d1d5db", cursor: "not-allowed" },
  pageInfo: { minWidth: "42px", textAlign: "center", fontSize: "12px", color: "#6b7280" },
  select: { height: "24px", padding: "0 6px", border: "1px solid #e5e7eb", borderRadius: "7px", background: "#fff", color: "#111827", cursor: "pointer", fontSize: "12px", fontWeight: "700" },
  total: { marginLeft: "6px", color: "#6b7280", fontSize: "12px", whiteSpace: "nowrap" },
};
