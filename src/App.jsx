import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag, X, Plus, Minus, Check, ChevronLeft, Star,
  Sparkles, Trophy, Pencil, RefreshCcw,
} from "lucide-react";
import { BarbellIcon, BarbellArt, TRUST_ICON_MAP } from "./icons";
import { defaultContent, defaultProducts, CATS } from "./defaultData";
import { loadContent, saveContent, loadProducts, saveProducts, resetAllData } from "./storage";
import EditableText from "./components/EditableText";
import ProductForm from "./components/ProductForm";

const fmt = (n) => Number(n || 0).toLocaleString("en-US");

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className="w-3 h-3" strokeWidth={0} fill={i < Math.round(rating) ? "#FF5A1F" : "#E5E3DD"} />
      ))}
    </div>
  );
}

function PulseDivider() {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="h-px flex-1 bg-[#EDEBE5]" />
      <svg width="72" height="20" viewBox="0 0 72 20" fill="none">
        <path d="M0 10 H22 L27 3 L33 17 L38 10 L42 10 L46 3 L50 17 L54 10 H72" stroke="#FF5A1F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="h-px flex-1 bg-[#EDEBE5]" />
    </div>
  );
}

function ProductArt({ product, colorHex }) {
  const hex = colorHex || "#e5e3dd";
  const isSupp = product.cat === "supp";
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden flex items-center justify-center bg-[#F5F4F1] border border-[#EDEBE5] transition-transform duration-300 group-hover:-translate-y-0.5"
      style={{ aspectRatio: "4 / 5" }}
    >
      {product.image ? (
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      ) : (
        <>
          <div
            className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full transition-transform duration-500 group-hover:scale-125"
            style={{ background: hex, opacity: 0.1 }}
          />
          <div className="transition-transform duration-300 group-hover:scale-110">
            {isSupp ? (
              <div className="w-12 h-16 rounded-[3px] border-[2.5px] flex items-end justify-center pb-1.5" style={{ borderColor: "#B9B6AE" }}>
                <div className="w-7 h-7 rounded-full border-[2.5px]" style={{ borderColor: hex !== "#e5e3dd" ? hex : "#B9B6AE" }} />
              </div>
            ) : (
              <BarbellIcon className="w-9 h-9" style={{ color: hex !== "#e5e3dd" ? hex : "#B9B6AE" }} />
            )}
          </div>
        </>
      )}
      {product.tag && (
        <span className="absolute top-2 left-2 text-[10px] tracking-widest uppercase font-mono px-2 py-1 rounded-sm bg-[#16171A] text-white font-semibold flex items-center gap-1">
          {product.tag === "ໃໝ່" && <Sparkles className="w-2.5 h-2.5" style={{ color: "#FF5A1F" }} />}
          {product.tag === "ຂາຍດີ" && <Trophy className="w-2.5 h-2.5" style={{ color: "#FF5A1F" }} />}
          {product.tag}
        </span>
      )}
      {product.was && (
        <span className="absolute top-2 right-2 text-[10px] tracking-widest uppercase font-mono px-2 py-1 rounded-sm bg-[#FF5A1F] text-white font-semibold">
          ຫຼຸດ
        </span>
      )}
    </div>
  );
}

