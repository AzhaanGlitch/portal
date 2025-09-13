// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { IsMobileProvider } from "../context/IsMobileContext";
import { ScrollProvider } from "@/context/ScrollContext";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScroll from "@/context/SmoothScroll";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";

function PreWrapper({ children }: { children: React.ReactNode }) {
    return (
        <IsMobileProvider>
            <ScrollProvider>
                <SmoothScroll>{children}</SmoothScroll>
            </ScrollProvider>
        </IsMobileProvider>
    );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthRoute = pathname.startsWith("/auth");

    return isAuthRoute ? (
        <PreWrapper>{children}</PreWrapper>
    ) : (
        <AuthProvider>
            <PreWrapper>
                <Header />
                {children}
                <Footer />
            </PreWrapper>
        </AuthProvider>
    );
}
