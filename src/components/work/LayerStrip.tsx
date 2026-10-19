import { LAYERS, type Layer } from "../room/work";

const summary = (owned: Layer[]) => {
  const idx = owned.map((l) => LAYERS.indexOf(l)).sort((a, b) => a - b);
  if (idx.length === LAYERS.length) return "All five layers";
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  return contiguous && idx.length > 2 ? `${LAYERS[idx[0]]} → ${LAYERS[idx[idx.length - 1]]}` : idx.map((i) => LAYERS[i]).join(", ");
};

export default function LayerStrip({ owned, size = "sm" }: { owned: Layer[]; size?: "sm" | "lg" }) {
  return (
    <div className={"layers " + size}>
      <ol aria-hidden={size === "sm"}>
        {LAYERS.map((l) => (
          <li key={l} className={owned.includes(l) ? "on" : undefined} title={l}>
            <i />
            {size === "lg" && <span>{l}</span>}
          </li>
        ))}
      </ol>
      {size === "sm" && <p><span>Owned</span>{summary(owned)}</p>}
    </div>
  );
}
