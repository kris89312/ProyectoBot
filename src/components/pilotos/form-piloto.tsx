"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface FormPilotoProps {
  onClose: () => void;
}

export function FormPiloto({ onClose }: FormPilotoProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data } = await axios.post("/api/pilotos", { nombre, tel_whatsapp: tel });

    if (!data.ok) {
      setError(data.error ?? "Error al crear piloto");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-[#E5E7EB] p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Nuevo Piloto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Teléfono WhatsApp</label>
            <input
              type="text"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              placeholder="502-5555-1234"
              required
              className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
            />
          </div>
          {error && <p className="text-sm text-[#DC2626]">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#6B7280] hover:text-[#111827]">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1A56DB] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1E429F] disabled:opacity-50 transition-colors"
            >
              {loading ? "Guardando..." : "Crear Piloto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
