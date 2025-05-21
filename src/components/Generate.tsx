import { Button } from "@radix-ui/themes";
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
      {query ? <Button className="w-full">Создать</Button> : null}
    </div>
  );
}
