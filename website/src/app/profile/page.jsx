"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Heart, MessageCircle, Calendar, TrendingUp, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import IsSignedIn from "@/components/HOC/IsSignedIn"

export default function ProfilePage() {
  const [userPosts, setUserPosts] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
  })

  useEffect(() => {
    fetchUserPosts()
    fetchUserStats()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const response = await fetch("/api/posts/user")
      const data = await response.json()
      setUserPosts(data.posts || [])
      setUser(data.user)
    } catch (error) {
      console.error("Error fetching user posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats")
      const data = await response.json()
      setStats(data.stats || stats)
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUserPosts()
        fetchUserStats()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
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
              <h1 className="text-3xl font-bold text-gray-900">{user?.firstName  + " " + (user?.lastName ? user?.lastName : "")  || "User"}</h1>
              <p className="text-gray-600">{user?.email || "user@example.com"}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Calendar size={14} />
                Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
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
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalPosts}</h3>
            <p className="text-gray-600">Posts Created</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart size={24} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalLikes}</h3>
            <p className="text-gray-600">Likes Received</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalComments}</h3>
            <p className="text-gray-600">Comments Received</p>
          </div>
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
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize">{post.category}</span>
                        {post.score && (
                          <div className="flex items-center gap-1 text-green-600">
                            <TrendingUp size={16} />
                            <span className="font-semibold">{post.score}</span>
                          </div>
                        )}
                        <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
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
                      <p className="text-blue-800 text-sm line-clamp-2">{post.question}</p>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r">
                      <p className="text-green-800 text-sm line-clamp-2">{post.answer}</p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Share your first "What If" scenario with the community!</p>
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
  )
}
