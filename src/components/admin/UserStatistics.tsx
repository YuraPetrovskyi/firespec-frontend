"use client";

import { useState } from "react";

type UserStats = {
  total_users: number;
  active_users: number;
  inactive_users: number;
  admin_users: number;
  regular_users: number;
  pending_invitations: number;
};

type Props = {
  stats: UserStats;
};

export default function UserStatistics({ stats }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const cards = [
    {
      label: "Total Users",
      value: stats.total_users,
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      label: "Active Users",
      value: stats.active_users,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      label: "Inactive Users",
      value: stats.inactive_users,
      color: "bg-gray-500",
      icon: "⏸️",
    },
    {
      label: "Admins",
      value: stats.admin_users,
      color: "bg-purple-500",
      icon: "👑",
    },
    {
      label: "Regular Users",
      value: stats.regular_users,
      color: "bg-indigo-500",
      icon: "👤",
    },
    {
      label: "Pending Invitations",
      value: stats.pending_invitations,
      color: "bg-yellow-500",
      icon: "📧",
    },
  ];

  return (
    <>
      {/* Mobile: Summary Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white rounded-lg shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">
                {stats.total_users}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                User Statistics
              </h3>
              <p className="text-xs text-gray-500">
                {stats.active_users} active users
              </p>
            </div>
          </div>
          <svg
            className={`w-6 h-6 text-gray-600 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Mobile Modal */}
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-lg shadow-2xl p-6 w-11/12 max-w-sm mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  User Statistics
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
                  >
                    <div
                      className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}
                    >
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">
                        {card.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        {card.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop & Tablet: Compact Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`${card.color} w-8 h-8 rounded-full flex items-center justify-center text-lg`}
              >
                {card.icon}
              </div>
              <span className="text-lg font-bold text-gray-800">
                {card.value}
              </span>
            </div>
            <h3 className="text-xs font-medium text-gray-600">{card.label}</h3>
          </div>
        ))}
      </div>
    </>
  );
}
