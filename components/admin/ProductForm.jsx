"use client";

import { useState, useEffect, useRef } from "react";
import { ImagePlus, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import ColorPicker from "./ColorPicker";

const DEFAULT_CATEGORIES = ["Men", "Women", "Kids", "Accessories", "Footwear"];
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductForm({ initialData = null, onSubmit, submitLabel = "Add Product" }) {
  const isEdit = !!initialData;
  const fileInputRef = useRef(null);
  const descriptionRef = useRef(null);

  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);

  const [form, setForm] = useState({
    name: "",
    category: "",
    customCategory: "",
    description: "",
    price: "",
    sizes: [],
    customSize: "",
    onSale: false,
    isNewArrival: true,
    isBestSeller: false,
  });
  const [colors, setColors] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  // Fetch every category that already exists across all products
  // (fixed defaults + every custom one ever typed) and merge them in.
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const existing = (data.products || [])
          .map((p) => p.category)
          .filter(Boolean);
        const merged = Array.from(new Set([...DEFAULT_CATEGORIES, ...existing])).sort();
        setCategoryOptions(merged);
      } catch (err) {
        console.error("Failed to load categories:", err);
        // fall back to defaults silently — form still works
      }
    }
    loadCategories();
  }, []);

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      const knownCategory = categoryOptions.includes(initialData.category);
      setForm({
        name: initialData.name || "",
        category: knownCategory ? initialData.category : "Other",
        customCategory: knownCategory ? "" : initialData.category || "",
        description: initialData.description || "",
        price: initialData.price || "",
        sizes: initialData.sizes || [],
        customSize: "",
        onSale: !!initialData.onSale,
        isNewArrival: !!initialData.isNewArrival,
        isBestSeller: !!initialData.isBestSeller,
      });
      setColors(initialData.colors || []);
      setPreview(initialData.image || null);
      if (descriptionRef.current) {
        descriptionRef.current.value = initialData.description || "";
      }
    }
  }, [initialData, categoryOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, description: value }));
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));
  };

  const addCustomSize = () => {
    const s = form.customSize.trim();
    if (s && !form.sizes.includes(s)) {
      setForm((f) => ({ ...f, sizes: [...f.sizes, s], customSize: "" }));
    }
  };

  const setImage = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files?.[0] || null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setImage(file);
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setPreview(isEdit ? null : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    const finalCategory =
      form.category === "Other" ? form.customCategory.trim() : form.category;

    const liveDescriptionFromDOM = descriptionRef.current?.value ?? "";
    const descriptionToSend =
      liveDescriptionFromDOM.length > 0 ? liveDescriptionFromDOM : form.description;

    if (!form.name || !finalCategory || !form.price || (!isEdit && !imageFile)) {
      setStatus({
        loading: false,
        error: "Name, category, price, and image are required.",
        success: "",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", finalCategory);
    formData.append("description", descriptionToSend);
    formData.append("price", form.price);
    formData.append("colors", colors.join(","));
    formData.append("sizes", form.sizes.join(","));
    formData.append("onSale", form.onSale);
    formData.append("isNewArrival", form.isNewArrival);
    formData.append("isBestSeller", form.isBestSeller);
    if (imageFile) formData.append("image", imageFile);

    try {
      await onSubmit(formData);
      setStatus({ loading: false, error: "", success: isEdit ? "Product updated." : "Product added." });
      if (!isEdit) {
        // If a brand-new custom category was just used, add it to the
        // in-memory dropdown immediately so it's selectable right away
        // without needing a refetch.
        if (form.category === "Other" && finalCategory) {
          setCategoryOptions((prev) =>
            Array.from(new Set([...prev, finalCategory])).sort()
          );
        }
        setForm({
          name: "",
          category: "",
          customCategory: "",
          description: "",
          price: "",
          sizes: [],
          customSize: "",
          onSale: false,
          isNewArrival: true,
          isBestSeller: false,
        });
        setColors([]);
        setImageFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (descriptionRef.current) descriptionRef.current.value = "";
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message || "Something went wrong.", success: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        {isEdit ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid gap-8 sm:grid-cols-[260px_1fr]">
        {/* IMAGE UPLOAD */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <p className="mb-2 text-xs text-gray-400">
            Recommended 600×698 · JPG, PNG or WEBP
          </p>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group relative aspect-[3/3.5] w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
              isDragging
                ? "border-red-500 bg-red-50"
                : preview
                ? "border-gray-200"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }`}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                  <span className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900">
                    Change Image
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm hover:bg-white hover:text-red-600"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-500">
                  <ImagePlus size={18} />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Click or drag image here
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          {isEdit && (
            <p className="mt-2 text-xs text-gray-400">
              Leave unchanged to keep the current image.
            </p>
          )}
        </div>

        {/* FIELDS */}
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Essential Polo"
                className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Price</label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Category — now includes every category ever used, fixed + custom */}
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="">Select category</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Other (type manually)</option>
            </select>
            {form.category === "Other" && (
              <input
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                placeholder="Enter custom category"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              ref={descriptionRef}
              name="description"
              defaultValue={form.description}
              onChange={handleDescriptionChange}
              rows={4}
              placeholder="Describe the product — fabric, fit, care instructions..."
              className="mt-1.5 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          {/* Colors */}
          <div>
            <ColorPicker colors={colors} onChange={setColors} />
          </div>

          {/* Sizes */}
          <div>
            <label className="text-sm font-medium text-gray-700">Sizes</label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                    form.sizes.includes(s)
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={form.customSize}
                onChange={(e) => setForm((f) => ({ ...f, customSize: e.target.value }))}
                placeholder="Custom size (e.g. 42, One Size)"
                className="w-48 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={addCustomSize}
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
              >
                Add
              </button>
            </div>
            {form.sizes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {form.sizes.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="onSale"
                checked={form.onSale}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              On Sale
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isNewArrival"
                checked={form.isNewArrival}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Show in New Arrivals
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="isBestSeller"
                checked={form.isBestSeller}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Show in Bestsellers
            </label>
          </div>

          {status.error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle size={15} />
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-600">
              <CheckCircle2 size={15} />
              {status.success}
            </div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status.loading && <Loader2 size={15} className="animate-spin" />}
            {status.loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}