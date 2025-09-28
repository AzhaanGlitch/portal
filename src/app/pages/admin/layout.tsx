"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { name: "Media", href: "media" },
    { name: "Feedback", href: "feedback" },
    { name: "Assign Access", href: "access" },
    { name: "Modules", href: "modules" },
    { name: "Services", href: "services" },
    { name: "Events", href: "events" },
];

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const pathSegments = pathname.split("/");
    
    // Find which tab segment we're currently on
    const currentTabIndex = pathSegments.findIndex(segment => 
        tabs.some(tab => tab.href === segment)
    );
    
    // Create the base path by removing everything after the tab segment
    const basePath = currentTabIndex !== -1 
        ? pathSegments.slice(0, currentTabIndex).join("/")
        : pathSegments.join("/");

    return (
        <div className="min-h-screen p-6 text-white my-dark-bg">
            <br />
            <br />
            <br />

            {/* Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto flex-row-reverse">
                {tabs.map((tab) => {
                    // Replace the current tab with the new tab, or append if no tab exists
                    const tabHref = currentTabIndex !== -1 
                        ? `${basePath}/${tab.href}`
                        : `${pathname}/${tab.href}`;
                    
                    const isActive = pathSegments.includes(tab.href);
                    return (
                        <Link
                            key={tab.name}
                            href={tabHref}
                            className={`px-3 py-1 rounded-md font-medium transition-colors ${isActive
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
            <div className="p-5 rounded-md shadow-md">{children}</div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}