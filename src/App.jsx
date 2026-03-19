
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  Download,
  Upload,
  Check,
  X,
  Menu,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";

const STORAGE_KEY = "mortalAuraJewelryCMS";
const CART_KEY = "mortalAuraCart";
const LANGUAGE_KEY = "mortalAuraLanguage";
const ADMIN_KEY = "mortalAuraAdminMode";
const CONFIG_URL = "/mortal-aura-config.json";
const UI_TEXTS = {
  en: {
    navHome: "Home",
    navCollections: "Collections",
    navWorks: "Works",
    navOneOfAKind: "One of a Kind",
    navStories: "Stories",
    navAbout: "About",
    navShipping: "Shipping",
    navContact: "Contact",
    collections: "Collections",
    works: "Works",
    oneOfAKind: "One of a Kind",
    stories: "Stories",
    about: "About",
    shipping: "Shipping",
    contact: "Contact",
    cart: "Cart",
    itemsSuffix: "item(s)",
    searchPlaceholder: "Search by title, SKU, stone, collection...",
    featured: "Featured",
    addToCart: "Add to Cart",
    emptyCart: "Your cart is empty.",
    subtotal: "Subtotal",
    clearCart: "Clear Cart",
    goToCheckout: "Go to Checkout",
    fullName: "Full Name",
    email: "Email",
    country: "Country / Region",
    city: "City",
    address: "Address",
    orderNote: "Order Note",
    sendOrderByEmail: "Send Order by Email",
    buyWithPayPal: "Buy with PayPal",
    material: "Material",
    stone: "Stone",
    size: "Size",
    sku: "SKU",
    stock: "Stock",
    inStock: "In Stock",
    soldOut: "Sold Out",
    madeToOrder: "Made to Order",
    limited: "Limited",
    viewDetails: "View Details",
    viewMore: "View More",
    viewLess: "Show Less",
    expandWorks: "Show All Works",
    collapseWorks: "Collapse Works",
    menu: "Menu",
    noOneOfAKind: "No One of a Kind works yet.",
    noMemoryWorks: "No works yet.",
  },
  ja: {
    navHome: "ホーム",
    navCollections: "系列",
    navWorks: "作品",
    navOneOfAKind: "一点物",
    navStories: "物語",
    navAbout: "ブランド",
    navShipping: "配送",
    navContact: "連絡先",
    collections: "系列",
    works: "作品",
    oneOfAKind: "一点物",
    stories: "物語",
    about: "ブランド",
    shipping: "配送",
    contact: "連絡先",
    cart: "カート",
    itemsSuffix: "点",
    searchPlaceholder: "作品名・SKU・宝石・系列で検索...",
    featured: "注目作品",
    addToCart: "カートに追加",
    emptyCart: "カートは空です。",
    subtotal: "小計",
    clearCart: "カートを空にする",
    goToCheckout: "チェックアウトへ",
    fullName: "氏名",
    email: "メールアドレス",
    country: "国・地域",
    city: "市区町村",
    address: "住所",
    orderNote: "備考",
    sendOrderByEmail: "メールで注文内容を送信",
    buyWithPayPal: "PayPalで購入",
    material: "素材",
    stone: "宝石",
    size: "サイズ",
    sku: "SKU",
    stock: "在庫",
    inStock: "在庫あり",
    soldOut: "売り切れ",
    madeToOrder: "受注制作",
    limited: "限定",
    viewDetails: "詳細を見る",
    viewMore: "もっと見る",
    viewLess: "折りたたむ",
    expandWorks: "作品をもっと見る",
    collapseWorks: "作品を折りたたむ",
    menu: "メニュー",
    noOneOfAKind: "一点物はまだありません。",
    noMemoryWorks: "作品はまだありません。",
  },
  zh: {
    navHome: "首页",
    navCollections: "系列",
    navWorks: "作品",
    navOneOfAKind: "孤品",
    navStories: "故事",
    navAbout: "关于",
    navShipping: "配送",
    navContact: "联系",
    collections: "系列",
    works: "作品",
    oneOfAKind: "孤品",
    stories: "故事",
    about: "关于",
    shipping: "配送",
    contact: "联系",
    cart: "购物车",
    itemsSuffix: "件",
    searchPlaceholder: "按作品名、SKU、宝石、系列搜索...",
    featured: "精选",
    addToCart: "加入购物车",
    emptyCart: "购物车为空。",
    subtotal: "小计",
    clearCart: "清空购物车",
    goToCheckout: "前往结账",
    fullName: "姓名",
    email: "邮箱",
    country: "国家 / 地区",
    city: "城市",
    address: "地址",
    orderNote: "订单备注",
    sendOrderByEmail: "通过邮件发送订单",
    buyWithPayPal: "用 PayPal 购买",
    material: "材质",
    stone: "宝石",
    size: "尺寸",
    sku: "SKU",
    stock: "库存",
    inStock: "有货",
    soldOut: "售罄",
    madeToOrder: "接受定制",
    limited: "限定",
    viewDetails: "查看详情",
    viewMore: "查看更多",
    viewLess: "收起",
    expandWorks: "展开全部作品",
    collapseWorks: "收起作品",
    menu: "菜单",
    noOneOfAKind: "暂时还没有孤品作品。",
    noMemoryWorks: "暂时还没有作品。",
  },
};

const CATEGORY_OPTIONS = {
  All: { en: "All", ja: "すべて", zh: "全部" },
  Ring: { en: "Ring", ja: "リング", zh: "戒指" },
  Pendant: { en: "Pendant", ja: "ペンダント", zh: "吊坠" },
  RingOrPendant: { en: "Ring or Pendant", ja: "リング/ペンダント", zh: "戒指或吊坠" },
  RingAndPendant: { en: "Ring and Pendant", ja: "リング&ペンダント", zh: "戒指和吊坠" },
  Bracelet: { en: "Bracelet", ja: "ブレスレット", zh: "手链" },
  Set: { en: "Set", ja: "セット", zh: "套组" },
};
const FIXED_CATEGORIES = Object.keys(CATEGORY_OPTIONS);
const ML_LANGS = ["en", "ja", "zh"];

function makeML(value = "") {
  const text = String(value ?? "");
  return { en: text, ja: text, zh: text };
}

function ensureML(value = "") {
  if (value && typeof value === "object" && ("en" in value || "ja" in value || "zh" in value)) {
    return {
      en: String(value.en ?? value.ja ?? value.zh ?? ""),
      ja: String(value.ja ?? value.en ?? value.zh ?? ""),
      zh: String(value.zh ?? value.en ?? value.ja ?? ""),
    };
  }
  return makeML(value);
}

function localized(value, lang = "en") {
  if (value && typeof value === "object" && ("en" in value || "ja" in value || "zh" in value)) {
    return String(value[lang] ?? value.en ?? value.ja ?? value.zh ?? "");
  }
  return String(value ?? "");
}

function mapCategoryToKey(value) {
  const raw = String(value ?? "").trim();
  if (FIXED_CATEGORIES.includes(raw)) return raw;
  const normalized = raw.toLowerCase();
  if (!raw || ["all", "全部", "すべて"].includes(normalized)) return "All";
  if (["ring", "戒指", "リング"].includes(normalized)) return "Ring";
  if (["pendant", "吊坠", "ペンダント"].includes(normalized)) return "Pendant";
  if (["ring or pendant", "戒指或吊坠", "リング/ペンダント", "ring/pendant"].includes(normalized)) return "RingOrPendant";
  if (["ring and pendant", "戒指和吊坠", "リング&ペンダント", "ring & pendant"].includes(normalized)) return "RingAndPendant";
  if (["bracelet", "手链", "ブレスレット"].includes(normalized)) return "Bracelet";
  if (["set", "套组", "セット"].includes(normalized)) return "Set";
  return "Pendant";
}

function getCategoryLabel(categoryKey, lang = "en", categoryLabels = null) {
  const key = mapCategoryToKey(categoryKey);
  return localized((categoryLabels && categoryLabels[key]) || CATEGORY_OPTIONS[key] || CATEGORY_OPTIONS.Pendant, lang);
}

function convertWorkToLocalized(work = {}) {
  const categoryKey = mapCategoryToKey(work.categoryKey || work.category);
  return {
    ...work,
    title: ensureML(work.title ?? "New Work"),
    subtitle: ensureML(work.subtitle ?? "Sin"),
    categoryKey,
    category: ensureML(work.category ?? getCategoryLabel(categoryKey, "en")),
    collection: ensureML(work.collection ?? "Main Collection"),
    collection2: ensureML(work.collection2 ?? ""),
    description: ensureML(work.description ?? ""),
    homeExcerpt: ensureML(work.homeExcerpt ?? ""),
    material: ensureML(work.material ?? "Silver 925"),
    stone: ensureML(work.stone ?? "Stone Name"),
    size: ensureML(work.size ?? "45 mm"),
  };
}

