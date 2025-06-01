// src/layouts/TopNavLayout.tsx

import TopNavigation from "@/components/TopNavigation";

const TopNavLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopNavigation />
      <main className="px-4 py-6 max-w-5xl mx-auto">{children}</main>
    </>
  );
};

export default TopNavLayout;
