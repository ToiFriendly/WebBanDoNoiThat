# Storefront Layout Generator

Figma plugin thuan `manifest + code.js + ui.html` de generate nhanh 4 man hinh:

- `Gio hang`
- `Lich su don hang`
- `Theo doi don hang`
- `Thanh toan MoMo`

Plugin dung sample data va visual direction nau-be hien co trong storefront cua du an nay, de ban import vao Figma va tao layout desktop ngay tren canvas.

## Cach chay trong Figma

1. Mo Figma Desktop.
2. Vao `Plugins` -> `Development` -> `Import plugin from manifest...`
3. Chon file [manifest.json](/C:/Users/hau45/OneDrive/Desktop/DACCVMTPTPM/WebBanDoNoiThat/figma-plugin-storefront-layouts/manifest.json)
4. Sau khi import, vao `Plugins` -> `Development` -> `Storefront Layout Generator`
5. Chon man hinh can generate va bam `Generate`

Plugin se tao cac frame moi tren current page va focus viewport vao cac frame vua tao.

## JSON Overrides

Plugin ho tro JSON overrides de ban tinh chinh content mau.

### Vi du cho 1 man hinh

```json
{
  "assetBaseUrl": "http://localhost:5000",
  "title": "Gio hang uu tien",
  "items": [
    {
      "category": "Phong an",
      "name": "Ban an Sol",
      "image": "/uploads/products/ban-an-sol.jpg",
      "meta": "Mat da tu nhien - 6 ghe",
      "quantity": 1,
      "price": "18.900.000d",
      "tag": "New"
    }
  ]
}
```

### Vi du cho mode `Tat ca 4 man hinh`

```json
{
  "assetBaseUrl": "http://localhost:5000",
  "cart": {
    "title": "Gio hang moi"
  },
  "history": {
    "filters": ["Tat ca", "Dang xu ly", "Hoan thanh"]
  },
  "tracking": {
    "selectedCode": "ORD-2026-018"
  },
  "payment": {
    "amount": "11.799.999đ",
    "orderCode": "DH17753665745968091"
  }
}
```

Luu y:

- `object` se duoc merge
- `array` se bi thay the toan bo
- Co the truyen `image`, `productImage`, `itemImage` hoac `images` cho cac item/order de plugin render anh that
- Co the truyen `qrImage` cho man hinh `payment` neu ban muon hien QR that thay vi QR placeholder
- URL tuong doi nhu `/uploads/...` se duoc noi voi `assetBaseUrl` (mac dinh: `http://localhost:5000`)

## Tuy chinh

Neu ban muon doi preset mac dinh, sua object `PRESETS` trong [code.js](/C:/Users/hau45/OneDrive/Desktop/DACCVMTPTPM/WebBanDoNoiThat/figma-plugin-storefront-layouts/code.js).
