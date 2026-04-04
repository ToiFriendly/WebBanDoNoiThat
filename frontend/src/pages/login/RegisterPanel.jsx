import { inputClassName, primaryButtonClassName } from "./authContent";

export default function RegisterPanel({
  registerForm,
  updateForm,
  onSubmit,
  onSwitchToLogin,
  loading,
}) {
  return (
    <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
      <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(145deg,#fffaf5_0%,rgba(245,235,222,0.82)_100%)] px-5 py-6 md:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.9rem]">
          Tao tai khoan moi
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
          Bat dau nhanh gon
        </h3>
        <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-base">
          <p>Dien thong tin can thiet de tao tai khoan va luu bo suu tap cua ban.</p>
          <p>Sau khi hoan tat, ban co the quay lai dang nhap ngay tren cung panel.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
          Ten nguoi dung
          <input
            className={inputClassName()}
            value={registerForm.username}
            onChange={(event) => updateForm("username", event.target.value)}
            placeholder="Username"
            required
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
          Email
          <input
            className={inputClassName()}
            type="email"
            value={registerForm.email}
            onChange={(event) => updateForm("email", event.target.value)}
            placeholder="Dia chi email cua ban"
            required
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
        Mat khau
        <input
          className={inputClassName()}
          type="password"
          value={registerForm.password}
          onChange={(event) => updateForm("password", event.target.value)}
          placeholder="Mat khau toi thieu 6 ky tu"
          required
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
          Ho va ten
          <input
            className={inputClassName()}
            value={registerForm.fullName}
            onChange={(event) => updateForm("fullName", event.target.value)}
            placeholder="Ho ten day du"
          />
        </label>

        <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
          So dien thoai
          <input
            className={inputClassName()}
            value={registerForm.phone}
            onChange={(event) => updateForm("phone", event.target.value)}
            placeholder="So dien thoai lien he"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a5b47]">
        <span>Tao tai khoan de luu san pham yeu thich va thong tin mua sam.</span>
        <button
          type="button"
          className="font-bold text-[#8c5f3f] transition hover:text-[#734d36]"
          onClick={onSwitchToLogin}
        >
          Da co tai khoan?
        </button>
      </div>

      <button
        type="button"
        className="w-fit text-left text-sm font-bold text-[#8c5f3f] transition hover:text-[#734d36]"
        onClick={onSwitchToLogin}
      >
        Quay lai dang nhap
      </button>

      <button
        className={primaryButtonClassName()}
        type="submit"
        disabled={loading}
      >
        {loading ? "Dang xu ly..." : "Tham gia ngay"}
      </button>
    </form>
  );
}
