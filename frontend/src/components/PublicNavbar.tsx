// src/components/PublicNavbar.tsx
export default function PublicNavbar() {
  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center space-x-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} className="h-8 w-auto" alt="SmartStoxVest" />
          <span className="text-xl font-bold text-blue-900">SmartStoxVest</span>
        </div>
        <nav className="space-x-6 text-sm font-medium text-blue-700">
          <a href="#mission" className="hover:text-blue-500">Mission</a>
          <a href="#team" className="hover:text-blue-500">Team</a>
          <a href="#features" className="hover:text-blue-500">Features</a>
          <a href="#feedback" className="hover:text-blue-500">Feedback</a>
          <a href="#feedback" className="hover:text-blue-500">Blog</a>
		  <a href="#FAQ" className="hover:text-blue-500">FAQ</a>
          <a href="/SmartStoxVest_User_Manual.pdf" download className="text-blue-600 underline">User Manual</a>
        </nav>
      </div>
    </header>
  );
}
