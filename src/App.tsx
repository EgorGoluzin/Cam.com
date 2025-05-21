import "./App.css";

function App() {
  return (
    <div className="bg-blue-50 w-full h-dvh p-8">
      <div className="max-w-3xl mx-auto flex gap-4">
        <nav className="bg-white rounded-2xl px-8 py-6">
          <ul className="flex flex-col gap-4">
            <li className="text-neutral-500 p-2 hover:bg-neutral-100 rounded-2xl">
              Поиск
            </li>
            <li>Создание</li>
          </ul>
        </nav>
        <main className="bg-white rounded-2xl p-6 w-full">
          <input type="text" />
        </main>
      </div>
    </div>
  );
}

export default App;
