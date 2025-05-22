import { Dialog } from "@radix-ui/themes";
import { useState, useRef } from "react";

const engineId =
  import.meta.env?.VITE_STABILITY_AI_ENGINE_ID ??
  "stable-diffusion-xl-1024-v1-0";
const STABILITY_API_URL = `https://api.stability.ai/v1/generation/${engineId}/text-to-image`;
const API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

const PROJECTIONS = [
  { label: "Вид сверху", value: "top-down orthographic view" },
  { label: "Вид спереди", value: "front orthographic view" },
  { label: "Вид сбоку", value: "side orthographic view" },
  { label: "Вид сзади", value: "back orthographic view" },
  { label: "аксонометрия", value: "isometric view" },
];

export function ImageGenerator() {
  const formRef = useRef<HTMLFormElement>(null);

  const [itemName, setItemName] = useState("");
  const [additional, setAdditional] = useState("");
  const [selectedProjections, setSelectedProjections] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<{ url: string; label: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildPrompt = (view: string) => {
    return `Technical blueprint of a ${itemName}; professional leathercraft pattern; ONLY ${view} projection; only one projection per image; do NOT include multiple views; clean cut lines, stitching guides; symmetrical, minimalist design; high-contrast on white; no shadows or perspective; ultra-detailed vector art; scalable and printable for real-world crafting${
      additional ? `; ${additional}` : ""
    }.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }

    if (selectedProjections.length === 0) {
      setError("Выберите хотя бы одну проекцию");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrls([]);

    try {
      const requests = selectedProjections.map(async (projection) => {
        const label = PROJECTIONS.find((p) => p.value === projection)?.label;

        const response = await fetch(STABILITY_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: buildPrompt(projection) }],
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Ошибка генерации проекции ${label}: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        const base64 = data.artifacts?.[0]?.base64;
        if (!base64) {
          throw new Error(`Пустой результат генерации проекции ${label}`);
        }

        return {
          url: `data:image/png;base64,${base64}`,
          label: label ?? projection,
        };
      });

      const results = await Promise.allSettled(requests);
      const successful: { url: string; label: string }[] = [];
      const errors: string[] = [];

      for (const result of results) {
        if (result.status === "fulfilled") {
          successful.push(result.value);
        } else {
          errors.push(result.reason?.message ?? "Неизвестная ошибка");
        }
      }

      if (successful.length) {
        setImageUrls(successful);
      }

      if (errors.length) {
        setError(errors.join("\n"));
      }
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

        <select
          multiple
          className="w-full p-2 border rounded"
          value={selectedProjections}
          onChange={(e) =>
            setSelectedProjections(
              Array.from(e.target.selectedOptions, (o) => o.value)
            )
          }
        >
          {PROJECTIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label} view
            </option>
          ))}
        </select>

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
            {imageUrls.map((img, idx) => (
              <Dialog.Root key={idx}>
                <Dialog.Trigger>
                  <img
                    src={img.url}
                    alt={img.label}
                    className="rounded shadow"
                  />
                </Dialog.Trigger>
                <Dialog.Content>
                  <img
                    src={img.url}
                    alt={img.label}
                    className="h-[80vh] object-cover rounded mx-auto"
                  />
                  <p className="text-center font-semibold mt-2">
                    {img.label} view
                  </p>
                </Dialog.Content>
              </Dialog.Root>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
