export default function JournalSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* fixed champagne paper background under everything */}
      <div className="fixed inset-0 -z-10 bg-[#FAF8F3]" />
      {children}
    </div>
  );
}