function localizeContentShape(content) {
  const next = { ...content };
  next.brandName = ensureML(next.brandName ?? "Mortal Aura");
  next.hero = {
    ...next.hero,
    eyebrow: ensureML(next.hero?.eyebrow ?? "Dark Jewelry Brand"),
    title: ensureML(next.hero?.title ?? "Mortal Aura"),
    subtitle: ensureML(next.hero?.subtitle ?? "Silver / Sin / Myth"),
    ctaPrimary: ensureML(next.hero?.ctaPrimary ?? "View Collection"),
    ctaSecondary: ensureML(next.hero?.ctaSecondary ?? "Shipping Policy"),
  };
  next.collectionsIntro = {
    ...next.collectionsIntro,
    sectionTitle: ensureML(next.collectionsIntro?.sectionTitle ?? "Collections"),
    sectionText: ensureML(next.collectionsIntro?.sectionText ?? ""),
    items: (next.collectionsIntro?.items || []).map((item, index) => ({
      ...item,
      title: ensureML(item.title ?? `Collection ${index + 1}`),
      subtitle: ensureML(item.subtitle ?? "Series"),
      description: ensureML(item.description ?? "Collection description."),
      targetCollection: ensureML(item.targetCollection ?? localized(item.title ?? `Collection ${index + 1}`, "en")),
    })),
  };
  next.worksIntro = {
    ...next.worksIntro,
    sectionTitle: ensureML(next.worksIntro?.sectionTitle ?? "Selected Works"),
    sectionText: ensureML(next.worksIntro?.sectionText ?? ""),
  };
  next.oneOfAKindIntro = {
    ...next.oneOfAKindIntro,
    sectionTitle: ensureML(next.oneOfAKindIntro?.sectionTitle ?? "One of a Kind"),
    sectionText: ensureML(next.oneOfAKindIntro?.sectionText ?? ""),
  };
  next.storiesIntro = {
    ...next.storiesIntro,
    sectionTitle: ensureML(next.storiesIntro?.sectionTitle ?? "Small Stories"),
    sectionText: ensureML(next.storiesIntro?.sectionText ?? ""),
    leftTitle: ensureML(next.storiesIntro?.leftTitle ?? "My Memories"),
    leftText: ensureML(next.storiesIntro?.leftText ?? ""),
    rightTitle: ensureML(next.storiesIntro?.rightTitle ?? "For Your Lover"),
    rightText: ensureML(next.storiesIntro?.rightText ?? ""),
  };
  next.visualSystem = {
    ...next.visualSystem,
    instagramSectionTitle: ensureML(next.visualSystem?.instagramSectionTitle ?? "Instagram Grid Preview"),
    instagramSectionText: ensureML(next.visualSystem?.instagramSectionText ?? ""),
  };
  next.shipping = {
    ...next.shipping,
    sectionTitle: ensureML(next.shipping?.sectionTitle ?? "Shipping Policy"),
    description: ensureML(next.shipping?.description ?? ""),
    note: ensureML(next.shipping?.note ?? ""),
  };
  next.about = {
    ...next.about,
    sectionTitle: ensureML(next.about?.sectionTitle ?? "About"),
    text1: ensureML(next.about?.text1 ?? ""),
    text2: ensureML(next.about?.text2 ?? ""),
    text3: ensureML(next.about?.text3 ?? ""),
  };
  next.contact = {
    ...next.contact,
    sectionTitle: ensureML(next.contact?.sectionTitle ?? "Contact"),
    instagramLabel: ensureML(next.contact?.instagramLabel ?? "Instagram"),
    note: ensureML(next.contact?.note ?? ""),
  };
  next.footer = {
    ...next.footer,
    text: ensureML(next.footer?.text ?? ""),
  };
  next.categoryLabels = FIXED_CATEGORIES.reduce((acc, key) => {
    acc[key] = ensureML(next.categoryLabels?.[key] ?? CATEGORY_OPTIONS[key]);
    return acc;
  }, {});
  next.works = (next.works || []).map(convertWorkToLocalized);
  next.oneOfAKindWorks = (next.oneOfAKindWorks || []).map(convertWorkToLocalized);
  next.memoryWorks = (next.memoryWorks || []).map(convertWorkToLocalized);
  next.loverWorks = (next.loverWorks || []).map(convertWorkToLocalized);
  return next;
}

