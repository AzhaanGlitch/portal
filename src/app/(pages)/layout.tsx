// app/(pages)/layout.tsx
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>

  );
}
