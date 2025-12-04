import UploadVideo from "../components/UploadVideo";
import ModelViewer from "../components/ModelViewer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Top Nav */}
      <SiteHeader />

      {/* Hero */}
      <Hero />

      {/* Gallery Preview */}
      <section id="gallery" className="border-t border-white/10">
        <GalleryPreview />
      </section>

      {/* How We Work */}
      <section id="how" className="border-t border-white/10">
        <HowWeWork />
      </section>

      {/* Before / After */}
      <section className="border-t border-white/10">
        <BeforeAfter />
      </section>

      {/* CTA + Footer */}
      <CallToAction />
      <Footer />
    </div>
  );
}

/* ----------------------- HEADER ----------------------- */

function SiteHeader() {
  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
      <a href="/" className="font-mono text-lg tracking-widest">3Dify</a>

      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
        <a href="#about" className="hover:text-white">about us ▾</a>
        <a href="#gallery" className="hover:text-white">gallery ▾</a>
        <a href="#how" className="hover:text-white">how we work ▾</a>
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="/signin"
          className="text-xs px-3 py-1 rounded-md border border-gray-600 hover:border-gray-300"
        >
          Sign in
        </a>

        <a
          href="/register"
          className="text-xs px-3 py-1 rounded-md border border-gray-600 hover:border-gray-300"
        >
          Register
        </a>
      </div>
    </header>
  );
}

/* ----------------------- HERO ----------------------- */

function Hero() {
  return (
    <main className="max-w-6xl mx-auto px-4 pt-24 pb-28 md:pb-40">
      <h1 className="font-mono font-semibold tracking-tight text-[56px] leading-none md:text-[96px]">3Dify</h1>
      <p className="mt-6 max-w-xl text-gray-300 leading-relaxed">
        Transform any video into a detailed 3D model — fast, accurate, and ready for use.
      </p>
      <div className="mt-8">
        <a href="#try" className="inline-block text-xs uppercase tracking-widest px-3 py-1 rounded-md border border-gray-600 hover:border-gray-300">Try 3Dify</a>
      </div>

      {/* Placeholder icon */}
      <div className="mt-16 w-full max-w-md h-40 md:h-52 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center">
        <ImageIcon />
      </div>
    </main>
  );
}

/* ----------------------- GALLERY ----------------------- */

function GalleryPreview() {
  const items = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1200&auto=format&fit=crop",
      title: "brief description",
      date: "Nov 5, 2022",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop",
      title: "brief description",
      date: "Jul 14, 2022",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1542626991-1b3d3b09122d?q=80&w=1200&auto=format&fit=crop",
      title: "brief description",
      date: "Sep 26, 2022",
    },
    {
      id: 4,
      img: "https://images.unsplash.com/photo-1544551763-7ef420be2d4e?q=80&w=1200&auto=format&fit=crop",
      title: "brief description",
      date: "Aug 13, 2022",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-mono tracking-widest text-lg lowercase">gallery</h2>
        <a href="/gallery" className="text-xs text-gray-400 hover:text-white">view full gallery →</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <article key={it.id} className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="aspect-[4/5] bg-white/[0.04] overflow-hidden">
              <img src={it.img} alt={it.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="px-3 py-2 border-t border-white/10">
              <p className="text-xs text-gray-200">{it.title}</p>
              <p className="text-[10px] text-gray-400">{it.date}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 md:mt-12 py-6 md:py-10 border-t border-white/10">
        <p className="max-w-3xl font-mono text-2xl md:text-4xl leading-tight">
          3Dify uses AI to generate detailed 3D models from simple video inputs. It reconstructs depth, texture, and geometry with precision.
        </p>
      </div>

      <p className="mt-2 text-xs text-gray-400 max-w-2xl">
        3Dify makes 3D modeling effortless. Transform any video into a shareable, realistic 3D model — no design experience required. <a href="#try" className="underline-offset-2 hover:underline">Try 3Dify →</a>
      </p>
    </div>
  );
}

/* ----------------------- HOW WE WORK ----------------------- */

function HowWeWork() {
  const steps = [
    {
      k: "01",
      title: "Upload video",
      desc: "Record a slow 360° sweep on your phone and upload it.",
    },
    {
      k: "02",
      title: "AI reconstruction",
      desc: "Our pipeline estimates depth and mesh from frames and fuses them.",
    },
    {
      k: "03",
      title: "Export & share",
      desc: "Download glTF/OBJ or view in your gallery with a share link.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <h2 className="font-mono tracking-widest text-lg lowercase mb-6">how we work</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.k} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-xs text-gray-400 mb-1">{s.k}</div>
            <h3 className="text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-gray-300">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------- BEFORE / AFTER ----------------------- */

function BeforeAfter() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">Input</p>
          <div className="h-56 md:h-72 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center">
            <Spinner />
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-400 mb-2">Output</p>
          <div className="h-56 md:h-72 rounded-xl border border-white/10 bg-white/[0.03] grid place-items-center">
            <Spinner />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- CALL TO ACTION ----------------------- */

function CallToAction() {
  return (
    <section id="try" className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-mono">Ready to turn video into 3D?</h3>
            <p className="text-sm text-gray-300 mt-1">Start with sample data or upload your own footage.</p>
          </div>

          <div className="flex gap-3">
            {/* Replaced old button with upload component */}
            <UploadVideo />

            <button className="text-xs px-3 py-2 rounded-md border border-gray-600 hover:border-gray-300">
              Use sample
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- FOOTER ----------------------- */

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-4 py-10 text-xs text-gray-400">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} 3Dify</p>
        <nav className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

/* ----------------------- SMALL UI PIECES ----------------------- */

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      <div className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <span className="text-xs">processing…</span>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="opacity-60">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="8" cy="10" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M21 16l-5.5-5.5L9 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
