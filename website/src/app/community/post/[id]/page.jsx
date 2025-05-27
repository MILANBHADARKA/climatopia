"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, MessageCircle, Share2, Send, Trash2, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [likecomment, setlikecomment] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPost()
      fetchComments()
    }
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()
      setPost(data.post)
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`)
      const data = await response.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}/like`, {
        method: "POST",
      })
      if (response.ok) {
        fetchPost()
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment("")
        fetchComments()
        fetchPost() // Update comment count
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const response = await fetch(`/api/posts/comments/${commentId}/like`, {
        method: "POST",
      })
      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error("Error liking comment:", error)
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
          <Link href="/community">
            <button className="text-blue-500 hover:text-blue-600">Back to Community</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b sticky top-16 z-10"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/community">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Post Details</h1>
              </div>
            </div>

            {/* Delete button for post owner */}

          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-6"
        >
          {/* Post Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {post.author?.firstName?.charAt(0) || "U"}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">{post.author?.firstName + " " + (post.author?.lastName == undefined ? "" : post.author?.lastName) || "Anonymous"}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs capitalize font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            {post.score && (
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                <TrendingUp size={18} className="text-green-600" />
                <span className="text-green-700 font-bold text-lg">{post.score}</span>
              </div>
            )}
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

          {/* Post Content */}
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h4 className="font-bold text-blue-900 mb-3 text-lg">What If:</h4>
              <p className="text-blue-800 text-lg leading-relaxed">{post.question}</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
              <h4 className="font-bold text-green-900 mb-3 text-lg">Prediction:</h4>
              <p className="text-green-800 text-lg leading-relaxed whitespace-pre-wrap">{post.answer}</p>
            </div>

            {post.image && (
              <div className="rounded-lg overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt="Post visualization"
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-8 pt-6 mt-6 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <Heart size={20} className="fill-current" />
              <span className="font-medium">{post.likesCount || 0} Likes</span>
            </motion.button>

            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle size={20} />
              <span className="font-medium">{post.commentsCount || 0} Comments</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <Share2 size={20} />
              <span className="font-medium">Share</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Comments ({comments.length})</h3>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                {post.author?.firstName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this scenario..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-3">
                  <motion.button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                    whileHover={{ scale: submittingComment ? 1 : 1.05 }}
                    whileTap={{ scale: submittingComment ? 1 : 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {submittingComment ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send size={16} />
                    )}
                    Comment
                  </motion.button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author?.firstName?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{comment.author?.firstName + " " + (comment.author?.lastName == undefined ? "" : comment.author?.lastName) || "Anonymous"}</span>
                      <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLikeComment.bind(null, comment._id)}
                      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Heart size={20} className="fill-current" />
                      <span className="font-medium">{comment.likesCount || 0} Likes</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {comments.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
