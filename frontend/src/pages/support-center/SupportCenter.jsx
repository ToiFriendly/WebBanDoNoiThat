import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StoreHeader from "../../components/StoreHeader";

const supportCategories = [
  {
    id: "shipping",
    label: "Vận chuyển",
    title: "Vận chuyển & Giao nhận",
    description:
      "Thông tin về phí giao hàng, thời gian nhận hàng và các lưu ý khi nhận đơn.",
    icon: "truck",
    faqs: [
      {
        id: "shipping-fee",
        icon: "truck",
        question: "Phí vận chuyển được tính như thế nào?",
        answer:
          "Phí vận chuyển của COZY CORNER được tính dựa trên khoảng cách địa lý và tổng trọng lượng của đơn hàng.",
        bullets: [
          "Nội thành Hà Nội & TP.HCM: đồng giá 30.000đ cho đơn dưới 500.000đ.",
          "Các tỉnh thành khác: tính theo bảng giá niêm yết của đơn vị vận chuyển đối tác (GHTK, Viettel Post).",
        ],
        note: "Miễn phí vận chuyển cho tất cả đơn hàng từ 1.000.000đ trở lên.",
      },
      {
        id: "shipping-time",
        icon: "clock",
        question: "Thời gian giao hàng là bao lâu?",
        answer:
          "Đơn nội thành thường được giao trong 24 - 48 giờ. Các tỉnh thành khác mất khoảng 3 - 5 ngày làm việc tùy khu vực.",
      },
      {
        id: "shipping-check",
        icon: "box",
        question: "Tôi có thể được kiểm hàng trước khi nhận không?",
        answer:
          "Bạn được kiểm tra tình trạng bên ngoài kiện hàng trước khi thanh toán. Với các đơn cần mở hộp sâu hơn, vui lòng quay video khi nhận để COZY CORNER hỗ trợ nhanh nhất nếu phát sinh vấn đề.",
      },
      {
        id: "shipping-address",
        icon: "pin",
        question: "Làm thế nào để thay đổi địa chỉ nhận hàng?",
        answer:
          "Bạn có thể liên hệ hotline hoặc gửi yêu cầu qua trang Liên hệ trong vòng 30 phút sau khi đặt hàng. Sau thời gian này, COZY CORNER sẽ kiểm tra lại với đối tác vận chuyển trước khi xác nhận thay đổi.",
      },
    ],
  },
  {
    id: "payment",
    label: "Thanh toán",
    title: "Thanh toán & Đơn hàng",
    description:
      "Các hình thức thanh toán, xuất hóa đơn và điều chỉnh đơn hàng sau khi đặt.",
    icon: "card",
    faqs: [
      {
        id: "payment-methods",
        icon: "card",
        question: "COZY CORNER hỗ trợ những hình thức thanh toán nào?",
        answer:
          "Bạn có thể thanh toán bằng chuyển khoản ngân hàng, ví điện tử MoMo hoặc thanh toán khi nhận hàng đối với đơn đủ điều kiện.",
      },
      {
        id: "payment-cod",
        icon: "wallet",
        question: "Đơn nào được áp dụng thanh toán khi nhận hàng?",
        answer:
          "Hình thức COD áp dụng cho đơn giao nội thành và một số tỉnh thành được đối tác vận chuyển hỗ trợ. Các đơn nội thất cồng kềnh có thể cần đặt cọc trước.",
      },
      {
        id: "payment-invoice",
        icon: "document",
        question: "Tôi có thể yêu cầu xuất hóa đơn VAT không?",
        answer:
          "Có. Bạn hãy để lại thông tin xuất hóa đơn trong phần ghi chú khi đặt hàng hoặc gửi yêu cầu trong ngày cho bộ phận hỗ trợ.",
      },
      {
        id: "payment-cancel",
        icon: "refresh",
        question: "Tôi có thể hủy đơn hàng sau khi thanh toán không?",
        answer:
          "Bạn có thể yêu cầu hủy đơn nếu đơn chưa được bàn giao cho đơn vị vận chuyển. Khoản hoàn tiền sẽ được xử lý theo hình thức thanh toán ban đầu.",
      },
    ],
  },
  {
    id: "refund",
    label: "Đổi trả & Hoàn tiền",
    title: "Đổi trả & Hoàn tiền",
    description:
      "Điều kiện đổi trả, quy trình xử lý hoàn tiền và các trường hợp sản phẩm lỗi.",
    icon: "refresh",
    faqs: [
      {
        id: "refund-policy",
        icon: "refresh",
        question: "Chính sách đổi trả của COZY CORNER như thế nào?",
        answer:
          "Bạn có thể yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên trạng, đầy đủ phụ kiện và hóa đơn mua hàng.",
      },
      {
        id: "refund-time",
        icon: "clock",
        question: "Bao lâu tôi sẽ nhận được tiền hoàn?",
        answer:
          "Tiền hoàn thường được xử lý trong vòng 3 - 7 ngày làm việc sau khi COZY CORNER xác nhận đã nhận lại sản phẩm đạt điều kiện hoàn trả.",
      },
      {
        id: "refund-damage",
        icon: "shield",
        question: "Nếu sản phẩm bị lỗi hoặc hư hỏng khi giao tới thì sao?",
        answer:
          "Bạn vui lòng chụp ảnh hoặc quay video ngay tại thời điểm mở hàng và gửi cho COZY CORNER trong vòng 24 giờ để được ưu tiên đổi mới hoặc hoàn tiền.",
      },
      {
        id: "refund-wrong-item",
        icon: "box",
        question: "Tôi nhận sai mẫu hoặc sai màu, xử lý như thế nào?",
        answer:
          "COZY CORNER sẽ chủ động sắp xếp thu hồi và gửi lại đúng sản phẩm cho bạn mà không phát sinh thêm chi phí.",
      },
    ],
  },
  {
    id: "warranty",
    label: "Bảo hành",
    title: "Bảo hành sản phẩm",
    description:
      "Phạm vi bảo hành, điều kiện áp dụng và cách gửi yêu cầu bảo hành nhanh.",
    icon: "shield",
    faqs: [
      {
        id: "warranty-coverage",
        icon: "shield",
        question: "Những lỗi nào được hỗ trợ bảo hành?",
        answer:
          "COZY CORNER hỗ trợ bảo hành cho các lỗi kỹ thuật từ nhà sản xuất như bong tróc hoàn thiện, nứt vỡ do lỗi vật liệu hoặc phụ kiện lắp ráp không đạt tiêu chuẩn.",
      },
      {
        id: "warranty-request",
        icon: "document",
        question: "Tôi gửi yêu cầu bảo hành bằng cách nào?",
        answer:
          "Bạn có thể gửi ảnh, video và mã đơn hàng qua email hoặc form hỗ trợ. Đội ngũ kỹ thuật sẽ phản hồi hướng xử lý trong vòng 24 giờ làm việc.",
      },
      {
        id: "warranty-period",
        icon: "clock",
        question: "Thời hạn bảo hành của sản phẩm là bao lâu?",
        answer:
          "Tùy sản phẩm, thời hạn bảo hành dao động từ 3 đến 12 tháng. Thông tin cụ thể được ghi trên trang chi tiết sản phẩm và phiếu mua hàng.",
      },
      {
        id: "warranty-exclusions",
        icon: "warning",
        question: "Trường hợp nào không nằm trong phạm vi bảo hành?",
        answer:
          "Các lỗi phát sinh do sử dụng sai hướng dẫn, va đập mạnh, ẩm mốc do môi trường hoặc tự ý sửa chữa sẽ không thuộc phạm vi bảo hành miễn phí.",
      },
    ],
  },
  {
    id: "account",
    label: "Tài khoản",
    title: "Tài khoản & Bảo mật",
    description:
      "Quản lý thông tin tài khoản, đổi mật khẩu và theo dõi lịch sử mua hàng.",
    icon: "user",
    faqs: [
      {
        id: "account-password",
        icon: "user",
        question: "Tôi quên mật khẩu thì phải làm sao?",
        answer:
          "Bạn hãy dùng chức năng quên mật khẩu ở trang đăng nhập hoặc liên hệ hỗ trợ nếu không còn truy cập được email/số điện thoại đã đăng ký.",
      },
      {
        id: "account-info",
        icon: "document",
        question: "Tôi có thể thay đổi email hoặc số điện thoại không?",
        answer:
          "Có. Bạn chỉ cần đăng nhập, cập nhật hồ sơ tài khoản hoặc liên hệ hỗ trợ để xác minh trước khi đổi thông tin quan trọng.",
      },
      {
        id: "account-orders",
        icon: "box",
        question: "Tôi xem lại lịch sử đơn hàng ở đâu?",
        answer:
          "Sau khi đăng nhập, bạn có thể vào mục tài khoản để xem các đơn đã đặt, trạng thái hiện tại và thông tin vận chuyển tương ứng.",
      },
      {
        id: "account-security",
        icon: "shield",
        question: "COZY CORNER lưu và bảo vệ dữ liệu cá nhân như thế nào?",
        answer:
          "Chúng tôi chỉ lưu các thông tin cần thiết để xử lý đơn hàng và chăm sóc khách hàng. Dữ liệu được giới hạn quyền truy cập và không chia sẻ cho bên thứ ba ngoài mục đích vận hành đơn hàng.",
      },
    ],
  },
];

function SearchIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m16 16 3.5 3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TruckIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M3.5 6.5h10v8h-10zM13.5 9h3.7l2.3 2.5v3H13.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="7.5" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="17.5" r="1.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CardIcon({ className = "" }) {
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
        d="M3.5 10.5h17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function RefreshIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12a8 8 0 0 1 13.4-5.8M20 12a8 8 0 0 1-13.4 5.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M17.4 3.8v4.4H13M7 20.2v-4.4h4.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 3.5 19 6v5.4c0 4.2-2.7 7.9-7 9.1-4.3-1.2-7-4.9-7-9.1V6l7-2.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function UserIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5v5l3.2 1.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BoxIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m12 3.8 7 4v8.4l-7 4-7-4V7.8l7-4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.8v12.3M5.2 8.2 12 12l6.8-3.8"
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

function WalletIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 7.5h12.5A1.5 1.5 0 0 1 19 9v7.5A1.5 1.5 0 0 1 17.5 18h-13A1.5 1.5 0 0 1 3 16.5V9A1.5 1.5 0 0 1 4.5 7.5H5Zm0 0V6A1.5 1.5 0 0 1 6.5 4.5h8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <circle cx="15.5" cy="12.75" r="1" fill="currentColor" />
    </svg>
  );
}

function DocumentIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M8 3.5h6l4 4v12A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-14A1.5 1.5 0 0 1 7.5 4H8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 3.8v4.1h4.1M9 12h6M9 15.5h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WarningIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4.5 20 18H4l8-13.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M12 9.2v4.1M12 16.5h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HeadsetIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 12a8 8 0 1 1 16 0v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <rect width="3.8" height="6" x="3.2" y="11.8" rx="1.4" stroke="currentColor" strokeWidth="1.8" />
      <rect width="3.8" height="6" x="17" y="11.8" rx="1.4" stroke="currentColor" strokeWidth="1.8" />
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

