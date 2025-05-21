import { useState } from "react";

export function Generate() {
  const [query, setQuery] = useState("");

  //   const [result, setResult] = useState();

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
        type="search"
        className="bg-neutral-100 w-full p-2 rounded-xl mb-4 sticky top-6 border border-neutral-300"
        placeholder="Введите название предмета"
      />
      {query ? (
        <button className="w-full bg-neutral-700 text-white p-4 rounded-3xl active:scale-95 transition-all">
          Создать
        </button>
      ) : null}
    </div>
  );
}
