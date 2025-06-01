import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TopNavigation from "@/components/TopNavigation";

const Footer = () => (
  <footer className="text-center text-sm py-6 border-t mt-10 dark:border-gray-700 text-gray-600 dark:text-gray-400">
    © {new Date().getFullYear()} SmartStoxVest. Built with ☕ + 🔥
  </footer>
);

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return show ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
      title="Back to top"
    >
      ⬆️
    </button>
  ) : null;
};

const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <TopNavigation />
      <main className="flex-grow px-4 py-6 max-w-5xl mx-auto text-gray-800 dark:text-gray-100">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default TopNavLayout;
