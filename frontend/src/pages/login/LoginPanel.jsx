import { inputClassName, primaryButtonClassName } from "./authContent";

export default function LoginPanel({
  loginForm,
  updateForm,
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  forgotPasswordHint,
  loading,
  googleLoading,
  googleButtonReady,
  googleButtonRef,
  hasGoogleClientId,
}) {
  return (
    <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
      <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(145deg,#fffaf5_0%,rgba(245,235,222,0.82)_100%)] px-5 py-6 md:px-7">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.9rem]">
          Dang nhap nhanh
        </p>
        <h3 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
          Chao mung ban quay lai
        </h3>
        <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-base">
          <p>Dien email hoac username de tiep tuc phien mua sam cua ban.</p>
          <p>Neu can, ban van co the chon luong dang nhap bang Google o ben duoi.</p>
        </div>
      </div>

      <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
        Email hoac ten dang nhap
        <input
          className={inputClassName()}
          value={loginForm.emailOrUsername}
          onChange={(event) =>
            updateForm("emailOrUsername", event.target.value)
          }
          placeholder="Nhap email hoac username"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
        Mat khau
        <input
          className={inputClassName()}
          type="password"
          value={loginForm.password}
          onChange={(event) => updateForm("password", event.target.value)}
          placeholder="Nhap mat khau"
          required
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a5b47]">
        <span>Dang nhap bang email, username hoac Google.</span>
        <button
          type="button"
          className="font-bold text-[#8c5f3f] transition hover:text-[#734d36]"
          onClick={onForgotPassword}
        >
          Quen mat khau?
        </button>
      </div>

      {forgotPasswordHint ? (
        <div className="rounded-[18px] border border-[#eadbc7] bg-[#f8efe2] px-4 py-3 text-sm leading-7 text-[#7a5b47]">
          {forgotPasswordHint}
        </div>
      ) : null}

      <button
        type="button"
        className="w-fit text-left text-sm font-bold text-[#8c5f3f] transition hover:text-[#734d36]"
        onClick={onSwitchToRegister}
      >
        Chua co tai khoan? Tao tai khoan moi
      </button>

      <button
        className={primaryButtonClassName()}
        type="submit"
        disabled={loading}
      >
        {loading ? "Dang xu ly..." : "Dang nhap ngay"}
      </button>

      <div className="flex items-center gap-4 text-xs text-[#866b5b] md:text-sm">
        <span className="h-px flex-1 bg-[#d8c4ae]" />
        <span>hoac tiep tuc voi Google</span>
        <span className="h-px flex-1 bg-[#d8c4ae]" />
      </div>

      {hasGoogleClientId ? (
        <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(180deg,#fffaf5_0%,#f8eee1_100%)] px-4 py-5 md:px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#8c5f3f]">
            Google Sign-In
          </p>

          <div className="mt-4 rounded-[18px] border border-dashed border-[#d8c4ae] bg-white/65 px-4 py-5">
            <div className="mx-auto flex w-full max-w-[360px] justify-center">
              <div
                ref={googleButtonRef}
                className="flex min-h-[44px] w-full justify-center"
              />
            </div>
          </div>

          {!googleButtonReady ? (
            <div className="mx-auto mt-4 flex h-11 w-full max-w-[320px] items-center justify-center rounded-full border border-[#d8c4ae] bg-white text-sm font-semibold text-[#2f241f]">
              Dang tai Google Sign-In...
            </div>
          ) : null}

          {googleLoading ? (
            <p className="mt-4 text-center text-sm text-[#7a5b47]">
              Dang gui OTP den email cua ban...
            </p>
          ) : null}
        </div>
      ) : (
        <p className="rounded-[20px] bg-[#fff6ea] px-4 py-4 text-sm text-[#734d36]">
          Chua tim thay VITE_GOOGLE_CLIENT_ID de hien thi dang nhap Google.
        </p>
      )}
    </form>
  );
}
