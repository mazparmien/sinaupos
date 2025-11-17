import React, { useState } from "react";

const cards = [
  {
    title: "Data",
    items: ["Data Engineering", "Data Warehouse", "Visualization", "Predictive Analytics"],
  },
  {
    title: "Creative",
    items: ["Brand Strategy", "Design System", "Storytelling", "Campaigns"],
  },
  {
    title: "Technology",
    items: ["Cloud Solutions", "AI/ML", "Cybersecurity", "App Development"],
  },
];

export default function CardSection() {
  const [expandedCard, setExpandedCard] = useState(null);

  return (
    <div className="flex justify-center gap-6 px-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          onClick={() =>
            setExpandedCard(expandedCard === idx ? null : idx)
          }
          className={`
            cursor-pointer transition-all duration-500 ease-in-out 
            ${expandedCard === idx ? "w-96 h-[28rem]" : "w-64 h-80"} 
            border border-black bg-[#E9EEF2] p-6 rounded-xl shadow-md flex flex-col
          `}
        >
          <h3 className="font-bold text-2xl mb-4">{card.title}</h3>

          {expandedCard === idx ? (
            <ul className="space-y-2">
              {card.items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center cursor-pointer hover:text-purple-600"
                >
                  <span>{item}</span>
                  <span>➔</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              <span>Click to expand ➔</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
