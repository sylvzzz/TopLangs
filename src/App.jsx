import { useEffect, useState } from "react";
import { Globe, Github, Moon, Sun } from "lucide-react";
import TopLangs from "./components/TopLangs";

const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");
  return stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};

export default function App() {
  const [user, setUser] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmittedUsername(user);
  }

  return (
    <div className="flex min-h-screen flex-col pt-32">
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <a
          href="https://github.com/sylvzzz"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink backdrop-blur-md transition duration-200 ease-out motion-reduce:transition-none active:scale-95"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="https://diogo-lb-silva.vercel.app"
          target="_blank"
          rel="noreferrer"
          aria-label="Website"
          className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink backdrop-blur-md transition duration-200 ease-out motion-reduce:transition-none active:scale-95"
        >
          <Globe className="w-5 h-5" />
        </a>
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          aria-label={dark ? "Dark mode" : "Light mode"}
          className="flex h-11 items-center gap-2 rounded-full border border-line bg-surface pl-4 pr-5 text-ink backdrop-blur-md transition duration-200 ease-out motion-reduce:transition-none active:scale-95"
        >
          <span className="relative h-5 w-5">
            <Sun
              className={`theme-icon absolute inset-0 ${dark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
            />
            <Moon
              className={`theme-icon absolute inset-0 ${dark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
            />
          </span>
          <span className="text-sm font-semibold">{dark ? "Dark mode" : "Light mode"}</span>
        </button>
      </div>

      <h1 className="text-center text-ink text-5xl font-bold mb-8">TopLangs by sylvzzz</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3 items-center">
        <input
          className="bg-surface border border-line px-6 py-4 rounded-2xl backdrop-blur-md
                     flex-1 text-lg font-bold text-ink placeholder:text-ink-soft
                     outline-none focus:border-purple-400 transition-colors duration-200"
          type="text"
          placeholder="Your github username..."
          value={user}
          onChange={(e) => setUser(e.target.value)}
          spellCheck="false"
        />
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-400 text-white font-semibold
                     px-6 py-4 rounded-2xl text-lg transition duration-150 ease-out active:scale-95"
        >
          Search
        </button>
      </form>
      {submittedUsername && <TopLangs username={submittedUsername} />}
      <footer className="mt-auto border-t border-line py-4 text-center text-sm font-semibold text-ink-soft">
        sylvzzz
        <span className="mx-1.5">·</span>
        <a
          href="https://github.com/sylvzzz"
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          GitHub
        </a>
        <span className="mx-1.5">·</span>
        <a
          href="https://diogo-lb-silva.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="transition-colors duration-200 hover:text-ink"
        >
          Website
        </a>
      </footer>
    </div>
  );
}