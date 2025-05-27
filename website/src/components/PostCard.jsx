"use client"

import { motion } from "framer-motion"
import { Heart, MessageCircle, Share2, Clock, TrendingUp, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export default function PostCard({ post, onLike }) {
  const [isLiking, setIsLiking] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    await onLike(post._id)
    setIsLiking(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.question,
          url: `${window.location.origin}/community/post/${post._id}`,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/community/post/${post._id}`)
      alert("Link copied to clipboard!")
    }
  }

  // Get author avatar or create initials
  const getAuthorAvatar = () => {
    if (post.author?.avatar) {
      return post.author.avatar
    }
    return null
  }

  const getAuthorInitials = () => {
    return post.author?.firstName?.charAt(0) || post.author?.lastName?.charAt(0) || "U"
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        {/* Post Header */}
        <Link href={`/community/profile/${post.author?._id}`}>
          <div className="hover:cursor-pointer hover:scale-105 hover:p-6 hover:bg-gray-100 flex items-center justify-between mb-4">
            <div className="hover:scale-105 hover:bg-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {getAuthorAvatar() ? (
                  <Image
                    src={getAuthorAvatar() || "/placeholder.svg"}
                    alt={post.author?.firstName || "User"}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {getAuthorInitials()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.author?.firstName + " " + (post.author?.lastName == undefined ? "" : post.author?.lastName) || "Anonymous"}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  {new Date(post.createdAt).toLocaleDateString()}
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs capitalize">{post.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {post.score && (
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-green-700 font-semibold">{post.score}</span>
                </div>
              )}


            </div>
          </div>
        </Link>

        {/* Post Content */}
        <Link href={`/community/post/${post._id}`}>
          <div className="cursor-pointer">
            <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">{post.title}</h2>

            <div className="mb-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-3">
                <h4 className="font-semibold text-blue-900 mb-1">What If:</h4>
                <p className="text-blue-800 line-clamp-2">{post.question}</p>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h4 className="font-semibold text-green-900 mb-1">Prediction:</h4>
                <p className="text-green-800 line-clamp-3">{post.answer}</p>
              </div>
            </div>

            {post.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt="Post visualization"
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </Link>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 transition-colors ${isLiking ? "text-gray-400" : "text-gray-600 hover:text-red-500"
                }`}
            >
              <Heart size={18} className="fill-current" />
              <span className="font-medium">{post.likesCount || 0}</span>
            </motion.button>

            <Link href={`/community/post/${post._id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
              >
                <MessageCircle size={18} />
                <span className="font-medium">{post.commentsCount || 0}</span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Share2 size={18} />
              <span className="font-medium">Share</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
