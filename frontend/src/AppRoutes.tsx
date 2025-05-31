import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ShortTerm from "@/pages/ShortTerm";
import MediumTerm from "@/pages/MediumTerm";
import LongTerm from "@/pages/LongTerm";
import Dashboard from "@/pages/Dashboard";
import RecommendedTools from "@/pages/RecommendedTools";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Layout from "@/components/Layout";
import Landing from "./pages/Landing";
import ThankYou from "./pages/ThankYou";

const AppRoutes = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("✅ beforeinstallprompt captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("🎉 User installed the app");
        } else {
          console.log("❌ User dismissed the install");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      {deferredPrompt && (
        <div className="p-4">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📲 Install SmartStoxVest
          </button>
        </div>
      )}

      <Routes>
        {/* 🔓 Public Routes – No Layout */}
        <Route path="/" element={<Landing />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* 🔐 App Routes without Layout for clean tool views */}
        <Route path="/app/short-term" element={<ShortTerm />} />
        <Route path="/app/medium-term" element={<MediumTerm />} />
        <Route path="/app/long-term" element={<LongTerm />} />

        {/* Optional routes with layout for dashboard/blog/tools */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tools" element={<RecommendedTools />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
        </Route>

        {/* 🔁 Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
