export const loginInitialState = {
  emailOrUsername: "",
  password: "",
};

export const registerInitialState = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  phone: "",
};

export const otpInitialState = {
  code: "",
};

export const heroContentByMode = {
  login: {
    eyebrow: "Khong gian song theo gu rieng",
    title: ["Dang nhap de", "kham pha", "bo suu tap", "noi that."],
    description: [
      "Tu den trang tri, tranh treo tuong den nhung mon decor nho,",
      "tai khoan cua ban giup luu lai cam hung va thao tac nhanh hon.",
    ],
    cards: [
      {
        title: "Luu lai san pham yeu thich",
        lines: [
          "Danh dau cac mon do hop gu de quay lai nhanh",
          "khi ban muon so sanh hoac chot don.",
        ],
      },
      {
        title: "Theo doi mua sam gon hon",
        lines: [
          "Thong tin tai khoan, don hang va xac minh",
          "duoc giu trong cung mot luong ro rang.",
        ],
      },
    ],
  },
  register: {
    eyebrow: "Khoi tao tai khoan",
    title: ["Tao tai khoan", "va bat dau", "hanh trinh", "trang tri."],
    description: [
      "Dang ky de luu san pham yeu thich, thong tin giao hang",
      "va bat dau xay dung bo suu tap noi that mang dau an rieng.",
    ],
    cards: [
      {
        title: "Luu gu bai tri cua ban",
        lines: [
          "Tai khoan moi giup ban gom cac mon do hop gu",
          "vao mot noi de quay lai nhanh hon sau nay.",
        ],
      },
      {
        title: "Mua sam thuan tay hon",
        lines: [
          "Dien thong tin mot lan de ve sau thao tac",
          "dang nhap, dat hang va theo doi deu gon hon.",
        ],
      },
    ],
  },
  otp: {
    eyebrow: "Xac minh Google",
    title: ["Nhap OTP", "de hoan tat", "dang nhap", "an toan."],
    description: [
      "Ma OTP duoc gui den email cua ban de xac nhan",
      "rang dung chu tai khoan dang tiep tuc dang nhap bang Google.",
    ],
    cards: [
      {
        title: "Xac minh nhanh gon",
        lines: [
          "Nhap ma gom 6 chu so vua duoc gui toi email",
          "de ket thuc luong dang nhap an toan hon.",
        ],
      },
      {
        title: "Gui lai khi can",
        lines: [
          "Neu ma cu het han, ban co the yeu cau",
          "gui lai OTP moi ngay trong panel nay.",
        ],
      },
    ],
  },
  forgot: {
    eyebrow: "Khoi phuc truy cap tai khoan",
    title: ["Dat lai", "mat khau", "mot cach", "an toan."],
    description: [
      "Luong quen mat khau duoc tach rieng de giu cac buoc",
      "xac minh, nhap OTP va cap nhat mat khau ro rang hon.",
    ],
    cards: [
      {
        title: "OTP gui qua email",
        lines: [
          "Nhap email dang ky de nhan ma OTP dat lai",
          "mat khau trong mot luong ngan gon, de theo doi.",
        ],
      },
      {
        title: "Quay lai nhanh hon",
        lines: [
          "Sau khi cap nhat mat khau moi, ban co the tro lai",
          "man dang nhap ngay ma khong can thao tac lai tu dau.",
        ],
      },
    ]
  },
};

export function inputClassName() {
  return "h-14 w-full rounded-[20px] border border-[#d8c4ae] bg-white/88 px-4 text-[15px] font-medium text-[#2f241f] outline-none transition placeholder:text-[#a49a93] focus:border-[#8c5f3f] focus:shadow-[0_0_0_4px_rgba(140,95,63,0.12)] md:h-15 md:px-5 md:text-base";
}

export function primaryButtonClassName() {
  return "rounded-[20px] bg-[linear-gradient(135deg,#8c5f3f_0%,#d87b38_100%)] px-5 py-4 text-base font-bold text-[#fffaf4] shadow-[0_18px_36px_rgba(140,95,63,0.22)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70";
}

export function secondaryButtonClassName() {
  return "rounded-[20px] border border-[#d8c4ae] bg-white/80 px-5 py-4 font-bold text-[#6a544a] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";
}
