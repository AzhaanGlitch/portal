// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import { IsMobileProvider } from "../context/IsMobileContext";
import { ScrollProvider } from "@/context/ScrollContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ContentProvider } from '@/context/ContentContext';

function PreWrapper({ children }: { children: React.ReactNode }) {
    return (
        <IsMobileProvider>
            <ScrollProvider>
                {children}
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
            <ContentProvider>
                <PreWrapper>
                    <Header />
                    {children}
                    <Footer />
                </PreWrapper>
            </ContentProvider>
        </AuthProvider>
    );
}
