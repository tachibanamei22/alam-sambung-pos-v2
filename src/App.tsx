import { useState } from "react";
import CheckoutV2 from "./pages/CheckoutV2";
import Items from "./pages/Items";
import Recap from "./pages/Recap";

type Tab = "checkout" | "items" | "recap";

function App() {
  const [tab, setTab] = useState<Tab>("checkout");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "checkout" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <CheckoutV2 />
          </div>
        )}
        {tab === "items" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <Items />
          </div>
        )}
        {tab === "recap" && (
          <div style={{ height: "100%", overflow: "auto" }}>
            <Recap />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: "flex", borderTop: "1px solid #1f2937" }}>
        <NavButton
          label="Checkout"
          active={tab === "checkout"}
          onClick={() => setTab("checkout")}
        />
        <NavButton
          label="Items"
          active={tab === "items"}
          onClick={() => setTab("items")}
        />
        <NavButton
          label="Recap"
          active={tab === "recap"}
          onClick={() => setTab("recap")}
        />
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
        background: active ? "#2563eb" : "#020617",
        color: "white",
        border: "none",
      }}
    >
      {label}
    </button>
  );
}

export default App;
