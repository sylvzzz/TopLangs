const TopLangs = ({ username = 'your_username', exclude = [], excludeRepos = [] }) => {
  const [state, setState] = useState({ loading: true, error: null, langs: [], repos: 0, total: 0 });
  const LANG_COLORS = [
  '#6366f1','#22d3ee','#f472b6','#34d399',
  '#fb923c','#a78bfa','#facc15','#f87171'
   ];
  useEffect(() => {
    async function load() {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          { headers }
        );
        const repoList = await res.json();

        if (!Array.isArray(repoList)) {
          throw new Error(repoList.message ?? 'GitHub API error');
        }

        const nonFork = repoList.filter(r =>
          !r.fork &&
          r.language &&
          !excludeRepos.map(e => e.toLowerCase()).includes(r.name.toLowerCase())
        );
        const totals = {};

        for (let i = 0; i < nonFork.length; i += 5) {
          const chunk = nonFork.slice(i, i + 5);
          const results = await Promise.allSettled(
            chunk.map(r => fetch(r.languages_url, { headers }).then(r => r.json()))
          );
          results.forEach(res => {
            if (res.status === 'fulfilled' && typeof res.value === 'object') {
              Object.entries(res.value).forEach(([lang, bytes]) => {
                totals[lang] = (totals[lang] || 0) + bytes;
              });
            }
          });
        }

        const sorted = Object.entries(totals)
          .filter(([lang]) => !exclude.map(e => e.toLowerCase()).includes(lang.toLowerCase()))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8);
        const total = sorted.reduce((s, [, v]) => s + v, 0);

        setState({ loading: false, error: null, langs: sorted, repos: nonFork.length, total });
      } catch (e) {
        setState(s => ({ ...s, loading: false, error: e.message }));
      }
    }
    load();
  }, [username]);

  const { loading, error, langs, repos, total } = state;

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Github className="w-8 h-8 text-purple-400" />
          <h2 className="text-4xl font-bold text-white">Top Languages</h2>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r /*from-indigo-500 via-purple-500 to-pink-500*/ rounded-2xl blur opacity-20" />
          <div className="relative bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
            {loading && (
              <p className="text-gray-500 text-sm animate-pulse">Fetching languages from GitHub...</p>
            )}

            {error && (
              <p className="text-red-400 text-sm">Error: {error}</p>
            )}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: 'Total Repos', value: repos },
                    { label: 'Total Languages', value: langs.length },
                    { label: 'Top language', value: langs[0]?.[0] ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-xl font-bold text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex w-full h-3 rounded-full overflow-hidden mb-4">
                  {langs.map(([lang, bytes], i) => (
                    <div
                      key={lang}
                      title={`${lang} — ${(bytes / total * 100).toFixed(1)}%`}
                      style={{ flex: bytes / total, background: LANG_COLORS[i % LANG_COLORS.length] }}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8">
                  {langs.map(([lang], i) => (
                    <div key={lang} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{ background: LANG_COLORS[i % LANG_COLORS.length] }}
                      />
                      {lang}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {langs.map(([lang, bytes], i) => {
                    const pct = (bytes / total * 100).toFixed(1);
                    const barW = Math.round(bytes / langs[0][1] * 100);
                    return (
                      <div key={lang} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-4 text-right flex-shrink-0">{i + 1}</span>
                        <span className="text-sm font-semibold text-gray-200 w-28 flex-shrink-0">{lang}</span>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="lang-bar h-full rounded-full"
                            style={{
                              width: `${barW}%`,
                              background: LANG_COLORS[i % LANG_COLORS.length],
                              animationDelay: `${i * 0.08}s`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0">{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopLangs