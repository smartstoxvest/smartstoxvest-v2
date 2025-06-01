import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import ShortTerm from "@/pages/ShortTerm";
import MediumTerm from "@/pages/MediumTerm";
import LongTerm from "@/pages/LongTerm";
import Landing from "@/pages/Landing";
import ThankYou from "@/pages/ThankYou";
import RecommendedTools from "@/pages/RecommendedTools";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import NewPost from "@/pages/NewPost";
import EditPost from "@/pages/EditPost";
import BlogList from "@/pages/BlogList";
import AdminLogin from "@/pages/AdminLogin";

// Layout
import TopNavLayout from "@/layouts/TopNavLayout";

const AppRoutes = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("✅ PWA install prompt captured");
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
          console.log("🎉 PWA installed");
        } else {
          console.log("❌ PWA install dismissed");
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <>
      {deferredPrompt && (
        <div className="p-4 text-center">
          <button
            onClick={handleInstallClick}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            📲 Install SmartStoxVest
          </button>
        </div>
      )}

      <Routes>
        {/* 🏠 Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* 📈 Main Features */}
        <Route path="/app/short-term" element={<ShortTerm />} />
        <Route path="/app/medium-term" element={<MediumTerm />} />
        <Route path="/app/long-term" element={<LongTerm />} />
        <Route path="/app/tools" element={<RecommendedTools />} />

        {/* 📝 Blog */}
        <Route path="/app/blog" element={<TopNavLayout><Blog /></TopNavLayout>} />
        <Route path="/app/blog/:slug" element={<TopNavLayout><BlogDetail /></TopNavLayout>} />

        {/* 🔐 Admin */}
        <Route path="/app/admin/login" element={<AdminLogin />} />
        <Route path="/app/admin/new" element={<TopNavLayout><NewPost /></TopNavLayout>} />
        <Route path="/app/admin/edit/:slug" element={<TopNavLayout><EditPost /></TopNavLayout>} />
        <Route path="/app/admin/blogs" element={<TopNavLayout><BlogList /></TopNavLayout>} />

        {/* 🔁 Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
