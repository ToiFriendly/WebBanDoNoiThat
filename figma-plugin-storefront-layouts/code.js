const THEME = {
  ink: "#2F241F",
  inkSoft: "#5C4A40",
  bronze: "#8C5F3F",
  copper: "#D87B38",
  accent: "#C86C2F",
  paper: "#FFFBF5",
  shell: "#FFF8F0",
  shellAlt: "#F5EFE6",
  cream: "#F6EFE4",
  clay: "#F3E5D7",
  line: "#D8C4AE",
  warm: "#F8EFE3",
  success: "#EDF7F0",
  successInk: "#2F6B43",
  info: "#EEF4FB",
  infoInk: "#3F628A",
  danger: "#FFF0EB",
  dangerInk: "#9B4731",
  muted: "#F2EDE7",
  mutedInk: "#6D5B4E",
  shadow: "#4F3423",
  momo: "#D91B8D",
  momoDark: "#B11073",
  momoLight: "#FFE9F6",
  momoLine: "#FFD1EB",
  momoYellow: "#FFE34D",
};

const DEFAULT_ASSET_BASE_URL = "http://localhost:5000";
const SCREEN_OVERRIDE_KEYS = ["cart", "history", "tracking", "payment"];
const IMAGE_CACHE = new Map();
const SAMPLE_IMAGE_URLS = {
  sofa:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  rug:
    "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=800&q=80",
  bed:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  cabinet:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  desk:
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
};

const PRESETS = {
  cart: {
    frameName: "Storefront / Gio hang",
    title: "Gio hang",
    subtitle: "",
    assetBaseUrl: DEFAULT_ASSET_BASE_URL,
    headerCartCount: 5,
    accountName: "Nguyen Phuc Hau",
    summaryEyebrow: "Thanh toan",
    summaryTitle: "Tom tat don hang",
    items: [
      {
        category: "Sofa",
        name: "Sofa da",
        image: SAMPLE_IMAGE_URLS.sofa,
        stock: "Ton kho hien tai: 58",
        quantity: 2,
        unitPrice: "3.000.000 d",
        lineTotal: "6.000.000 d",
      },
      {
        category: "Textile",
        name: "Tham decor",
        image: SAMPLE_IMAGE_URLS.rug,
        stock: "Ton kho hien tai: 60",
        quantity: 1,
        unitPrice: "2.500.000 d",
        lineTotal: "2.500.000 d",
      },
      {
        category: "Bedroom",
        name: "Giuong don",
        image: SAMPLE_IMAGE_URLS.bed,
        stock: "Ton kho hien tai: 19",
        quantity: 1,
        unitPrice: "2.000.000 d",
        lineTotal: "2.000.000 d",
      },
      {
        category: "Storage",
        name: "Tu don go",
        image: SAMPLE_IMAGE_URLS.cabinet,
        stock: "Ton kho hien tai: 1",
        quantity: 1,
        unitPrice: "1.000.000 d",
        lineTotal: "1.000.000 d",
      },
    ],
    summary: [
      { label: "Tong so luong", value: "5" },
      { label: "Tam tinh", value: "11.500.000 d" },
      { label: "Phi van chuyen", value: "0 d" },
      { label: "Giam gia", value: "0 d" },
    ],
    total: "11.500.000 d",
    shippingRows: [
      [{ label: "Ho va ten", value: "Nguyen Phuc Hau" }],
      [{ label: "So dien thoai", value: "0748372683" }],
      [{ label: "Dia chi", value: "" }],
      [
        { label: "Phuong / Xa", value: "" },
        { label: "Quan / Huyen", value: "" },
      ],
      [
        { label: "Tinh / Thanh pho", value: "" },
        { label: "Quoc gia", value: "Viet Nam" },
      ],
      [{ label: "Ghi chu", value: "Vi du: goi truoc khi giao hang..." }],
    ],
    paymentMethods: [
      {
        label: "Thanh toan bang MoMo",
        note: "Nhan QR va xac nhan trong ung dung",
        selected: true,
      },
      {
        label: "Thanh toan khi nhan hang",
        note: "Thanh toan sau khi nhan hang",
        selected: false,
      },
    ],
    primaryAction: "Dat hang va den MoMo",
    continueLabel: "Tiep tuc mua sam",
    recommendationsTitle: "Nhung san pham tuong tu",
    recommendations: [
      {
        category: "Ban",
        name: "Ban lam viec",
        image: SAMPLE_IMAGE_URLS.desk,
        price: "2.299.999 d",
      },
    ],
  },
  history: {
    frameName: "Storefront / Lich su don hang",
    title: "Lich su don hang",
    subtitle:
      "Giao dien gon gon hon, xem nhanh don da mua va mo chi tiet khi can.",
    assetBaseUrl: DEFAULT_ASSET_BASE_URL,
    headerCartCount: 0,
    accountName: "Nguyen Phuc Hau",
    selectedFilterIndex: 0,
    filters: [
      "Tat ca",
      "Dang xu ly",
      "Cho xac nhan",
      "Da xac nhan",
      "Dang giao",
      "Hoan thanh",
      "Da huy",
    ],
    orders: [
      {
        code: "DH17753267925412695",
        status: "Cho xac nhan",
        tone: "warm",
        paymentStatus: "Cho thanh toan",
        paymentTone: "warm",
        paymentMethod: "COD",
        date: "01:19 5 thg 4, 2026",
        itemTitle: "Sofa da",
        itemImage: SAMPLE_IMAGE_URLS.sofa,
        itemMeta: "2 x 3.000.000 d - +3 san pham khac",
        total: "11.500.000 d",
        quantity: "5 san pham",
      },
      {
        code: "DH17753180677899770",
        status: "Cho xac nhan",
        tone: "warm",
        paymentStatus: "Cho thanh toan",
        paymentTone: "warm",
        paymentMethod: "COD",
        date: "22:54 4 thg 4, 2026",
        itemTitle: "Tu don go",
        itemImage: SAMPLE_IMAGE_URLS.cabinet,
        itemMeta: "1 x 1.000.000 d - +4 san pham khac",
        total: "10.799.999 d",
        quantity: "5 san pham",
      },
    ],
  },
  tracking: {
    frameName: "Storefront / Theo doi don hang",
    title: "Theo dõi đơn hàng",
    subtitle:
      "Xem nhanh các đơn của bạn, lọc theo trạng thái và mở chi tiết ngay trên cùng một màn hình.",
    assetBaseUrl: DEFAULT_ASSET_BASE_URL,
    headerCartCount: 5,
    accountName: "Nguyen Phuc Hau",
    selectedFilterIndex: 0,
    filters: [
      "Tất cả",
      "Đang xử lý",
      "Chờ xác nhận",
      "Đã xác nhận",
      "Đang giao",
      "Hoàn thành",
      "Đã hủy",
    ],
    selectedCode: "DH17753267925412695",
    orders: [
      {
        code: "DH17753267925412695",
        date: "01:19 5/4/2026",
        status: "Chờ xác nhận",
        tone: "warm",
        total: "11.500.000 đ",
        items: [
          {
            name: "Sofa da",
            image: SAMPLE_IMAGE_URLS.sofa,
            price: "3.000.000 đ",
            quantity: 2,
          },
          {
            name: "Thảm decor",
            image: SAMPLE_IMAGE_URLS.rug,
            price: "2.500.000 đ",
            quantity: 1,
          },
          {
            name: "Giường Đơn",
            image: SAMPLE_IMAGE_URLS.bed,
            price: "2.000.000 đ",
            quantity: 1,
          },
          {
            name: "Tủ đơn gỗ",
            image: SAMPLE_IMAGE_URLS.cabinet,
            price: "1.000.000 đ",
            quantity: 1,
          },
        ],
      },
      {
        code: "DH17753180677899770",
        date: "22:54 4/4/2026",
        status: "Chờ xác nhận",
        tone: "warm",
        total: "10.799.999 đ",
        items: [
          {
            name: "Tủ đơn gỗ",
            image: SAMPLE_IMAGE_URLS.cabinet,
            price: "1.000.000 đ",
            quantity: 1,
          },
          {
            name: "Giường Đơn",
            image: SAMPLE_IMAGE_URLS.bed,
            price: "2.000.000 đ",
            quantity: 1,
          },
          {
            name: "Sofa da",
            image: SAMPLE_IMAGE_URLS.sofa,
            price: "3.000.000 đ",
            quantity: 1,
          },
          {
            name: "Bàn làm việc",
            image: SAMPLE_IMAGE_URLS.desk,
            price: "2.299.999 đ",
            quantity: 1,
          },
        ],
      },
    ],
    summary: {
      code: "DH17753267925412695",
      date: "Đặt lúc 01:19 5/4/2026",
      status: "Chờ xác nhận",
      statusTone: "warm",
      paymentStatus: "Chờ thanh toán",
      paymentTone: "warm",
      total: "11.500.000 đ",
      method: "COD",
      quantity: "5 sản phẩm",
    },
    steps: [
      {
        title: "Đặt hàng",
        state: "completed",
        description: "Hệ thống đã ghi nhận đơn hàng của bạn.",
      },
      {
        title: "Xác nhận",
        state: "current",
        description: "Đơn hàng đang được cửa hàng xác nhận.",
      },
      {
        title: "Vận chuyển",
        state: "inactive",
        description: "Đơn hàng đang trên đường giao tới bạn.",
      },
      {
        title: "Hoàn thành",
        state: "inactive",
        description: "Đơn hàng đã giao thành công.",
      },
    ],
    shipping: {
      fullName: "Nguyen Phuc Hau",
      phone: "0748372683",
      address: "adsad, fafs, fasd, ud, Viet Nam",
      note: "sd",
    },
  },
  payment: {
    frameName: "Storefront / Thanh toán MoMo",
    assetBaseUrl: DEFAULT_ASSET_BASE_URL,
    gatewayTitle: "Cổng thanh toán MoMo",
    supplierLabel: "Nhà cung cấp",
    supplierName: "MoMo Payment",
    orderLabel: "Mã đơn hàng",
    orderCode: "DH17753665745968091",
    descriptionLabel: "Mô tả",
    description: "Thanh toán đơn hàng D...",
    amountLabel: "Số tiền",
    amount: "11.799.999đ",
    countdownTitle: "Đơn hàng sẽ hết hạn sau:",
    countdown: {
      hours: "01",
      minutes: "39",
      seconds: "36",
    },
    countdownUnits: ["Giờ", "Phút", "Giây"],
    backLabel: "Quay về",
    promotionText: "Tích xu đổi quà cho mọi giao dịch",
    walletLabel: "Ví Trả Sau",
    instruction:
      "Sử dụng App MoMo hoặc ứng dụng camera hỗ trợ QR code để quét mã",
    helpText: "Gặp khó khăn khi thanh toán?",
    helpLink: "Xem Hướng dẫn",
    footerLeft: "© 2023 - Cổng thanh toán MoMo",
    footerRight: "Hỗ trợ khách hàng:",
    qrImage: "",
  },
};

figma.showUI(__html__, {
  width: 400,
  height: 620,
  themeColors: true,
});

