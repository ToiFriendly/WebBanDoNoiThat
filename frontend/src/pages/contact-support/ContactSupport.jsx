import { Link } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";

const contactCards = [
  {
    id: "showroom",
    title: "Showroom chính",
    description: "Khu phố 4, Linh Trung, Thủ Đức, TP. Hồ Chí Minh",
    note: "Mở cửa: 8:00 - 22:00",
    icon: "pin",
  },
  {
    id: "hotline",
    title: "Hotline hỗ trợ",
    description: "1900 9999 (Miễn phí cước gọi)",
    note: "Hỗ trợ 24/7 tất cả các ngày trong tuần",
    icon: "phone",
  },
  {
    id: "email",
    title: "Email liên hệ",
    description: "cozycorner.support@gmail.com",
    note: "Phản hồi trong vòng 2 giờ làm việc",
    icon: "mail",
  },
];

const quickActions = [
  "Tư vấn thiết kế nội thất",
  "Báo giá sản phẩm",
  "Tra cứu đơn hàng",
  "Gặp nhân viên tư vấn",
];

function SectionBadgeIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M7 21h10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 17v4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <rect
        width="18"
        height="12"
        x="3"
        y="3"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m9 11 2 2 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChatIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M7 18.2 3.8 20v-3.6A8 8 0 1 1 20 12a8 8 0 0 1-8 8c-1.7 0-3.2-.4-4.6-1.2H7Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 10.5h7M8.5 13.5h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PinIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 21s6-5.1 6-10a6 6 0 1 0-12 0c0 4.9 6 10 6 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m6 4.5 3.4 3.4-1.8 2.7a14.5 14.5 0 0 0 5.8 5.8l2.7-1.8 3.4 3.4-2.2 2.2a2.5 2.5 0 0 1-2.5.6c-3.2-1-6.2-2.9-8.7-5.4S2.7 9.7 1.7 6.5a2.5 2.5 0 0 1 .6-2.5L4.5 1.8 6 4.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        width="18"
        height="13"
        x="3"
        y="5.5"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m5.5 8 6.5 5 6.5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DotsIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="5.5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="18.5" r="1.8" />
    </svg>
  );
}

function PaperclipIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m10 13.5 5-5a2.8 2.8 0 1 1 4 4l-6.7 6.7a4.3 4.3 0 0 1-6.1-6.1l7-7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SmileIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 14.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

function SendIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12 20 4l-3.6 16-4.4-5.2L4 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 14.8 20 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M13.5 21v-7h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H17V4.9c-.3 0-1.4-.1-2.7-.1-2.7 0-4.3 1.6-4.3 4.6V11H7v3h3v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        width="15"
        height="15"
        x="4.5"
        y="4.5"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

function YoutubeIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M20 8.3a2.8 2.8 0 0 0-2-2C16.2 5.8 12 5.8 12 5.8s-4.2 0-6 .5a2.8 2.8 0 0 0-2 2 29.7 29.7 0 0 0 0 7.4 2.8 2.8 0 0 0 2 2c1.8.5 6 .5 6 .5s4.2 0 6-.5a2.8 2.8 0 0 0 2-2 29.7 29.7 0 0 0 0-7.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m10 15.3 5-3.3-5-3.3v6.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getCardIcon(icon, className) {
  if (icon === "phone") {
    return <PhoneIcon className={className} />;
  }

  if (icon === "mail") {
    return <MailIcon className={className} />;
  }

  return <PinIcon className={className} />;
}

function ContactCard({ icon, title, description, note }) {
  return (
    <article className="rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-white/92 p-5 shadow-[0_16px_40px_rgba(92,61,38,0.08)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#f3d2a5,#f8ebd8)] text-[#6f482a]">
          {getCardIcon(icon, "h-7 w-7")}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#2f241f]">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#5c4a40]">{description}</p>
          <p className="mt-2 text-sm font-medium text-[#d2871d]">{note}</p>
        </div>
      </div>
    </article>
  );
}

function MessageBubble({ children, tone = "light" }) {
  return (
    <div
      className={`max-w-[320px] rounded-[20px] px-4 py-3 text-sm leading-6 shadow-[0_12px_24px_rgba(92,61,38,0.06)] ${
        tone === "accent"
          ? "bg-[#efac34] font-medium text-[#2f241f]"
          : "bg-[#fff5e8] text-[#5b4334]"
      }`}
    >
      {children}
    </div>
  );
}

function SocialButton({ label, children }) {
  return (
    <button
      aria-label={label}
      className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-[rgba(95,63,42,0.12)] bg-[#f7e1bf] text-[#4b3224] shadow-[0_12px_24px_rgba(92,61,38,0.08)] transition hover:-translate-y-0.5"
      type="button"
    >
      {children}
    </button>
  );
}

function ContactSupport() {
  return (
    <main className="min-h-screen px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[linear-gradient(180deg,rgba(255,249,241,0.9),rgba(248,239,225,0.94))] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        <div className="relative overflow-hidden rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-[linear-gradient(145deg,rgba(255,248,239,0.98),rgba(249,238,222,0.96))] p-5 md:p-7">
          <div className="pointer-events-none absolute -left-16 top-8 h-36 w-36 rounded-full bg-[rgba(244,170,81,0.14)] blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(244,210,165,0.26)] blur-3xl" />

          <div className="relative">
            <div className="max-w-[760px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-medium text-[#a56b2b]">
                <SectionBadgeIcon className="h-4 w-4" />
                Hỗ trợ khách hàng 24/7
              </div>
              <h1 className="mt-5 max-w-[10ch] text-4xl font-semibold leading-none text-[#1f1511] md:text-6xl">
                Liên hệ & Hỗ trợ
              </h1>
              <p className="mt-5 max-w-[62ch] text-base leading-8 text-[#b47828]">
                Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7,
                giúp bạn lựa chọn sản phẩm phù hợp, giải đáp mọi thắc mắc và cùng
                bạn kiến tạo không gian sống mơ ước theo phong cách riêng.
              </p>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="grid gap-6">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-2xl font-semibold text-[#241814]">
                    <PinIcon className="h-6 w-6 text-[#ef9f1a]" />
                    <span>Thông tin liên hệ</span>
                  </div>
                  <div className="grid gap-4">
                    {contactCards.map((card) => (
                      <ContactCard key={card.id} {...card} />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-2 text-2xl font-semibold text-[#241814]">
                    <SectionBadgeIcon className="h-6 w-6 text-[#ef9f1a]" />
                    <span>Chỉ đường</span>
                  </div>
                  <div className="overflow-hidden rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-white/92 shadow-[0_16px_40px_rgba(92,61,38,0.08)]">
                    <div className="flex items-center justify-between gap-3 border-b border-[rgba(95,63,42,0.08)] px-5 py-4">
                      <div>
                        <div className="text-sm font-semibold text-[#3e2d22]">
                          Showroom COZY CORNER
                        </div>
                        <div className="mt-1 text-sm text-[#7a6558]">
                          Thủ Đức, TP. Hồ Chí Minh
                        </div>
                      </div>
                      <div className="rounded-full bg-[#f7e1bf] px-3 py-1.5 text-xs font-semibold text-[#a56b2b]">
                        Mở ngay trên bản đồ
                      </div>
                    </div>

                    <div className="h-[280px] w-full bg-[#efe2d1]">
                      <iframe
                        className="h-full w-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=Linh%20Trung%2C%20Thu%20Duc%2C%20Ho%20Chi%20Minh%20City&z=14&output=embed"
                        title="Bản đồ showroom COZY CORNER"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-2xl font-semibold text-[#241814]">
                    <ChatIcon className="h-6 w-6 text-[#ef9f1a]" />
                    <span>Chat trực tuyến</span>
                  </div>

                  <div className="overflow-hidden rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-white/94 shadow-[0_20px_45px_rgba(92,61,38,0.08)]">
                    <div className="flex items-center justify-between gap-4 border-b border-[rgba(95,63,42,0.08)] px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(145deg,#4d8cf6,#83bcff)] text-sm font-bold text-white">
                          TV
                        </div>
                        <div>
                          <div className="font-semibold text-[#2f241f]">
                            Hỗ trợ khách hàng
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-[#6c6d4c]">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ef9f1a]" />
                            Thường trả lời ngay lập tức
                          </div>
                        </div>
                      </div>
                      <button
                        aria-label="Tùy chọn hỗ trợ"
                        className="rounded-full p-2 text-[#6d5849] transition hover:bg-[#f6ecdf]"
                        type="button"
                      >
                        <DotsIcon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="bg-[linear-gradient(180deg,#fff8ef,#f9ebd5)] px-5 py-5">
                      <div className="mx-auto mb-5 w-fit rounded-full bg-[#f7d7a6] px-4 py-1 text-xs font-semibold text-[#8f602f]">
                        Hôm nay
                      </div>

                      <div className="grid gap-3">
                        <div className="flex">
                          <MessageBubble>
                            Xin chào! Mình là trợ lý ảo của COZY CORNER, mình có
                            thể giúp gì cho bạn hôm nay?
                          </MessageBubble>
                        </div>
                        <div className="text-xs font-medium text-[#8f7b6c]">08:30</div>
                        <div className="flex">
                          <MessageBubble>
                            Hãy chọn một trong các danh mục bên dưới để được hỗ
                            trợ nhanh nhất nhé.
                          </MessageBubble>
                        </div>

                        <div className="grid gap-3 pt-2 sm:grid-cols-2">
                          {quickActions.map((action) => (
                            <button
                              key={action}
                              className="rounded-2xl bg-[#efac34] px-4 py-3 text-sm font-semibold text-[#2f241f] shadow-[0_12px_24px_rgba(239,172,52,0.24)] transition hover:-translate-y-0.5"
                              type="button"
                            >
                              {action}
                            </button>
                          ))}
                        </div>

                        <div className="text-xs font-medium text-[#8f7b6c]">08:30</div>
                      </div>
                    </div>

                    <div className="border-t border-[rgba(95,63,42,0.08)] bg-white px-5 py-4">
                      <div className="flex items-center gap-3 rounded-[22px] border border-[rgba(95,63,42,0.08)] bg-[#fff8f1] px-4 py-3">
                        <button
                          aria-label="Đính kèm tệp"
                          className="rounded-full p-1 text-[#c78633]"
                          type="button"
                        >
                          <PaperclipIcon className="h-5 w-5" />
                        </button>
                        <button
                          aria-label="Chọn biểu cảm"
                          className="rounded-full p-1 text-[#c78633]"
                          type="button"
                        >
                          <SmileIcon className="h-5 w-5" />
                        </button>
                        <input
                          className="w-full border-none bg-transparent text-sm text-[#5b4334] outline-none placeholder:text-[#ab9078]"
                          placeholder="Nhập tin nhắn..."
                          type="text"
                        />
                        <button
                          aria-label="Gửi tin nhắn"
                          className="rounded-full bg-[#fff0d8] p-2 text-[#8f5f31] transition hover:bg-[#f9e2b8]"
                          type="button"
                        >
                          <SendIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-white/92 p-5 shadow-[0_16px_40px_rgba(92,61,38,0.08)]">
                  <div className="mb-4 text-lg font-semibold text-[#241814]">
                    Kết nối cùng COZY CORNER
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <SocialButton label="Facebook">
                      <FacebookIcon className="h-8 w-8" />
                    </SocialButton>
                    <SocialButton label="Instagram">
                      <InstagramIcon className="h-8 w-8" />
                    </SocialButton>
                    <SocialButton label="YouTube">
                      <YoutubeIcon className="h-8 w-8" />
                    </SocialButton>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[rgba(95,63,42,0.08)] bg-[linear-gradient(145deg,#fff3df,#f6ddae)] p-5 shadow-[0_16px_40px_rgba(92,61,38,0.08)]">
                  <div className="text-lg font-semibold text-[#241814]">
                    Cần câu trả lời nhanh hơn?
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#6f553f]">
                    Khám phá Trung tâm hỗ trợ để tìm nhanh câu trả lời về vận
                    chuyển, thanh toán, đổi trả, bảo hành và tài khoản.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#2f241f] px-5 text-sm font-semibold text-[#fff8f0] no-underline shadow-[0_12px_24px_rgba(66,44,31,0.16)] transition hover:-translate-y-0.5"
                      to="/ho-tro"
                    >
                      Mở trung tâm hỗ trợ
                    </Link>
                    <Link
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[rgba(95,63,42,0.12)] bg-white/75 px-5 text-sm font-semibold text-[#5f4738] no-underline transition hover:bg-white"
                      to="/lien-he"
                    >
                      Gửi yêu cầu trực tiếp
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContactSupport;
