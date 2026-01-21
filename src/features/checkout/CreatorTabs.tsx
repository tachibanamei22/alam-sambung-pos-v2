type Props = {
  creators: string[];
  active: string;
  onChange: (creator: string) => void;
};

export default function CreatorTabs({ creators, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {["All", ...creators].map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-4 py-2 rounded-lg whitespace-nowrap ${
            active === c ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