figma.ui.onmessage = async (message) => {
  if (message.type === "cancel") {
    figma.closePlugin();
    return;
  }

  if (message.type !== "generate") {
    return;
  }

  try {
    postStatus("Dang load font va tao screen...");
    await loadFonts();

    const scale = clamp(Number(message.scale) || 1, 0.7, 1.2);
    const targetScreens =
      message.screen === "all"
        ? ["cart", "history", "tracking", "payment"]
        : [message.screen];

    const startX = getNextCanvasX();
    const topY = 0;
    const createdFrames = [];
    let cursorX = startX;

    for (const screenId of targetScreens) {
      const preset = buildPreset(screenId, message.overrides);
      const frame = await buildScreen(screenId, preset, cursorX, topY, scale);
      createdFrames.push(frame);
      cursorX += frame.width + px(180, scale);
    }

    figma.currentPage.selection = createdFrames;
    figma.viewport.scrollAndZoomIntoView(createdFrames);
    figma.notify(
      createdFrames.length > 1
        ? `Da tao ${createdFrames.length} man hinh storefront.`
        : `Da tao man hinh ${createdFrames[0].name}.`,
    );
    figma.closePlugin();
  } catch (error) {
    const messageText =
      error && typeof error.message === "string"
        ? error.message
        : "Khong the tao layout Figma.";

    postStatus(messageText);
    figma.notify(messageText, { error: true });
  }
};

function postStatus(message) {
  figma.ui.postMessage({
    type: "status",
    message,
  });
}

async function loadFonts() {
  const fonts = [
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Semi Bold" },
    { family: "Inter", style: "Bold" },
  ];

  await Promise.all(fonts.map((font) => figma.loadFontAsync(font)));
}

function buildPreset(screenId, overrides) {
  const base = clone(PRESETS[screenId]);

  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
    return base;
  }

  const sharedOverrides = Object.fromEntries(
    Object.entries(overrides).filter(
      ([key]) => !SCREEN_OVERRIDE_KEYS.includes(key),
    ),
  );
  const mergedBase = deepMerge(base, sharedOverrides);

  if (screenId && overrides[screenId]) {
    return deepMerge(mergedBase, overrides[screenId]);
  }

  return mergedBase;
}

async function buildScreen(screenId, preset, x, y, scale) {
  if (screenId === "cart") {
    return buildCartScreen(preset, x, y, scale);
  }

  if (screenId === "history") {
    return buildHistoryScreen(preset, x, y, scale);
  }

  if (screenId === "tracking") {
    return buildTrackingScreen(preset, x, y, scale);
  }

  if (screenId === "payment") {
    return buildPaymentScreen(preset, x, y, scale);
  }

  throw new Error(`Preset ${screenId} khong duoc ho tro.`);
}

