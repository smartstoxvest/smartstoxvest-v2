// src/App.tsx
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar"; // ✅ Make sure this path is correct

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Navbar /> {/* ✅ ADD THIS */}
      <AppRoutes />
    </>
  );
}

export default App;
