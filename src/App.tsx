import "./App.css";
import { useAppStore } from "./app.store";
import { Generate } from "./components/Generate";
import { Search } from "./components/Search";
import { Sidebar } from "./components/Sidebar";

function App() {
  const { section } = useAppStore();

  return (
    <div className="bg-neutral-100 w-full min-h-dvh p-8">
      <div className="max-w-3xl mx-auto flex gap-4 flex-col h-full">
        <div className="flex gap-4 h-full">
          <Sidebar />
          <main className="bg-white rounded-2xl p-6 w-full min-h-full">
            {{ search: <Search />, generate: <Generate /> }[section]}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