async function buildCartScreen(preset, x, y, scale) {
  const screen = createScreenScaffold({
    name: preset.frameName,
    activeNav: "cart",
    preset,
    x,
    y,
    scale,
  });
  const contentWidth = px(1132, scale);

  const cartSurface = createAutoFrame("Cart Surface", {
    width: contentWidth,
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(24, scale),
    fills: [solidPaint(THEME.paper, 0.55)],
    radius: px(30, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.1, weight: 1 },
    effects: [softShadow(scale)],
  });
  screen.shell.appendChild(cartSurface);

  const mainRow = createAutoFrame("Cart Main Row", {
    layoutMode: "HORIZONTAL",
    width: px(1096, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });
  cartSurface.appendChild(mainRow);

  const leftColumn = createAutoFrame("Cart Items", {
    width: px(712, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
  });
  const rightColumn = createAutoFrame("Checkout Column", {
    width: px(360, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
  });
  mainRow.appendChild(leftColumn);
  mainRow.appendChild(createVerticalDivider(px(1, scale), scale));
  mainRow.appendChild(rightColumn);

  for (const [index, item] of preset.items.entries()) {
    leftColumn.appendChild(await createCartItemCard(item, scale, preset.assetBaseUrl));
    if (index < preset.items.length - 1) {
      leftColumn.appendChild(createDivider(px(712, scale), scale));
    }
  }

  leftColumn.appendChild(
    createTextNode("Continue Link", preset.continueLabel || "Tiep tuc mua sam", {
      style: "Semi Bold",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.bronze,
    }),
  );

  rightColumn.appendChild(
    createCheckoutLead(
      preset.summaryEyebrow || "Thanh toan",
      preset.summaryTitle || "Tom tat don hang",
      scale,
    ),
  );
  rightColumn.appendChild(createSummaryCard(preset, scale));
  rightColumn.appendChild(createShippingCard(preset, scale));
  rightColumn.appendChild(createPaymentCard(preset, scale));
  rightColumn.appendChild(createCheckoutButton(preset.primaryAction, scale));

  screen.shell.appendChild(await createRecommendationSection(preset, scale));
  finalizeScreen(screen, scale);
  return screen.frame;
}

async function buildHistoryScreen(preset, x, y, scale) {
  const screen = createScreenScaffold({
    name: preset.frameName,
    activeNav: "history",
    preset,
    x,
    y,
    scale,
  });
  const contentWidth = px(1132, scale);

  screen.shell.appendChild(
    createFilterRow(
      "Filter Row",
      preset.filters,
      preset.selectedFilterIndex || 0,
      scale,
    ),
  );
  screen.shell.appendChild(
    createTextNode("Results Count", `${preset.orders.length} don dang hien thi`, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#7D685A",
    }),
  );

  for (const order of preset.orders) {
    screen.shell.appendChild(
      await createOrderHistoryCard(order, scale, preset.assetBaseUrl),
    );
  }

  finalizeScreen(screen, scale);
  return screen.frame;
}

async function buildTrackingScreen(preset, x, y, scale) {
  const screen = createScreenScaffold({
    name: preset.frameName,
    activeNav: "tracking",
    preset,
    x,
    y,
    scale,
  });
  const contentWidth = px(1132, scale);

  screen.shell.appendChild(
    createFilterRow(
      "Filter Row",
      preset.filters,
      preset.selectedFilterIndex || 0,
      scale,
    ),
  );

  const bodyRow = createAutoFrame("Tracking Body", {
    layoutMode: "HORIZONTAL",
    width: contentWidth,
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });
  screen.shell.appendChild(bodyRow);

  const sidebar = createAutoFrame("Tracking Sidebar", {
    width: px(280, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(30, scale),
    padding: [px(16, scale), px(16, scale), px(16, scale), px(16, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });
  const detail = createAutoFrame("Tracking Detail", {
    width: px(840, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });
  bodyRow.appendChild(sidebar);
  bodyRow.appendChild(detail);

  sidebar.appendChild(
    createSectionLead(
      "Sidebar Lead",
      "Đơn của bạn",
      `${preset.orders.length} đơn đang hiển thị`,
      px(248, scale),
      scale,
      true,
    ),
  );

  for (const order of preset.orders) {
    sidebar.appendChild(
      await createOrderPreviewCard(
        order,
        order.code === preset.selectedCode,
        scale,
        preset.assetBaseUrl,
      ),
    );
  }

  detail.appendChild(createTrackingOverviewCard(preset.summary, preset.steps, scale));
  detail.appendChild(createShippingInfoCard(preset.shipping, preset.summary, scale));

  finalizeScreen(screen, scale);
  return screen.frame;
}

async function buildPaymentScreen(preset, x, y, scale) {
  const frame = figma.createFrame();
  frame.name = preset.frameName;
  frame.resizeWithoutConstraints(px(1440, scale), px(860, scale));
  frame.x = x;
  frame.y = y;
  frame.fills = [solidPaint("#FFF9FC", 1)];
  frame.clipsContent = true;

  createPaymentBackground(frame, scale);

  const topBar = createPaymentTopBar(preset, scale);
  frame.appendChild(topBar);
  topBar.x = 0;
  topBar.y = 0;

  const contentRow = createAutoFrame("Payment Content", {
    layoutMode: "HORIZONTAL",
    width: px(1140, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(36, scale),
    fills: [],
    counterAxisAlignItems: "MIN",
  });
  frame.appendChild(contentRow);
  contentRow.x = Math.round((frame.width - contentRow.width) / 2);
  contentRow.y = px(122, scale);

  const leftColumn = createAutoFrame("Payment Left", {
    width: px(356, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(22, scale),
    fills: [],
  });
  const rightColumn = createAutoFrame("Payment Right", {
    width: px(748, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: 0,
    fills: [],
  });
  contentRow.appendChild(leftColumn);
  contentRow.appendChild(rightColumn);

  leftColumn.appendChild(createPaymentInfoCard(preset, scale));
  leftColumn.appendChild(createPaymentCountdownCard(preset, scale));

  const qrPanel = await createPaymentQrPanel(preset, scale);
  rightColumn.appendChild(qrPanel);

  const footer = createPaymentFooter(preset, scale);
  frame.appendChild(footer);
  footer.x = 0;
  footer.y = frame.height - footer.height;

  return frame;
}

function createScreenScaffold({ name, activeNav, preset, x, y, scale }) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resizeWithoutConstraints(px(1440, scale), px(1560, scale));
  frame.x = x;
  frame.y = y;
  frame.fills = [solidPaint(THEME.cream, 1)];
  frame.clipsContent = false;

  const decorations = [];
  decorations.push(
    createEllipse(frame, "Glow Top", px(300, scale), px(300, scale), {
      x: px(-52, scale),
      y: px(-72, scale),
      fill: solidPaint("#FAC06A", 0.18),
    }),
  );
  decorations.push(
    createEllipse(frame, "Glow Bottom", px(240, scale), px(240, scale), {
      x: px(1120, scale),
      y: px(1180, scale),
      fill: solidPaint("#A16207", 0.08),
    }),
  );
  decorations.push(
    createEllipse(frame, "Glow Mid", px(180, scale), px(180, scale), {
      x: px(1180, scale),
      y: px(280, scale),
      fill: solidPaint("#D87B38", 0.06),
    }),
  );

  const shell = createAutoFrame("Shell", {
    width: px(1180, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(24, scale),
    fills: [solidPaint(THEME.paper, 0.86)],
    radius: px(32, scale),
    padding: [px(24, scale), px(24, scale), px(24, scale), px(24, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.12, weight: 1 },
    effects: [dropShadow(scale)],
  });
  frame.appendChild(shell);
  shell.x = Math.round((frame.width - shell.width) / 2);
  shell.y = px(32, scale);

  shell.appendChild(createStoreHeader(activeNav, preset, scale));
  shell.appendChild(createPageIntro(preset, scale));

  return { frame, shell, decorations };
}

function createPaymentBackground(frame, scale) {
  createDotCluster(frame, px(18, scale), px(112, scale), 16, 7, px(18, scale), "#FFD9ED", 0.7, px(3, scale));
  createDotCluster(frame, frame.width - px(142, scale), frame.height - px(150, scale), 8, 5, px(18, scale), "#FFD9ED", 0.7, px(3, scale));

  createEllipse(frame, "Payment Glow Left", px(360, scale), px(360, scale), {
    x: px(-120, scale),
    y: px(82, scale),
    fill: solidPaint("#FFF2FA", 1),
  });
  createEllipse(frame, "Payment Glow Right", px(210, scale), px(210, scale), {
    x: frame.width - px(250, scale),
    y: px(42, scale),
    fill: solidPaint("#FFF2FA", 1),
  });
}

function createPaymentTopBar(preset, scale) {
  const bar = createAutoFrame("Payment Top Bar", {
    layoutMode: "HORIZONTAL",
    width: px(1440, scale),
    height: px(86, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(18, scale),
    fills: [solidPaint("#FFFFFF", 1)],
    padding: [0, px(140, scale), 0, px(140, scale)],
    stroke: { color: "#EFD7E5", opacity: 1, weight: 1 },
    counterAxisAlignItems: "CENTER",
  });

  bar.appendChild(createMomoLogoBadge(px(58, scale), scale));
  bar.appendChild(
    createTextNode("Gateway Title", preset.gatewayTitle, {
      style: "Medium",
      fontSize: px(22, scale),
      lineHeight: px(30, scale),
      fill: "#26374D",
    }),
  );

  return bar;
}

function createPaymentInfoCard(preset, scale) {
  const card = createAutoFrame("Payment Info Card", {
    width: px(356, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [solidPaint("#FFFFFF", 1)],
    radius: px(16, scale),
    padding: [px(24, scale), px(24, scale), px(24, scale), px(24, scale)],
    stroke: { color: "#E5E7EE", opacity: 1, weight: 1 },
  });

  card.appendChild(
    createTextNode("Info Heading", "Thông tin đơn hàng", {
      style: "Semi Bold",
      fontSize: px(22, scale),
      lineHeight: px(30, scale),
      fill: "#213246",
    }),
  );

  card.appendChild(
    createTextNode("Supplier Label", preset.supplierLabel, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#66778F",
    }),
  );

  const supplierRow = createAutoFrame("Supplier Row", {
    layoutMode: "HORIZONTAL",
    width: px(308, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  supplierRow.appendChild(createMomoLogoBadge(px(22, scale), scale));
  supplierRow.appendChild(
    createTextNode("Supplier Name", preset.supplierName, {
      style: "Semi Bold",
      fontSize: px(18, scale),
      lineHeight: px(24, scale),
      fill: "#213246",
      width: px(276, scale),
    }),
  );
  card.appendChild(supplierRow);
  card.appendChild(createDivider(px(308, scale)));

  card.appendChild(createPaymentField(preset.orderLabel, preset.orderCode, scale));
  card.appendChild(createDivider(px(308, scale)));
  card.appendChild(createPaymentField(preset.descriptionLabel, preset.description, scale));
  card.appendChild(createDivider(px(308, scale)));

  const amountBlock = createAutoFrame("Amount Block", {
    width: px(308, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
  });
  amountBlock.appendChild(
    createTextNode("Amount Label", preset.amountLabel, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#66778F",
    }),
  );
  amountBlock.appendChild(
    createTextNode("Amount Value", preset.amount, {
      style: "Medium",
      fontSize: px(38, scale),
      lineHeight: px(46, scale),
      fill: "#24364A",
    }),
  );
  card.appendChild(amountBlock);

  return card;
}

function createPaymentField(label, value, scale) {
  const block = createAutoFrame("Payment Field", {
    width: px(308, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
  });

  block.appendChild(
    createTextNode("Field Label", label, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#66778F",
    }),
  );
  block.appendChild(
    createTextNode("Field Value", value, {
      style: "Semi Bold",
      fontSize: px(16, scale),
      lineHeight: px(24, scale),
      fill: "#213246",
      width: px(308, scale),
    }),
  );

  return block;
}

function createPaymentCountdownCard(preset, scale) {
  const wrap = createAutoFrame("Countdown Wrap", {
    width: px(356, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });

  const card = createAutoFrame("Countdown Card", {
    width: px(356, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [solidPaint("#FFF0F8", 1)],
    radius: px(14, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
    counterAxisAlignItems: "CENTER",
  });
  wrap.appendChild(card);

  const title = createTextNode("Countdown Title", preset.countdownTitle, {
    style: "Medium",
    fontSize: px(15, scale),
    lineHeight: px(22, scale),
    fill: THEME.momo,
    width: px(300, scale),
  });
  title.textAlignHorizontal = "CENTER";
  card.appendChild(title);

  const row = createAutoFrame("Countdown Row", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [],
  });
  card.appendChild(row);

  const countdown = preset.countdown || {};
  const values = [
    countdown.hours || "01",
    countdown.minutes || "39",
    countdown.seconds || "36",
  ];

  values.forEach((value, index) => {
    row.appendChild(
      createCountdownCell(
        value,
        (preset.countdownUnits || [])[index] || "",
        scale,
      ),
    );
  });

  const back = createTextNode("Back Link", preset.backLabel, {
    style: "Semi Bold",
    fontSize: px(14, scale),
    lineHeight: px(20, scale),
    fill: THEME.momo,
  });
  wrap.appendChild(back);

  return wrap;
}

function createCountdownCell(value, unit, scale) {
  const cell = createAutoFrame("Countdown Cell", {
    width: px(56, scale),
    height: px(76, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(8, scale),
    fills: [solidPaint("#F6D4E8", 1)],
    radius: px(12, scale),
    counterAxisAlignItems: "CENTER",
    primaryAxisAlignItems: "CENTER",
  });

  const valueNode = createTextNode("Countdown Value", value, {
    style: "Bold",
    fontSize: px(18, scale),
    lineHeight: px(22, scale),
    fill: THEME.momo,
  });
  valueNode.textAlignHorizontal = "CENTER";

  const unitNode = createTextNode("Countdown Unit", unit, {
    style: "Regular",
    fontSize: px(11, scale),
    lineHeight: px(16, scale),
    fill: THEME.momo,
  });
  unitNode.textAlignHorizontal = "CENTER";

  cell.appendChild(valueNode);
  cell.appendChild(unitNode);
  return cell;
}

async function createPaymentQrPanel(preset, scale) {
  const panel = figma.createFrame();
  panel.name = "Payment QR Panel";
  panel.layoutMode = "NONE";
  panel.resizeWithoutConstraints(px(748, scale), px(718, scale));
  panel.fills = [solidPaint(THEME.momo, 1)];
  panel.cornerRadius = px(16, scale);
  panel.clipsContent = true;

  createDotCluster(panel, px(58, scale), px(32, scale), 14, 10, px(8, scale), "#FFFFFF", 0.24, px(2, scale));
  createDotCluster(panel, px(20, scale), px(386, scale), 11, 11, px(8, scale), "#FFFFFF", 0.18, px(2, scale));
  createEllipse(panel, "Panel Glow", px(160, scale), px(160, scale), {
    x: px(248, scale),
    y: px(76, scale),
    fill: solidPaint("#FF7CC4", 0.18),
  });

  const diamond = figma.createRectangle();
  diamond.name = "Diamond";
  diamond.resizeWithoutConstraints(px(122, scale), px(122, scale));
  diamond.rotation = 45;
  diamond.x = px(56, scale);
  diamond.y = px(208, scale);
  diamond.fills = [solidPaint("#FFFFFF", 0.12)];
  panel.appendChild(diamond);

  const promo = createPaymentPromoBanner(preset, scale);
  panel.appendChild(promo);
  promo.x = px(178, scale);
  promo.y = px(16, scale);

  const wallet = createPaymentWalletBanner(preset, scale);
  panel.appendChild(wallet);
  wallet.x = Math.round((panel.width - wallet.width) / 2);
  wallet.y = px(88, scale);

  const qrCard = await createQrCodeCard(preset, scale);
  panel.appendChild(qrCard);
  qrCard.x = Math.round((panel.width - qrCard.width) / 2);
  qrCard.y = px(174, scale);

  const instructionWrap = createAutoFrame("Instruction Wrap", {
    width: px(520, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  panel.appendChild(instructionWrap);
  instructionWrap.x = Math.round((panel.width - instructionWrap.width) / 2);
  instructionWrap.y = px(560, scale);

  const instruction = createTextNode("Instruction", preset.instruction, {
    style: "Semi Bold",
    fontSize: px(18, scale),
    lineHeight: px(32, scale),
    fill: "#FFFFFF",
    width: px(520, scale),
  });
  instruction.textAlignHorizontal = "CENTER";
  instructionWrap.appendChild(instruction);

  const help = createAutoFrame("Help Row", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  instructionWrap.appendChild(help);
  help.appendChild(
    createTextNode("Help Text", preset.helpText, {
      style: "Medium",
      fontSize: px(16, scale),
      lineHeight: px(24, scale),
      fill: "#FFFFFF",
    }),
  );
  help.appendChild(
    createTextNode("Help Link", preset.helpLink, {
      style: "Bold",
      fontSize: px(16, scale),
      lineHeight: px(24, scale),
      fill: THEME.momoYellow,
    }),
  );

  return panel;
}

function createPaymentPromoBanner(preset, scale) {
  const wrap = createAutoFrame("Payment Promo", {
    layoutMode: "HORIZONTAL",
    width: px(382, scale),
    height: px(56, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(12, scale),
    fills: [solidPaint("#FFFFFF", 1)],
    radius: px(14, scale),
    padding: [px(8, scale), px(14, scale), px(8, scale), px(8, scale)],
    counterAxisAlignItems: "CENTER",
  });

  wrap.appendChild(createMomoLogoBadge(px(40, scale), scale));
  wrap.appendChild(
    createTextNode("Promo Text", preset.promotionText, {
      style: "Bold",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.momo,
      width: px(248, scale),
    }),
  );
  wrap.appendChild(createMomoLogoBadge(px(36, scale), scale));
  return wrap;
}

function createPaymentWalletBanner(preset, scale) {
  const wrap = createAutoFrame("Wallet Banner", {
    layoutMode: "HORIZONTAL",
    width: px(392, scale),
    height: px(58, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(16, scale),
    fills: [solidPaint("#FFFFFF", 1)],
    radius: px(14, scale),
    padding: [px(8, scale), px(18, scale), px(8, scale), px(18, scale)],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });

  const left = createAutoFrame("Wallet Left", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  wrap.appendChild(left);

  const labelChip = createAutoFrame("Wallet Label Chip", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: px(32, scale),
    autoWidth: true,
    autoHeight: false,
    itemSpacing: px(10, scale),
    fills: [solidPaint("#FFF4FA", 1)],
    radius: px(8, scale),
    padding: [0, px(10, scale), 0, px(10, scale)],
    stroke: { color: "#E3A2C9", opacity: 1, weight: 1 },
    counterAxisAlignItems: "CENTER",
  });
  labelChip.appendChild(
    createTextNode("Wallet Label", preset.walletLabel, {
      style: "Bold",
      fontSize: px(14, scale),
      lineHeight: px(18, scale),
      fill: "#2A3345",
    }),
  );
  left.appendChild(labelChip);
  left.appendChild(createMomoLogoBadge(px(32, scale), scale));

  wrap.appendChild(createMomoLogoBadge(px(40, scale), scale));
  return wrap;
}

async function createQrCodeCard(preset, scale) {
  const card = figma.createFrame();
  card.name = "QR Card";
  card.layoutMode = "NONE";
  card.resizeWithoutConstraints(px(352, scale), px(350, scale));
  card.fills = [solidPaint("#FFFFFF", 1)];
  card.cornerRadius = px(18, scale);
  card.clipsContent = true;

  const band = figma.createRectangle();
  band.name = "QR Header Band";
  band.resizeWithoutConstraints(px(280, scale), px(22, scale));
  band.x = px(36, scale);
  band.y = px(18, scale);
  band.fills = [solidPaint("#F5CFE5", 1)];
  card.appendChild(band);

  createCornerBracket(card, px(20, scale), px(18, scale), px(28, scale), px(28, scale), px(4, scale), THEME.momoDark, "tl");
  createCornerBracket(card, card.width - px(20, scale), px(18, scale), px(28, scale), px(28, scale), px(4, scale), THEME.momoDark, "tr");
  createCornerBracket(card, px(20, scale), card.height - px(20, scale), px(28, scale), px(28, scale), px(4, scale), THEME.momoDark, "bl");
  createCornerBracket(card, card.width - px(20, scale), card.height - px(20, scale), px(28, scale), px(28, scale), px(4, scale), THEME.momoDark, "br");

  if (preset.qrImage) {
    const imageHash = await loadImageHash(preset.qrImage, preset.assetBaseUrl);

    if (imageHash) {
      const qr = figma.createRectangle();
      qr.name = "QR Image";
      qr.resizeWithoutConstraints(px(260, scale), px(260, scale));
      qr.x = Math.round((card.width - qr.width) / 2);
      qr.y = px(42, scale);
      qr.fills = [imagePaint(imageHash, "FILL")];
      card.appendChild(qr);
    } else {
      card.appendChild(createFakeQrCode(px(260, scale), scale));
    }
  } else {
    const fakeQr = createFakeQrCode(px(260, scale), scale);
    card.appendChild(fakeQr);
    fakeQr.x = Math.round((card.width - fakeQr.width) / 2);
    fakeQr.y = px(42, scale);
  }

  const centerBadge = createMomoCircleBadge(px(54, scale), scale);
  card.appendChild(centerBadge);
  centerBadge.x = Math.round((card.width - centerBadge.width) / 2);
  centerBadge.y = Math.round((card.height - centerBadge.height) / 2);

  return card;
}

function createCornerBracket(parent, x, y, width, height, thickness, color, corner) {
  const horizontal = figma.createRectangle();
  horizontal.name = `Bracket H ${corner}`;
  horizontal.resizeWithoutConstraints(width, thickness);
  horizontal.fills = [solidPaint(color, 1)];
  horizontal.cornerRadius = thickness / 2;

  const vertical = figma.createRectangle();
  vertical.name = `Bracket V ${corner}`;
  vertical.resizeWithoutConstraints(thickness, height);
  vertical.fills = [solidPaint(color, 1)];
  vertical.cornerRadius = thickness / 2;

  if (corner === "tl") {
    horizontal.x = x;
    horizontal.y = y;
    vertical.x = x;
    vertical.y = y;
  } else if (corner === "tr") {
    horizontal.x = x - width;
    horizontal.y = y;
    vertical.x = x - thickness;
    vertical.y = y;
  } else if (corner === "bl") {
    horizontal.x = x;
    horizontal.y = y - thickness;
    vertical.x = x;
    vertical.y = y - height;
  } else {
    horizontal.x = x - width;
    horizontal.y = y - thickness;
    vertical.x = x - thickness;
    vertical.y = y - height;
  }

  parent.appendChild(horizontal);
  parent.appendChild(vertical);
}

function createFakeQrCode(size, scale) {
  const qr = figma.createFrame();
  qr.name = "Fake QR";
  qr.layoutMode = "NONE";
  qr.resizeWithoutConstraints(size, size);
  qr.fills = [solidPaint("#FFFFFF", 1)];
  qr.clipsContent = true;

  const gridSize = 29;
  const cell = Math.floor(size / gridSize);

  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      if (!shouldFillQrCell(row, col, gridSize)) {
        continue;
      }

      const pixel = figma.createRectangle();
      pixel.name = `QR ${row}-${col}`;
      pixel.resizeWithoutConstraints(cell, cell);
      pixel.x = col * cell;
      pixel.y = row * cell;
      pixel.fills = [solidPaint("#101010", 1)];
      qr.appendChild(pixel);
    }
  }

  return qr;
}

function shouldFillQrCell(row, col, gridSize) {
  if (isFinderPatternCell(row, col, 0, 0)) {
    return true;
  }

  if (isFinderPatternCell(row, col, 0, gridSize - 7)) {
    return true;
  }

  if (isFinderPatternCell(row, col, gridSize - 7, 0)) {
    return true;
  }

  const onTimingRow = row === 6 && col > 7 && col < gridSize - 8;
  const onTimingCol = col === 6 && row > 7 && row < gridSize - 8;

  if (onTimingRow || onTimingCol) {
    return (row + col) % 2 === 0;
  }

  return (
    ((row * 7 + col * 11 + row * col) % 5 === 0) ||
    ((row + col) % 7 === 0 && row % 2 === 0) ||
    ((row * 3 + col * 5) % 11 === 0)
  );
}

function isFinderPatternCell(row, col, startRow, startCol) {
  if (
    row < startRow ||
    row >= startRow + 7 ||
    col < startCol ||
    col >= startCol + 7
  ) {
    return false;
  }

  const localRow = row - startRow;
  const localCol = col - startCol;
  const outer = localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
  const inner = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;

  return outer || inner;
}

function createPaymentFooter(preset, scale) {
  const footer = createAutoFrame("Payment Footer", {
    layoutMode: "HORIZONTAL",
    width: px(1440, scale),
    height: px(62, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(16, scale),
    fills: [solidPaint("#FFFFFF", 1)],
    padding: [0, px(140, scale), 0, px(140, scale)],
    stroke: { color: "#EAE4EC", opacity: 1, weight: 1 },
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });

  footer.appendChild(
    createTextNode("Footer Left", preset.footerLeft, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#62708A",
    }),
  );
  footer.appendChild(
    createTextNode("Footer Right", preset.footerRight, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: "#62708A",
    }),
  );

  return footer;
}

function createMomoLogoBadge(size, scale) {
  const badge = createAutoFrame("MoMo Badge", {
    width: size,
    height: size,
    autoWidth: false,
    autoHeight: false,
    itemSpacing: 0,
    fills: [solidPaint(THEME.momoDark, 1)],
    radius: Math.round(size * 0.18),
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
  });

  const label = createTextNode("MoMo Text", "mo\nmo", {
    style: "Bold",
    fontSize: Math.max(px(10, scale), Math.round(size * 0.34)),
    lineHeight: Math.round(size * 0.32),
    fill: "#FFFFFF",
    width: Math.max(size - px(6, scale), px(14, scale)),
  });
  label.textAlignHorizontal = "CENTER";
  badge.appendChild(label);

  return badge;
}

function createMomoCircleBadge(size, scale) {
  const badge = figma.createEllipse();
  badge.name = "MoMo Circle Badge";
  badge.resizeWithoutConstraints(size, size);
  badge.fills = [solidPaint(THEME.momoDark, 1)];

  const wrap = figma.createFrame();
  wrap.name = "MoMo Circle Wrap";
  wrap.layoutMode = "NONE";
  wrap.resizeWithoutConstraints(size, size);
  wrap.fills = [];
  wrap.strokes = [];
  wrap.appendChild(badge);

  const label = createTextNode("MoMo Circle Text", "mo\nmo", {
    style: "Bold",
    fontSize: Math.max(px(9, scale), Math.round(size * 0.28)),
    lineHeight: Math.round(size * 0.24),
    fill: "#FFFFFF",
    width: Math.max(size - px(8, scale), px(16, scale)),
  });
  label.textAlignHorizontal = "CENTER";
  wrap.appendChild(label);
  label.x = Math.round((size - label.width) / 2);
  label.y = Math.round((size - label.height) / 2);

  return wrap;
}

function createDotCluster(parent, x, y, cols, rows, spacing, color, opacity, dotSize) {
  const wrap = figma.createFrame();
  wrap.name = "Dot Cluster";
  wrap.layoutMode = "NONE";
  wrap.resizeWithoutConstraints(
    Math.max(cols - 1, 0) * spacing + dotSize,
    Math.max(rows - 1, 0) * spacing + dotSize,
  );
  wrap.x = x;
  wrap.y = y;
  wrap.fills = [];
  wrap.strokes = [];

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const dot = figma.createEllipse();
      dot.name = `Dot ${row}-${col}`;
      dot.resizeWithoutConstraints(dotSize, dotSize);
      dot.x = col * spacing;
      dot.y = row * spacing;
      dot.fills = [solidPaint(color, opacity)];
      wrap.appendChild(dot);
    }
  }

  parent.appendChild(wrap);
  return wrap;
}

function finalizeScreen(screen, scale) {
  const minHeight = px(1180, scale);
  const targetHeight = Math.max(
    minHeight,
    screen.shell.y + screen.shell.height + px(40, scale),
  );

  screen.frame.resizeWithoutConstraints(screen.frame.width, targetHeight);

  if (screen.decorations[1]) {
    screen.decorations[1].y = targetHeight - px(300, scale);
  }
}

function createStoreHeader(activeNav, preset, scale) {
  const header = createAutoFrame("Store Header", {
    layoutMode: "HORIZONTAL",
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(20, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });

  const brand = createTextNode("Brand", "Tiem Do Trang Tri Noi That", {
    style: "Bold",
    fontSize: px(16, scale),
    lineHeight: px(22, scale),
    fill: THEME.ink,
    letterSpacing: px(1, scale),
    textCase: "UPPER",
  });
  header.appendChild(brand);

  const nav = createAutoFrame("Navigation", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  header.appendChild(nav);

  const tabs = [
    { key: "home", label: "Trang chủ" },
    { key: "cart", label: `Giỏ hàng (${preset.headerCartCount || 0})` },
    { key: "tracking", label: "Theo dõi đơn" },
    { key: "history", label: "Lịch sử đơn" },
    { key: "account", label: preset.accountName || "Nguyen Phuc Hau" },
  ];

  tabs.forEach((tab) => {
    nav.appendChild(
      createButtonChip(
        tab.label,
        tab.key === "account" || tab.key === activeNav ? "primary" : "secondary",
        scale,
        0,
        true,
      ),
    );
  });

  return header;
}

function createPageIntro(preset, scale) {
  const intro = createAutoFrame("Page Intro", {
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });

  intro.appendChild(
    createTextNode("Page Title", preset.title, {
      style: "Semi Bold",
      fontSize: px(58, scale),
      lineHeight: px(66, scale),
      fill: THEME.ink,
    }),
  );

  if (preset.subtitle) {
    intro.appendChild(
      createTextNode("Page Subtitle", preset.subtitle, {
        style: "Regular",
        fontSize: px(15, scale),
        lineHeight: px(24, scale),
        fill: THEME.inkSoft,
        width: px(680, scale),
      }),
    );
  }

  return intro;
}

function createHeroCard(preset, scale) {
  const hero = createAutoFrame("Hero Card", {
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(30, scale),
    padding: [px(24, scale), px(24, scale), px(24, scale), px(24, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  hero.appendChild(
    createTextNode("Eyebrow", preset.eyebrow, {
      style: "Semi Bold",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.bronze,
      letterSpacing: px(1.4, scale),
      textCase: "UPPER",
    }),
  );

  hero.appendChild(
    createTextNode("Hero Title", preset.title, {
      style: "Semi Bold",
      fontSize: px(42, scale),
      lineHeight: px(48, scale),
      fill: THEME.ink,
    }),
  );

  const description = createTextNode("Hero Description", preset.description, {
    style: "Regular",
    fontSize: px(16, scale),
    lineHeight: px(26, scale),
    fill: THEME.inkSoft,
    width: px(680, scale),
  });
  hero.appendChild(description);

  const statsRow = createAutoFrame("Hero Stats", {
    layoutMode: "HORIZONTAL",
    width: px(1084, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
  });
  hero.appendChild(statsRow);

  preset.stats.forEach((stat) => {
    statsRow.appendChild(createMetricCard(stat, scale));
  });

  return hero;
}

function createMetricCard(stat, scale) {
  const card = createAutoFrame("Metric Card", {
    width: px(350, scale),
    height: px(116, scale),
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(8, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(22, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  card.appendChild(
    createTextNode("Metric Value", stat.value, {
      style: "Bold",
      fontSize: px(24, scale),
      lineHeight: px(30, scale),
      fill: THEME.accent,
    }),
  );
  card.appendChild(
    createTextNode("Metric Label", stat.label, {
      style: "Medium",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
      width: px(280, scale),
    }),
  );

  return card;
}

function createSectionLead(name, title, description, width, scale, compact) {
  const lead = createAutoFrame(name, {
    width,
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(compact ? 6 : 8, scale),
    fills: [],
  });

  lead.appendChild(
    createTextNode("Section Title", title, {
      style: "Semi Bold",
      fontSize: px(compact ? 20 : 24, scale),
      lineHeight: px(compact ? 26 : 30, scale),
      fill: THEME.ink,
    }),
  );
  lead.appendChild(
    createTextNode("Section Description", description, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(22, scale),
      fill: THEME.inkSoft,
      width,
    }),
  );

  return lead;
}

async function createCartItemCard(item, scale, assetBaseUrl) {
  const card = createAutoFrame("Cart Item Card", {
    layoutMode: "HORIZONTAL",
    width: px(712, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
    radius: 0,
    padding: [px(8, scale), 0, px(8, scale), 0],
  });

  card.appendChild(
    await createProductThumbnail({
      image: item.image || item.productImage || item.images,
      label: item.category || "San pham",
      width: px(92, scale),
      height: px(92, scale),
      variant: "cart",
      scale,
      assetBaseUrl,
    }),
  );

  const info = createAutoFrame("Item Info", {
    width: px(604, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(14, scale),
    fills: [],
  });
  card.appendChild(info);

  const top = createAutoFrame("Item Top", {
    layoutMode: "HORIZONTAL",
    width: px(604, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "MIN",
  });
  info.appendChild(top);

  const titleCol = createAutoFrame("Title Column", {
    width: px(404, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });
  top.appendChild(titleCol);
  titleCol.appendChild(
    createTextNode("Name", item.name, {
        style: "Semi Bold",
        fontSize: px(20, scale),
        lineHeight: px(26, scale),
        fill: THEME.ink,
        width: px(404, scale),
      }),
  );
  titleCol.appendChild(
    createTextNode("Stock", item.stock, {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(18, scale),
      fill: "#6A564B",
      width: px(404, scale),
    }),
  );

  const unitPrice = createAutoFrame("Unit Price", {
    width: px(120, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(4, scale),
    fills: [],
    counterAxisAlignItems: "MAX",
  });
  top.appendChild(unitPrice);
  unitPrice.appendChild(
    createTextNode("Unit Price Label", "Don gia", {
      style: "Regular",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.bronze,
    }),
  );
  unitPrice.appendChild(
    createTextNode("Unit Price Value", item.unitPrice || item.price, {
      style: "Bold",
      fontSize: px(18, scale),
      lineHeight: px(24, scale),
      fill: THEME.ink,
    }),
  );

  const bottom = createAutoFrame("Item Bottom", {
    layoutMode: "HORIZONTAL",
    width: px(604, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });
  info.appendChild(bottom);

  bottom.appendChild(createQuantityControl(item.quantity, scale));

  const totalStack = createAutoFrame("Total Stack", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  bottom.appendChild(totalStack);
  totalStack.appendChild(
    createTextNode("Total", item.lineTotal || item.unitPrice || item.price, {
      style: "Bold",
      fontSize: px(20, scale),
      lineHeight: px(26, scale),
      fill: THEME.ink,
    }),
  );
  totalStack.appendChild(createButtonChip("Xoa", "tertiary", scale, 0, true));

  return card;
}

function createQuantityControl(quantity, scale) {
  const wrapper = createAutoFrame("Quantity Control", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });

  wrapper.appendChild(createMiniStepperButton("-", scale));
  wrapper.appendChild(
    createButtonChip(String(quantity), "secondary", scale, px(48, scale), true),
  );
  wrapper.appendChild(createMiniStepperButton("+", scale));
  return wrapper;
}

function createMiniStepperButton(label, scale) {
  const frame = createAutoFrame("Stepper Button", {
    width: px(28, scale),
    height: px(28, scale),
    autoWidth: false,
    autoHeight: false,
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(999, scale),
    stroke: { color: "#D8C4AE", opacity: 1, weight: 1 },
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
  });
  frame.appendChild(
    createTextNode("Label", label, {
      style: "Bold",
      fontSize: px(14, scale),
      lineHeight: px(14, scale),
      fill: THEME.ink,
    }),
  );
  return frame;
}

function createCheckoutLead(eyebrow, title, scale) {
  const lead = createAutoFrame("Checkout Lead", {
    width: px(360, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });

  lead.appendChild(
    createTextNode("Checkout Eyebrow", eyebrow, {
      style: "Semi Bold",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.bronze,
      letterSpacing: px(1.6, scale),
      textCase: "UPPER",
    }),
  );
  lead.appendChild(
    createTextNode("Checkout Title", title, {
      style: "Semi Bold",
      fontSize: px(32, scale),
      lineHeight: px(38, scale),
      fill: THEME.ink,
    }),
  );

  return lead;
}

function createSummaryCard(preset, scale) {
  const card = createAutoFrame("Summary Card", {
    width: px(360, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(28, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
  });

  preset.summary.forEach((line) => {
    card.appendChild(createSummaryLine(line.label, line.value, scale));
  });

  card.appendChild(createDivider(px(320, scale), scale));
  card.appendChild(createSummaryLine("Thanh toan", preset.total, scale, true));
  return card;
}

function createSummaryLine(label, value, scale, highlight) {
  const row = createAutoFrame("Summary Line", {
    layoutMode: "HORIZONTAL",
    width: px(320, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });
  row.appendChild(
    createTextNode("Summary Label", label, {
      style: highlight ? "Semi Bold" : "Regular",
      fontSize: px(highlight ? 17 : 15, scale),
      lineHeight: px(highlight ? 24 : 22, scale),
      fill: highlight ? THEME.ink : THEME.inkSoft,
    }),
  );
  row.appendChild(
    createTextNode("Summary Value", value, {
      style: "Bold",
      fontSize: px(highlight ? 22 : 16, scale),
      lineHeight: px(highlight ? 28 : 22, scale),
      fill: highlight ? THEME.accent : THEME.ink,
    }),
  );
  return row;
}

function createShippingCard(preset, scale) {
  const card = createAutoFrame("Shipping Card", {
    width: px(360, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(14, scale),
    fills: [],
    radius: 0,
    padding: [0, 0, 0, 0],
  });

  const shippingRows = preset.shippingRows || [];
  shippingRows.forEach((row) => {
    if (row.length === 2) {
      card.appendChild(createInputFieldRow(row, scale));
      return;
    }

    card.appendChild(createInputField(row[0], scale));
  });

  return card;
}

function createInputField(field, scale, width) {
  const fieldWidth = width || px(320, scale);
  const stack = createAutoFrame("Field Stack", {
    width: fieldWidth,
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [],
  });
  stack.appendChild(
    createTextNode("Field Label", field.label, {
      style: "Semi Bold",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.inkSoft,
    }),
  );

  const input = createAutoFrame("Input", {
    width: fieldWidth,
    height: px(field.label === "Ghi chu" ? 84 : 54, scale),
    autoWidth: false,
    autoHeight: false,
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(18, scale),
    padding: [px(16, scale), px(16, scale), px(16, scale), px(16, scale)],
    stroke: { color: "#D8C4AE", opacity: 1, weight: 1 },
    primaryAxisAlignItems: "CENTER",
  });
  input.appendChild(
    createTextNode("Field Value", field.value || " ", {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.ink,
      width: fieldWidth - px(32, scale),
    }),
  );
  stack.appendChild(input);
  return stack;
}

function createInputFieldRow(fields, scale) {
  const row = createAutoFrame("Field Row", {
    layoutMode: "HORIZONTAL",
    width: px(320, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });

  fields.forEach((field) => {
    row.appendChild(createInputField(field, scale, px(154, scale)));
  });

  return row;
}

function createPaymentCard(preset, scale) {
  const card = createAutoFrame("Payment Card", {
    width: px(360, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(28, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
  });

  preset.paymentMethods.forEach((method) => {
    card.appendChild(createPaymentOption(method, scale));
  });

  return card;
}

function createCheckoutButton(label, scale) {
  return createButtonChip(label, "accent", scale, px(360, scale));
}

function createPaymentOption(option, scale) {
  const card = createAutoFrame("Payment Option", {
    width: px(324, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [
      solidPaint(option.selected ? THEME.paper : THEME.shellAlt, option.selected ? 1 : 0.8),
    ],
    radius: px(22, scale),
    padding: [px(14, scale), px(14, scale), px(14, scale), px(14, scale)],
    stroke: {
      color: option.selected ? "#D87B38" : "#5F3F2A",
      opacity: option.selected ? 0.44 : 0.08,
      weight: 1,
    },
  });

  const row = createAutoFrame("Payment Row", {
    layoutMode: "HORIZONTAL",
    width: px(296, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  card.appendChild(row);

  const dot = figma.createEllipse();
  dot.name = "Radio";
  dot.resizeWithoutConstraints(px(18, scale), px(18, scale));
  dot.fills = [solidPaint(option.selected ? THEME.copper : "#D9CEC1", 1)];
  row.appendChild(dot);

  const textCol = createAutoFrame("Payment Text", {
    width: px(266, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(4, scale),
    fills: [],
  });
  row.appendChild(textCol);
  textCol.appendChild(
    createTextNode("Payment Label", option.label, {
      style: "Semi Bold",
      fontSize: px(15, scale),
      lineHeight: px(20, scale),
      fill: THEME.ink,
      width: px(254, scale),
    }),
  );
  textCol.appendChild(
    createTextNode("Payment Note", option.note, {
      style: "Regular",
      fontSize: px(13, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
      width: px(254, scale),
    }),
  );

  return card;
}

function createActionCard(name, title, description, scale) {
  const card = createAutoFrame(name, {
    width: px(384, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [solidPaint(THEME.ink, 1)],
    radius: px(28, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
  });

  card.appendChild(
    createTextNode("Action Title", title, {
      style: "Bold",
      fontSize: px(19, scale),
      lineHeight: px(26, scale),
      fill: THEME.paper,
      width: px(344, scale),
    }),
  );
  card.appendChild(
    createTextNode("Action Description", description, {
      style: "Regular",
      fontSize: px(13, scale),
      lineHeight: px(20, scale),
      fill: "#E7D6C7",
      width: px(344, scale),
    }),
  );
  card.appendChild(createButtonChip("Tao don hang", "primary", scale, px(170, scale)));
  return card;
}

async function createRecommendationSection(preset, scale) {
  const section = createAutoFrame("Recommendations Section", {
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [solidPaint(THEME.paper, 0.72)],
    radius: px(30, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  section.appendChild(
    createTextNode("Recommendations Title", preset.recommendationsTitle || "Nhung san pham tuong tu", {
      style: "Semi Bold",
      fontSize: px(32, scale),
      lineHeight: px(38, scale),
      fill: THEME.ink,
    }),
  );

  const row = createAutoFrame("Recommendation Row", {
    layoutMode: "HORIZONTAL",
    width: px(1092, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
  });
  section.appendChild(row);

  for (const item of preset.recommendations) {
    row.appendChild(await createRecommendationCard(item, scale, preset.assetBaseUrl));
  }

  return section;
}

async function createRecommendationCard(item, scale, assetBaseUrl) {
  const card = createAutoFrame("Recommendation Card", {
    width: px(132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(26, scale),
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  card.appendChild(
    await createProductThumbnail({
      image: item.image || item.productImage || item.images,
      label: item.category || "San pham",
      width: px(132, scale),
      height: px(92, scale),
      variant: "edgeToEdge",
      scale,
      noPadding: true,
      assetBaseUrl,
    }),
  );

  const textWrap = createAutoFrame("Recommendation Text", {
    width: px(132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
    padding: [0, px(10, scale), px(12, scale), px(10, scale)],
  });
  card.appendChild(textWrap);
  textWrap.appendChild(
    createTextNode("Category", item.category, {
      style: "Semi Bold",
      fontSize: px(9, scale),
      lineHeight: px(14, scale),
      fill: THEME.bronze,
      letterSpacing: px(1.1, scale),
      textCase: "UPPER",
    }),
  );
  textWrap.appendChild(
    createTextNode("Name", item.name, {
      style: "Semi Bold",
      fontSize: px(12, scale),
      lineHeight: px(18, scale),
      fill: THEME.ink,
      width: px(112, scale),
    }),
  );
  textWrap.appendChild(
    createTextNode("Price", item.price, {
      style: "Bold",
      fontSize: px(11, scale),
      lineHeight: px(16, scale),
      fill: THEME.ink,
    }),
  );
  return card;
}

function createFilterRow(name, filters, selectedIndex, scale) {
  const row = createAutoFrame(name, {
    layoutMode: "HORIZONTAL",
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });

  filters.forEach((filter, index) => {
    row.appendChild(
      createButtonChip(
        filter,
        index === selectedIndex ? "primary" : "secondary",
        scale,
        0,
        true,
      ),
    );
  });
  return row;
}

function createInsightCard(name, title, description, scale, width) {
  const card = createAutoFrame(name, {
    width,
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(24, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
  });

  card.appendChild(
    createTextNode("Insight Title", title, {
      style: "Semi Bold",
      fontSize: px(18, scale),
      lineHeight: px(24, scale),
      fill: THEME.ink,
    }),
  );
  card.appendChild(
    createTextNode("Insight Description", description, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(22, scale),
      fill: THEME.inkSoft,
      width: width - px(36, scale),
    }),
  );
  return card;
}

async function createOrderHistoryCard(order, scale, assetBaseUrl) {
  const card = createAutoFrame("History Order Card", {
    layoutMode: "HORIZONTAL",
    width: px(1132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(18, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(26, scale),
    padding: [px(18, scale), px(18, scale), px(18, scale), px(18, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  card.appendChild(
    await createProductThumbnail({
      image: order.itemImage || order.image || order.productImage,
      label: "San pham",
      width: px(88, scale),
      height: px(88, scale),
      variant: "medium",
      scale,
      assetBaseUrl,
    }),
  );

  const left = createAutoFrame("History Left", {
    width: px(690, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });
  card.appendChild(left);

  const heading = createAutoFrame("History Heading", {
    layoutMode: "HORIZONTAL",
    width: px(690, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    counterAxisAlignItems: "CENTER",
  });
  left.appendChild(heading);
  heading.appendChild(
    createTextNode("Order Code", order.code, {
      style: "Semi Bold",
      fontSize: px(20, scale),
      lineHeight: px(26, scale),
      fill: THEME.ink,
    }),
  );
  heading.appendChild(createTonePill(order.status, order.tone, scale));

  left.appendChild(
    createTextNode("Date", order.date, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
    }),
  );
  left.appendChild(
    createTextNode("Item Title", order.itemTitle, {
      style: "Medium",
      fontSize: px(16, scale),
      lineHeight: px(22, scale),
      fill: THEME.ink,
      width: px(664, scale),
    }),
  );
  left.appendChild(
    createTextNode("Item Meta", order.itemMeta, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(22, scale),
      fill: THEME.inkSoft,
      width: px(664, scale),
    }),
  );

  const pillRow = createAutoFrame("History Pills", {
    layoutMode: "HORIZONTAL",
    width: px(690, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });
  left.appendChild(pillRow);
  pillRow.appendChild(createTonePill(order.paymentStatus, order.paymentTone, scale));
  pillRow.appendChild(createButtonChip(order.paymentMethod, "soft", scale, 0, true));

  const right = createAutoFrame("History Right", {
    width: px(268, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "MAX",
  });
  card.appendChild(right);
  right.appendChild(
    createTextNode("Total Label", "Tong thanh toan", {
      style: "Regular",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.bronze,
    }),
  );
  right.appendChild(
    createTextNode("Total", order.total, {
      style: "Bold",
      fontSize: px(24, scale),
      lineHeight: px(30, scale),
      fill: THEME.accent,
    }),
  );
  right.appendChild(
    createTextNode("Quantity", order.quantity, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
    }),
  );
  right.appendChild(createButtonChip("Xem chi tiet", "primary", scale, px(148, scale)));
  return card;
}

async function createOrderPreviewCard(order, isActive, scale, assetBaseUrl) {
  const totalItems = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    : 0;
  const card = createAutoFrame("Order Preview Card", {
    width: px(248, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [solidPaint(isActive ? THEME.shell : THEME.paper, 1)],
    radius: px(24, scale),
    padding: [px(14, scale), px(14, scale), px(14, scale), px(14, scale)],
    stroke: {
      color: isActive ? "#EFB37E" : "#5F3F2A",
      opacity: isActive ? 1 : 0.1,
      weight: 1,
    },
  });

  const heading = createAutoFrame("Preview Heading", {
    layoutMode: "HORIZONTAL",
    width: px(220, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });
  card.appendChild(heading);
  const titleCol = createAutoFrame("Preview Title", {
    width: px(132, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [],
  });
  heading.appendChild(titleCol);
  titleCol.appendChild(
    createTextNode("Code", order.code, {
      style: "Semi Bold",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.ink,
      width: px(132, scale),
    }),
  );
  titleCol.appendChild(
    createTextNode("Date", order.date, {
      style: "Medium",
      fontSize: px(11, scale),
      lineHeight: px(18, scale),
      fill: THEME.inkSoft,
      width: px(132, scale),
    }),
  );
  heading.appendChild(createTonePill(order.status, order.tone, scale, true));

  for (const item of order.items || []) {
    card.appendChild(await createMiniOrderItem(item, isActive, scale, assetBaseUrl));
  }

  card.appendChild(createDivider(px(220, scale), scale));

  const footer = createAutoFrame("Preview Footer", {
    layoutMode: "HORIZONTAL",
    width: px(220, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });
  card.appendChild(footer);
  footer.appendChild(
    createTextNode("Count", `${totalItems} sản phẩm`, {
      style: "Medium",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.inkSoft,
    }),
  );
  footer.appendChild(
    createTextNode("Total", order.total, {
      style: "Bold",
      fontSize: px(15, scale),
      lineHeight: px(20, scale),
      fill: THEME.ink,
    }),
  );

  return card;
}

async function createMiniOrderItem(item, isActive, scale, assetBaseUrl) {
  const row = createAutoFrame("Mini Item", {
    layoutMode: "HORIZONTAL",
    width: px(220, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
    radius: 0,
    padding: [0, 0, 0, 0],
  });

  row.appendChild(
    await createProductThumbnail({
      image: item.image || item.productImage || item.images,
      label: "SP",
      width: px(38, scale),
      height: px(38, scale),
      variant: "trackingCompact",
      scale,
      assetBaseUrl,
    }),
  );

  const info = createAutoFrame("Mini Info", {
    width: px(136, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(2, scale),
    fills: [],
  });
  row.appendChild(info);
  info.appendChild(
    createTextNode("Name", item.name, {
      style: "Medium",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.ink,
      width: px(136, scale),
    }),
  );
  info.appendChild(
    createTextNode("Price", item.price, {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(17, scale),
      fill: THEME.bronze,
      width: px(136, scale),
    }),
  );
  row.appendChild(
    createTextNode("Quantity", `x${item.quantity}`, {
      style: "Medium",
      fontSize: px(13, scale),
      lineHeight: px(18, scale),
      fill: THEME.inkSoft,
    }),
  );
  return row;
}

function createTrackingOverviewCard(summary, steps, scale) {
  const card = createAutoFrame("Tracking Overview", {
    width: px(840, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(30, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  const header = createAutoFrame("Tracking Summary Header", {
    layoutMode: "HORIZONTAL",
    width: px(800, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
  });
  card.appendChild(header);

  const titleCol = createAutoFrame("Summary Titles", {
    width: px(520, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [],
  });
  header.appendChild(titleCol);
  titleCol.appendChild(
    createTextNode("Label", "Mã đơn hàng", {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(18, scale),
      fill: "#B08968",
    }),
  );
  titleCol.appendChild(
    createTextNode("Code", summary.code, {
      style: "Medium",
      fontSize: px(44, scale),
      lineHeight: px(50, scale),
      fill: "#344760",
    }),
  );
  titleCol.appendChild(
    createTextNode("Date", summary.date, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
      width: px(520, scale),
    }),
  );

  const pills = createAutoFrame("Summary Pills", {
    layoutMode: "HORIZONTAL",
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });
  header.appendChild(pills);
  pills.appendChild(createTonePill(summary.status, summary.statusTone, scale));
  pills.appendChild(createTonePill(summary.paymentStatus, summary.paymentTone, scale));

  const metrics = createAutoFrame("Summary Metrics", {
    layoutMode: "HORIZONTAL",
    width: px(736, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
  });
  card.appendChild(metrics);
  metrics.appendChild(createMiniMetric("Tổng tiền", summary.total, scale));
  metrics.appendChild(createMiniMetric("Thanh toán", summary.method, scale));
  metrics.appendChild(createMiniMetric("Số lượng", summary.quantity, scale));

  card.appendChild(
    createTextNode("Steps Title", "Tiến trình đơn hàng", {
      style: "Semi Bold",
      fontSize: px(30, scale),
      lineHeight: px(36, scale),
      fill: THEME.ink,
    }),
  );

  steps.forEach((step, index) => {
    card.appendChild(createTrackingStep(step, index === steps.length - 1, scale));
  });

  return card;
}

function createMiniMetric(label, value, scale) {
  const card = createAutoFrame("Mini Metric", {
    width: px(258, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(20, scale),
    padding: [px(14, scale), px(14, scale), px(14, scale), px(14, scale)],
  });
  card.appendChild(
    createTextNode("Label", label, {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.bronze,
    }),
  );
  card.appendChild(
    createTextNode("Value", value, {
      style: "Semi Bold",
      fontSize: px(24, scale),
      lineHeight: px(28, scale),
      fill: THEME.ink,
      width: px(230, scale),
    }),
  );
  return card;
}

function createTrackingStepsCard(steps, scale) {
  const card = createAutoFrame("Tracking Steps", {
    width: px(776, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(14, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(28, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
  });

  card.appendChild(
    createTextNode("Steps Title", "Tien trinh don hang", {
      style: "Semi Bold",
      fontSize: px(24, scale),
      lineHeight: px(30, scale),
      fill: THEME.ink,
    }),
  );

  steps.forEach((step, index) => {
    card.appendChild(createTrackingStep(step, index === steps.length - 1, scale));
  });

  return card;
}

function createTrackingStep(step, isLast, scale) {
  const row = createAutoFrame("Tracking Step", {
    layoutMode: "HORIZONTAL",
    width: px(800, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(10, scale),
    fills: [],
  });

  const timeline = figma.createFrame();
  timeline.name = "Timeline";
  timeline.resizeWithoutConstraints(px(16, scale), px(90, scale));
  timeline.layoutMode = "NONE";
  timeline.fills = [];
  timeline.strokes = [];
  row.appendChild(timeline);

  const dot = figma.createEllipse();
  dot.name = "Dot";
  dot.resizeWithoutConstraints(px(10, scale), px(10, scale));
  dot.x = px(3, scale);
  dot.y = px(8, scale);
  dot.fills = [solidPaint(getStepDotColor(step.state), 1)];
  timeline.appendChild(dot);

  if (!isLast) {
    const line = figma.createRectangle();
    line.name = "Line";
    line.resizeWithoutConstraints(px(2, scale), px(78, scale));
    line.x = px(7, scale);
    line.y = px(22, scale);
    line.cornerRadius = px(2, scale);
    line.fills = [solidPaint(getStepLineColor(step.state), 1)];
    timeline.appendChild(line);
  }

  const body = createAutoFrame("Step Body", {
    width: px(774, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [solidPaint(getStepBackground(step.state), 1)],
    radius: px(20, scale),
    padding: [px(14, scale), px(14, scale), px(14, scale), px(14, scale)],
    stroke: { color: getStepBorder(step.state), opacity: 1, weight: 1 },
  });
  row.appendChild(body);

  const head = createAutoFrame("Step Head", {
    layoutMode: "HORIZONTAL",
    width: px(746, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(12, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "CENTER",
  });
  body.appendChild(head);
  head.appendChild(
    createTextNode("Title", step.title, {
      style: "Semi Bold",
      fontSize: px(16, scale),
      lineHeight: px(22, scale),
      fill: THEME.ink,
    }),
  );
  head.appendChild(createButtonChip(getStepLabel(step.state), "soft", scale, 0, true));

  body.appendChild(
    createTextNode("Description", step.description, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(22, scale),
      fill: THEME.inkSoft,
      width: px(746, scale),
    }),
  );
  return row;
}

function createShippingInfoCard(shipping, summary, scale) {
  const card = createAutoFrame("Shipping Info", {
    width: px(840, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [solidPaint(THEME.paper, 1)],
    radius: px(30, scale),
    padding: [px(20, scale), px(20, scale), px(20, scale), px(20, scale)],
    stroke: { color: "#5F3F2A", opacity: 0.08, weight: 1 },
  });

  const header = createAutoFrame("Shipping Header", {
    layoutMode: "HORIZONTAL",
    width: px(800, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(20, scale),
    fills: [],
    primaryAxisAlignItems: "SPACE_BETWEEN",
    counterAxisAlignItems: "MIN",
  });
  card.appendChild(header);

  const lead = createAutoFrame("Shipping Lead", {
    width: px(560, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(8, scale),
    fills: [],
  });
  header.appendChild(lead);
  lead.appendChild(
    createTextNode("Shipping Heading", "Thông tin giao hàng", {
      style: "Semi Bold",
      fontSize: px(30, scale),
      lineHeight: px(36, scale),
      fill: THEME.ink,
    }),
  );
  lead.appendChild(
    createTextNode("Shipping Name", shipping.fullName, {
      style: "Semi Bold",
      fontSize: px(18, scale),
      lineHeight: px(24, scale),
      fill: THEME.ink,
      width: px(560, scale),
    }),
  );
  lead.appendChild(
    createTextNode("Shipping Phone", shipping.phone, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(20, scale),
      fill: THEME.inkSoft,
      width: px(560, scale),
    }),
  );
  lead.appendChild(
    createTextNode("Shipping Address", shipping.address, {
      style: "Regular",
      fontSize: px(14, scale),
      lineHeight: px(22, scale),
      fill: THEME.inkSoft,
      width: px(560, scale),
    }),
  );

  header.appendChild(createButtonChip("Lịch sử đơn hàng", "primary", scale, px(182, scale)));

  card.appendChild(createDivider(px(800, scale), scale));

  const body = createAutoFrame("Shipping Body", {
    layoutMode: "HORIZONTAL",
    width: px(800, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(16, scale),
    fills: [],
  });
  card.appendChild(body);
  body.appendChild(createMetaColumn("Trạng thái", summary.status, scale, px(256, scale)));
  body.appendChild(createMetaColumn("Thanh toán", summary.paymentStatus, scale, px(256, scale)));
  body.appendChild(createMetaColumn("Ghi chú", shipping.note, scale, px(256, scale)));
  return card;
}

function createMetaColumn(label, value, scale, width) {
  const column = createAutoFrame("Meta Column", {
    width: width || px(234, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [],
  });
  column.appendChild(
    createTextNode("Meta Label", label, {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.bronze,
      letterSpacing: px(1.1, scale),
      textCase: "UPPER",
    }),
  );
  column.appendChild(
    createTextNode("Meta Value", value, {
      style: "Medium",
      fontSize: px(15, scale),
      lineHeight: px(22, scale),
      fill: THEME.ink,
      width: width || px(234, scale),
    }),
  );
  return column;
}

function createInfoBlock(label, value, scale, width) {
  const card = createAutoFrame("Info Block", {
    width: width || px(234, scale),
    height: 100,
    autoWidth: false,
    autoHeight: true,
    itemSpacing: px(6, scale),
    fills: [solidPaint(THEME.shell, 1)],
    radius: px(22, scale),
    padding: [px(14, scale), px(14, scale), px(14, scale), px(14, scale)],
  });
  card.appendChild(
    createTextNode("Label", label, {
      style: "Regular",
      fontSize: px(12, scale),
      lineHeight: px(16, scale),
      fill: THEME.bronze,
      letterSpacing: px(1.1, scale),
      textCase: "UPPER",
    }),
  );
  card.appendChild(
    createTextNode("Value", value, {
      style: "Medium",
      fontSize: px(15, scale),
      lineHeight: px(22, scale),
      fill: THEME.ink,
      width: (width || px(234, scale)) - px(28, scale),
    }),
  );
  return card;
}

function createTonePill(label, tone, scale, compact) {
  const colors = getTonePalette(tone);
  const pill = createAutoFrame("Tone Pill", {
    width: 100,
    height: 100,
    autoWidth: true,
    autoHeight: true,
    itemSpacing: 0,
    fills: [solidPaint(colors.background, 1)],
    radius: px(999, scale),
    padding: [
      px(compact ? 6 : 8, scale),
      px(compact ? 10 : 12, scale),
      px(compact ? 6 : 8, scale),
      px(compact ? 10 : 12, scale),
    ],
  });
  pill.appendChild(
    createTextNode("Pill Label", label, {
      style: "Semi Bold",
      fontSize: px(compact ? 10 : 11, scale),
      lineHeight: px(compact ? 13 : 14, scale),
      fill: colors.text,
    }),
  );
  return pill;
}

function createButtonChip(label, variant, scale, width, compact) {
  const palette = getButtonPalette(variant);
  const frame = createAutoFrame("Button Chip", {
    width: width || px(100, scale),
    height: px(compact ? 38 : 42, scale),
    autoWidth: width ? false : true,
    autoHeight: false,
    itemSpacing: 0,
    fills: [solidPaint(palette.background, palette.opacity)],
    radius: px(999, scale),
    padding: [0, px(compact ? 14 : 16, scale), 0, px(compact ? 14 : 16, scale)],
    stroke: palette.stroke
      ? {
          color: palette.stroke,
          opacity: palette.strokeOpacity,
          weight: 1,
        }
      : null,
    primaryAxisAlignItems: "CENTER",
    counterAxisAlignItems: "CENTER",
  });
  frame.appendChild(
    createTextNode("Button Label", label, {
      style: "Semi Bold",
      fontSize: px(compact ? 12 : 13, scale),
      lineHeight: px(compact ? 16 : 18, scale),
      fill: palette.text,
    }),
  );
  return frame;
}

function createVisualPlaceholderParts(label, tag, width, height, scale, noPadding) {
  const frame = createAutoFrame("Visual Placeholder", {
    width,
    height,
    autoWidth: false,
    autoHeight: false,
    itemSpacing: px(8, scale),
    fills: [solidPaint(THEME.clay, 1)],
    radius: px(24, scale),
    padding: noPadding
      ? [0, 0, 0, 0]
      : [px(12, scale), px(12, scale), px(12, scale), px(12, scale)],
    primaryAxisAlignItems: "MAX",
    counterAxisAlignItems: "MIN",
  });

  const panel = figma.createRectangle();
  panel.name = "Panel";
  panel.resizeWithoutConstraints(
    width - (noPadding ? 0 : px(24, scale)),
    height - (noPadding ? 0 : px(24, scale)),
  );
  panel.cornerRadius = px(18, scale);
  panel.fills = [solidPaint("#FDF7EE", 1)];
  frame.appendChild(panel);
  panel.layoutPositioning = "ABSOLUTE";
  panel.x = noPadding ? 0 : px(12, scale);
  panel.y = noPadding ? 0 : px(12, scale);

  if (label) {
    const chip = createButtonChip(label, "soft", scale, 0, true);
    frame.appendChild(chip);
  }

  if (tag) {
    const tagChip = createButtonChip(tag, "secondary", scale, 0, true);
    frame.appendChild(tagChip);
  }

  return { frame, panel };
}

function createVisualPlaceholder(label, tag, width, height, scale, noPadding) {
  return createVisualPlaceholderParts(
    label,
    tag,
    width,
    height,
    scale,
    noPadding,
  ).frame;
}

function getThumbnailVariant(variant, width, height, noPadding) {
  if (variant === "trackingCompact") {
    return {
      outerRadius: 12,
      innerRadius: 10,
      padding: 4,
    };
  }

  if (variant === "cart") {
    return {
      outerRadius: 22,
      innerRadius: 20,
      padding: 8,
    };
  }

  if (variant === "edgeToEdge" || noPadding) {
    return {
      outerRadius: Math.min(width, height) / 5.5,
      innerRadius: Math.min(width, height) / 7,
      padding: 0,
    };
  }

  if (variant === "medium") {
    return {
      outerRadius: 20,
      innerRadius: 16,
      padding: 8,
    };
  }

  return {
    outerRadius: 20,
    innerRadius: 16,
    padding: 8,
  };
}

async function createProductThumbnail({
  image,
  label,
  tag,
  width,
  height,
  variant,
  scale,
  noPadding,
  assetBaseUrl,
  fit,
}) {
  const imageHash = await loadImageHash(
    getFirstImageSource(image),
    assetBaseUrl,
  );
  const thumbnailVariant = getThumbnailVariant(
    variant,
    width,
    height,
    noPadding,
  );
  const padding = px(thumbnailVariant.padding, scale);
  const outerRadius = px(thumbnailVariant.outerRadius, scale);
  const innerRadius = px(thumbnailVariant.innerRadius, scale);
  const innerWidth = Math.max(width - padding * 2, px(12, scale));
  const innerHeight = Math.max(height - padding * 2, px(12, scale));
  const frame = figma.createFrame();
  frame.name = "Product Thumbnail";
  frame.layoutMode = "NONE";
  frame.resizeWithoutConstraints(width, height);
  frame.fills = [solidPaint("#F3E8D7", 1)];
  frame.cornerRadius = outerRadius;
  frame.clipsContent = true;

  const panel = figma.createFrame();
  panel.name = "Thumbnail Surface";
  panel.layoutMode = "NONE";
  panel.resizeWithoutConstraints(innerWidth, innerHeight);
  panel.x = padding;
  panel.y = padding;
  panel.cornerRadius = innerRadius;
  panel.clipsContent = true;
  frame.appendChild(panel);

  if (!imageHash) {
    panel.fills = [solidPaint("#F2E3D0", 1)];

    if (label || tag) {
      const chip = createButtonChip(label || tag, "soft", scale, 0, true);
      panel.appendChild(chip);
      chip.x = px(6, scale);
      chip.y = Math.max(panel.height - chip.height - px(6, scale), px(6, scale));
    }

    return frame;
  }

  panel.fills = [
    solidPaint("#FFFFFF", 1),
    imagePaint(imageHash, fit || "FIT"),
  ];
  return frame;
}

function createDivider(width) {
  const divider = figma.createRectangle();
  divider.name = "Divider";
  divider.resizeWithoutConstraints(width, 1);
  divider.fills = [solidPaint("#5F3F2A", 0.1)];
  return divider;
}

function createVerticalDivider(width, scale) {
  const divider = figma.createRectangle();
  divider.name = "Vertical Divider";
  divider.resizeWithoutConstraints(width, px(920, scale));
  divider.cornerRadius = width;
  divider.fills = [solidPaint("#5F3F2A", 0.08)];
  return divider;
}

function createAutoFrame(name, options) {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = options.layoutMode || "VERTICAL";
  frame.itemSpacing = options.itemSpacing || 0;
  frame.paddingTop = options.padding ? options.padding[0] : 0;
  frame.paddingRight = options.padding ? options.padding[1] : 0;
  frame.paddingBottom = options.padding ? options.padding[2] : 0;
  frame.paddingLeft = options.padding ? options.padding[3] : 0;
  frame.primaryAxisAlignItems = options.primaryAxisAlignItems || "MIN";
  frame.counterAxisAlignItems = options.counterAxisAlignItems || "MIN";
  frame.resizeWithoutConstraints(options.width || 100, options.height || 100);
  frame.counterAxisSizingMode = resolveCounterAxisSizing(frame.layoutMode, options);
  frame.primaryAxisSizingMode = resolvePrimaryAxisSizing(frame.layoutMode, options);
  frame.fills = options.fills || [];
  frame.strokes = options.stroke ? [solidPaint(options.stroke.color, options.stroke.opacity)] : [];
  frame.strokeWeight = options.stroke ? options.stroke.weight || 1 : 0;
  frame.cornerRadius = options.radius || 0;
  frame.clipsContent = options.clipsContent || false;
  frame.effects = options.effects || [];
  return frame;
}

function resolvePrimaryAxisSizing(layoutMode, options) {
  if (options.primaryAxisSizingMode) {
    return options.primaryAxisSizingMode;
  }

  if (layoutMode === "VERTICAL") {
    return options.autoHeight === false ? "FIXED" : "AUTO";
  }

  return options.autoWidth === false ? "FIXED" : "AUTO";
}

function resolveCounterAxisSizing(layoutMode, options) {
  if (options.counterAxisSizingMode) {
    return options.counterAxisSizingMode;
  }

  if (layoutMode === "VERTICAL") {
    return options.autoWidth === false ? "FIXED" : "AUTO";
  }

  return options.autoHeight === false ? "FIXED" : "AUTO";
}

function createTextNode(name, text, options) {
  const node = figma.createText();
  node.name = name;
  node.fontName = {
    family: "Inter",
    style: options.style || "Regular",
  };
  node.fontSize = options.fontSize || 16;
  node.lineHeight = {
    unit: "PIXELS",
    value: options.lineHeight || Math.round((options.fontSize || 16) * 1.4),
  };
  if (options.letterSpacing) {
    node.letterSpacing = {
      unit: "PIXELS",
      value: options.letterSpacing,
    };
  }
  if (options.textCase) {
    node.textCase = options.textCase;
  }
  node.fills = [solidPaint(options.fill || THEME.ink, 1)];
  node.characters = text;
  node.textAutoResize = options.width ? "HEIGHT" : "WIDTH_AND_HEIGHT";
  if (options.width) {
    node.resize(options.width, node.height);
  }
  return node;
}

function createEllipse(parent, name, width, height, options) {
  const ellipse = figma.createEllipse();
  ellipse.name = name;
  ellipse.resizeWithoutConstraints(width, height);
  ellipse.x = options.x || 0;
  ellipse.y = options.y || 0;
  ellipse.fills = [options.fill];
  parent.appendChild(ellipse);
  return ellipse;
}

function getTonePalette(tone) {
  const palettes = {
    warm: { background: "#FBF0E3", text: "#B87C43" },
    info: { background: THEME.info, text: THEME.infoInk },
    success: { background: THEME.success, text: THEME.successInk },
    danger: { background: THEME.danger, text: THEME.dangerInk },
    muted: { background: THEME.muted, text: THEME.mutedInk },
  };
  return palettes[tone] || palettes.muted;
}

function getButtonPalette(variant) {
  const palettes = {
    primary: {
      background: THEME.ink,
      text: THEME.paper,
      opacity: 1,
      stroke: null,
      strokeOpacity: 0,
    },
    accent: {
      background: THEME.copper,
      text: THEME.paper,
      opacity: 1,
      stroke: null,
      strokeOpacity: 0,
    },
    secondary: {
      background: THEME.paper,
      text: THEME.inkSoft,
      opacity: 1,
      stroke: "#5F3F2A",
      strokeOpacity: 0.1,
    },
    tertiary: {
      background: THEME.clay,
      text: THEME.inkSoft,
      opacity: 1,
      stroke: null,
      strokeOpacity: 0,
    },
    soft: {
      background: THEME.shellAlt,
      text: THEME.bronze,
      opacity: 1,
      stroke: null,
      strokeOpacity: 0,
    },
  };
  return palettes[variant] || palettes.secondary;
}

function getStepLabel(state) {
  if (state === "completed") return "Đã xong";
  if (state === "current") return "Đang xử lý";
  return "Chờ tiếp theo";
}

function getStepDotColor(state) {
  if (state === "completed") return "#CF8B48";
  if (state === "current") return THEME.copper;
  return "#E4D8CC";
}

function getStepLineColor(state) {
  if (state === "completed") return "#EAD7C3";
  if (state === "current") return "#F1DCC7";
  return "#EEE4DB";
}

function getStepBackground(state) {
  if (state === "completed") return "#FFFFFF";
  if (state === "current") return "#FFF9F3";
  return "#FFFFFF";
}

function getStepBorder(state) {
  if (state === "completed") return "#ECE0D4";
  if (state === "current") return "#E6A16D";
  return "#EFE5DC";
}

function dropShadow(scale) {
  const shadowColor = hexToRgb(THEME.shadow);
  return {
    type: "DROP_SHADOW",
    color: {
      r: shadowColor.r,
      g: shadowColor.g,
      b: shadowColor.b,
      a: 0.08,
    },
    offset: { x: 0, y: px(20, scale) },
    radius: px(60, scale),
    visible: true,
    blendMode: "NORMAL",
  };
}

function softShadow(scale) {
  const shadowColor = hexToRgb(THEME.shadow);
  return {
    type: "DROP_SHADOW",
    color: {
      r: shadowColor.r,
      g: shadowColor.g,
      b: shadowColor.b,
      a: 0.08,
    },
    offset: { x: 0, y: px(10, scale) },
    radius: px(24, scale),
    visible: true,
    blendMode: "NORMAL",
  };
}

function imagePaint(imageHash, scaleMode) {
  return {
    type: "IMAGE",
    imageHash,
    scaleMode: scaleMode || "FIT",
    opacity: 1,
    visible: true,
  };
}

function solidPaint(hex, opacity) {
  return {
    type: "SOLID",
    color: hexToRgb(hex),
    opacity: opacity == null ? 1 : opacity,
  };
}

function hexToRgb(hex) {
  const cleaned = hex.replace("#", "");
  const normalized =
    cleaned.length === 3
      ? cleaned.split("").map((char) => char + char).join("")
      : cleaned;

  return {
    r: parseInt(normalized.slice(0, 2), 16) / 255,
    g: parseInt(normalized.slice(2, 4), 16) / 255,
    b: parseInt(normalized.slice(4, 6), 16) / 255,
  };
}

function getNextCanvasX() {
  if (!figma.currentPage.children.length) {
    return 0;
  }

  let rightmostEdge = 0;

  figma.currentPage.children.forEach((node) => {
    const edge = node.x + node.width;
    if (edge > rightmostEdge) {
      rightmostEdge = edge;
    }
  });

  return rightmostEdge + 200;
}

function normalizeImageCandidates(value) {
  if (Array.isArray(value)) {
    return value.flatMap((entry) => normalizeImageCandidates(entry));
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  return [];
}

function getFirstImageSource() {
  const sources = Array.prototype.slice.call(arguments);

  for (let index = 0; index < sources.length; index += 1) {
    const candidates = normalizeImageCandidates(sources[index]);

    if (candidates.length) {
      return candidates[0];
    }
  }

  return "";
}

function resolveAssetUrl(value, assetBaseUrl) {
  const normalizedValue = String(value || "").trim();

  if (!normalizedValue) {
    return "";
  }

  if (
    normalizedValue.startsWith("http://") ||
    normalizedValue.startsWith("https://") ||
    normalizedValue.startsWith("data:") ||
    normalizedValue.startsWith("blob:")
  ) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("//")) {
    return `https:${normalizedValue}`;
  }

  const baseUrl = String(assetBaseUrl || DEFAULT_ASSET_BASE_URL)
    .trim()
    .replace(/\/+$/, "");

  if (!baseUrl) {
    return normalizedValue;
  }

  if (normalizedValue.startsWith("/")) {
    return `${baseUrl}${normalizedValue}`;
  }

  return `${baseUrl}/${normalizedValue.replace(/^\/+/, "")}`;
}

async function loadImageHash(value, assetBaseUrl) {
  const resolvedUrl = resolveAssetUrl(value, assetBaseUrl);

  if (!resolvedUrl) {
    return "";
  }

  if (IMAGE_CACHE.has(resolvedUrl)) {
    return IMAGE_CACHE.get(resolvedUrl) || "";
  }

  try {
    const image = await figma.createImageAsync(resolvedUrl);
    IMAGE_CACHE.set(resolvedUrl, image.hash);
    return image.hash;
  } catch (error) {
    IMAGE_CACHE.set(resolvedUrl, "");
    return "";
  }
}

function deepMerge(target, source) {
  if (!isPlainObject(source)) {
    return source;
  }

  const output = isPlainObject(target) ? clone(target) : {};

  Object.entries(source).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      output[key] = clone(value);
      return;
    }

    if (isPlainObject(value)) {
      output[key] = deepMerge(output[key], value);
      return;
    }

    output[key] = value;
  });

  return output;
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function px(value, scale) {
  return Math.round(value * scale);
}