function MultiLangEditor({ label, value, onChange, rows = 2 }) {
  const current = ensureML(value);
  const [activeLang, setActiveLang] = useState("en");
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">{label}</div>
        <div className="inline-flex items-center rounded-xl border border-white/10 bg-zinc-950 p-1">
          {ML_LANGS.map((lang) => (
            <button
              key={`${label}-${lang}`}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`rounded-lg px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] transition ${activeLang === lang ? "bg-zinc-100 text-black" : "text-zinc-400 hover:text-white"}`}
            >
              {lang === "en" ? "EN" : lang === "ja" ? "JP" : "中文"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">{activeLang}</div>
        {rows > 1 ? (
          <textarea value={current[activeLang]} rows={rows} onChange={(e) => onChange({ ...current, [activeLang]: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
        ) : (
          <input value={current[activeLang]} onChange={(e) => onChange({ ...current, [activeLang]: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
        )}
      </div>
    </div>
  );
}

function AdminSection({ title, defaultOpen = false, children, actions = null }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-black/35">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-5 py-5 text-left">
        <div className="min-w-0 text-sm font-medium tracking-[0.18em] text-white">{title}</div>
        <div className="flex items-center gap-2">
          {actions}
          {open ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
        </div>
      </button>
      {open ? <div className="border-t border-white/10 p-4">{children}</div> : null}
    </div>
  );
}

function WorkAdminCard({ listKey, work, index, currentLanguage, updateWorkList, categoryLabels }) {
  const [open, setOpen] = useState(false);
  const [imagesOpen, setImagesOpen] = useState(false);
  const imageSlots = Array.from({ length: 10 }, (_, slotIndex) => (Array.isArray(work.images) ? work.images[slotIndex] || "" : slotIndex === 0 ? (work.image || "") : ""));
  const syncImages = (slots) => {
    const cleaned = slots.map((v) => String(v || "").trim()).filter(Boolean).slice(0, 10);
    updateWorkList(listKey, index, { images: cleaned, image: cleaned[0] || "" });
  };
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-zinc-950/60">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left">
        <div className="min-w-0">
          <div className="truncate text-sm text-zinc-100">{index + 1}. {localized(work.title, currentLanguage) || work.sku}</div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-500">{work.sku}</div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={work.categoryKey || mapCategoryToKey(work.category)}
            onChange={(e) => updateWorkList(listKey, index, {
              categoryKey: e.target.value,
              category: ensureML(categoryLabels?.[e.target.value] ?? CATEGORY_OPTIONS[e.target.value]),
            })}
            onClick={(e) => e.stopPropagation()}
            className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none"
          >
            {FIXED_CATEGORIES.filter((key) => key !== "All").map((key) => (
              <option key={key} value={key}>{getCategoryLabel(key, currentLanguage, categoryLabels)}</option>
            ))}
          </select>
          {open ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
        </div>
      </button>
      {open ? (
        <div className="space-y-3 border-t border-white/10 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">SKU</div>
              <input value={work.sku || ""} onChange={(e) => updateWorkList(listKey, index, { sku: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Status</div>
              <select value={work.status || "In Stock"} onChange={(e) => updateWorkList(listKey, index, { status: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none">
                <option value="In Stock">In Stock</option>
                <option value="Sold Out">Sold Out</option>
                <option value="Made to Order">Made to Order</option>
                <option value="Limited">Limited</option>
              </select>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Price</div>
              <input value={work.price || ""} onChange={(e) => updateWorkList(listKey, index, { price: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Stock</div>
              <input value={work.stock || ""} onChange={(e) => updateWorkList(listKey, index, { stock: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3 sm:col-span-2">
              <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">PayPal URL</div>
              <input value={work.paypalPaymentUrl || ""} onChange={(e) => updateWorkList(listKey, index, { paypalPaymentUrl: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30">
            <button type="button" onClick={() => setImagesOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Image URLs</div>
                <div className="mt-1 text-[11px] text-zinc-500">10 slots · Slot 1 is the primary image</div>
              </div>
              {imagesOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
            </button>
            {imagesOpen ? (
              <div className="grid gap-3 border-t border-white/10 p-4">
                {imageSlots.map((url, slotIndex) => (
                  <div key={`${work.sku || index}-image-slot-${slotIndex}`} className="space-y-2">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">{slotIndex === 0 ? "Image 1 · Primary" : `Image ${slotIndex + 1}`}</div>
                    <input
                      value={url}
                      onChange={(e) => {
                        const nextSlots = [...imageSlots];
                        nextSlots[slotIndex] = e.target.value;
                        syncImages(nextSlots);
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <MultiLangEditor label="Title" value={work.title} rows={1} onChange={(value) => updateWorkList(listKey, index, { title: value })} />
          <MultiLangEditor label="Subtitle" value={work.subtitle} rows={1} onChange={(value) => updateWorkList(listKey, index, { subtitle: value })} />
          <MultiLangEditor label="Collection 1" value={work.collection} rows={1} onChange={(value) => updateWorkList(listKey, index, { collection: value })} />
          <MultiLangEditor label="Collection 2" value={work.collection2} rows={1} onChange={(value) => updateWorkList(listKey, index, { collection2: value })} />
          <MultiLangEditor label="Material" value={work.material} rows={1} onChange={(value) => updateWorkList(listKey, index, { material: value })} />
          <MultiLangEditor label="Stone" value={work.stone} rows={1} onChange={(value) => updateWorkList(listKey, index, { stone: value })} />
          <MultiLangEditor label="Size" value={work.size} rows={1} onChange={(value) => updateWorkList(listKey, index, { size: value })} />
          <MultiLangEditor label="Description" value={work.description} rows={4} onChange={(value) => updateWorkList(listKey, index, { description: value })} />
          <MultiLangEditor label="Home Excerpt" value={work.homeExcerpt} rows={3} onChange={(value) => updateWorkList(listKey, index, { homeExcerpt: value })} />
        </div>
      ) : null}
    </div>
  );
}

function storageAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "__mortal_aura_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function safeGet(key) {
  if (!storageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  if (!storageAvailable()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function ensureRateShape(rate = {}) {
  return { region: rate.region ?? "Region", price: rate.price ?? "¥0" };
}

function ensureCollectionItemShape(item = {}, index = 0) {
  return {
    title: item.title ?? `Collection ${index + 1}`,
    subtitle: item.subtitle ?? "Series",
    description: item.description ?? "Collection description.",
    image: item.image ?? "",
    targetCollection: item.targetCollection ?? item.title ?? `Collection ${index + 1}`,
    enabled: item.enabled ?? index < 3,
    shape: item.shape === "round" ? "round" : "long",
  };
}

function ensureWorkShape(work = {}) {
  const rawImages = Array.isArray(work.images)
    ? work.images
    : work.image
      ? [work.image]
      : [];
  const imageList = rawImages
    .filter((img) => typeof img === "string" && img.trim())
    .slice(0, 10);
  const primaryImage = imageList[0] || (typeof work.image === "string" ? work.image : "");
  const categoryKey = mapCategoryToKey((work.categoryKey || work.category) ?? "Pendant");
  return {
    title: work.title ?? "New Work",
    subtitle: work.subtitle ?? "Sin",
    categoryKey,
    category: work.category ?? CATEGORY_OPTIONS[categoryKey] ?? getCategoryLabel(categoryKey, "en"),
    collection: work.collection ?? "Main Collection",
    collection2: work.collection2 ?? "",
    sku: work.sku ?? `MA-NEW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    image: primaryImage,
    images: imageList,
    description: work.description ?? "",
    homeExcerpt: work.homeExcerpt ?? "",
    material: work.material ?? "Silver 925",
    stone: work.stone ?? "Stone Name",
    size: work.size ?? "45 mm",
    price: work.price ?? "¥0",
    originalPrice: work.originalPrice ?? "",
    salePrice: work.salePrice ?? "",
    saleLabel: work.saleLabel ?? "SALE",
    saleActive: Boolean(work.saleActive ?? work.salePrice),
    stock: work.stock ?? "1",
    status: work.status ?? "In Stock",
    featured: Boolean(work.featured),
    paypalPaymentUrl: work.paypalPaymentUrl ?? "",
  };
}

function normalizeSiteContent(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  const base = {
    sections: {
      hero: true,
      collections: true,
      works: true,
      oneOfAKind: true,
      stories: true,
      about: true,
      instagram: false,
      shipping: true,
      contact: true,
      memoryLove: true,
    },
    brandName: "Mortal Aura",
    hero: {
      eyebrow: "Dark Jewelry Brand",
      title: "Mortal Aura",
      subtitle: "Silver / Sin / Myth",
      ctaPrimary: "View Collection",
      ctaSecondary: "Shipping Policy",
      backgroundImage: "",
    },
    store: {
      currency: "JPY",
      domesticFreeShippingThreshold: "20000",
      internationalFreeShippingThreshold: "100000",
      japanShippingNote: "",
      internationalShippingNote: "",
      checkoutNote: "",
    },
    collectionsIntro: {
      sectionTitle: "Collections",
      sectionText: "",
      items: Array.from({ length: 6 }, (_, index) => ensureCollectionItemShape({}, index)),
    },
    worksIntro: { sectionTitle: "Selected Works", sectionText: "" },
    oneOfAKindIntro: { sectionTitle: "One of a Kind", sectionText: "" },
    storiesIntro: {
      sectionTitle: "Small Stories",
      sectionText: "",
      leftTitle: "My Memories",
      leftText: "",
      rightTitle: "For Your Lover",
      rightText: "",
    },
    visualSystem: {
      showWatermark: true,
      watermarkText: "M.A",
      watermarkOpacity: "18",
      instagramSectionTitle: "Instagram Grid Preview",
      instagramSectionText: "",
    },
    shipping: {
      sectionTitle: "Shipping Policy",
      description: "",
      rates: [],
      note: "",
    },
    works: [],
    oneOfAKindWorks: [],
    memoryWorks: [],
    loverWorks: [],
    about: { sectionTitle: "About", text1: "", text2: "", text3: "" },
    contact: {
      sectionTitle: "Contact",
      email: "",
      instagramLabel: "Instagram",
      instagram: "",
      instagramUrl: "",
      note: "",
    },
    footer: { text: "" },
    categoryLabels: FIXED_CATEGORIES.reduce((acc, key) => ({ ...acc, [key]: CATEGORY_OPTIONS[key] }), {}),
  };
  return localizeContentShape({
    ...base,
    ...safe,
    sections: { ...base.sections, ...(safe.sections || {}) },
    hero: { ...base.hero, ...(safe.hero || {}) },
    store: { ...base.store, ...(safe.store || {}) },
    collectionsIntro: {
      ...base.collectionsIntro,
      ...(safe.collectionsIntro || {}),
      items: Array.from({ length: 6 }, (_, index) =>
        ensureCollectionItemShape(safe.collectionsIntro?.items?.[index] ?? base.collectionsIntro.items[index], index)
      ),
    },
    worksIntro: { ...base.worksIntro, ...(safe.worksIntro || {}) },
    oneOfAKindIntro: { ...base.oneOfAKindIntro, ...(safe.oneOfAKindIntro || {}) },
    storiesIntro: { ...base.storiesIntro, ...(safe.storiesIntro || {}) },
    visualSystem: { ...base.visualSystem, ...(safe.visualSystem || {}) },
    shipping: {
      ...base.shipping,
      ...(safe.shipping || {}),
      rates: Array.isArray(safe.shipping?.rates) ? safe.shipping.rates.map(ensureRateShape) : [],
    },
    about: { ...base.about, ...(safe.about || {}) },
    contact: { ...base.contact, ...(safe.contact || {}) },
    footer: { ...base.footer, ...(safe.footer || {}) },
    works: Array.isArray(safe.works) ? safe.works.map(ensureWorkShape) : [],
    oneOfAKindWorks: Array.isArray(safe.oneOfAKindWorks) ? safe.oneOfAKindWorks.map(ensureWorkShape) : [],
    memoryWorks: Array.isArray(safe.memoryWorks) ? safe.memoryWorks.map(ensureWorkShape) : [],
    loverWorks: Array.isArray(safe.loverWorks) ? safe.loverWorks.map(ensureWorkShape) : [],
  });
}

function normalizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      sku: String(item.sku ?? ""),
      quantity: Math.max(1, Number(item.quantity ?? 1) || 1),
    }))
    .filter((item) => item.sku);
}

function parseYen(value) {
  return Number(String(value ?? "0").replace(/[^\d.-]/g, "")) || 0;
}

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function hasActiveSale(work) {
  return Boolean(work?.saleActive && parseYen(work?.salePrice) > 0);
}

function getEffectivePriceValue(work) {
  return hasActiveSale(work) ? parseYen(work.salePrice) : parseYen(work.price);
}

function getDisplayPrice(work) {
  return hasActiveSale(work) ? work.salePrice : work.price;
}

function getOriginalPriceLabel(work) {
  return hasActiveSale(work) ? work.originalPrice || work.price : "";
}

function getSalePercent(work) {
  const original = parseYen(getOriginalPriceLabel(work));
  const current = getEffectivePriceValue(work);
  if (!original || current >= original) return 0;
  return Math.round(((original - current) / original) * 100);
}

function useRevealOnScroll(options = {}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed || typeof window === "undefined" || !ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: options.threshold ?? 0.22,
        rootMargin: options.rootMargin ?? "0px 0px -8% 0px",
      }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [revealed, options.rootMargin, options.threshold]);

  return [ref, revealed];
}

function RevealBlock({ children, className = "", delay = 0, threshold = 0.12 }) {
  const [ref, revealed] = useRevealOnScroll({ threshold });
  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function getStatusBadgeClass(status, stock) {
  if (status === "Sold Out" || Number(stock || 0) <= 0) return "border-red-500/30 bg-red-500/10 text-red-300";
  if (status === "Made to Order") return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  if (status === "Limited") return "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200";
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function getWorkCollections(work, lang) {
  return [localized(work.collection, lang), localized(work.collection2, lang)].map((v) => String(v || "").trim()).filter(Boolean);
}

function getCartSummary(cart, works, store) {
  const allWorks = works;
  const items = cart
    .map((cartItem) => {
      const work = allWorks.find((w) => w.sku === cartItem.sku);
      if (!work) return null;
      const unitPrice = getEffectivePriceValue(work);
      return { ...work, quantity: cartItem.quantity, unitPrice, lineTotal: unitPrice * cartItem.quantity };
    })
    .filter(Boolean);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const domesticFreeThreshold = parseYen(store.domesticFreeShippingThreshold);
  const internationalFreeThreshold = parseYen(store.internationalFreeShippingThreshold);
  return {
    items,
    subtotal,
    domesticFreeThreshold,
    internationalFreeThreshold,
  };
}

function WorkCard({ work, ui, visualSystem, onOpen, onAddToCart, localizedStatus, currentLanguage, categoryLabels = null, compact = false, largeTitle = false }) {
  const [cardRef, revealed] = useRevealOnScroll({ threshold: compact ? 0.12 : 0.18 });
  const coverImage = (Array.isArray(work.images) && work.images.find(Boolean)) || work.image || "";
  const soldOut = work.status === "Sold Out" || Number(work.stock || 0) <= 0;
  const currentPriceLabel = getDisplayPrice(work);
  const originalPriceLabel = getOriginalPriceLabel(work);
  const salePercent = getSalePercent(work);
  const imageColorClass = revealed ? "scale-[1.01] grayscale-0 md:grayscale md:group-hover:grayscale-0" : "grayscale";

  return (
    <article
      ref={cardRef}
      className={`group overflow-hidden rounded-[1.4rem] border border-white/10 bg-zinc-950 transition-all duration-700 ease-out hover:border-white/20 sm:rounded-3xl ${compact ? "max-w-[360px]" : ""} ${revealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} hover:-translate-y-1`}
    >
      <div onClick={onOpen} className="cursor-pointer">
        <div className={`relative flex items-center justify-center overflow-hidden border-b border-white/10 bg-black ${compact ? "aspect-square" : "aspect-square sm:aspect-[3/4]"}`}>
          {coverImage ? (
            <img
              src={coverImage}
              alt={localized(work.title, currentLanguage)}
              className={`max-h-full max-w-full object-contain transition-[filter,transform] duration-[3000ms] ease-out md:duration-700 ${imageColorClass}`}
            />
          ) : null}
          <div className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out ${revealed ? "opacity-100" : "opacity-0"}`} style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0) 34%, rgba(0,0,0,0.12) 58%, rgba(0,0,0,0.34) 82%, rgba(0,0,0,0.52) 100%)" }} />
          {visualSystem.showWatermark ? (
            <div className="pointer-events-none absolute bottom-3 right-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white sm:bottom-4 sm:right-4 sm:text-xs sm:tracking-[0.35em]" style={{ opacity: Number(visualSystem.watermarkOpacity || 18) / 100 }}>
              {visualSystem.watermarkText}
            </div>
          ) : null}
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
            {work.featured ? <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-zinc-100 sm:px-3 sm:text-[10px] sm:tracking-[0.3em]">{ui.featured}</span> : null}
            {hasActiveSale(work) ? <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] text-amber-200 sm:px-3 sm:text-[10px] sm:tracking-[0.3em]">{work.saleLabel || "SALE"}{salePercent ? ` · -${salePercent}%` : ""}</span> : null}
            <span className={`rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.18em] sm:px-3 sm:text-[10px] sm:tracking-[0.3em] ${getStatusBadgeClass(work.status, work.stock)}`}>
              {localizedStatus(work.status)}
            </span>
          </div>
        </div>
        <div className={compact ? "p-3 sm:p-5" : "p-3.5 sm:p-6 md:p-7"}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className={`${compact ? "text-sm sm:text-xl" : largeTitle ? "text-lg sm:text-3xl" : "text-sm sm:text-2xl"} truncate font-medium uppercase tracking-[0.06em] text-white sm:tracking-[0.08em]`}>
                {localized(work.title, currentLanguage)}
              </h3>
              <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-zinc-500 sm:mt-2 sm:text-xs sm:tracking-[0.35em]">{localized(work.subtitle, currentLanguage)} / {getCategoryLabel(work.categoryKey || work.category, currentLanguage, categoryLabels)}</p>
              <div className="mt-2 flex max-w-full flex-wrap gap-1.5 sm:gap-2">{getWorkCollections(work, currentLanguage).map((entry, idx) => <p key={`${work.sku}-collection-${idx}`} className="inline-flex max-w-full truncate rounded-full border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-zinc-300 sm:px-3 sm:text-[10px] sm:tracking-[0.3em]">{entry}</p>)}</div>
            </div>
            <div className="shrink-0 text-right">
              {hasActiveSale(work) && originalPriceLabel ? <div className="text-[10px] text-zinc-500 line-through sm:text-xs">{originalPriceLabel}</div> : null}
              <div className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-100 sm:px-3 sm:text-xs">{currentPriceLabel}</div>
            </div>
          </div>
          {work.homeExcerpt ? <p className={`${compact ? "mt-3 hidden text-sm leading-6 text-zinc-400 sm:block" : "mt-4 hidden text-sm leading-7 text-zinc-400 sm:block"}`}>{localized(work.homeExcerpt, currentLanguage)}</p> : null}
          <div className="mt-3 hidden flex-wrap gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:flex sm:text-[11px] sm:tracking-[0.28em]">
            <span>{localized(work.material, currentLanguage)}</span><span>•</span><span>{localized(work.stone, currentLanguage)}</span><span>•</span><span>{localized(work.size, currentLanguage)}</span><span>•</span><span>{work.sku}</span>
          </div>
        </div>
      </div>
      <div className={compact ? "border-t border-white/10 px-3 pb-3 pt-2.5 sm:px-5 sm:pb-4 sm:pt-3" : "border-t border-white/10 px-3.5 pb-3.5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 md:px-7"}>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <button onClick={onOpen} className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 text-zinc-100 transition hover:border-white/30 hover:text-white ${compact ? "px-3 py-2 text-[11px] sm:text-xs" : "px-3 py-2.5 text-[11px] sm:px-4 sm:py-3 sm:text-sm"}`}>
            <Eye size={16} /> {ui.viewDetails}
          </button>
          <button onClick={onAddToCart} disabled={soldOut} className={`inline-flex items-center justify-center gap-2 rounded-2xl border transition ${compact ? "px-3 py-2 text-[11px] sm:text-xs" : "px-3 py-2.5 text-[11px] sm:px-4 sm:py-3 sm:text-sm"} ${soldOut ? "cursor-not-allowed border-white/10 text-zinc-500" : "border-white/10 text-zinc-100 hover:border-white/30 hover:text-white"}`}>
            <ShoppingBag size={16} /> {ui.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}

function filterWorks(list, category, searchTerm, lang, categoryLabels = null) {
  const q = searchTerm.trim().toLowerCase();
  return list.filter((work) => {
    const workCategoryKey = mapCategoryToKey(work.categoryKey || work.category);
    const matchesCategory = category === "All" || workCategoryKey === category;
    const haystack = [localized(work.title, lang), localized(work.subtitle, lang), localized(work.stone, lang), localized(work.collection, lang), localized(work.collection2, lang), work.sku, getCategoryLabel(workCategoryKey, lang, categoryLabels)].join(" ").toLowerCase();
    const matchesSearch = !q || haystack.includes(q);
    return matchesCategory && matchesSearch;
  });
}

export default function App() {
  const [siteContent, setSiteContent] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const raw = safeGet(CART_KEY);
      return raw ? normalizeCart(JSON.parse(raw)) : [];
    } catch {
      return [];
    }
  });
  const [currentLanguage, setCurrentLanguage] = useState(() => safeGet(LANGUAGE_KEY) || "zh");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saveState, setSaveState] = useState("读取中");
  const [headerSearchTerm, setHeaderSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [oneOfAKindCategory, setOneOfAKindCategory] = useState("All");
  const [memoryCategory, setMemoryCategory] = useState("All");
  const [loverCategory, setLoverCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedDetailImageIndex, setSelectedDetailImageIndex] = useState(0);
  const [exportText, setExportText] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", email: "", country: "Japan", city: "", address: "", note: "" });
  const [worksExpanded, setWorksExpanded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth));
  const fileInputRef = useRef(null);

  useEffect(() => {
    const admin = (() => {
      try {
        const params = new URLSearchParams(window.location.search);
        return params.get("admin") === "1" || safeGet(ADMIN_KEY) === "1";
      } catch {
        return false;
      }
    })();
    setIsAdminMode(admin);
    setEditorOpen(admin);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(CONFIG_URL, { cache: "no-store" });
        const remote = await res.json();
        const normalized = normalizeSiteContent(remote);
        setSiteContent(normalized);
        safeSet(STORAGE_KEY, JSON.stringify(normalized));
        setSaveState("已从项目 JSON 读取");
      } catch {
        try {
          const local = safeGet(STORAGE_KEY);
          const normalized = normalizeSiteContent(local ? JSON.parse(local) : {});
          setSiteContent(normalized);
          setSaveState("已从本地读取");
        } catch {
          setSiteContent(normalizeSiteContent({}));
          setSaveState("读取失败");
        }
      }
    })();
  }, []);

  useEffect(() => {
    safeSet(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeSet(LANGUAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    if (!siteContent) return;
    safeSet(STORAGE_KEY, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    setWorksExpanded(false);
  }, [activeCategory, headerSearchTerm, currentLanguage]);

  if (!siteContent) {
    return <div className="flex min-h-screen items-center justify-center bg-black text-zinc-300">Loading...</div>;
  }

  const normalizedContent = siteContent;
  const ui = UI_TEXTS[currentLanguage] || UI_TEXTS.en;
  const allWorks = normalizedContent.works.concat(normalizedContent.oneOfAKindWorks, normalizedContent.memoryWorks, normalizedContent.loverWorks);
  const filteredWorks = filterWorks(normalizedContent.works, activeCategory, headerSearchTerm, currentLanguage, normalizedContent.categoryLabels);
  const filteredOneOfAKindWorks = filterWorks(normalizedContent.oneOfAKindWorks, oneOfAKindCategory, headerSearchTerm, currentLanguage, normalizedContent.categoryLabels);
  const filteredMemoryWorks = filterWorks(normalizedContent.memoryWorks, memoryCategory, headerSearchTerm, currentLanguage, normalizedContent.categoryLabels);
  const filteredLoverWorks = filterWorks(normalizedContent.loverWorks, loverCategory, headerSearchTerm, currentLanguage, normalizedContent.categoryLabels);
  const worksColumns = viewportWidth >= 1280 ? 3 : 2;
  const collapsedWorksCount = worksColumns * 3;
  const visibleWorks = worksExpanded ? filteredWorks : filteredWorks.slice(0, collapsedWorksCount);
  const shouldShowWorksToggle = filteredWorks.length > collapsedWorksCount;
  const cartSummary = getCartSummary(cart, allWorks, normalizedContent.store);
  const previewShiftClass = isAdminMode && editorOpen ? "xl:pr-[29rem]" : "";
  const updateWorkList = (listKey, index, patch) => {
    setSiteContent((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const localizedStatus = (status) => {
    if (status === "Sold Out") return ui.soldOut;
    if (status === "Made to Order") return ui.madeToOrder;
    if (status === "Limited") return ui.limited;
    return ui.inStock;
  };

  const navItems = [
    normalizedContent.sections.hero ? { id: "home", label: ui.navHome } : null,
    normalizedContent.sections.collections ? { id: "collections", label: ui.navCollections } : null,
    normalizedContent.sections.works ? { id: "works", label: ui.navWorks } : null,
    normalizedContent.sections.oneOfAKind ? { id: "one-of-a-kind", label: ui.navOneOfAKind } : null,
    normalizedContent.sections.stories ? { id: "stories", label: ui.navStories } : null,
    normalizedContent.sections.about ? { id: "about", label: ui.navAbout } : null,
    normalizedContent.sections.shipping ? { id: "shipping", label: ui.navShipping } : null,
    normalizedContent.sections.contact ? { id: "contact", label: ui.navContact } : null,
  ].filter(Boolean);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  const addToCart = (work) => {
    if (!work || work.status === "Sold Out" || Number(work.stock || 0) <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.sku === work.sku);
      if (existing) return prev.map((item) => item.sku === work.sku ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { sku: work.sku, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (sku, delta) => {
    setCart((prev) => normalizeCart(prev.map((item) => item.sku === sku ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0)));
  };

  const exportData = () => {
    const jsonText = JSON.stringify(normalizeSiteContent(siteContent), null, 2);
    setExportText(jsonText);
    setExportModalOpen(true);
    try {
      const blob = new Blob([jsonText], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mortal-aura-jewelry-config.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {}
  };

  const importData = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const next = normalizeSiteContent(JSON.parse(String(reader.result)));
        setSiteContent(next);
        safeSet(STORAGE_KEY, JSON.stringify(next));
        setSaveState("已导入");
      } catch {
        setSaveState("导入失败");
      }
    };
    reader.readAsText(file);
  };

  const resetLocal = async () => {
    try {
      const res = await fetch(CONFIG_URL, { cache: "no-store" });
      const remote = await res.json();
      const normalized = normalizeSiteContent(remote);
      setSiteContent(normalized);
      safeSet(STORAGE_KEY, JSON.stringify(normalized));
      setSaveState("已恢复项目 JSON");
    } catch {
      setSaveState("恢复失败");
    }
  };

  const orderSummaryText = [
    `Customer: ${checkoutForm.name || "-"}`,
    `Email: ${checkoutForm.email || "-"}`,
    `Country/Region: ${checkoutForm.country || "-"}`,
    `City: ${checkoutForm.city || "-"}`,
    `Address: ${checkoutForm.address || "-"}`,
    `Note: ${checkoutForm.note || "-"}`,
    "",
    "Items:",
    ...cartSummary.items.map((item) => `${localized(item.title, currentLanguage)} (${item.sku}) × ${item.quantity} = ${formatYen(item.lineTotal)}`),
    "",
    `Subtotal: ${formatYen(cartSummary.subtotal)}`,
  ].join("\n");

  return (
    <div className={`min-h-screen bg-black text-zinc-200 ${previewShiftClass}`}>
      {isAdminMode ? (
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur md:px-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white">Mortal Aura Admin</p>
            <p className="text-xs text-zinc-500">当前结构：项目默认读取 public/mortal-aura-config.json，后台仍可手动导入导出。</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300">
              <Check size={14} /> {saveState}
            </span>
            <button onClick={exportData} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white">
              <Download size={16} /> 导出配置
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white">
              <Upload size={16} /> 导入配置
            </button>
            <button onClick={resetLocal} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white">
              恢复项目 JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => importData(e.target.files?.[0])} />
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 md:px-8">
          <div className="rounded-[1.75rem] border border-white/10 bg-black/45 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:px-5 md:px-6">
            <div className="flex items-center justify-between gap-4">
              <button onClick={() => scrollToId("home")} className="shrink-0 text-left text-base font-semibold uppercase tracking-[0.28em] text-zinc-100 sm:text-lg md:text-xl md:tracking-[0.35em]">
                {localized(normalizedContent.brandName, currentLanguage)}
              </button>
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="hidden xl:flex items-center rounded-2xl border border-white/10 bg-zinc-950/80 px-3 py-2">
                  <Search size={15} className="mr-2 shrink-0 text-zinc-500" />
                  <input
                    value={headerSearchTerm}
                    onChange={(e) => setHeaderSearchTerm(e.target.value)}
                    placeholder={ui.searchPlaceholder}
                    className="w-[170px] bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500 2xl:w-[220px]"
                  />
                </div>
                <div className="hidden md:flex items-center gap-1 rounded-2xl border border-white/10 bg-zinc-950 p-1">
                  {[{ code: "en", label: "EN" }, { code: "ja", label: "JP" }, { code: "zh", label: "中文" }].map((lang) => (
                    <button key={lang.code} onClick={() => setCurrentLanguage(lang.code)} className={`rounded-xl px-3 py-1.5 text-xs transition ${currentLanguage === lang.code ? "bg-zinc-100 text-black" : "text-zinc-300 hover:text-white"}`}>
                      {lang.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCartOpen(true)} className="relative inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white sm:px-4">
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">{ui.cart}</span>
                  {cartSummary.items.length > 0 ? <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-black">{cartSummary.items.reduce((sum, item) => sum + item.quantity, 0)}</span> : null}
                </button>
                <button onClick={() => setMobileMenuOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 transition hover:border-white/30 hover:text-white xl:hidden">
                  <Menu size={16} />
                  <span className="hidden sm:inline">{ui.menu}</span>
                </button>
              </div>
            </div>

            <div className="mt-3 hidden xl:flex items-center justify-center border-t border-white/10 pt-3">
              <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 2xl:gap-x-8">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => scrollToId(item.id)} className="text-xs uppercase tracking-[0.26em] text-zinc-400 transition hover:text-white 2xl:text-sm">
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
        {mobileMenuOpen ? (
          <div className="border-t border-white/10 bg-black/90 px-4 py-4 backdrop-blur sm:px-6 xl:hidden">
            <div className="mb-3 flex items-center rounded-2xl border border-white/10 bg-zinc-950/80 px-3 py-2">
              <Search size={15} className="mr-2 shrink-0 text-zinc-500" />
              <input
                value={headerSearchTerm}
                onChange={(e) => setHeaderSearchTerm(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-full bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
              />
            </div>
            <div className="mb-3 flex items-center gap-1 rounded-2xl border border-white/10 bg-zinc-950 p-1 md:hidden">
              {[{ code: "en", label: "EN" }, { code: "ja", label: "JP" }, { code: "zh", label: "中文" }].map((lang) => (
                <button key={lang.code} onClick={() => setCurrentLanguage(lang.code)} className={`rounded-xl px-3 py-1.5 text-xs transition ${currentLanguage === lang.code ? "bg-zinc-100 text-black" : "text-zinc-300 hover:text-white"}`}>
                  {lang.label}
                </button>
              ))}
            </div>
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToId(item.id)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-left text-sm uppercase tracking-[0.22em] text-zinc-200 transition hover:border-white/30 hover:text-white">
                  <span>{item.label}</span>
                  <ChevronDown size={14} className="rotate-[-90deg]" />
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        {normalizedContent.sections.hero ? (
          <section id="home" className="relative isolate overflow-hidden border-b border-white/10">
            {normalizedContent.hero.backgroundImage ? <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${normalizedContent.hero.backgroundImage})` }} /> : null}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black" />
            <div className="relative mx-auto flex min-h-[82vh] max-w-7xl items-center px-4 py-16 sm:px-6 sm:py-20 md:min-h-[92vh] md:px-8 md:py-24">
              <div className="max-w-4xl">
                <p className="mb-5 text-xs uppercase tracking-[0.45em] text-zinc-400 md:text-sm">{localized(normalizedContent.hero.eyebrow, currentLanguage)}</p>
                <h1 className="mb-6 text-4xl font-semibold uppercase leading-none tracking-[0.06em] text-white sm:text-5xl md:text-7xl lg:text-8xl">{localized(normalizedContent.hero.title, currentLanguage)}</h1>
                <p className="max-w-2xl text-sm tracking-[0.14em] text-zinc-300 sm:text-base md:text-lg md:tracking-[0.18em] uppercase">{localized(normalizedContent.hero.subtitle, currentLanguage)}</p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <button onClick={() => scrollToId("collections")} className="rounded-2xl border border-zinc-200 px-6 py-3 text-sm uppercase tracking-[0.22em] text-zinc-100 transition hover:bg-zinc-100 hover:text-black">
                    {localized(normalizedContent.hero.ctaPrimary, currentLanguage)}
                  </button>
                  <button onClick={() => scrollToId("shipping")} className="rounded-2xl border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.22em] text-zinc-300 transition hover:border-white/40 hover:text-white">
                    {localized(normalizedContent.hero.ctaSecondary, currentLanguage)}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.collections ? (
          <section id="collections" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.collections}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.collectionsIntro.sectionTitle, currentLanguage)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.collectionsIntro.sectionText, currentLanguage)}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {normalizedContent.collectionsIntro.items.filter((item) => item.enabled).map((item, index) => (
                  <RevealBlock key={`${localized(item.title, currentLanguage)}-${index}`} delay={index * 60}>
                    <button
                    onClick={() => {
                      setHeaderSearchTerm(localized(item.targetCollection, currentLanguage) || localized(item.title, currentLanguage));
                      scrollToId("works");
                    }}
                    className={`group relative overflow-hidden border border-white/10 bg-zinc-950 text-left shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition duration-500 hover:-translate-y-1 hover:border-white/25 ${item.shape === "round" ? "rounded-full" : "rounded-[1.35rem] sm:rounded-[2rem]"}`}
                  >
                    <div className={`relative overflow-hidden bg-black ${item.shape === "round" ? "aspect-square" : "aspect-square sm:aspect-[4/3]"}`}>
                      {item.image ? <img src={item.image} alt={localized(item.title, currentLanguage)} className="h-full w-full object-cover grayscale-0 transition duration-700 group-hover:scale-105" /> : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                        <p className="text-[8px] uppercase tracking-[0.22em] text-zinc-500 sm:text-[10px] sm:tracking-[0.35em]">{localized(item.subtitle, currentLanguage)}</p>
                        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.04em] text-white sm:mt-1 sm:text-xl sm:tracking-[0.08em]">{localized(item.title, currentLanguage)}</p>
                      </div>
                    </div>
                    <div className={`px-2.5 pb-3 pt-2 text-[10px] leading-4 text-zinc-400 sm:px-5 sm:pb-6 sm:pt-3 sm:text-sm sm:leading-7 ${item.shape === "round" ? "text-center" : ""}`}>
                      {localized(item.description, currentLanguage)}
                    </div>
                  </button>
                  </RevealBlock>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.works ? (
          <section id="works" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.works}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.worksIntro.sectionTitle, currentLanguage)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.worksIntro.sectionText, currentLanguage)}</p>
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {FIXED_CATEGORIES.map((category) => (
                  <button key={getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)} onClick={() => setActiveCategory(category)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${activeCategory === category ? "border-zinc-100 bg-zinc-100 text-black" : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"}`}>
                    {getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleWorks.map((work) => (
                  <WorkCard
                    key={work.sku}
                    work={work}
                    ui={ui}
                    visualSystem={normalizedContent.visualSystem}
                    localizedStatus={localizedStatus}
                    currentLanguage={currentLanguage}
                    onOpen={() => {
                      setSelectedWork(work);
                      setSelectedDetailImageIndex(0);
                    }}
                    onAddToCart={() => addToCart(work)}
                  />
                ))}
              </div>
              {shouldShowWorksToggle ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setWorksExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-xs uppercase tracking-[0.22em] text-zinc-200 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                  >
                    {worksExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {worksExpanded ? ui.collapseWorks : ui.expandWorks}
                  </button>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.oneOfAKind ? (
          <section id="one-of-a-kind" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.oneOfAKind}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.oneOfAKindIntro.sectionTitle, currentLanguage)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.oneOfAKindIntro.sectionText, currentLanguage)}</p>
              </div>
              <div className="mb-8 flex flex-wrap gap-2">
                {FIXED_CATEGORIES.map((category) => (
                  <button key={getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)} onClick={() => setOneOfAKindCategory(category)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${oneOfAKindCategory === category ? "border-zinc-100 bg-zinc-100 text-black" : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"}`}>
                    {getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredOneOfAKindWorks.length ? filteredOneOfAKindWorks.map((work) => (
                  <WorkCard
                    key={work.sku}
                    work={work}
                    ui={ui}
                    visualSystem={normalizedContent.visualSystem}
                    localizedStatus={localizedStatus}
                    currentLanguage={currentLanguage}
                    onOpen={() => {
                      setSelectedWork(work);
                      setSelectedDetailImageIndex(0);
                    }}
                    onAddToCart={() => addToCart(work)}
                  />
                )) : <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">{ui.noOneOfAKind}</div>}
              </div>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.stories ? (
          <section id="stories" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.stories}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.storiesIntro.sectionTitle, currentLanguage)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.storiesIntro.sectionText, currentLanguage)}</p>
              </div>
              <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <div className="flex flex-wrap gap-2">{FIXED_CATEGORIES.map((category) => <button key={`memory-${getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}`} onClick={() => setMemoryCategory(category)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${memoryCategory === category ? "border-zinc-100 bg-zinc-100 text-black" : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"}`}>{getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}</button>)}</div>
                <div className="flex flex-wrap gap-2 lg:justify-end">{FIXED_CATEGORIES.map((category) => <button key={`lover-${getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}`} onClick={() => setLoverCategory(category)} className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${loverCategory === category ? "border-zinc-100 bg-zinc-100 text-black" : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white"}`}>{getCategoryLabel(category, currentLanguage, normalizedContent.categoryLabels)}</button>)}</div>
              </div>
              <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-start">
                <div>
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Left Story</p>
                    <h3 className="mt-2 text-2xl font-medium uppercase tracking-[0.08em] text-white">{localized(normalizedContent.storiesIntro.leftTitle, currentLanguage)}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{localized(normalizedContent.storiesIntro.leftText, currentLanguage)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2">
                    {filteredMemoryWorks.length ? filteredMemoryWorks.map((work) => (
                      <WorkCard
                        key={work.sku}
                        work={work}
                        ui={ui}
                        visualSystem={normalizedContent.visualSystem}
                        localizedStatus={localizedStatus}
                    currentLanguage={currentLanguage}
                        compact
                        onOpen={() => {
                          setSelectedWork(work);
                          setSelectedDetailImageIndex(0);
                        }}
                        onAddToCart={() => addToCart(work)}
                      />
                    )) : <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500 sm:col-span-2">{ui.noMemoryWorks}</div>}
                  </div>
                </div>
                <div className="hidden md:flex h-full min-h-[360px] items-stretch justify-center"><div className="h-full w-px border-l border-dashed border-white/20" /></div>
                <div>
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Right Story</p>
                    <h3 className="mt-2 text-2xl font-medium uppercase tracking-[0.08em] text-white">{localized(normalizedContent.storiesIntro.rightTitle, currentLanguage)}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-400">{localized(normalizedContent.storiesIntro.rightText, currentLanguage)}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2">
                    {filteredLoverWorks.length ? filteredLoverWorks.map((work) => (
                      <WorkCard
                        key={work.sku}
                        work={work}
                        ui={ui}
                        visualSystem={normalizedContent.visualSystem}
                        localizedStatus={localizedStatus}
                    currentLanguage={currentLanguage}
                        compact
                        onOpen={() => {
                          setSelectedWork(work);
                          setSelectedDetailImageIndex(0);
                        }}
                        onAddToCart={() => addToCart(work)}
                      />
                    )) : <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500 sm:col-span-2">{ui.noMemoryWorks}</div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.about ? (
          <section id="about" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.about}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.about.sectionTitle, currentLanguage)}</h2>
              </div>
              <div className="space-y-6 text-sm leading-8 text-zinc-400 md:text-base">
                <p>{localized(normalizedContent.about.text1, currentLanguage)}</p>
                <p>{localized(normalizedContent.about.text2, currentLanguage)}</p>
                <p>{localized(normalizedContent.about.text3, currentLanguage)}</p>
              </div>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.shipping ? (
          <section id="shipping" className="border-b border-white/10 px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.shipping}</p>
                <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.shipping.sectionTitle, currentLanguage)}</h2>
                <p className="mt-4 text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.shipping.description, currentLanguage)}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4 rounded-[2rem] border border-white/10 bg-zinc-950 p-6">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-zinc-400">
                    {normalizedContent.store.japanShippingNote}<br />{normalizedContent.store.internationalShippingNote}
                  </div>
                </div>
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
                  {normalizedContent.shipping.rates.map((rate, index) => (
                    <div key={`${rate.region}-${index}`} className="grid grid-cols-[1fr_auto] border-b border-white/10 px-6 py-4 text-sm text-zinc-300 last:border-b-0">
                      <div>{rate.region}</div>
                      <div>{rate.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-sm text-zinc-500">{localized(normalizedContent.shipping.note, currentLanguage)}</p>
            </div>
          </section>
        ) : null}

        {normalizedContent.sections.contact ? (
          <section id="contact" className="px-6 py-20 md:px-8 md:py-24">
            <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-zinc-950 p-8 md:p-12">
              <p className="mb-3 text-xs uppercase tracking-[0.45em] text-zinc-500">{ui.contact}</p>
              <h2 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white md:text-4xl">{localized(normalizedContent.contact.sectionTitle, currentLanguage)}</h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">{localized(normalizedContent.contact.note, currentLanguage)}</p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Email</p>
                  <a href={`mailto:${normalizedContent.contact.email}`} className="mt-3 block text-lg text-zinc-100 transition hover:text-white">{normalizedContent.contact.email}</a>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{localized(normalizedContent.contact.instagramLabel, currentLanguage)}</p>
                  <a href={normalizedContent.contact.instagramUrl} target="_blank" rel="noreferrer" className="mt-3 block text-lg text-zinc-100 transition hover:text-white">{normalizedContent.contact.instagram}</a>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {isAdminMode ? (
        <>
          <button
            type="button"
            onClick={() => setEditorOpen((v) => !v)}
            className="fixed bottom-5 right-5 z-[85] hidden rounded-full border border-white/10 bg-zinc-950/90 px-4 py-3 text-xs uppercase tracking-[0.22em] text-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur xl:inline-flex"
          >
            {editorOpen ? "Hide Editor" : "Show Editor"}
          </button>
          {editorOpen ? (
            <aside className="fixed inset-y-0 right-0 z-[84] hidden w-[28rem] border-l border-white/10 bg-black/96 xl:block">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.3em] text-white">Multi-language Editor</p>
                    <p className="mt-1 text-xs text-zinc-500">字段内语言 tab 已启用，当前内容自动保存到本地。</p>
                  </div>
                  <button onClick={() => setEditorOpen(false)} className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:text-white"><X size={16} /></button>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                  <AdminSection title="店铺设置">
                    <div className="space-y-3">
                      <MultiLangEditor label="Brand Name" value={siteContent.brandName} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, brandName: value }))} />
                      <MultiLangEditor label="Footer Text" value={siteContent.footer.text} rows={2} onChange={(value) => setSiteContent((prev) => ({ ...prev, footer: { ...prev.footer, text: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="首页 HERO">
                    <div className="space-y-3">
                      <MultiLangEditor label="Eyebrow" value={siteContent.hero.eyebrow} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: value } }))} />
                      <MultiLangEditor label="Title" value={siteContent.hero.title} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, hero: { ...prev.hero, title: value } }))} />
                      <MultiLangEditor label="Subtitle" value={siteContent.hero.subtitle} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: value } }))} />
                      <MultiLangEditor label="Primary CTA" value={siteContent.hero.ctaPrimary} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, hero: { ...prev.hero, ctaPrimary: value } }))} />
                      <MultiLangEditor label="Secondary CTA" value={siteContent.hero.ctaSecondary} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, hero: { ...prev.hero, ctaSecondary: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="COLLECTIONS 区标题">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.collectionsIntro.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, sectionTitle: value } }))} />
                      <MultiLangEditor label="Section Text" value={siteContent.collectionsIntro.sectionText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, sectionText: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="COLLECTIONS 卡位（固定 6 个）" defaultOpen>
                    <div className="space-y-4">
                      {siteContent.collectionsIntro.items.map((item, index) => (
                        <div key={`collection-slot-${index}`} className="space-y-3 rounded-[1.4rem] border border-white/10 bg-zinc-950/60 p-3">
                          <div className="text-xs uppercase tracking-[0.22em] text-zinc-400">Card {index + 1}</div>
                          <MultiLangEditor label="Title" value={item.title} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, items: prev.collectionsIntro.items.map((entry, i) => i === index ? { ...entry, title: value } : entry) } }))} />
                          <MultiLangEditor label="Subtitle" value={item.subtitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, items: prev.collectionsIntro.items.map((entry, i) => i === index ? { ...entry, subtitle: value } : entry) } }))} />
                          <MultiLangEditor label="Description" value={item.description} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, items: prev.collectionsIntro.items.map((entry, i) => i === index ? { ...entry, description: value } : entry) } }))} />
                          <MultiLangEditor label="Search Target Collection" value={item.targetCollection} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, collectionsIntro: { ...prev.collectionsIntro, items: prev.collectionsIntro.items.map((entry, i) => i === index ? { ...entry, targetCollection: value } : entry) } }))} />
                        </div>
                      ))}
                    </div>
                  </AdminSection>

                  <AdminSection title="作品区标题">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.worksIntro.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, worksIntro: { ...prev.worksIntro, sectionTitle: value } }))} />
                      <MultiLangEditor label="Section Text" value={siteContent.worksIntro.sectionText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, worksIntro: { ...prev.worksIntro, sectionText: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="分类标签">
                    <div className="space-y-3">
                      {FIXED_CATEGORIES.map((key) => (
                        <MultiLangEditor key={`category-label-${key}`} label={key} value={siteContent.categoryLabels[key]} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, categoryLabels: { ...prev.categoryLabels, [key]: value } }))} />
                      ))}
                    </div>
                  </AdminSection>

                  <AdminSection title="ONE OF A KIND 区标题">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.oneOfAKindIntro.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, oneOfAKindIntro: { ...prev.oneOfAKindIntro, sectionTitle: value } }))} />
                      <MultiLangEditor label="Section Text" value={siteContent.oneOfAKindIntro.sectionText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, oneOfAKindIntro: { ...prev.oneOfAKindIntro, sectionText: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="STORIES 区标题">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.storiesIntro.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, sectionTitle: value } }))} />
                      <MultiLangEditor label="Section Text" value={siteContent.storiesIntro.sectionText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, sectionText: value } }))} />
                      <MultiLangEditor label="Left Title" value={siteContent.storiesIntro.leftTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, leftTitle: value } }))} />
                      <MultiLangEditor label="Left Text" value={siteContent.storiesIntro.leftText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, leftText: value } }))} />
                      <MultiLangEditor label="Right Title" value={siteContent.storiesIntro.rightTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, rightTitle: value } }))} />
                      <MultiLangEditor label="Right Text" value={siteContent.storiesIntro.rightText} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, storiesIntro: { ...prev.storiesIntro, rightText: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="品牌介绍区">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.about.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, about: { ...prev.about, sectionTitle: value } }))} />
                      <MultiLangEditor label="Paragraph 1" value={siteContent.about.text1} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, about: { ...prev.about, text1: value } }))} />
                      <MultiLangEditor label="Paragraph 2" value={siteContent.about.text2} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, about: { ...prev.about, text2: value } }))} />
                      <MultiLangEditor label="Paragraph 3" value={siteContent.about.text3} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, about: { ...prev.about, text3: value } }))} />
                    </div>
                  </AdminSection>

                  <AdminSection title="联系方式区">
                    <div className="space-y-3">
                      <MultiLangEditor label="Section Title" value={siteContent.contact.sectionTitle} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, sectionTitle: value } }))} />
                      <MultiLangEditor label="Instagram Label" value={siteContent.contact.instagramLabel} rows={1} onChange={(value) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, instagramLabel: value } }))} />
                      <MultiLangEditor label="Note" value={siteContent.contact.note} rows={3} onChange={(value) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, note: value } }))} />
                      <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Email</div>
                        <input value={siteContent.contact.email || ""} onChange={(e) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
                      </div>
                      <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Instagram Handle</div>
                        <input value={siteContent.contact.instagram || ""} onChange={(e) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, instagram: e.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
                      </div>
                      <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-3">
                        <div className="text-xs uppercase tracking-[0.28em] text-zinc-500">Instagram URL</div>
                        <input value={siteContent.contact.instagramUrl || ""} onChange={(e) => setSiteContent((prev) => ({ ...prev, contact: { ...prev.contact, instagramUrl: e.target.value } }))} className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none" />
                      </div>
                    </div>
                  </AdminSection>

                  <AdminSection title="作品板块（主作品）" defaultOpen>
                    <div className="space-y-4">
                      {(siteContent.works || []).map((work, index) => (
                        <WorkAdminCard key={`works-${work.sku || index}`} listKey="works" work={work} index={index} currentLanguage={currentLanguage} updateWorkList={updateWorkList} categoryLabels={siteContent.categoryLabels} />
                      ))}
                    </div>
                  </AdminSection>

                  <AdminSection title="一点物作品板块">
                    <div className="space-y-4">
                      {(siteContent.oneOfAKindWorks || []).map((work, index) => (
                        <WorkAdminCard key={`oneof-${work.sku || index}`} listKey="oneOfAKindWorks" work={work} index={index} currentLanguage={currentLanguage} updateWorkList={updateWorkList} categoryLabels={siteContent.categoryLabels} />
                      ))}
                    </div>
                  </AdminSection>

                  <AdminSection title="记忆分区作品板块">
                    <div className="space-y-4">
                      {(siteContent.memoryWorks || []).map((work, index) => (
                        <WorkAdminCard key={`memory-${work.sku || index}`} listKey="memoryWorks" work={work} index={index} currentLanguage={currentLanguage} updateWorkList={updateWorkList} categoryLabels={siteContent.categoryLabels} />
                      ))}
                    </div>
                  </AdminSection>

                  <AdminSection title="Lover 分区作品板块">
                    <div className="space-y-4">
                      {(siteContent.loverWorks || []).map((work, index) => (
                        <WorkAdminCard key={`lover-${work.sku || index}`} listKey="loverWorks" work={work} index={index} currentLanguage={currentLanguage} updateWorkList={updateWorkList} categoryLabels={siteContent.categoryLabels} />
                      ))}
                    </div>
                  </AdminSection>
                </div>
              </div>
            </aside>
          ) : null}
        </>
      ) : null}

      <footer className="border-t border-white/10 px-6 py-6 md:px-8">
        <div className="mx-auto max-w-7xl text-xs uppercase tracking-[0.28em] text-zinc-500">{localized(normalizedContent.footer.text, currentLanguage)}</div>
      </footer>

      {selectedWork ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={() => setSelectedWork(null)}>
          <div className="relative max-h-[94vh] w-full max-w-6xl overflow-auto rounded-[2rem] border border-white/10 bg-zinc-950" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedWork(null)} className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 p-2 text-zinc-300 transition hover:text-white"><X size={18} /></button>
            <div className="grid md:grid-cols-[0.95fr_1.05fr]">
              <div className="relative flex min-h-[320px] items-center justify-center border-b border-white/10 bg-black p-4 sm:p-6 md:min-h-[520px] md:border-b-0 md:border-r md:p-8">
                {((Array.isArray(selectedWork.images) && selectedWork.images[selectedDetailImageIndex]) || selectedWork.image) ? (
                  <img src={((Array.isArray(selectedWork.images) && selectedWork.images[selectedDetailImageIndex]) || selectedWork.image)} alt={localized(selectedWork.title, currentLanguage)} className="max-h-[78vh] max-w-full object-contain" />
                ) : null}
                {Array.isArray(selectedWork.images) && selectedWork.images.filter(Boolean).length > 1 ? (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                    {selectedWork.images.filter(Boolean).map((img, index) => (
                      <button key={`${selectedWork.sku}-thumb-${index}`} onClick={() => setSelectedDetailImageIndex(index)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-2xl border ${selectedDetailImageIndex === index ? "border-white/60" : "border-white/10"}`}>
                        <img src={img} alt={`${localized(selectedWork.title, currentLanguage)}-${index + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="p-5 sm:p-6 md:p-10">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-300">{getCategoryLabel(selectedWork.categoryKey || selectedWork.category, currentLanguage, normalizedContent.categoryLabels)}</span>
                  {hasActiveSale(selectedWork) ? <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-amber-200">{selectedWork.saleLabel || "SALE"}{getSalePercent(selectedWork) ? ` · -${getSalePercent(selectedWork)}%` : ""}</span> : null}
                  <span className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${getStatusBadgeClass(selectedWork.status, selectedWork.stock)}`}>{localizedStatus(selectedWork.status)}</span>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.35em] text-zinc-500">{localized(selectedWork.subtitle, currentLanguage)}</p>
                <div className="mt-3 flex flex-wrap gap-2">{getWorkCollections(selectedWork, currentLanguage).map((entry, idx) => <p key={`${selectedWork.sku}-detail-collection-${idx}`} className="inline-flex rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-zinc-300">{entry}</p>)}</div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-3xl font-semibold uppercase tracking-[0.08em] text-white sm:text-4xl">{localized(selectedWork.title, currentLanguage)}</h3>
                    <p className="mt-4 max-w-2xl text-sm leading-8 text-zinc-400">{localized(selectedWork.description, currentLanguage)}</p>
                  </div>
                  <div className="text-right">
                    {hasActiveSale(selectedWork) ? <div className="mb-1 text-xs text-zinc-500 line-through">{getOriginalPriceLabel(selectedWork)}</div> : null}
                    <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100">{getDisplayPrice(selectedWork)}</div>
                  </div>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">{ui.material}: {localized(selectedWork.material, currentLanguage)}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">{ui.stone}: {localized(selectedWork.stone, currentLanguage)}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">{ui.size}: {localized(selectedWork.size, currentLanguage)}</div>
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-zinc-100">{ui.sku}: {selectedWork.sku}</div>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => addToCart(selectedWork)} disabled={selectedWork.status === "Sold Out" || Number(selectedWork.stock || 0) <= 0} className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm transition ${selectedWork.status === "Sold Out" || Number(selectedWork.stock || 0) <= 0 ? "cursor-not-allowed border-white/10 text-zinc-500" : "border-white/10 text-zinc-100 hover:border-white/30 hover:text-white"}`}><ShoppingBag size={16} /> {ui.addToCart}</button>
                  {selectedWork.paypalPaymentUrl ? <a href={selectedWork.paypalPaymentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-100 transition hover:border-white/30 hover:text-white">{ui.buyWithPayPal}</a> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center md:justify-end" onClick={() => setCartOpen(false)}>
          <div className="h-[88vh] w-full max-w-xl overflow-auto rounded-t-[2rem] border border-white/10 bg-zinc-950 p-4 sm:p-6 md:h-full md:rounded-none md:border-l md:border-t-0" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-white">{ui.cart}</p>
                <p className="text-xs text-zinc-500">{cartSummary.items.reduce((sum, item) => sum + item.quantity, 0)} {ui.itemsSuffix}</p>
              </div>
              <button onClick={() => setCartOpen(false)} className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:text-white"><X size={18} /></button>
            </div>
            {cartSummary.items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">{ui.emptyCart}</div>
            ) : (
              <div className="space-y-4">
                {cartSummary.items.map((item) => (
                  <div key={item.sku} className="rounded-3xl border border-white/10 bg-black/40 p-4">
                    <div className="flex gap-4">
                      <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                        {((Array.isArray(item.images) && item.images.find(Boolean)) || item.image) ? <img src={((Array.isArray(item.images) && item.images.find(Boolean)) || item.image)} alt={localized(item.title, currentLanguage)} className="max-h-full max-w-full object-contain" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-white">{localized(item.title, currentLanguage)}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">{localized(item.subtitle, currentLanguage)}</p>
                            <p className="mt-2 text-xs text-zinc-500">{item.sku}</p>
                            {hasActiveSale(item) ? <p className="mt-2 text-[11px] text-amber-200">{item.saleLabel || "SALE"} applied</p> : null}
                          </div>
                          <button onClick={() => setCart((prev) => prev.filter((v) => v.sku !== item.sku))} className="text-zinc-500 transition hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 px-2 py-2">
                            <button onClick={() => updateCartQuantity(item.sku, -1)} className="rounded-xl p-1 text-zinc-300 transition hover:text-white"><Minus size={14} /></button>
                            <span className="min-w-8 text-center text-sm text-zinc-100">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.sku, 1)} className="rounded-xl p-1 text-zinc-300 transition hover:text-white"><Plus size={14} /></button>
                          </div>
                          <div className="text-sm text-zinc-100">{formatYen(item.lineTotal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between text-sm text-zinc-300"><span>{ui.subtotal}</span><span>{formatYen(cartSummary.subtotal)}</span></div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 text-sm leading-7 text-zinc-400">{localized(normalizedContent.store.checkoutNote, currentLanguage)}</div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setCart([])} className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300 transition hover:border-red-500/40">{ui.clearCart}</button>
                  <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 transition hover:border-white/30 hover:text-white">{ui.goToCheckout}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-2 sm:p-4 backdrop-blur-sm md:items-center" onClick={() => setCheckoutOpen(false)}>
          <div className="max-h-[94vh] w-full max-w-5xl overflow-auto rounded-[2rem] border border-white/10 bg-zinc-950" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-8">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-white">Checkout</p>
              </div>
              <button onClick={() => setCheckoutOpen(false)} className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:text-white"><X size={18} /></button>
            </div>
            <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:p-8">
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input label={ui.fullName} value={checkoutForm.name} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, name: v }))} />
                    <Input label={ui.email} value={checkoutForm.email} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, email: v }))} />
                    <Input label={ui.country} value={checkoutForm.country} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, country: v }))} />
                    <Input label={ui.city} value={checkoutForm.city} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, city: v }))} />
                  </div>
                  <div className="mt-4"><Textarea label={ui.address} value={checkoutForm.address} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, address: v }))} rows={3} /></div>
                  <div className="mt-4"><Textarea label={ui.orderNote} value={checkoutForm.note} onChange={(v) => setCheckoutForm((prev) => ({ ...prev, note: v }))} rows={4} /></div>
                </div>
                <a href={`mailto:${normalizedContent.contact.email}?subject=${encodeURIComponent(`${localized(normalizedContent.brandName, currentLanguage)} Order Inquiry`)}&body=${encodeURIComponent(orderSummaryText)}`} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm text-zinc-100 transition hover:border-white/30 hover:text-white">
                  {ui.sendOrderByEmail}
                </a>
              </div>
              <div className="space-y-4">
                {cartSummary.items.map((item) => (
                  <div key={item.sku} className="flex gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
                      {((Array.isArray(item.images) && item.images.find(Boolean)) || item.image) ? <img src={((Array.isArray(item.images) && item.images.find(Boolean)) || item.image)} alt={localized(item.title, currentLanguage)} className="max-h-full max-w-full object-contain" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-white">{localized(item.title, currentLanguage)}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-zinc-500">{localized(item.subtitle, currentLanguage)}</p>
                          <p className="mt-2 text-xs text-zinc-500">{item.quantity} × {formatYen(item.unitPrice)}</p>
                          {hasActiveSale(item) ? <p className="mt-1 text-[11px] text-amber-200">{item.saleLabel || "SALE"} applied</p> : null}
                        </div>
                        <div className="text-sm text-zinc-100">{formatYen(item.lineTotal)}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-3xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between text-sm text-zinc-300"><span>{ui.subtotal}</span><span>{formatYen(cartSummary.subtotal)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {exportModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setExportModalOpen(false)}>
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/10 bg-zinc-950 p-5 md:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-white">导出配置 JSON</p>
                <p className="mt-1 text-xs text-zinc-500">如果浏览器没自动下载，就直接复制下面内容保存为 .json 文件。</p>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:text-white">
                <X size={18} />
              </button>
            </div>
            <textarea readOnly value={exportText} className="h-[55vh] w-full rounded-2xl border border-white/10 bg-black px-4 py-3 font-mono text-xs leading-6 text-zinc-200 outline-none" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
