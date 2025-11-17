import { useState } from "react";
import { Utensils, CupSoda, CakeSlice } from "lucide-react";

export default function CategoryTabs({ onChangeCategory }) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { label: "All Menu", value: "all" },
    { label: "Foods", value: "Foods", icon: <Utensils size={18} /> },
    { label: "Beverages", value: "Beverages", icon: <CupSoda size={18} /> },
    { label: "Dessert", value: "Dessert", icon: <CakeSlice size={18} /> },
  ];

  const handleTabClick = (value) => {
    setActiveTab(value);
    if (onChangeCategory) onChangeCategory(value);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex w-full gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value)}
            className={`flex flex-1 items-center justify-center gap-2 h-14 rounded-lg font-medium text-base transition-all duration-200
              ${
                activeTab === tab.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "border border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600"
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
