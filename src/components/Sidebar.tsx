import { useAppStore } from "@/app.store";

export function Sidebar() {
  const { section, setSection } = useAppStore();

  return (
    <nav className="relative top-8 h-full md:sticky">
      <span className="text-2xl font-medium mb-6 block">Cam.com</span>
      <ul className="flex flex-col gap-2">
        <li
          onClick={() => setSection("search")}
          className={`text-neutral-500 py-2 px-4 hover:bg-neutral-200 rounded-2xl cursor-pointer w-32 active:scale-95 transition-all ${
            section === "search" ? "bg-neutral-200/50 font-medium" : ""
          }`}
        >
          Поиск
        </li>
        <li
          onClick={() => setSection("generate")}
          className={`text-neutral-500 py-2 px-4 hover:bg-neutral-200 rounded-2xl cursor-pointer w-32 active:scale-95 transition-all ${
            section === "generate" ? "bg-neutral-200/50 font-medium" : ""
          }`}
        >
          Генерация
        </li>
      </ul>
    </nav>
  );
}
