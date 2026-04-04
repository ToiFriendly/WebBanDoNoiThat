function tabClassName(active) {
  return `rounded-full px-4 py-3 text-sm font-bold transition md:px-5 md:text-base ${
    active
      ? "bg-[#2f241f] text-[#fff8f2] shadow-[0_10px_24px_rgba(47,36,31,0.12)]"
      : "bg-transparent text-[#7a5b47] hover:-translate-y-0.5"
  }`;
}

export default function AuthTabs({ mode, onChange }) {
  const activeMode = mode === "register" ? "register" : "login";

  return (
    <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-[#f2e7d7] p-1.5">
      <button
        type="button"
        className={tabClassName(activeMode === "login")}
        onClick={() => onChange("login")}
      >
        Dang nhap
      </button>
      <button
        type="button"
        className={tabClassName(activeMode === "register")}
        onClick={() => onChange("register")}
      >
        Dang ky
      </button>
    </div>
  );
}
