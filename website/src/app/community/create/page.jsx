"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useEffect } from "react";
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import IsSignedIn from "@/components/HOC/IsSignedIn"

export default function CreatePostPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    question: "",
    answer: "",
    score: "",
    category: "other",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push('/sign-in');
  //   }
  // }, [isLoaded, isSignedIn, router]);

  const categories = [
    { value: "climate", label: "Climate" },
    { value: "economy", label: "Economy" },
    { value: "technology", label: "Technology" },
    { value: "society", label: "Society" },
    { value: "environment", label: "Environment" },
    { value: "other", label: "Other" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          submitData.append(key, formData[key])
        }
      })

      const response = await fetch("/api/posts", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        router.push("/community")
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <IsSignedIn>
    <div className="mt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b sticky top-16 z-10"
      >
        <div className=" max-w-4xl mx-auto px-4 py-4">
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
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600">Share your "What If" scenario with the community</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Post Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your scenario a catchy title..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">What If Question *</label>
              <div className="relative">
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="What if we could reduce global carbon emissions by 50% in the next 5 years?"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <div className="absolute top-3 right-3">
                  <Sparkles size={20} className="text-blue-400" />
                </div>
              </div>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Your Prediction/Analysis *</label>
              <textarea
                name="answer"
                value={formData.answer}
                onChange={handleInputChange}
                placeholder="Based on current trends and data, here's what might happen..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Score */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Impact Score (0-100)</label>
              <input
                type="number"
                name="score"
                value={formData.score}
                onChange={handleInputChange}
                placeholder="85"
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Rate the potential impact of your scenario (optional)</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Visualization (Optional)</label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload an image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Link href="/community" className="flex-1">
                <button
                  type="button"
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </Link>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Publishing...
                  </>
                ) : (
                  "Publish Post"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
    </IsSignedIn>
  )
}
