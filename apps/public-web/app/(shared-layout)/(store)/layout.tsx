export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>Store Header</header>

      <main>{children}</main>
    </div>
  );
}
