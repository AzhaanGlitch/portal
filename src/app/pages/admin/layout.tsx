"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { name: "Events", href: "events" },
    { name: "Modules", href: "modules" },
    { name: "Services", href: "services" },
    { name: "Media", href: "media" },
    { name: "Feedback", href: "feedback" },
    { name: "Assign Access", href: "access" },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen p-6 text-white my-dark-bg">
            <br />
            <br />
            <br />
            <h2 className="text-2xl mb-4">Super Admin Dashboard</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                                }`}
                        >
                            {tab.name}
                        </Link>
                    );
                })}
            </div>

            {/* Page Content */}
            <div className="p-5 rounded-md bg-gray-900 shadow-md">{children}</div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}
