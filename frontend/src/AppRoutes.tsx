import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ShortTerm from "@/pages/ShortTerm";
import MediumTerm from "@/pages/MediumTerm";
import LongTerm from "@/pages/LongTerm";
import Dashboard from "@/pages/Dashboard";
import RecommendedTools from "@/pages/RecommendedTools";
import NewPost from "@/pages/NewPost";
import EditPost from "@/pages/EditPost";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import AdminLogin from "@/pages/AdminLogin";
import RequireAdmin from "@/components/RequireAdmin";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import AuthUI from "@/pages/AuthUI";
import RequireAuth from "@/components/RequireAuth";
import useAuth from "@/hooks/useAuth";
import AdminUsers from "@/pages/AdminUsers";
import { ForgotPassword, ResetPassword } from "./pages/ForgotAndResetPassword";


const AppRoutes = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      const envToken = import.meta.env.VITE_ADMIN_TOKEN;
      setIsAdmin(token === envToken);
    };

    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    return () => window.removeEventListener("storage", checkAdmin);
  }, []);

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
        <Route element={<Layout />}>
		  <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/auth" element={<AuthUI />} />
		  <Route path="/forgot-password" element={<ForgotPassword />} />
		  <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/short-term" element={<RequireAuth><ShortTerm /></RequireAuth>} />
          <Route path="/medium-term" element={<RequireAuth><MediumTerm /></RequireAuth>} />
          <Route path="/long-term" element={<RequireAuth><LongTerm /></RequireAuth>} />
          <Route path="/tools" element={<RecommendedTools />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/new-post" element={<RequireAdmin><NewPost /></RequireAdmin>} />
        <Route path="/admin/edit/:slug" element={<RequireAdmin><EditPost /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
