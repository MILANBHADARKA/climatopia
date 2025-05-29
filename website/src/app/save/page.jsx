"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookmarkIcon,
  Plus,
  Filter,
  Edit,
  Trash2,
  MessageSquare,
  TrendingUp,
  Clock,
  Send,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"
import Toast from "@/components/Toast"
import IsSignedIn from "@/components/HOC/IsSignedIn"

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("whatifs")
  const [savedWhatIfs, setSavedWhatIfs] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  useEffect(() => {
    fetchSavedItems()
  }, [activeTab, filter])

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
  }

  const fetchSavedItems = async () => {
    try {
      setLoading(true)

      if (activeTab === "whatifs") {
        const params = new URLSearchParams()
        if (filter !== "all") {
          if (filter === "posted") {
            params.append("isPosted", "true")
          } else if (filter === "drafts") {
            params.append("isPosted", "false")
          } else {
            params.append("category", filter)
          }
        }

        const response = await fetch(`/api/saved/whatifs?${params}`)
        const data = await response.json()
        setSavedWhatIfs(data.whatifs || [])
      } else {
        const response = await fetch("/api/saved/posts")
        const data = await response.json()
        setSavedPosts(data.savedPosts || [])
      }
    } catch (error) {
      console.error("Error fetching saved items:", error)
      showToast("Failed to load saved items", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWhatIf = async (id) => {
    if (!confirm("Are you sure you want to delete this what-if?")) return

    try {
      const response = await fetch(`/api/saved/whatifs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSavedItems()
        showToast("What-if deleted successfully")
      }
    } catch (error) {
      console.error("Error deleting what-if:", error)
      showToast("Failed to delete what-if", "error")
    }
  }

  const handlePostToCommunity = async (whatifId) => {
    try {
      const response = await fetch(`/api/saved/whatifs/${whatifId}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        fetchSavedItems()
        showToast("Posted to community successfully!")
      }
    } catch (error) {
      console.error("Error posting to community:", error)
      showToast("Failed to post to community", "error")
    }
  }

  const handleRemoveSavedPost = async (id) => {
    if (!confirm("Are you sure you want to remove this saved post?")) return

    try {
      const response = await fetch(`/api/saved/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchSavedItems()
        showToast("Post removed from saved")
      }
    } catch (error) {
      console.error("Error removing saved post:", error)
      showToast("Failed to remove saved post", "error")
    }
  }

  const categories = [
    { value: "all", label: "All" },
    { value: "drafts", label: "Drafts" },
    { value: "posted", label: "Posted" },
    { value: "climate", label: "Climate" },
    { value: "economy", label: "Economy" },
    { value: "technology", label: "Technology" },
    { value: "society", label: "Society" },
    { value: "environment", label: "Environment" },
  ]

  if (loading) {
    return (
      <div className="mt-16 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
        className="bg-white shadow-sm border-b sticky top-0 z-10"
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
              <p className="text-gray-600">Manage your saved what-if scenarios and community posts</p>
            </div>
            <Link href="/saved/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full flex items-center gap-2 font-medium shadow-lg"
              >
                <Plus size={20} />
                New What-If
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-1 mb-6 inline-flex"
        >
          <button
            onClick={() => setActiveTab("whatifs")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "whatifs"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={18} />
              What-If Scenarios
            </div>
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "posts"
                ? "bg-blue-500 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookmarkIcon size={18} />
              Saved Posts
            </div>
          </button>
        </motion.div>

        {/* Filters for What-Ifs */}
        {activeTab === "whatifs" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4 mb-6"
          >
            <div className="flex items-center gap-4">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "whatifs" ? (
            <motion.div
              key="whatifs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {savedWhatIfs.length > 0 ? (
                savedWhatIfs.map((whatif, index) => (
                  <motion.div
                    key={whatif._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{whatif.title}</h3>
                          {whatif.isPosted && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Posted
                            </span>
                          )}
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm capitalize">
                            {whatif.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(whatif.createdAt).toLocaleDateString()}
                          </div>
                          {whatif.score && (
                            <div className="flex items-center gap-1">
                              <TrendingUp size={14} />
                              Score: {whatif.score}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!whatif.isPosted && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePostToCommunity(whatif._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                          >
                            <Send size={16} />
                            Post to Community
                          </motion.button>
                        )}

                        

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteWhatIf(whatif._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">What If:</h4>
                        <p className="text-blue-800">{whatif.question}</p>
                      </div>

                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <h4 className="font-semibold text-green-900 mb-2">Analysis:</h4>
                        <p className="text-green-800 line-clamp-3">{whatif.answer}</p>
                      </div>
                    </div>

                    {whatif.tags && whatif.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {whatif.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved what-ifs yet</h3>
                  <p className="text-gray-600 mb-6">Start creating your own what-if scenarios!</p>
                  <Link href="/saved/create">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium"
                    >
                      Create Your First What-If
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="posts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {savedPosts.length > 0 ? (
                savedPosts.map((savedPost, index) => (
                  <motion.div
                    key={savedPost._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Link href={`/community/post/${savedPost.post._id}`}>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {savedPost.post.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {savedPost.post.author?.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-sm text-gray-600">{savedPost.post.author?.name}</span>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs capitalize">
                            {savedPost.post.category}
                          </span>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            Saved {new Date(savedPost.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveSavedPost(savedPost._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                        <p className="text-blue-800 text-sm line-clamp-2">{savedPost.post.question}</p>
                      </div>
                      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                        <p className="text-green-800 text-sm line-clamp-2">{savedPost.post.answer}</p>
                      </div>
                    </div>

                    {savedPost.notes && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-lg mb-4">
                        <h4 className="font-semibold text-yellow-900 mb-1">Your Notes:</h4>
                        <p className="text-yellow-800 text-sm">{savedPost.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={16} />
                        <span>Score: {savedPost.post.score || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={16} />
                        <span>{savedPost.post.commentsCount || 0} comments</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookmarkIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved posts yet</h3>
                  <p className="text-gray-600 mb-6">Save interesting posts from the community to read later!</p>
                  <Link href="/community">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium"
                    >
                      Explore Community
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
    </IsSignedIn>
  )
}
