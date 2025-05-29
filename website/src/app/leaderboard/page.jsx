"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Award, Star, Gem } from "lucide-react";
import Image from "next/image";

const Leaderboard = ({ users }) => {
  // Sort users by badge count in descending order
  const sortedUsers = [...users].sort((a, b) => b.bages.length - a.bages.length);

  // Badge rank icons
  const rankIcons = [
    <Crown className="w-5 h-5 text-amber-400" />,
    <Gem className="w-5 h-5 text-purple-500" />,
    <Award className="w-5 h-5 text-blue-500" />,
    <Star className="w-5 h-5 text-yellow-400" />,
    <Star className="w-5 h-5 text-gray-400" />
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-amber-500" />
          <h2 className="text-2xl font-bold text-gray-900">Community Leaders</h2>
        </div>
        <p className="text-gray-600">
          Top contributors ranked by their badge collection
        </p>
      </motion.div>

      <div className="space-y-4">
        {sortedUsers.slice(0, 10).map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-all 
              ${index < 3 ? "bg-gradient-to-r from-white to-amber-50 border-amber-100" : "bg-white border-gray-100"} 
              hover:shadow-md hover:border-transparent`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold relative">
              {index < 5 ? rankIcons[index] : index + 1}
              {index < 3 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {index + 1}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                {index < 3 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full 
                    ${index === 0 ? "bg-amber-100 text-amber-800" : 
                      index === 1 ? "bg-purple-100 text-purple-800" : 
                      "bg-blue-100 text-blue-800"}`}>
                    {index === 0 ? "Legendary" : index === 1 ? "Elite" : "Pro"}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 font-bold text-sm">
                {user.bages.length}
              </div>
              <span className="text-sm text-gray-500">badges</span>
            </div>

            <div className="hidden md:flex items-center gap-2 ml-4">
              {user.bages.slice(0, 3).map((badge, badgeIndex) => (
                <motion.div
                  key={badgeIndex}
                  whileHover={{ scale: 1.1 }}
                  className="w-8 h-8 relative"
                >
                  <Image
                    src={badge.image || "/default-badge.png"}
                    alt={badge.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.target.src = "/default-badge.png";
                    }}
                  />
                </motion.div>
              ))}
              {user.bages.length > 3 && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">
                  +{user.bages.length - 3}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sortedUsers.length * 0.1 + 0.2 }}
        className="mt-8 text-center"
      >
        <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          View Full Leaderboard
        </button>
      </motion.div>
    </div>
  );
};

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('/api/badge/allusers');
        const data = await response.json();
        
        // Transform the data to match our component's expected structure
        const transformedUsers = data.map(user => ({
          ...user,
          name: user.name || 'Anonymous User',
          email: user.email || 'No email provided',
          bages: user.badges || [] // Ensure bages is always an array
        }));

        console.log(transformedUsers)
        
        setUsers(transformedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="mt-6 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Leaderboard users={users} />
    </div>
  );
}