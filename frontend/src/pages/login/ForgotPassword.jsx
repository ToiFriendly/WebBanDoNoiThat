import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthHero from "./AuthHero";
import {
  heroContentByMode,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName
} from "./authContent";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const requestInitialState = {
  email: ""
};

const resetInitialState = {
  otp: "",
  password: "",
  confirmPassword: ""
};

function stepClassName(active, done) {
  if (active) {
    return "bg-[#2f241f] text-[#fff8f2] shadow-[0_10px_24px_rgba(47,36,31,0.12)]";
  }

  if (done) {
    return "bg-[#f3e5d7] text-[#6a544a]";
  }

  return "bg-transparent text-[#7a5b47]";
}

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [requestForm, setRequestForm] = useState(requestInitialState);
  const [resetForm, setResetForm] = useState(resetInitialState);
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [requestMeta, setRequestMeta] = useState(null);

  function updateRequestForm(field, value) {
    setRequestForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  function updateResetForm(field, value) {
    setResetForm((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleRequestOtp(event) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password/request`,
        requestForm
      );

      setRequestMeta(data);
      setStep("reset");
      setResetForm(resetInitialState);
      setFeedback(
        `OTP da duoc gui den ${data.maskedEmail}. Vui long nhap ma va dat lai mat khau moi.`
      );
    } catch (error) {
      setFeedback(
        error.response?.data?.message ||
          "Khong the gui OTP dat lai mat khau."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (resetForm.password !== resetForm.confirmPassword) {
      setFeedback("Mat khau xac nhan khong khop.");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password/reset`,
        {
          email: requestMeta?.email || requestForm.email,
          otp: resetForm.otp,
          password: resetForm.password
        }
      );

      setStep("success");
      setFeedback(data.message || "Dat lai mat khau thanh cong.");
      setResetForm(resetInitialState);
    } catch (error) {
      setFeedback(
        error.response?.data?.message || "Khong the dat lai mat khau."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!requestMeta?.email && !requestForm.email) {
      setFeedback("Khong tim thay email de gui lai OTP.");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password/request`,
        {
          email: requestMeta?.email || requestForm.email
        }
      );

      setRequestMeta(data);
      setFeedback(`Da gui lai OTP den ${data.maskedEmail}.`);
    } catch (error) {
      setFeedback(
        error.response?.data?.message || "Khong the gui lai OTP."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,192,106,0.34),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(161,98,7,0.1),transparent_28%),linear-gradient(135deg,#f6efe4_0%,#efe4d3_42%,#f9f5ee_100%)] px-4 py-6 text-[#2f241f] md:px-8 md:py-8">
      <div className="mx-auto grid max-w-[1320px] gap-6 xl:min-h-[calc(100vh-4rem)] xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,540px)] xl:items-center">
        <AuthHero content={heroContentByMode.forgot} />

        <section className="relative rounded-[32px] border border-[#d8c4ae] bg-[rgba(255,252,247,0.86)] p-5 shadow-[0_24px_80px_rgba(76,51,36,0.12)] backdrop-blur md:p-7">
          <div className="pointer-events-none absolute inset-x-10 top-14 h-36 rounded-full bg-[rgba(216,123,56,0.06)] blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.92rem]">
                  Quen mat khau
                </p>
                <h2 className="mt-3 text-3xl leading-none font-semibold text-[#2f241f] md:text-[2.8rem]">
                  Dat lai tai khoan
                </h2>
              </div>

              <button
                type="button"
                className="rounded-full border border-[#d8c4ae] bg-white/76 px-5 py-3 text-sm font-bold text-[#6a544a] transition hover:-translate-y-0.5 md:text-base"
                onClick={() => navigate("/login")}
              >
                Quay lai dang nhap
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 rounded-full bg-[#f2e7d7] p-1.5">
              <div
                className={`rounded-full px-4 py-3 text-center text-sm font-bold md:text-base ${stepClassName(
                  step === "request",
                  step === "reset" || step === "success"
                )}`}
              >
                Email
              </div>
              <div
                className={`rounded-full px-4 py-3 text-center text-sm font-bold md:text-base ${stepClassName(
                  step === "reset",
                  step === "success"
                )}`}
              >
                OTP
              </div>
              <div
                className={`rounded-full px-4 py-3 text-center text-sm font-bold md:text-base ${stepClassName(
                  step === "success",
                  false
                )}`}
              >
                Hoan tat
              </div>
            </div>

            {step === "request" ? (
              <form className="mt-6 grid gap-5" onSubmit={handleRequestOtp}>
                <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(145deg,#fffaf5_0%,rgba(245,235,222,0.82)_100%)] px-5 py-6 md:px-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.9rem]">
                    Nhan OTP qua email
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
                    Xac minh yeu cau dat lai
                  </h3>
                  <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-base">
                    <p>Nhap email dang ky tai khoan de nhan ma OTP dat lai mat khau.</p>
                    <p>Ma se duoc gui den hop thu va co hieu luc trong vai phut.</p>
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
                  Email tai khoan
                  <input
                    className={inputClassName()}
                    type="email"
                    value={requestForm.email}
                    onChange={(event) =>
                      updateRequestForm("email", event.target.value)
                    }
                    placeholder="Nhap email da dang ky"
                    required
                  />
                </label>

                <button
                  className={primaryButtonClassName()}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Dang gui OTP..." : "Gui OTP"}
                </button>
              </form>
            ) : step === "reset" ? (
              <form className="mt-6 grid gap-5" onSubmit={handleResetPassword}>
                <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(145deg,#fffaf5_0%,rgba(245,235,222,0.82)_100%)] px-5 py-6 md:px-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.9rem]">
                    Dat lai mat khau
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
                    Nhap OTP va mat khau moi
                  </h3>
                  <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-base">
                    <p>
                      OTP da duoc gui toi{" "}
                      <strong>{requestMeta?.maskedEmail || requestForm.email}</strong>.
                    </p>
                    <p>Nhap ma OTP, sau do dat lai mat khau moi de quay lai dang nhap.</p>
                  </div>
                </div>

                <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
                  Ma OTP
                  <input
                    className={inputClassName()}
                    inputMode="numeric"
                    maxLength={6}
                    value={resetForm.otp}
                    onChange={(event) =>
                      updateResetForm(
                        "otp",
                        event.target.value.replace(/\D/g, "")
                      )
                    }
                    placeholder="Nhap ma OTP gom 6 chu so"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
                  Mat khau moi
                  <input
                    className={inputClassName()}
                    type="password"
                    value={resetForm.password}
                    onChange={(event) =>
                      updateResetForm("password", event.target.value)
                    }
                    placeholder="Nhap mat khau moi"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-[#5f493d] md:text-base">
                  Xac nhan mat khau moi
                  <input
                    className={inputClassName()}
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(event) =>
                      updateResetForm("confirmPassword", event.target.value)
                    }
                    placeholder="Nhap lai mat khau moi"
                    required
                  />
                </label>

                <button
                  className={primaryButtonClassName()}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Dang cap nhat..." : "Dat lai mat khau"}
                </button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className={secondaryButtonClassName()}
                    onClick={handleResendOtp}
                    disabled={loading}
                  >
                    Gui lai OTP
                  </button>
                  <button
                    type="button"
                    className={secondaryButtonClassName()}
                    onClick={() => setStep("request")}
                    disabled={loading}
                  >
                    Doi email khac
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-6 grid gap-5">
                <div className="rounded-[24px] border border-[#d8c4ae] bg-[linear-gradient(145deg,#fffaf5_0%,rgba(245,235,222,0.82)_100%)] px-5 py-6 md:px-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.9rem]">
                    Hoan tat
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold text-[#2f241f] md:text-[2rem]">
                    Mat khau da duoc cap nhat
                  </h3>
                  <div className="mt-3 space-y-1 text-sm leading-7 text-[#6a544a] md:text-base">
                    <p>Ban co the quay lai dang nhap bang mat khau moi ngay bay gio.</p>
                    <p>Neu can, hay dang nhap lai bang email hoac username nhu binh thuong.</p>
                  </div>
                </div>

                <button
                  type="button"
                  className={primaryButtonClassName()}
                  onClick={() => navigate("/login")}
                >
                  Quay lai dang nhap
                </button>

                <button
                  type="button"
                  className={secondaryButtonClassName()}
                  onClick={() => {
                    setStep("request");
                    setRequestForm(requestInitialState);
                    setResetForm(resetInitialState);
                    setRequestMeta(null);
                    setFeedback("");
                  }}
                >
                  Tao yeu cau moi
                </button>
              </div>
            )}

            {feedback ? (
              <p className="mt-5 rounded-[22px] bg-[#f5ebde] px-5 py-4 text-sm leading-7 text-[#734d36] md:text-base">
                {feedback}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
