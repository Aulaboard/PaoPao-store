import React, { useState } from "react";
import { X, Plus, Trash2, Upload, ImageOff } from "lucide-react";
import { CATS, TAG_OPTIONS } from "../defaultData";

const CAT_LABEL = { women: "ຜູ້ຍິງ", men: "ຜູ້ຊາຍ", supp: "ອາຫານເສີມ" };
const TAG_LABEL = { "": "ບໍ່ມີປ້າຍ", "ຂາຍດີ": "ຂາຍດີ", "ໃໝ່": "ໃໝ່" };

function emptyProduct(cat) {
  return {
    id: "p_" + Date.now(),
    cat,
    name: "",
    price: 0,
    was: null,
    image: null,
    tag: "",
    rating: 5,
    reviews: 0,
    colors: [],
    sizes: [],
  };
}

// Reads a File into a compressed base64 data URL so photos don't blow up
// localStorage (which has a small size limit, typically ~5MB total).
function fileToCompressedDataUrl(file, maxDim = 900, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("Image decode failed"));
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProductForm({ initial, onSave, onClose, onDelete }) {
  const [p, setP] = useState(initial || emptyProduct("women"));
  const [imgError, setImgError] = useState("");

  function set(field, value) {
    setP((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError("");
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      set("image", dataUrl);
    } catch {
      setImgError("ອັບໂຫລດຮູບບໍ່ສຳເລັດ, ລອງໃໝ່ອີກຄັ້ງ");
    }
  }

  function addColor() {
    set("colors", [...p.colors, { id: "c_" + Date.now(), label: "", hex: "#1a1a1a" }]);
  }
  function updateColor(id, field, value) {
    set("colors", p.colors.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }
  function removeColor(id) {
    set("colors", p.colors.filter((c) => c.id !== id));
  }

  function addSize() {
    set("sizes", [...p.sizes, ""]);
  }
  function updateSize(idx, value) {
    set("sizes", p.sizes.map((s, i) => (i === idx ? value : s)));
  }
  function removeSize(idx) {
    set("sizes", p.sizes.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!p.name.trim() || !p.price) return;
    const cleaned = {
      ...p,
      price: Number(p.price) || 0,
      was: p.was ? Number(p.was) : null,
      rating: Math.max(0, Math.min(5, Number(p.rating) || 0)),
      reviews: Number(p.reviews) || 0,
      colors: p.colors.filter((c) => c.label.trim()),
      sizes: p.sizes.filter((s) => s.trim()),
    };
    onSave(cleaned);
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-[#EDEBE5] z-10">
          <h3 className="disp text-lg font-bold">{initial ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}</h3>
          <button onClick={onClose} type="button"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
          {/* image */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-2 block">ຮູບສິນຄ້າ</label>
            <div className="flex items-center gap-3">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#F5F4F1] border border-[#EDEBE5] flex items-center justify-center flex-shrink-0">
                {p.image ? (
                  <img src={p.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <ImageOff className="w-5 h-5 text-[#C9C6BE]" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border border-[#16171A] cursor-pointer hover:bg-[#16171A] hover:text-white transition-colors w-fit">
                  <Upload className="w-3.5 h-3.5" />
                  ອັບໂຫລດຮູບ
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
                </label>
                {p.image && (
                  <button type="button" onClick={() => set("image", null)} className="text-xs text-[#9A978E] hover:text-[#FF5A1F] text-left">
                    ລຶບຮູບ, ໃຊ້ໄອຄອນແທນ
                  </button>
                )}
                {imgError && <p className="text-xs text-red-500">{imgError}</p>}
              </div>
            </div>
          </div>

          {/* category */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ໝວດໝູ່</label>
            <select
              value={p.cat}
              onChange={(e) => set("cat", e.target.value)}
              className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
            >
              {CATS.map((c) => (
                <option key={c} value={c}>{CAT_LABEL[c]}</option>
              ))}
            </select>
          </div>

          {/* name */}
          <div>
            <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ຊື່ສິນຄ້າ</label>
            <input
              required
              value={p.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full border border-[#E5E3DD] rounded-md px-3 py-2 focus:outline-none focus:border-[#FF5A1F]"
              placeholder="ຊື່ສິນຄ້າ"
            />
          </div>

          {/* price / was / tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ລາຄາ (₭)</label>
              <input
                required
                type="number"
                min="0"
                value={p.price}
                onChange={(e) => set("price", e.target.value)}
                className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ລາຄາເດີມ (ຫຼຸດ)</label>
              <input
                type="number"
                min="0"
                value={p.was ?? ""}
                onChange={(e) => set("was", e.target.value === "" ? null : e.target.value)}
                placeholder="ບໍ່ຫຼຸດ"
                className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ປ້າຍ</label>
              <select
                value={p.tag}
                onChange={(e) => set("tag", e.target.value)}
                className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
              >
                {TAG_OPTIONS.map((t) => (
                  <option key={t} value={t}>{TAG_LABEL[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ຄະແນນ</label>
              <input
                type="number" min="0" max="5" step="0.1"
                value={p.rating}
                onChange={(e) => set("rating", e.target.value)}
                className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-[#9A978E] mb-1 block">ຈຳນວນຣີວິວ</label>
              <input
                type="number" min="0"
                value={p.reviews}
                onChange={(e) => set("reviews", e.target.value)}
                className="w-full border border-[#E5E3DD] rounded-md px-3 py-2"
              />
            </div>
          </div>

          {/* colors */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wide text-[#9A978E] block">ສີ (ຖ້າມີ)</label>
              <button type="button" onClick={addColor} className="text-xs flex items-center gap-1 text-[#FF5A1F] font-medium">
                <Plus className="w-3.5 h-3.5" /> ເພີ່ມສີ
              </button>
            </div>
            <div className="space-y-2">
              {p.colors.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(c.id, "hex", e.target.value)}
                    className="w-9 h-9 rounded-md border border-[#E5E3DD] p-0.5 flex-shrink-0"
                  />
                  <input
                    value={c.label}
                    onChange={(e) => updateColor(c.id, "label", e.target.value)}
                    placeholder="ຊື່ສີ ເຊັ່ນ: ດຳ"
                    className="flex-1 border border-[#E5E3DD] rounded-md px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeColor(c.id)} className="p-2 text-[#9A978E] hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {p.colors.length === 0 && <p className="text-xs text-[#C9C6BE]">ຍັງບໍ່ມີສີ — ກົດ "ເພີ່ມສີ" ຖ້າສິນຄ້ານີ້ມີຫຼາຍສີ</p>}
            </div>
          </div>

          {/* sizes / flavors */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs uppercase tracking-wide text-[#9A978E] block">ຂະໜາດ / ລົດຊາດ</label>
              <button type="button" onClick={addSize} className="text-xs flex items-center gap-1 text-[#FF5A1F] font-medium">
                <Plus className="w-3.5 h-3.5" /> ເພີ່ມ
              </button>
            </div>
            <div className="space-y-2">
              {p.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={s}
                    onChange={(e) => updateSize(i, e.target.value)}
                    placeholder="ເຊັ່ນ: M ຫຼື ຊັອກໂກແລັດ"
                    className="flex-1 border border-[#E5E3DD] rounded-md px-3 py-2 text-sm"
                  />
                  <button type="button" onClick={() => removeSize(i)} className="p-2 text-[#9A978E] hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {p.sizes.length === 0 && <p className="text-xs text-[#C9C6BE]">ຍັງບໍ່ມີ — ໃສ່ຢ່າງໜ້ອຍໜຶ່ງລາຍການ (ໄຊສ໌ ຫຼື ລົດຊາດ)</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#EDEBE5]">
            {initial && (
              <button
                type="button"
                onClick={() => onDelete(p.id)}
                className="flex items-center gap-1.5 text-sm text-red-500 px-3 py-2.5 rounded-md hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" /> ລຶບສິນຄ້ານີ້
              </button>
            )}
            <button
              type="submit"
              className="ml-auto flex-1 py-2.5 rounded-md bg-[#16171A] text-white font-semibold disp uppercase tracking-wide hover:bg-[#FF5A1F] transition-colors"
            >
              {initial ? "ບັນທຶກການແກ້ໄຂ" : "ເພີ່ມສິນຄ້າ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
