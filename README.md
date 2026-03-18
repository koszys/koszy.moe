# Start of the project

<p>
<a href="https://v3.tailwindcss.com/docs/installation">Tailwind</a>  
</p>

1) Create the project. The version used is the previous of the most recent. Choose React and JavaScript + SWC. 
```bash
npm create vite@7.1.3 koszy-moe
cd koszy-moe
```

2) Install Tailwind CSS
```bash
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

3) Configure the tailwind.config.js
```bash
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```


4) Add Tailwind directives to top of index.css
```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<details>

<summary>App.jsx boilerplate</summary>
  
```bash
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-wider cursor-pointer">
            koszy.moe
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-gray-400">
            <a href="#" className="text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Global Planner</a>
            <a href="#" className="hover:text-white transition-colors">Pinned Events</a>
          </nav>
        </div>
        <div className="flex items-center space-x-5">
          {/* Placeholder for Ko-fi / Discord */}
          <a href="#" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
          </a>
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]">
            Login
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 mt-10">
        
        {/* Hero Section */}
        <section className="text-center mb-20 mt-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Gacha Routine</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Your unified planner and event timeline. Track daily rewards, manage stamina, and never miss a banner across all your favorite games and servers.
          </p>
        </section>

        {/* Database Hub / Games Grid */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-2xl font-bold tracking-wide">Supported Games</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Active Game: Genshin Impact */}
            <a href="/genshin" className="group block relative rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:-translate-y-1">
              <div className="aspect-[16/9] bg-gray-700 relative overflow-hidden">
                {/* Visual placeholder - later replace with actual game banner */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-gray-800 opacity-80 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10"></div>
              </div>
              
              <div className="absolute bottom-0 w-full p-5 z-20">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Genshin Impact</h3>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 rounded">Planner</span>
                  <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 rounded">Timeline</span>
                </div>
              </div>
            </a>

            {/* Inactive Games (Placeholders based on your list) */}
            <div className="rounded-2xl overflow-hidden bg-gray-800/30 border border-gray-800/50 opacity-40 cursor-not-allowed aspect-[16/9] relative">
              <div className="absolute bottom-0 w-full p-5">
                <h3 className="text-xl font-bold text-gray-300">Honkai: Star Rail</h3>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-bold">Coming Soon</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gray-800/30 border border-gray-800/50 opacity-40 cursor-not-allowed aspect-[16/9] relative">
              <div className="absolute bottom-0 w-full p-5">
                <h3 className="text-xl font-bold text-gray-300">Zenless Zone Zero</h3>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-bold">Coming Soon</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-gray-800/30 border border-gray-800/50 opacity-40 cursor-not-allowed aspect-[16/9] relative">
              <div className="absolute bottom-0 w-full p-5">
                <h3 className="text-xl font-bold text-gray-300">Wuthering Waves</h3>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider font-bold">Coming Soon</p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
```
</details>

<details>

<summary>index.css boilerplate</summary>

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  background-color: #111827; /* Tailwind gray-900 to ensure dark mode base */
  color: #f3f4f6;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
```

</details>