function BriefcaseIcon({ className = "" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect width="17" height="11.5" x="3.5" y="7" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7M3.8 11.5h16.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function getIcon(icon, className) {
  switch (icon) {
    case "truck":
      return <TruckIcon className={className} />;
    case "card":
      return <CardIcon className={className} />;
    case "refresh":
      return <RefreshIcon className={className} />;
    case "shield":
      return <ShieldIcon className={className} />;
    case "user":
      return <UserIcon className={className} />;
    case "clock":
      return <ClockIcon className={className} />;
    case "box":
      return <BoxIcon className={className} />;
    case "pin":
      return <PinIcon className={className} />;
    case "wallet":
      return <WalletIcon className={className} />;
    case "document":
      return <DocumentIcon className={className} />;
    case "warning":
      return <WarningIcon className={className} />;
    default:
      return <DocumentIcon className={className} />;
  }
}

function normalizeText(value) {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function CategoryButton({ category, active, onClick }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-[#fee1b0] text-[#2f241f]"
          : "bg-transparent text-[#614937] hover:bg-[#fbf4e8]"
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={`flex h-8 w-8 items-center justify-center ${active ? "text-[#d48119]" : "text-[#b6793a]"}`}>
        {getIcon(category.icon, "h-5 w-5")}
      </span>
      <span>{category.label}</span>
    </button>
  );
}

function ExpandedFaqCard({ item }) {
  return (
    <article className="rounded-[14px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(87,61,36,0.04)]">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[6px] bg-[#fde7c4] text-[#d48119]">
          {getIcon(item.icon, "h-6 w-6")}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-medium text-[#1f1511] md:text-[2rem]">
            {item.question}
          </h3>
          <div className="mt-4 rounded-[2px] border-[3px] border-[#1896ff] px-6 py-4 text-[0.96rem] leading-8 text-[#79757d]">
            <p>{item.answer}</p>
            {item.bullets?.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {item.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
            {item.note ? (
              <div className="mt-2 font-semibold text-[#63c857]">{item.note}</div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function CollapsedFaqRow({ item, onToggle }) {
  return (
    <button
      className="flex w-full items-center gap-4 rounded-[14px] bg-white px-4 py-5 text-left shadow-[0_8px_18px_rgba(87,61,36,0.04)] transition hover:translate-x-0.5"
      onClick={onToggle}
      type="button"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fde7c4] text-[#c98a2b]">
        {getIcon(item.icon, "h-6 w-6")}
      </span>
      <span className="text-lg font-semibold text-[#2b1c11] md:text-[1.65rem]">
        {item.question}
      </span>
    </button>
  );
}

function SearchFaqCard({ item, expanded, onToggle }) {
  return (
    <article className="rounded-[14px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(87,61,36,0.04)]">
      <button
        className="flex w-full items-start gap-4 text-left"
        onClick={onToggle}
        type="button"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#fde7c4] text-[#c98a2b]">
          {getIcon(item.icon, "h-6 w-6")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-semibold tracking-[0.08em] text-[#c48a42] uppercase">
            {item.categoryLabel}
          </div>
          <div className="text-lg font-semibold text-[#2f241f] md:text-[1.55rem]">
            {item.question}
          </div>
          {expanded ? (
            <div className="mt-4 rounded-[2px] border-[3px] border-[#1896ff] px-5 py-4 text-[0.96rem] leading-8 text-[#79757d]">
              <p>{item.answer}</p>
              {item.bullets?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {item.note ? (
                <div className="mt-2 font-semibold text-[#63c857]">{item.note}</div>
              ) : null}
            </div>
          ) : null}
        </div>
        <ChevronIcon
          className={`mt-1 h-5 w-5 shrink-0 text-[#8a6642] transition ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
    </article>
  );
}

function SupportCenter() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(supportCategories[0].id);
  const [draftQuery, setDraftQuery] = useState("");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(supportCategories[0].faqs[0].id);

  const activeCategory =
    supportCategories.find((category) => category.id === selectedCategoryId) ||
    supportCategories[0];

  const visibleFaqs = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());

    if (!normalizedQuery) {
      return activeCategory.faqs.map((item) => ({
        ...item,
        categoryId: activeCategory.id,
        categoryLabel: activeCategory.label,
      }));
    }

    return supportCategories.flatMap((category) =>
      category.faqs
        .filter((item) => {
          const haystack = normalizeText(
            [item.question, item.answer, ...(item.bullets || []), item.note]
              .filter(Boolean)
              .join(" "),
          );

          return haystack.includes(normalizedQuery);
        })
        .map((item) => ({
          ...item,
          categoryId: category.id,
          categoryLabel: category.label,
        })),
    );
  }, [activeCategory, query]);

  const safeExpandedId =
    visibleFaqs.find((item) => item.id === expandedId)?.id || visibleFaqs[0]?.id || "";
  const expandedCategoryId =
    activeCategory.faqs.find((item) => item.id === expandedId)?.id ||
    activeCategory.faqs[0]?.id ||
    "";
  const expandedCategoryFaq =
    activeCategory.faqs.find((item) => item.id === expandedCategoryId) ||
    activeCategory.faqs[0];
  const collapsedCategoryFaqs = activeCategory.faqs.filter(
    (item) => item.id !== expandedCategoryId,
  );

  function handleSearchSubmit(event) {
    event.preventDefault();
    setQuery(draftQuery.trim());
    setExpandedId("");
  }

  function handleSelectCategory(category) {
    setSelectedCategoryId(category.id);
    setExpandedId(category.faqs[0]?.id || "");

    if (query) {
      setQuery("");
      setDraftQuery("");
    }
  }

  return (
    <main className="min-h-screen px-3 py-4 text-[#2f241f] md:px-6 md:py-6">
      <section className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[32px] border border-[rgba(95,63,42,0.12)] bg-[linear-gradient(180deg,rgba(255,249,241,0.9),rgba(248,239,225,0.94))] p-5 shadow-[0_20px_60px_rgba(79,52,35,0.08)] md:p-6">
        <StoreHeader />

        <div className="overflow-hidden rounded-[30px] border border-[rgba(95,63,42,0.08)] bg-[linear-gradient(180deg,#ffe5bc,#fde7c8)]">
          <div className="px-5 py-8 text-center md:px-8 md:py-12">
            <h1 className="text-4xl font-semibold leading-none text-[#1f1511] md:text-6xl">
              Trung tâm hỗ trợ khách hàng
            </h1>
            <p className="mx-auto mt-4 max-w-[620px] text-base leading-8 text-[#5f4738]">
              Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.
            </p>

            <form
              className="mx-auto mt-6 flex max-w-[620px] flex-col gap-3 rounded-[24px] border border-[rgba(95,63,42,0.08)] bg-white/86 p-3 shadow-[0_14px_32px_rgba(93,61,38,0.08)] sm:flex-row"
              onSubmit={handleSearchSubmit}
            >
              <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl bg-[#fffaf3] px-4 text-[#9b7d62]">
                <SearchIcon className="h-5 w-5" />
                <input
                  className="w-full border-none bg-transparent text-sm text-[#5b4334] outline-none placeholder:text-[#ad9279]"
                  onChange={(event) => setDraftQuery(event.target.value)}
                  placeholder="Gõ từ khóa tìm kiếm (VD: Vận chuyển, Bảo hành)..."
                  type="search"
                  value={draftQuery}
                />
              </label>
              <button
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#e49a23] px-6 text-sm font-semibold text-[#2f241f] shadow-[0_12px_24px_rgba(228,154,35,0.2)] transition hover:-translate-y-0.5"
                type="submit"
              >
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="border-t border-[rgba(95,63,42,0.12)] bg-[rgba(255,250,244,0.86)] px-5 py-4 text-sm text-[#7c6453] md:px-8">
            <Link className="font-medium text-[#d28218] no-underline" to="/">
              Trang chủ
            </Link>
            <span> / </span>
            <span>Trung tâm hỗ trợ</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 min-[560px]:grid-cols-[160px_minmax(0,1fr)]">
          <aside className="grid gap-5">
            <div className="rounded-[14px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(87,61,36,0.04)]">
              <div className="mb-4 text-[1.65rem] font-semibold text-[#241814]">Danh mục</div>
              <div className="grid gap-2">
                {supportCategories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    active={!query && category.id === activeCategory.id}
                    category={category}
                    onClick={() => handleSelectCategory(category)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[14px] bg-[#fee1ad] px-4 py-5 shadow-[0_8px_18px_rgba(87,61,36,0.04)]">
              <div className="text-[1.55rem] font-semibold leading-tight text-[#241814]">
                Cần hỗ trợ trực tiếp ?
              </div>
              <p className="mt-3 text-sm leading-8 text-[#664d3b]">
                Đội ngũ chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc 24/7.
              </p>
              <Link
                className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#2f241f] px-4 text-sm font-semibold text-[#fff8f0] no-underline shadow-[0_10px_20px_rgba(66,44,31,0.16)] transition hover:-translate-y-0.5"
                to="/lien-he"
              >
                <HeadsetIcon className="h-4 w-4" />
                Chat ngay
              </Link>
            </div>
          </aside>

          <section className="grid gap-5">
            <div>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[1.9rem] font-semibold text-[#241814] md:text-[2.2rem]">
                    {query ? `Kết quả cho "${query}"` : activeCategory.title}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[#6d5544]">
                    {query
                      ? `Tìm thấy ${visibleFaqs.length} câu trả lời phù hợp với từ khóa của bạn.`
                      : activeCategory.description}
                  </p>
                </div>

                {query ? (
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[rgba(95,63,42,0.12)] bg-white/80 px-5 text-sm font-semibold text-[#5c4536] transition hover:bg-white"
                    onClick={() => {
                      setQuery("");
                      setDraftQuery("");
                      setExpandedId(activeCategory.faqs[0]?.id || "");
                    }}
                    type="button"
                  >
                    Quay về danh mục
                  </button>
                ) : null}
              </div>
            </div>

            {visibleFaqs.length ? (
              <div className="grid gap-4">
                {query ? (
                  visibleFaqs.map((item) => (
                    <SearchFaqCard
                      key={item.id}
                      expanded={safeExpandedId === item.id}
                      item={item}
                      onToggle={() =>
                        setExpandedId((current) => (current === item.id ? "" : item.id))
                      }
                    />
                  ))
                ) : (
                  <>
                    <ExpandedFaqCard item={expandedCategoryFaq} />
                    {collapsedCategoryFaqs.map((item) => (
                      <CollapsedFaqRow
                        key={item.id}
                        item={item}
                        onToggle={() => setExpandedId(item.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-[rgba(95,63,42,0.16)] bg-white/70 px-6 py-10 text-center">
                <div className="text-2xl font-semibold text-[#241814]">
                  Không tìm thấy câu trả lời phù hợp
                </div>
                <p className="mx-auto mt-3 max-w-[520px] text-sm leading-7 text-[#6d5544]">
                  Hãy thử với từ khóa khác hoặc liên hệ trực tiếp để đội ngũ COZY
                  CORNER hỗ trợ bạn trong vài phút.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[rgba(95,63,42,0.12)] bg-white px-5 text-sm font-semibold text-[#5f4738] no-underline transition hover:bg-[#fffaf3]"
                    href="tel:19009999"
                  >
                    <PhoneIcon className="h-5 w-5" />
                    Hotline
                  </a>
                  <Link
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#e49a23] px-5 text-sm font-semibold text-[#2f241f] no-underline shadow-[0_12px_24px_rgba(228,154,35,0.2)] transition hover:-translate-y-0.5"
                    to="/lien-he"
                  >
                    <BriefcaseIcon className="h-5 w-5" />
                    Gửi yêu cầu
                  </Link>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 rounded-[14px] bg-[#fee1ad] px-5 py-5 shadow-[0_8px_18px_rgba(87,61,36,0.04)] md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold text-[#241814]">
                Bạn không tìm thấy câu trả lời?
                </div>
                <p className="mt-2 text-sm leading-7 text-[#6a503d]">
                  Hãy liên hệ trực tiếp chúng tôi sẽ phản hồi trong vòng 5 phút.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-white px-5 text-sm font-medium text-[#5f4738] no-underline transition hover:bg-[#fffaf3]"
                  href="tel:19009999"
                >
                  <PhoneIcon className="h-5 w-5" />
                  Hotline
                </a>
                <Link
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] bg-[#e49a23] px-5 text-sm font-semibold text-[#2f241f] no-underline transition hover:-translate-y-0.5"
                  to="/lien-he"
                >
                  <BriefcaseIcon className="h-5 w-5" />
                  Gửi yêu cầu
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default SupportCenter;