function Toast({ show, text }) {
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 z-[60] transition-all duration-300 ${show ? "bottom-6 opacity-100" : "-bottom-10 opacity-0"}`}>
      <div className="flex items-center gap-2 bg-[#16171A] text-white text-sm px-4 py-2.5 rounded-full shadow-lg">
        <span className="w-5 h-5 rounded-full bg-[#FF5A1F] flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3" strokeWidth={3} />
        </span>
        {text}
      </div>
    </div>
  );
}

export default function App() {
  const [content, setContent] = useState(() => loadContent(defaultContent));
  const [products, setProducts] = useState(() => loadProducts(defaultProducts));
  const [editMode, setEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null | "new" | product object
  const [newProductCat, setNewProductCat] = useState("women");

  const [cat, setCat] = useState("women");
  const [selected, setSelected] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [detailColor, setDetailColor] = useState(null);
  const [detailSize, setDetailSize] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", payment: "transfer" });
  const [toast, setToast] = useState(false);
  const [bump, setBump] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [gridKey, setGridKey] = useState(0);

  useEffect(() => saveContent(content), [content]);
  useEffect(() => saveProducts(products), [products]);
  useEffect(() => setGridKey((k) => k + 1), [cat]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const catList = useMemo(() => products.filter((p) => p.cat === cat), [products, cat]);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  function updateContentField(field, value) {
    setContent((c) => ({ ...c, [field]: value }));
  }
  function updateCatLabel(catId, value) {
    setContent((c) => ({ ...c, catLabels: { ...c.catLabels, [catId]: value } }));
  }
  function updateTrustText(idx, value) {
    setContent((c) => ({ ...c, trust: c.trust.map((t, i) => (i === idx ? { ...t, text: value } : t)) }));
  }

  function openDetail(p) {
    if (editMode) {
      setEditingProduct(p);
      return;
    }
    setSelected(p);
    setDetailColor(p.colors[0] || null);
    setDetailSize(p.sizes[0] || null);
  }

  function addToCart() {
    if (!selected) return;
    setCart((prev) => {
      const key = `${selected.id}-${detailColor?.id}-${detailSize}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { key, id: selected.id, name: selected.name, price: selected.price, color: detailColor, size: detailSize, qty: 1 }];
    });
    setSelected(null);
    setToast(true);
    setBump(true);
    setTimeout(() => setBump(false), 400);
  }

  function updateQty(key, delta) {
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
  }

  function submitOrder(e) {
    e.preventDefault();
    setOrderNo("PP" + Math.floor(100000 + Math.random() * 899999));
    setOrderDone(true);
  }

  function resetAll() {
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setOrderDone(false);
    setForm({ name: "", phone: "", address: "", payment: "transfer" });
  }

  function saveProduct(p) {
    setProducts((prev) => {
      const exists = prev.some((x) => x.id === p.id);
      return exists ? prev.map((x) => (x.id === p.id ? p : x)) : [...prev, p];
    });
    setEditingProduct(null);
  }
  function deleteProduct(id) {
    if (!window.confirm("ລຶບສິນຄ້ານີ້ອອກຖາວອນບໍ?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setEditingProduct(null);
  }
  function handleResetData() {
    if (!window.confirm("ຣີເຊັດຂໍ້ມູນທັງໝົດກັບຄືນຄ່າເລີ່ມຕົ້ນ? ການປ່ຽນແປງທັງໝົດຈະຫາຍໄປ.")) return;
    resetAllData();
    setContent(defaultContent);
    setProducts(defaultProducts);
  }

  return (
    <div className="min-h-screen bg-white text-[#16171A]" style={{ fontFamily: "'Noto Sans Lao', 'Inter', sans-serif" }}>
      <Toast show={toast} text="ເພີ່ມລົງກະຕ່າແລ້ວ" />

      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#EDEBE5]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="disp text-2xl font-extrabold uppercase tracking-tight flex items-center gap-2 flex-1 min-w-0">
            <img src="/logo-mark.png" alt="" className="h-8 w-auto flex-shrink-0" />
            <EditableText
              editing={editMode}
              value={content.brand}
              onChange={(v) => updateContentField("brand", v)}
              className="truncate"
              inputClassName="text-xl font-extrabold max-w-[10rem]"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setEditMode((v) => !v)}
              title="ໂໝດແກ້ໄຂ"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold transition-colors ${
                editMode ? "bg-[#FF5A1F] border-[#FF5A1F] text-white" : "border-[#16171A] hover:bg-[#16171A] hover:text-white"
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              {editMode ? "ກຳລັງແກ້ໄຂ" : "ແກ້ໄຂ"}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#16171A] hover:bg-[#16171A] hover:text-white transition-colors">
              <ShoppingBag className="w-4 h-4" />
              <span className="mono text-xs">{cartCount}</span>
              {cartCount > 0 && (
                <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#FF5A1F] text-white text-[9px] flex items-center justify-center font-bold ${bump ? "bump" : ""}`}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="bg-[#FFF4EE] border-y border-[#FFDBC4] px-4 py-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-[#9A5432]">ໂໝດແກ້ໄຂເປີດຢູ່ — ການປ່ຽນແປງບັນທຶກໄວ້ໃນອຸປະກອນນີ້ອັດຕະໂນມັດ</span>
            <button onClick={handleResetData} className="flex items-center gap-1 flex-shrink-0 text-[#9A5432] font-medium hover:text-[#FF5A1F]">
              <RefreshCcw className="w-3 h-3" /> ຣີເຊັດ
            </button>
          </div>
        )}

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-6 -mb-px overflow-x-auto">
          {CATS.map((c) => {
            const active = cat === c;
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`relative flex items-center gap-2 py-3 whitespace-nowrap transition-colors disp text-sm font-semibold uppercase tracking-wide ${
                  active ? "text-[#16171A]" : "text-[#9A978E] hover:text-[#16171A]"
                }`}
              >
                {editMode ? (
                  <EditableText
                    editing
                    value={content.catLabels[c]}
                    onChange={(v) => updateCatLabel(c, v)}
                    inputClassName="text-sm w-24"
                  />
                ) : (
                  content.catLabels[c]
                )}
                <span className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#FF5A1F] transition-transform duration-300 origin-left ${active ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            );
          })}
        </div>
      </header>

      {/* Hero strip */}
      <div className="max-w-5xl mx-auto px-4 pt-6">
        <div className="rounded-2xl text-white px-5 py-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1C1E23 0%, #16171A 60%)" }}>
          <BarbellArt className="absolute bottom-3 right-3 w-20" style={{ color: "#FFFFFF", opacity: 0.1 }} />
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/3" style={{ background: "#FF5A1F", opacity: 0.18 }} />

          <div className="relative">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#FF8A5C" }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF5A1F" }} />
              <EditableText editing={editMode} value={content.eyebrow} onChange={(v) => updateContentField("eyebrow", v)} inputClassName="text-white text-[10px]" />
            </div>
            <h2 className="disp text-lg font-extrabold leading-snug">
              <EditableText editing={editMode} value={content.heroTitle} onChange={(v) => updateContentField("heroTitle", v)} inputClassName="text-white text-lg font-extrabold" />
            </h2>
            <p className="text-xs mt-1" style={{ color: "#B9B6AE" }}>
              <EditableText editing={editMode} value={content.heroSubtitle} onChange={(v) => updateContentField("heroSubtitle", v)} inputClassName="text-white text-xs" />
            </p>
          </div>

          <div className="relative flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            {content.trust.map((t, i) => {
              const Icon = TRUST_ICON_MAP[t.icon] || Star;
              return (
                <div key={i} className="flex items-center gap-1.5 text-[11px] rounded-full pl-2 pr-3 py-1.5 flex-shrink-0" style={{ color: "#EDEBE5", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#FF5A1F" }} strokeWidth={2} />
                  {editMode ? (
                    <EditableText editing value={t.text} onChange={(v) => updateTrustText(i, v)} inputClassName="text-white text-[11px] w-28" />
                  ) : (
                    t.text
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="w-9 h-9 rounded-full bg-[#FFF4EE] flex items-center justify-center flex-shrink-0">
            <BarbellIcon className="w-4 h-4" style={{ color: "#FF5A1F" }} />
          </span>
          <h1 className="disp text-3xl md:text-4xl font-extrabold uppercase tracking-tight">{content.catLabels[cat]}</h1>
        </div>
        <p className="text-[#9A978E] text-sm mb-6">{catList.length} ລາຍການ</p>
        <PulseDivider />
        <div className="h-6" />

        {editMode && (
          <button
            onClick={() => { setNewProductCat(cat); setEditingProduct("new"); }}
            className="mb-4 flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-md border-2 border-dashed border-[#FF5A1F] text-[#FF5A1F] font-semibold hover:bg-[#FFF4EE] transition-colors"
          >
            <Plus className="w-4 h-4" /> ເພີ່ມສິນຄ້າໃໝ່ໃນໝວດນີ້
          </button>
        )}

        <div key={gridKey} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {catList.map((p, idx) => (
            <button key={p.id} onClick={() => openDetail(p)} className="text-left group rise relative" style={{ animationDelay: `${idx * 45}ms` }}>
              {editMode && (
                <span className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center">
                  <Pencil className="w-3.5 h-3.5" style={{ color: "#FF5A1F" }} />
                </span>
              )}
              <ProductArt product={p} colorHex={p.colors[0]?.hex} />
              <div className="mt-2">
                <div className="text-sm font-medium group-hover:text-[#FF5A1F] transition-colors">{p.name || "(ບໍ່ມີຊື່)"}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Stars rating={p.rating} />
                  <span className="text-[10px] text-[#9A978E] mono">({p.reviews})</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="mono text-sm text-[#16171A] font-semibold">₭{fmt(p.price)}</span>
                  {p.was && <span className="mono text-xs text-[#B9B6AE] line-through">₭{fmt(p.was)}</span>}
                </div>
                {p.colors.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {p.colors.map((c) => (
                      <span key={c.id} className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: c.hex }} />
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
          {catList.length === 0 && (
            <div className="col-span-2 md:col-span-3 text-center py-10 text-[#9A978E] text-sm">
              ບໍ່ມີສິນຄ້າໃນໝວດນີ້ {editMode && "— ລອງເພີ່ມສິນຄ້າໃໝ່ເບິ່ງ"}
            </div>
          )}
        </div>

        <div className="mt-10"><PulseDivider /></div>
      </main>

      <footer className="border-t border-[#EDEBE5] mt-4">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center text-center">
          <div className="w-40 rounded-xl bg-[#F5F4F1] p-3 mb-3">
            <img src="/logo.png" alt={content.brand} className="w-full h-auto" />
          </div>
          <p className="text-xs text-[#9A978E] mt-1 max-w-xs">
            {editMode ? (
              <EditableText editing value={content.footerTagline} onChange={(v) => updateContentField("footerTagline", v)} multiline inputClassName="text-xs text-center" />
            ) : (
              content.footerTagline
            )}
          </p>
          <div className="w-full max-w-xs mt-5"><PulseDivider /></div>
          <p className="text-[10px] text-[#C9C6BE] mt-4 mono">© {new Date().getFullYear()} {content.brand.toUpperCase()} STORE</p>
        </div>
      </footer>

      {/* Product detail overlay */}
      {selected && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="max-w-5xl mx-auto h-full overflow-y-auto px-4 py-4">
            <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-[#6B6F76] hover:text-[#16171A] mb-4 text-sm">
              <ChevronLeft className="w-4 h-4" /> ກັບຄືນ
            </button>
            <div className="grid md:grid-cols-2 gap-8 pop">
              <div className="max-w-sm mx-auto md:mx-0 w-full">
                <ProductArt product={selected} colorHex={detailColor?.hex} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selected.tag && (
                    <span className="text-[10px] tracking-widest uppercase font-mono px-2 py-1 rounded-sm bg-[#16171A] text-white font-semibold">{selected.tag}</span>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Stars rating={selected.rating} />
                    <span className="text-xs text-[#9A978E] mono">{selected.rating} ({selected.reviews})</span>
                  </div>
                </div>
                <h2 className="disp text-2xl md:text-3xl font-extrabold mt-3">{selected.name}</h2>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="mono text-xl" style={{ color: "#FF5A1F" }}>₭{fmt(selected.price)}</span>
                  {selected.was && <span className="mono text-sm text-[#B9B6AE] line-through">₭{fmt(selected.was)}</span>}
                </div>

                {selected.colors.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wide text-[#9A978E] mb-2">
                      ສີ: <span className="text-[#16171A]">{detailColor?.label}</span>
                    </div>
                    <div className="flex gap-2">
                      {selected.colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setDetailColor(c)}
                          className="w-9 h-9 rounded-full border-2 transition-all duration-200"
                          style={{
                            background: c.hex,
                            borderColor: detailColor?.id === c.id ? "#FF5A1F" : "rgba(0,0,0,0.12)",
                            transform: detailColor?.id === c.id ? "scale(1.12)" : "scale(1)",
                            boxShadow: detailColor?.id === c.id ? "0 3px 8px rgba(255,90,31,0.35)" : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selected.sizes.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wide text-[#9A978E] mb-2">{selected.cat === "supp" ? "ລົດຊາດ" : "ຂະໜາດ"}</div>
                    <div className="flex flex-wrap gap-2">
                      {selected.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => setDetailSize(s)}
                          className={`px-3 py-1.5 rounded-md border text-sm mono transition-colors ${
                            detailSize === s ? "border-[#FF5A1F] text-[#FF5A1F] bg-[#FFF4EE]" : "border-[#E5E3DD] text-[#6B6F76] hover:border-[#9A978E]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={addToCart} className="mt-8 w-full md:w-auto px-8 py-3 rounded-md bg-[#16171A] text-white font-semibold disp uppercase tracking-wide hover:bg-[#FF5A1F] active:scale-[0.97] transition-all">
                  ໃສ່ກະຕ່າ
                </button>

                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-5 pt-5 border-t border-[#EDEBE5]">
                  {content.trust.map((t, i) => {
                    const Icon = TRUST_ICON_MAP[t.icon] || Star;
                    return (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#9A978E]">
                        <Icon className="w-3.5 h-3.5" style={{ color: "#FF5A1F" }} />
                        {t.text}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && !checkoutOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col border-l border-[#EDEBE5]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDEBE5]">
              <h3 className="disp text-lg uppercase font-bold">ກະຕ່າຂອງທ່ານ</h3>
              <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 && (
                <div className="text-center pt-10">
                  <BarbellIcon className="w-8 h-8 mx-auto mb-2" style={{ color: "#E5E3DD" }} />
                  <p className="text-[#9A978E] text-sm">ຍັງບໍ່ມີສິນຄ້າໃນກະຕ່າ</p>
                </div>
              )}
              {cart.map((item) => (
                <div key={item.key} className="flex gap-3 rise">
                  <div className="w-14 h-16 rounded-md flex-shrink-0 border border-[#EDEBE5]" style={{ background: item.color ? item.color.hex : "#F5F4F1" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="text-xs text-[#9A978E] mt-0.5">{item.color ? item.color.label : ""} {item.size ? `· ${item.size}` : ""}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-[#E5E3DD] rounded-md">
                        <button onClick={() => updateQty(item.key, -1)} className="p-1"><Minus className="w-3 h-3" /></button>
                        <span className="mono text-xs w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)} className="p-1"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="mono text-sm">₭{fmt(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="px-5 py-4 border-t border-[#EDEBE5]">
                <div className="flex justify-between mb-3 text-sm">
                  <span className="text-[#9A978E]">ຍອດລວມ</span>
                  <span className="mono font-semibold" style={{ color: "#FF5A1F" }}>₭{fmt(cartTotal)}</span>
                </div>
                <button onClick={() => setCheckoutOpen(true)} className="w-full py-3 rounded-md bg-[#16171A] text-white font-semibold disp uppercase tracking-wide hover:bg-[#FF5A1F] active:scale-[0.98] transition-all">
                  ໄປໜ້າຊຳລະເງິນ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div className="max-w-md mx-auto px-5 py-6">
            {!orderDone ? (
              <>
                <button onClick={() => setCheckoutOpen(false)} className="flex items-center gap-1 text-[#6B6F76] hover:text-[#16171A] mb-4 text-sm">
                  <ChevronLeft className="w-4 h-4" /> ກັບໄປກະຕ່າ
                </button>
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#16171A] text-white text-[10px] flex items-center justify-center font-bold mono">1</span>
                    <span className="text-xs font-medium">ຂໍ້ມູນ</span>
                  </div>
                  <span className="flex-1 h-px bg-[#E5E3DD]" />
                  <div className="flex items-center gap-1.5 opacity-40">
                    <span className="w-5 h-5 rounded-full bg-[#E5E3DD] text-[#16171A] text-[10px] flex items-center justify-center font-bold mono">2</span>
                    <span className="text-xs font-medium">ສຳເລັດ</span>
                  </div>
                </div>
                <h2 className="disp text-2xl font-extrabold uppercase mb-4">ຂໍ້ມູນຈັດສົ່ງ</h2>
                <form onSubmit={submitOrder} className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-[#9A978E]">ຊື່-ນາມສະກຸນ</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 bg-white border border-[#E5E3DD] rounded-md px-3 py-2 focus:outline-none focus:border-[#FF5A1F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-[#9A978E]">ເບີໂທ</label>
                    <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 bg-white border border-[#E5E3DD] rounded-md px-3 py-2 focus:outline-none focus:border-[#FF5A1F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-[#9A978E]">ທີ່ຢູ່ຈັດສົ່ງ</label>
                    <textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full mt-1 bg-white border border-[#E5E3DD] rounded-md px-3 py-2 focus:outline-none focus:border-[#FF5A1F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-2 block">ວິທີຊຳລະເງິນ</label>
                    <div className="space-y-2">
                      {[{ id: "transfer", label: "ໂອນເງິນຜ່ານທະນາຄານ" }, { id: "cod", label: "ເກັບເງິນປາຍທາງ (COD)" }].map((opt) => (
                        <label key={opt.id} className={`flex items-center gap-3 border rounded-md px-3 py-2.5 cursor-pointer transition-colors ${form.payment === opt.id ? "border-[#FF5A1F] bg-[#FFF4EE]" : "border-[#E5E3DD]"}`}>
                          <input type="radio" name="payment" checked={form.payment === opt.id} onChange={() => setForm({ ...form, payment: opt.id })} className="accent-[#FF5A1F]" />
                          <span className="text-sm">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#EDEBE5] pt-4 flex justify-between">
                    <span className="text-[#9A978E] text-sm">ຍອດຊຳລະທັງໝົດ</span>
                    <span className="mono font-semibold text-lg" style={{ color: "#FF5A1F" }}>₭{fmt(cartTotal)}</span>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-md bg-[#16171A] text-white font-semibold disp uppercase tracking-wide hover:bg-[#FF5A1F] active:scale-[0.98] transition-all">
                    ຢືນຢັນການສັ່ງຊື້
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center pt-16">
                <div className="w-16 h-16 rounded-full bg-[#16171A] flex items-center justify-center mb-4 pop">
                  <Check className="w-8 h-8 text-[#FF5A1F]" strokeWidth={2.5} />
                </div>
                <h2 className="disp text-2xl font-extrabold uppercase mb-1">ສັ່ງຊື້ສຳເລັດ</h2>
                <div className="mono text-xs text-[#9A978E] mb-3 px-2.5 py-1 rounded-full bg-[#F5F4F1]">ເລກທີ່ອໍເດີ #{orderNo}</div>
                <p className="text-[#6B6F76] text-sm max-w-xs">ຂອບໃຈ {form.name}! ພວກເຮົາຈະຈັດສົ່ງໄປທີ່ {form.address} ໄວໆນີ້</p>
                <button onClick={resetAll} className="mt-8 px-6 py-2.5 rounded-md border border-[#16171A] hover:bg-[#16171A] hover:text-white disp uppercase text-sm transition-colors">
                  ກັບໄປໜ້າຮ້ານ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product editor modal */}
      {editingProduct && (
        <ProductForm
          initial={editingProduct === "new" ? null : editingProduct}
          onSave={(p) => saveProduct(editingProduct === "new" ? { ...p, cat: p.cat || newProductCat } : p)}
          onClose={() => setEditingProduct(null)}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
}
