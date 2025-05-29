"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Star, Users, Award } from "lucide-react";
import Image from "next/image";

const Leaderboard = ({ users }) => {
  // Sort users by badge count in descending order
  const sortedUsers = [...users].sort((a, b) => b.bages.length - a.bages.length);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Leaderboard</h1>
            <p className="text-gray-600 text-lg">Top environmental champions</p>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {sortedUsers.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.email}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className={`relative p-6 rounded-2xl border-2 text-center ${
              index === 0 
                ? 'bg-gradient-to-b from-yellow-50 to-amber-50 border-yellow-200' 
                : index === 1 
                ? 'bg-gradient-to-b from-gray-50 to-slate-50 border-gray-200'
                : 'bg-gradient-to-b from-orange-50 to-red-50 border-orange-200'
            }`}
          >
            {/* Rank Badge */}
            <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
              index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
            }`}>
              {index === 0 ? <Crown className="w-4 h-4 text-white" /> :
               index === 1 ? <Medal className="w-4 h-4 text-white" /> :
               <Award className="w-4 h-4 text-white" />}
            </div>

            {/* User Avatar */}
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
              index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
              'bg-gradient-to-r from-orange-400 to-red-500'
            }`}>
              {user.name?.charAt(0) || 'U'}
            </div>

            {/* User Info */}
            <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-600 mb-4 truncate">{user.email}</p>

            {/* Badge Count */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              index === 0 ? 'bg-yellow-100 text-yellow-800' :
              index === 1 ? 'bg-gray-100 text-gray-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              <Star className="w-4 h-4" />
              <span className="font-semibold">{user.bages.length} badges</span>
            </div>

            {/* Recent Badges Preview */}
            {user.bages.length > 0 && (
              <div className="flex justify-center mt-4 gap-2">
                {user.bages.slice(0, 3).map((badge, badgeIndex) => (
                  <div key={badgeIndex} className="w-8 h-8 relative bg-zinc-600 rounded-lg p-1 shadow-sm">
                    <Image
                      src={badge.image || "/default-badge.png"}
                      alt={badge.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
                {user.bages.length > 3 && (
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-medium text-gray-600">
                    +{user.bages.length - 3}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Rest of the list */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">All Champions</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedUsers.map((user, index) => (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index < 3 
                      ? index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0) || 'U'}
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-48">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Badges Preview */}
                  <div className="hidden sm:flex items-center gap-1">
                    {user.bages.slice(0, 3).map((badge, badgeIndex) => (
                      <div key={badgeIndex} className="w-6 h-6 relative bg-zinc-600 rounded border shadow-sm">
                        <Image
                          src={badge.image || "/default-badge.png"}
                          alt={badge.name}
                          fill
                          className="object-contain p-0.5"
                        />
                      </div>
                    ))}
                    {user.bages.length > 3 && (
                      <span className="text-xs text-gray-500 ml-1">+{user.bages.length - 3}</span>
                    )}
                  </div>

                  {/* Badge Count */}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                    <Star className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-700 text-sm">{user.bages.length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-6 border-t border-gray-100 text-center">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
            View All Rankings
          </button>
        </div>
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
    <div className="mt-16 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Leaderboard users={users} />
    </div>
  );
}