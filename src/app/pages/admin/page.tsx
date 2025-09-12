"use client";
import React, { useState } from "react";
import EventManager from "@/components/EventManager";
import ModuleManager from "@/components/ModuleManager";
import ServiceManager from "@/components/ServiceManager";
import MediaManager from "@/components/MediaManager";
import FeedbackViewer from "@/components/FeedbackViewer";
import AssignModuleAccess from "@/components/AssignModuleAccess";

const tabs = [
    { name: "Events", component: <EventManager /> },
    { name: "Modules", component: <ModuleManager /> },
    { name: "Services", component: <ServiceManager /> },
    { name: "Media", component: <MediaManager /> },
    { name: "Feedback", component: <FeedbackViewer /> },
    { name: "Assign Access", component: <AssignModuleAccess /> },
];

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen p-6  text-white my-dark-bg" >
            <br /><br /><br />
            <h2 className="text-2xl mb-4">Super Admin Dashboard</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === index
                                ? "bg-blue-600 text-white"
                                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Active Tab Content */}
            <div className="p-5 rounded-md bg-gray-900 shadow-md" >
                {tabs[activeTab].component}
            </div>
            <br /><br /><br /><br />
        </div>
    );
};

export default SuperAdminDashboard;
