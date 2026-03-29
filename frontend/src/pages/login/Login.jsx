import { useState } from "react";
import axios from "axios";
import "../../App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const loginInitialState = {
  emailOrUsername: "",
  password: "",
};

const registerInitialState = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  phone: "",
};

function Login() {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(loginInitialState);
  const [registerForm, setRegisterForm] = useState(registerInitialState);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [session, setSession] = useState(null);

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
      setFeedback("Đăng nhập thành công! Chào mừng bạn quay trở lại.");
      localStorage.setItem("auth_demo_session", JSON.stringify(data));
      setLoginForm(loginInitialState);
    } catch (error) {
      setFeedback(error.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
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
      setFeedback("Đăng ký thành công! Hãy bắt đầu mua sắm ngay.");
      localStorage.setItem("auth_demo_session", JSON.stringify(data));
      setRegisterForm(registerInitialState);
    } catch (error) {
      setFeedback(error.response?.data?.message || "Đăng ký thất bại. Email hoặc Username có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(setter, field, value) {
    setter((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleLogout() {
    localStorage.removeItem("auth_demo_session");
    setSession(null);
    setFeedback("Bạn đã đăng xuất.");
  }

  return (
    <main className="auth-shell">
      <section className="auth-copy">
        <p className="eyebrow">Tiệm Đồ Trang Trí Nội Thất</p>
        <h1>Kiến tạo không gian sống mơ ước của bạn.</h1>
        <p className="lead">
          Đăng nhập để khám phá bộ sưu tập đồ decor độc đáo, từ đèn trang trí, 
          tranh treo tường đến những vật phẩm thủ công tinh tế cho căn phòng của bạn.
        </p>
        <div className="feature-list">
          <div>
            <strong>Sản phẩm độc bản</strong>
            <span>Đồ trang trí được tuyển chọn kỹ lưỡng, mang phong cách riêng.</span>
          </div>
          <div>
            <strong>Giao hàng tận tâm</strong>
            <span>Đảm bảo an toàn cho mọi món đồ dễ vỡ nhất của bạn.</span>
          </div>
          <div>
            <strong>Ưu đãi thành viên</strong>
            <span>Nhận thông báo sớm nhất về các bộ sưu tập giới hạn.</span>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <div className="tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Đăng ký
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Email hoặc tên đăng nhập
              <input
                value={loginForm.emailOrUsername}
                onChange={(event) =>
                  updateForm(
                    setLoginForm,
                    "emailOrUsername",
                    event.target.value,
                  )
                }
                placeholder="Nhập email hoặc username"
                required
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  updateForm(setLoginForm, "password", event.target.value)
                }
                placeholder="Nhập mật khẩu"
                required
              />
            </label>
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập ngay"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label>
              Tên người dùng
              <input
                value={registerForm.username}
                onChange={(event) =>
                  updateForm(setRegisterForm, "username", event.target.value)
                }
                placeholder="Username"
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  updateForm(setRegisterForm, "email", event.target.value)
                }
                placeholder="Địa chỉ email của bạn"
                required
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  updateForm(setRegisterForm, "password", event.target.value)
                }
                placeholder="Mật khẩu tối thiểu 6 ký tự"
                required
              />
            </label>
            <label>
              Họ và tên
              <input
                value={registerForm.fullName}
                onChange={(event) =>
                  updateForm(setRegisterForm, "fullName", event.target.value)
                }
                placeholder="Họ tên đầy đủ"
              />
            </label>
            <label>
              Số điện thoại
              <input
                value={registerForm.phone}
                onChange={(event) =>
                  updateForm(setRegisterForm, "phone", event.target.value)
                }
                placeholder="Số điện thoại liên hệ"
              />
            </label>
            <button className="submit-button" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Tham gia ngay"}
            </button>
          </form>
        )}

        {feedback ? <p className="feedback">{feedback}</p> : null}

        {session?.user ? (
          <div className="session-box">
            <h2>Chào mừng, {session.user.username}!</h2>
            <p>
              Cảm ơn bạn đã ghé thăm <strong>Tiệm Đồ Trang Trí Nội Thất</strong>.
            </p>
            <p>
              Hãy bắt đầu làm mới không gian của bạn ngay hôm nay.
            </p>
            <button
              type="button"
              className="ghost-button"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default Login;
