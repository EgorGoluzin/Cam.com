import { useState, useRef } from "react";

const STABILITY_API_URL =
  "https://api.stability.ai/v2beta/stable-image/generate/core";
const API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

export function ImageGenerator() {
  const formRef = useRef<HTMLFormElement>(null);

  const [itemName, setItemName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [additional, setAdditional] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = () => {
    return `Technical blueprint of a ${itemName}, professional leatherworking template, top-down orthographic view, clean cut lines, stitching marks, precise measurements in mm/cm, dimensions: ${width} x ${height} symmetrical design, minimalist style, high contrast lines on white background, no shadows, no perspective, vector-art style, ultra-detailed, scalable vector graphic (SVG) vibe, functional design for real-world crafting${
      additional ? `, ${additional}` : ""
    }`;
  };

  const prompt = buildPrompt();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("output_format", "webp");

      const response = await fetch(STABILITY_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка генерации: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageUrl(objectUrl);
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Неизвестная ошибка при генерации"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Blueprint генератор</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-2"
        noValidate
      >
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Название изделия (например, сумка)"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
          minLength={2}
        />

        <div className="flex gap-2">
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Ширина (мм)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            required
            min={10}
            max={1000}
            step={1}
          />
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Высота (мм)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            min={10}
            max={1000}
            step={1}
          />
        </div>

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Дополнительные параметры (по желанию)"
          rows={2}
          value={additional}
          onChange={(e) => setAdditional(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Генерация..." : "Сгенерировать чертёж"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <div>
          <h2 className="font-semibold mt-4">Результат:</h2>
          <img
            src={imageUrl}
            alt="Generated blueprint"
            className="mt-2 rounded shadow"
          />
        </div>
      )}
    </div>
  );
}
