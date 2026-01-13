export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      {children}
    </div>
  );
}
