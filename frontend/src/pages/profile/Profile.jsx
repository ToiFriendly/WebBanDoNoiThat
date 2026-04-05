import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";
import {
  API_BASE_URL,
  getStoredSession,
  getStoredSessionUser,
  requestAuthJson,
  saveStoredSession,
} from "../../utils/storefront";

function mapUserToForm(user) {
  return {
    username: user?.username || "",
    email: user?.email || "",
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  };
}

function Profile() {
  const [sessionUser, setSessionUser] = useState(() => getStoredSessionUser());
  const [profileUser, setProfileUser] = useState(() => getStoredSessionUser());
  const [form, setForm] = useState(() => mapUserToForm(getStoredSessionUser()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      const nextSessionUser = getStoredSessionUser();

      if (!isMounted) {
        return;
      }

      setSessionUser(nextSessionUser);

      if (!nextSessionUser) {
        setProfileUser(null);
        setForm(mapUserToForm(null));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await requestAuthJson(`${API_BASE_URL}/api/auth/me`);

        if (!isMounted) {
          return;
        }

        const nextUser = data?.user || nextSessionUser;
        setProfileUser(nextUser);
        setForm(mapUserToForm(nextUser));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setProfileUser(nextSessionUser);
        setForm(mapUserToForm(nextSessionUser));
        setFeedback(error.message || "Khong the tai thong tin ho so.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    window.addEventListener("storage", loadProfile);
    window.addEventListener("auth-session-changed", loadProfile);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", loadProfile);
      window.removeEventListener("auth-session-changed", loadProfile);
    };
  }, []);

  const baselineForm = useMemo(
    () => mapUserToForm(profileUser || sessionUser),
    [profileUser, sessionUser],
  );
  const isDirty =
    form.username !== baselineForm.username ||
    form.email !== baselineForm.email ||
    form.fullName !== baselineForm.fullName ||
    form.phone !== baselineForm.phone;

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setFeedback("");

      const payload = {
        username: form.username,
        email: form.email,
        fullName: form.fullName,
        phone: form.phone,
      };
      const data = await requestAuthJson(`${API_BASE_URL}/api/auth/me`, {
        method: "PUT",
        body: payload,
      });
      const nextUser = data?.user;

      if (nextUser) {
        const storedSession = getStoredSession();

        if (storedSession?.token) {
          saveStoredSession({
            ...storedSession,
            user: nextUser,
          });
        }

        setSessionUser(nextUser);
        setProfileUser(nextUser);
        setForm(mapUserToForm(nextUser));
      }

      setFeedback(data?.message || "Cap nhat ho so thanh cong.");
    } catch (error) {
      setFeedback(error.message || "Khong the cap nhat thong tin ca nhan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto mb-6 w-full max-w-[1180px] rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[rgba(255,251,245,0.82)] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        {!sessionUser ? (
          <div className="mt-6 rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/75 p-6">
            <h1 className="text-3xl font-semibold">Hồ sơ người dùng</h1>
            <p className="mt-3 max-w-[62ch] leading-7 text-[#5f4a3d]">
              Đăng nhập để xem và chỉnh sửa thông tin cá nhân của bạn.
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#2f241f] px-5 font-bold text-[#fff8f0] no-underline"
              to="/login"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-3xl border border-[rgba(95,63,42,0.1)] bg-white/80 p-6">
              <p className="text-xs tracking-[0.16em] text-[#8b6243] uppercase">
                Thông tin đăng ký hiện tại
              </p>
              <h1 className="mt-3 text-3xl font-semibold">Cap nhat ho so</h1>
              <p className="mt-3 max-w-[60ch] leading-7 text-[#5f4a3d]">
                Bạn có thể chỉnh sửa username, email, họ tên và số điện thoại.
                Dữ liệu sẽ được lưu vào tài khoản hiện tại.
              </p>

              {feedback ? (
                <p className="mt-4 rounded-2xl bg-[#f5ebde] px-4 py-3 leading-7 text-[#734d36]">
                  {feedback}
                </p>
              ) : null}

              {loading ? (
                <div className="mt-5 rounded-2xl border border-[rgba(95,63,42,0.1)] bg-white p-4 text-[#5f4a3d]">
                  Đang tải thông tin hồ sơ...
                </div>
              ) : (
                <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#5f4a3d]">
                      Username
                    </span>
                    <input
                      className="min-h-11 rounded-2xl border border-[rgba(95,63,42,0.2)] bg-white px-4"
                      value={form.username}
                      onChange={(event) =>
                        updateField("username", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#5f4a3d]">
                      Email
                    </span>
                    <input
                      type="email"
                      className="min-h-11 rounded-2xl border border-[rgba(95,63,42,0.2)] bg-white px-4"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      required
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#5f4a3d]">
                      Họ và tên
                    </span>
                    <input
                      className="min-h-11 rounded-2xl border border-[rgba(95,63,42,0.2)] bg-white px-4"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-[#5f4a3d]">
                      Số điện thoại
                    </span>
                    <input
                      className="min-h-11 rounded-2xl border border-[rgba(95,63,42,0.2)] bg-white px-4"
                      value={form.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2f241f] px-6 font-bold text-[#fff8f0] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving || loading || !isDirty}
                  >
                    {saving ? "Dang luu..." : "Luu thay doi"}
                  </button>
                </form>
              )}
            </article>

            <aside className="rounded-3xl border border-[rgba(95,63,42,0.12)] bg-[linear-gradient(180deg,rgba(63,42,31,0.96),rgba(89,63,48,0.92))] p-6 text-[#f8efe5]">
              <p className="text-xs tracking-[0.14em] uppercase">
                Tài khoản hiện tại
              </p>
              <h2 className="mt-3 text-3xl font-semibold">
                {baselineForm.fullName || baselineForm.username || "Người dùng"}
              </h2>
              <p className="mt-3 leading-7 text-[#f4dfcb]">
                Khi cập nhật thành công, thông tin mới sẽ được đồng bộ vào phiên
                đăng nhập và hiển thị ngay ở các trang khác.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl bg-[rgba(255,255,255,0.1)] p-4">
                  <div className="text-xs tracking-[0.14em] text-[#f4dfcb] uppercase">
                    Username
                  </div>
                  <strong className="mt-1 block text-lg">
                    {baselineForm.username || "Chua co"}
                  </strong>
                </div>

                <div className="rounded-2xl bg-[rgba(255,255,255,0.1)] p-4">
                  <div className="text-xs tracking-[0.14em] text-[#f4dfcb] uppercase">
                    Email
                  </div>
                  <strong className="mt-1 block text-lg break-all">
                    {baselineForm.email || "Chua co"}
                  </strong>
                </div>

                <div className="rounded-2xl bg-[rgba(255,255,255,0.1)] p-4">
                  <div className="text-xs tracking-[0.14em] text-[#f4dfcb] uppercase">
                    Số điện thoại
                  </div>
                  <strong className="mt-1 block text-lg">
                    {baselineForm.phone || "Chua cap nhat"}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;
