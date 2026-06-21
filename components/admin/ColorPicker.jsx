"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ColorPicker({ colors, onChange }) {
  const [hex, setHex] = useState("#000000");

  const addColor = () => {
    if (!colors.includes(hex)) onChange([...colors, hex]);
  };

  const removeColor = (c) => {
    onChange(colors.filter((col) => col !== c));
  };

  return (
    <div>
      <label className="text-sm font-medium text-gray-500">Colors</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-gray-300"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#RRGGBB"
          className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-red-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={addColor}
          className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
        >
          Add
        </button>
      </div>

      {colors.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1 rounded-full border border-gray-200 py-1 pl-1 pr-2 text-xs"
            >
              <span
                className="h-4 w-4 rounded-full border border-gray-300"
                style={{ backgroundColor: c }}
              />
              {c}
              <button type="button" onClick={() => removeColor(c)}>
                <X size={12} className="text-gray-400 hover:text-red-600" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}