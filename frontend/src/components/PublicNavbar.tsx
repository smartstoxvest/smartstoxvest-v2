import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
//import { Browser } from "@capacitor/browser";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  const isNative = Capacitor.isNativePlatform();

  // ✅ User Manual opener
  const openUserManual = async () => {
    const url = "https://smartstoxvest.com/SmartStoxVest_User_Manual.pdf";
    if (isNative) {
      await Browser.open({ url });
    } else {
      window.open(url, "_blank", "noopener");
    }
  };

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(doScroll, 100);
    } else {
      doScroll();
    }
    setMenuOpen(false);
  };

  // Simple route helper
  const goTo = (path: string) => {
    if (location.pathname !== path) navigate(path);
    setMenuOpen(false);
  };

  // Highlight active section (landing page sections)
  useEffect(() => {
    const ids = ["mission", "team", "features", "feedback", "FAQ"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id));
      },
      { threshold: 0.6 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Classes for section-based links (landing) vs path-based links (standalone pages)
  const linkClass = (id: string) =>
    `hover:text-blue-500 ${
      activeSection === id ? "text-blue-600 font-semibold" : "text-blue-700"
    }`;

  const linkClassPath = (path: string) =>
    `hover:text-blue-500 ${
      location.pathname === path ? "text-blue-600 font-semibold" : "text-blue-700"
    }`;

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* logo + brand */}
        <div className="flex items-center space-x-2">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            className="h-8 w-auto"
            alt="SmartStoxVest"
          />
          <span className="text-xl font-bold text-blue-900">SmartStoxVest</span>
        </div>

        {/* desktop menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <button onClick={() => scrollTo("mission")} className={linkClass("mission")}>Mission</button>
          <button onClick={() => scrollTo("team")} className={linkClass("team")}>Team</button>
          <button onClick={() => scrollTo("features")} className={linkClass("features")}>Features</button>
          <button onClick={() => scrollTo("feedback")} className={linkClass("feedback")}>Feedback</button>
          <a href="/app/blog" className="hover:text-blue-500">Blog</a>
          <button onClick={() => scrollTo("FAQ")} className={linkClass("FAQ")}>FAQ</button>

          {/* ✅ Partnership (new) */}
          <button
            onClick={() => goTo("/partnership")}
            className={`relative ${linkClassPath("/partnership")}`}
            aria-label="Partnership"
          >
            Partnership
            {/* subtle 'new' pulse dot */}
            <span
              className="absolute -top-1 -right-3 inline-block h-2 w-2 bg-[#FF7200] rounded-full animate-pulse"
              aria-hidden="true"
            />
          </button>

          <button onClick={openUserManual} className="text-blue-600 underline">
            User Manual
          </button>
        </nav>

        {/* hamburger */}
        <button
          className="md:hidden text-blue-800"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-3 text-base font-medium text-blue-700">
          <button onClick={() => scrollTo("mission")} className={`text-left ${linkClass("mission")}`}>Mission</button>
          <button onClick={() => scrollTo("team")} className={`text-left ${linkClass("team")}`}>Team</button>
          <button onClick={() => scrollTo("features")} className={`text-left ${linkClass("features")}`}>Features</button>
          <button onClick={() => scrollTo("feedback")} className={`text-left ${linkClass("feedback")}`}>Feedback</button>
          <button onClick={() => scrollTo("FAQ")} className={`text-left ${linkClass("FAQ")}`}>FAQ</button>

          {/* ✅ Partnership (mobile) */}
          <button
            onClick={() => goTo("/partnership")}
            className={`text-left ${linkClassPath("/partnership")} relative`}
          >
            Partnership
            <span
              className="ml-2 inline-block h-2 w-2 bg-[#FF7200] rounded-full animate-pulse align-middle"
              aria-hidden="true"
            />
          </button>

          {/* Optional: uncomment if you want Blog & Manual in mobile menu */}
          {/* <a onClick={() => setMenuOpen(false)} href="/app/blog" className="text-left hover:text-blue-500">Blog</a> */}
          {/* <button
            onClick={async () => { setMenuOpen(false); await openUserManual(); }}
            className="text-left text-blue-600 underline"
          >
            User Manual
          </button> */}
        </div>
      )}
    </header>
  );
}
