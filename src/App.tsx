import { useState } from "react";
import Checkout from "./pages/Checkout";
import Items from "./pages/Items";
import Recap from "./pages/Recap";

type Tab = "checkout" | "items" | "recap";

function App() {
  const [tab, setTab] = useState<Tab>("checkout");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Content */}
      <div style={{ flex: 1, padding: 16 }}>
        {tab === "checkout" && <Checkout />}
        {tab === "items" && <Items />}
        {tab === "recap" && <Recap />}
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ccc",
        }}
      >
        <NavButton label="Checkout" active={tab === "checkout"} onClick={() => setTab("checkout")} />
        <NavButton label="Items" active={tab === "items"} onClick={() => setTab("items")} />
        <NavButton label="Recap" active={tab === "recap"} onClick={() => setTab("recap")} />
      </div>
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: "18px 0",
        fontSize: 18,
        fontWeight: 600,
        background: active ? "#2563eb" : "#1f2933",
        color: "white",
        border: "none",
      }}
    >
      {label}
    </button>
  );
}


export default App;
