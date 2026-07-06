import { useState } from "react";
import TopLangs from "./components/TopLangs";

export default function App() {

  const [user, setUser] = useState("");
  const [submittedUsername, setSubmittedUsername] = useState("");

  function handleSubmit(e)
  {
    e.preventDefault();
    setSubmittedUsername(user);
  }

  return (
    <div className="pt-32">
      <h1 className="text-center text-[#15054f] font-bold text-5xl text-shadow-sm text-shadow-mauve-700 mb-8">TopLangs by sylvzzz</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex gap-3 items-center">
        <input
          className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-md
                     flex-1 text-lg font-bold text-[#15054f] placeholder-gray-500 placeholder:font-bold
                     outline-none focus:border-purple-400 transition-colors"
          type="text"
          placeholder="Your github username..."
          value={user}
          onChange={(e) => setUser(e.target.value)}
          spellCheck="false"
        />
        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-400 text-white font-semibold
                     px-6 py-4 rounded-2xl text-lg transition-colors"
        >
          Search
        </button>
      </form>
      {submittedUsername && <TopLangs username={submittedUsername} />}
    </div>
  );
}