export default function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1,2,3,4,5].map((n) => (
        <span
          key={n}
          onClick={() => onChange(n)}
          style={{
            cursor: "pointer",
            fontSize: 20,
            color: n <= value ? "#f28c28" : "#ccc",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
