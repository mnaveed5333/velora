"use client";

import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">New Arrival</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((p) => (
            <tr key={p._id}>
              <td className="px-4 py-3">
                <img src={p.image} alt={p.name} className="h-12 w-10 rounded object-cover" />
              </td>
              <td className="px-4 py-3 text-gray-900">{p.name}</td>
              <td className="px-4 py-3 text-gray-700">{p.category}</td>
              <td className="px-4 py-3 text-gray-700">${p.price}</td>
              <td className="px-4 py-3 text-gray-700">{p.isNewArrival ? "Yes" : "No"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/dashboard/products/${p._id}`}
                    className="text-gray-400 hover:text-blue-600"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => onDelete(p._id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}