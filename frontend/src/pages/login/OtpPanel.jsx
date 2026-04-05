import {
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
} from "./authContent";

export default function OtpPanel({
  googleChallenge,
  otpForm,
  updateForm,
  onSubmit,
  onResendOtp,
  loading,
  googleLoading,
}) {
  return (
    <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
      <div className="rounded-[24px] border border-[#d8c4ae] bg-[#fff6ea] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f]">
          Dang nhap Google
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
          Nhap ma OTP
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#6a544a] md:text-base">
          Chung toi da gui ma xac minh toi{" "}
          <strong>{googleChallenge?.email || "email cua ban"}</strong>. Ban chi
          dang nhap thanh cong sau khi OTP dung.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-semibold text-[#5f493d]">
        Ma OTP
        <input
          className={inputClassName()}
          inputMode="numeric"
          maxLength={6}
          value={otpForm.code}
          onChange={(event) =>
            updateForm("code", event.target.value.replace(/\D/g, ""))
          }
          placeholder="Nhap ma OTP gom 6 chu so"
          required
        />
      </label>

      <button
        className={primaryButtonClassName()}
        type="submit"
        disabled={loading}
      >
        {loading ? "Dang xac minh..." : "Xac minh va dang nhap"}
      </button>

      <button
        type="button"
        className={secondaryButtonClassName()}
        onClick={onResendOtp}
        disabled={googleLoading}
      >
        {googleLoading ? "Dang gui lai OTP..." : "Gui lai OTP"}
      </button>
    </form>
  );
}
