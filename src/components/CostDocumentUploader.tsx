"use client";

import { useState, useRef } from "react";
import { ProjectCost } from "@/types";

interface CostDocumentUploaderProps {
  projectId: string;
  onUploadSuccess: (cost: ProjectCost) => void;
}

export default function CostDocumentUploader({
  projectId,
  onUploadSuccess,
}: CostDocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    documentType: "invoice" as "invoice" | "order" | "estimate" | "other",
    amount: "",
    vendor: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Formato non supportato. Usa PDF, JPG, PNG o DOCX.");
      return;
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError("File troppo grande. Massimo 20MB.");
      return;
    }

    setSelectedFile(file);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Nessun file selezionato.");
      return;
    }

    if (!formData.amount) {
      setError("Inserisci l'importo.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);
      formDataToSend.append("documentType", formData.documentType);
      formDataToSend.append("amount", formData.amount);
      formDataToSend.append("vendor", formData.vendor);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("date", formData.date);

      const res = await fetch(`/api/projects/${projectId}/costs`, {
        method: "POST",
        body: formDataToSend,
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Errore nel caricamento");
        return;
      }

      onUploadSuccess(json.data);

      // Reset form
      setSelectedFile(null);
      setShowForm(false);
      setFormData({
        documentType: "invoice",
        amount: "",
        vendor: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch {
      setError("Errore di rete");
    } finally {
      setIsLoading(false);
    }
  };

  if (showForm && selectedFile) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Aggiungi Documento di Costo
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(0)} KB)
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo Documento <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.documentType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  documentType: e.target.value as any,
                })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="invoice">Fattura</option>
              <option value="order">Ordine Fornitore</option>
              <option value="estimate">Preventivo</option>
              <option value="other">Altro</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importo (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="es. 5000.00"
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fornitore / Azienda
            </label>
            <input
              type="text"
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
              placeholder="es. ABC Impianti SRL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Documento
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="es. Motore principale, ordine XYZ123"
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setSelectedFile(null);
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Caricamento..." : "Aggiungi Costo"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-gray-50 hover:border-gray-400"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        hidden
      />

      <div className="space-y-3">
        <div className="text-4xl">📄</div>
        <h3 className="text-lg font-semibold text-gray-900">
          Carica Documento di Costo
        </h3>
        <p className="text-sm text-gray-600">
          Trascina qui fatture, ordini, preventivi o clicca per sfogliare
        </p>
        <p className="text-xs text-gray-500">
          PDF, JPG, PNG, DOCX • Max 20MB
        </p>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Seleziona File
        </button>
      </div>
    </div>
  );
}
