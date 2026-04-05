import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { API_BASE_URL, clearStoredSession, saveStoredSession } from "../../utils/storefront";
import AuthHero from "./AuthHero";
import AuthTabs from "./AuthTabs";
import LoginPanel from "./LoginPanel";
import OtpPanel from "./OtpPanel";
import RegisterPanel from "./RegisterPanel";
import {
  heroContentByMode,
  loginInitialState,
  otpInitialState,
  registerInitialState,
} from "./authContent";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function getRequestErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

function Login() {
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitialState);
  const [registerForm, setRegisterForm] = useState(registerInitialState);
  const [otpForm, setOtpForm] = useState(otpInitialState);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleButtonReady, setGoogleButtonReady] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [forgotPasswordHint, setForgotPasswordHint] = useState("");
  const [session, setSession] = useState(null);
  const [googleChallenge, setGoogleChallenge] = useState(null);
  const [googleCredential, setGoogleCredential] = useState("");

  const heroContent = heroContentByMode[mode] || heroContentByMode.login;

  function resetGoogleFlow(nextMode = "login") {
    setMode(nextMode);
    setGoogleChallenge(null);
    setGoogleCredential("");
    setOtpForm(otpInitialState);
    setForgotPasswordHint("");
  }

  function updateLoginForm(field, value) {
    setLoginForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateRegisterForm(field, value) {
    setRegisterForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateOtpForm(field, value) {
    setOtpForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginForm,
      );
      setSession(data);
      setFeedback("Dang nhap thanh cong! Chao mung ban quay tro lai.");
      saveStoredSession(data);
      setLoginForm(loginInitialState);
      resetGoogleFlow("login");
      navigate("/");
    } catch (error) {
      setFeedback(getRequestErrorMessage(error, "Dang nhap that bai. Vui long kiem tra lai."));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        registerForm,
      );
      setSession(data);
      setFeedback("Dang ky thanh cong! Hay bat dau mua sam ngay.");
      saveStoredSession(data);
      setRegisterForm(registerInitialState);
      resetGoogleFlow("login");
    } catch (error) {
      setFeedback(getRequestErrorMessage(error, "Dang ky that bai."));
    } finally {
      setLoading(false);
    }
  }

  async function requestGoogleOtp(credential, successMessage) {
    setGoogleLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/google/request-otp`,
        { credential },
      );

      setGoogleCredential(credential);
      setGoogleChallenge(data);
      setOtpForm(otpInitialState);
      setMode("otp");
      setFeedback(successMessage || data.message);
    } catch (error) {
      setFeedback(getRequestErrorMessage(error, "Khong the gui OTP tu dang nhap Google."));
    } finally {
      setGoogleLoading(false);
    }
  }

  const handleGoogleCredential = useEffectEvent(async (response) => {
    if (!response?.credential) {
      setFeedback("Khong nhan duoc thong tin dang nhap Google.");
      return;
    }

    await requestGoogleOtp(response.credential);
  });

  useEffect(() => {
    if (mode !== "login") {
      return undefined;
    }

    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) {
      return undefined;
    }

    let isMounted = true;
    let scriptNode = null;
    setGoogleButtonReady(false);

    function renderGoogleButton() {
      if (
        !isMounted ||
        !window.google?.accounts?.id ||
        !googleButtonRef.current
      ) {
        return;
      }

      const hostWidth =
        googleButtonRef.current.parentElement?.clientWidth ||
        googleButtonRef.current.clientWidth ||
        320;
      const buttonWidth = Math.max(260, Math.min(Math.floor(hostWidth), 360));

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        text: "signin_with",
        width: buttonWidth,
      });
      setGoogleButtonReady(true);
    }

    function handleLoad() {
      window.requestAnimationFrame(renderGoogleButton);
    }

    if (window.google?.accounts?.id) {
      handleLoad();
    } else {
      scriptNode = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );

      if (!scriptNode) {
        scriptNode = document.createElement("script");
        scriptNode.src = "https://accounts.google.com/gsi/client";
        scriptNode.async = true;
        scriptNode.defer = true;
        document.head.appendChild(scriptNode);
      }

      scriptNode.addEventListener("load", handleLoad);
    }

    window.addEventListener("resize", handleLoad);

    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleLoad);

      if (scriptNode) {
        scriptNode.removeEventListener("load", handleLoad);
      }
    };
  }, [mode]);

  async function handleVerifyOtp(event) {
    event.preventDefault();

    if (!googleChallenge?.challengeId) {
      setFeedback("Phien dang nhap Google da het. Vui long thu lai.");
      resetGoogleFlow("login");
      return;
    }

    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/auth/google/verify-otp`,
        {
          challengeId: googleChallenge.challengeId,
          otp: otpForm.code,
        },
      );

      setSession(data);
      setFeedback("Dang nhap Google thanh cong.");
      saveStoredSession(data);
      resetGoogleFlow("login");
      navigate("/");
    } catch (error) {

      setFeedback(error.response?.data?.message || "Khong the xac minh OTP.");

    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (!googleCredential) {
      setFeedback("Khong con du lieu dang nhap Google. Vui long thu lai.");
      resetGoogleFlow("login");
      return;
    }

    await requestGoogleOtp(googleCredential, "Da gui lai OTP moi.");
  }

  function handleLogout() {
    clearStoredSession();
    setSession(null);
    resetGoogleFlow("login");
    setFeedback("Ban da dang xuat.");
  }

  function handleForgotPassword() {
    setForgotPasswordHint(
      "Luong quen mat khau se duoc noi voi xac minh OTP qua email trong buoc tiep theo.",
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(250,192,106,0.34),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(161,98,7,0.1),transparent_28%),linear-gradient(135deg,#f6efe4_0%,#efe4d3_42%,#f9f5ee_100%)] px-4 py-6 text-[#2f241f] md:px-8 md:py-8">
      <div className="mx-auto grid max-w-[1320px] gap-6 xl:min-h-[calc(100vh-4rem)] xl:grid-cols-[minmax(0,1.1fr)_minmax(420px,540px)] xl:items-center">
        <AuthHero content={heroContent} />

        <section className="relative rounded-[32px] border border-[#d8c4ae] bg-[rgba(255,252,247,0.86)] p-5 shadow-[0_24px_80px_rgba(76,51,36,0.12)] backdrop-blur md:p-7">
          <div className="pointer-events-none absolute inset-x-10 top-14 h-36 rounded-full bg-[rgba(216,123,56,0.06)] blur-3xl" />

          <div className="relative">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8c5f3f] md:text-[0.92rem]">
                  Tai khoan
                </p>
                <h2 className="mt-3 text-3xl leading-none font-semibold text-[#2f241f] md:text-[2.8rem]">
                  {mode === "register"
                    ? "Dang ky"
                    : mode === "otp"
                      ? "Xac minh OTP"
                      : "Dang nhap"}
                </h2>
              </div>

              <button
                type="button"
                className="rounded-full border border-[#d8c4ae] bg-white/76 px-5 py-3 text-sm font-bold text-[#6a544a] transition hover:-translate-y-0.5 md:text-base"
                onClick={() => navigate("/")}
              >
                Ve trang chu
              </button>
            </div>

            <AuthTabs mode={mode} onChange={resetGoogleFlow} />

            {mode === "login" ? (
              <LoginPanel
                loginForm={loginForm}
                updateForm={updateLoginForm}
                onSubmit={handleLogin}
                onSwitchToRegister={() => resetGoogleFlow("register")}
                onForgotPassword={handleForgotPassword}
                forgotPasswordHint={forgotPasswordHint}
                loading={loading}
                googleLoading={googleLoading}
                googleButtonReady={googleButtonReady}
                googleButtonRef={googleButtonRef}
                hasGoogleClientId={Boolean(GOOGLE_CLIENT_ID)}
              />
            ) : mode === "otp" ? (
              <OtpPanel
                googleChallenge={googleChallenge}
                otpForm={otpForm}
                updateForm={updateOtpForm}
                onSubmit={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                loading={loading}
                googleLoading={googleLoading}
              />
            ) : (
              <RegisterPanel
                registerForm={registerForm}
                updateForm={updateRegisterForm}
                onSubmit={handleRegister}
                onSwitchToLogin={() => resetGoogleFlow("login")}
                loading={loading}
              />
            )}

            {feedback ? (
              <p className="mt-5 rounded-[22px] bg-[#f5ebde] px-5 py-4 text-sm leading-7 text-[#734d36] md:text-base">
                {feedback}
              </p>
            ) : null}

            {session?.user ? (
              <div className="mt-5 rounded-[24px] border border-[#d8c4ae] bg-[#fff6ea] p-6">
                <h2 className="text-2xl font-semibold text-[#2f241f]">
                  Chao mung, {session.user.username}!
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6a544a] md:text-base">
                  Cam on ban da ghe tham <strong>Tiem Do Trang Tri Noi That</strong>.
                </p>
                <p className="mt-2 text-sm leading-7 text-[#6a544a] md:text-base">
                  Hay bat dau lam moi khong gian cua ban ngay hom nay.
                </p>
                <button
                  type="button"
                  className="mt-5 rounded-[20px] bg-[#f3e5d7] px-5 py-4 font-bold text-[#5a4336] transition hover:-translate-y-0.5"
                  onClick={handleLogout}
                >
                  Dang xuat
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
