import Sidebar from "@/components/Sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
