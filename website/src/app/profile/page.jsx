"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  MessageCircle,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import IsSignedIn from "@/components/HOC/IsSignedIn";
import axios from "axios";

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [bages, setbages] = useState([])
  const [bageImages, setBageImages] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(true);
  
  useEffect(() => {
    const fetchAll = async () => {
      await fetchUserPosts();
      await fetchUserStats();
      setBadgesLoading(true);
      const userbages = await fetchUserBadges();
      setbages(userbages);

      // Fetch badge images
      const fetchedImages = [];
      for (const badge of userbages || []) {
        try {
          const response = await axios.get(badge.url, { maxRedirects: 5 });
          if (response.data?.image) {
            fetchedImages.push({
              name: badge.name,
              image: response.data.image
            });
          }
        } catch (error) {
          console.error(`Error fetching badge from ${badge.url}:`, error.message);
        }
      }
      setBageImages(fetchedImages);
      setBadgesLoading(false);
    };

    fetchAll();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch("/api/posts/user");
      const data = await response.json();
      setUserPosts(data.posts || []);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats");
      const data = await response.json();
      setStats(data.stats || stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchUserPosts();
        fetchUserStats();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Updated to match your posts API pattern
  async function fetchUserBadges() {
    try {
      const response = await fetch("/api/badge/currentUser");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log("Badges:", data.badges);
      return data.badges;
    } catch (error) {
      console.error("Failed to fetch badges:", error.message);
      return [];
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <IsSignedIn>
      <div className="mt-16 min-h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm border-b"
        >
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user?.firstName +
                    " " +
                    (user?.lastName ? user?.lastName : "") || "User"}
                </h1>
                <p className="text-gray-600">
                  {user?.email || "user@example.com"}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Calendar size={14} />
                  Joined{" "}
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium"
              >
                <Edit size={18} />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={24} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalPosts}
              </h3>
              <p className="text-gray-600">Posts Created</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart size={24} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalLikes}
              </h3>
              <p className="text-gray-600">Likes Received</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle size={24} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalComments}
              </h3>
              <p className="text-gray-600">Comments Received</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🏆</span>
                </div>
                Achievements
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {badgesLoading ? "..." : `${bageImages.length} earned`}
              </div>
            </div>
            
            {badgesLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 shadow-lg overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-pulse duration-1000" 
                         style={{
                           animation: 'shimmer 2s infinite',
                           background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                         }} />
                    
                    {/* Skeleton badge */}
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <div className="w-full h-full bg-gray-300 rounded-full animate-pulse" />
                      {/* Pulsing glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 to-purple-300/50 rounded-full animate-ping" 
                           style={{ animationDuration: '2s' }} />
                    </div>
                    
                    {/* Skeleton text */}
                    <div className="text-center">
                      <div className="h-3 bg-gray-300 rounded-full mx-auto animate-pulse" 
                           style={{ width: '60%' }} />
                    </div>
                    
                    {/* Loading dots */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" 
                           style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : bageImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {bageImages.map((badge, index) => (
                  <motion.div 
                    key={index}
                    initial={{ scale: 0, rotateY: 180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 10,
                      z: 50
                    }}
                    className="group relative"
                  >
                    {/* Glassmorphism container */}
                    <div className="relative bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/30">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Badge image container */}
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                        <div className="relative w-full h-full bg-zinc-700 rounded-full p-2 shadow-lg">
                          <Image
                            src={badge.image}
                            alt={badge.name || "Badge"}
                            fill
                            className="object-contain drop-shadow-sm"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        
                        {/* Sparkle effect */}
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs">✨</span>
                        </div>
                      </div>
                      
                      {/* Badge name */}
                      {badge.name && (
                        <div className="text-center">
                          <h3 className="text-xs font-semibold text-gray-800 truncate px-1 group-hover:text-gray-900 transition-colors duration-300">
                            {badge.name}
                          </h3>
                        </div>
                      )}
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                        {badge.name || "Achievement"}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Add more badges placeholder */}
                {Array.from({ length: Math.max(0, 6 - bageImages.length) }).map((_, index) => (
                  <motion.div
                    key={`placeholder-${index}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: (bageImages.length + index) * 0.1 }}
                    className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] hover:border-gray-400 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <span className="text-gray-400 text-lg">?</span>
                    </div>
                    <span className="text-xs text-gray-400 text-center">More to unlock</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No achievements yet</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Start creating posts, engaging with the community, and earning your first badges!
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Posts Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
              <Link href="/community/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Create New Post
                </motion.button>
              </Link>
            </div>

            {userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href={`/community/post/${post._id}`}>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">
                            {post.category}
                          </span>
                          {post.score && (
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp size={16} />
                              <span className="font-semibold">
                                {post.score}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r">
                        <p className="text-blue-800 text-sm line-clamp-2">
                          {post.question}
                        </p>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r">
                        <p className="text-green-800 text-sm line-clamp-2">
                          {post.answer}
                        </p>
                      </div>
                    </div>

                    {post.image && (
                      <div className="mb-4">
                        <Image
                          src={post.image || "/placeholder.svg"}
                          alt="Post visualization"
                          width={400}
                          height={200}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Heart size={16} />
                        <span>{post.likesCount || 0} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span>{post.commentsCount || 0} comments</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Share your first "What If" scenario with the community!
                </p>
                <Link href="/community/create">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium"
                  >
                    Create Your First Post
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </IsSignedIn>
  );
}
