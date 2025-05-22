import { useState, useRef } from "react";

const engineId =
  import.meta.env?.VITE_STABILITY_AI_ENGINE_ID ?? "stable-diffusion-v1-6";
const STABILITY_API_URL = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;
const API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

export function ImageGenerator() {
  const formRef = useRef<HTMLFormElement>(null);

  const [itemName, setItemName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [additional, setAdditional] = useState("");
  const [samples, setSamples] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = () => {
    return `Технический чертёж ${itemName}, профессиональный шаблон для кожевенного дела, вид сверху, чёткие линии резки, отметки для прошивки, точные размеры в мм/см, габариты: ${width} x ${height}, симметричный дизайн, минимализм, высококонтрастные линии на белом фоне, без теней, без перспективы, стиль векторной графики, ультра-детализация, масштабируемый дизайн в духе SVG, пригодный для реального производства${
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
    setImageUrls([]);

    try {
      const response = await fetch(STABILITY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: parseInt(height),
          width: parseInt(width),
          steps: 30,
          samples: samples, // Генерируем 3 изображения
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка генерации: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.artifacts || !Array.isArray(data.artifacts)) {
        throw new Error("Некорректный ответ от API");
      }

      const urls = data.artifacts.map(
        (art: { base64: string }) => `data:image/png;base64,${art.base64}`
      );
      setImageUrls(urls);
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

        <div className="flex gap-2">
          <input
            type="number"
            className="w-1/2 p-2 border rounded"
            placeholder="Кол-во изображений"
            value={samples}
            onChange={(e) => setSamples(e.target.valueAsNumber)}
            required
            min={1}
            max={10}
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

      {imageUrls.length > 0 && (
        <div>
          <h2 className="font-semibold mt-4">Результаты:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Generated blueprint ${idx + 1}`}
                className="rounded shadow"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
