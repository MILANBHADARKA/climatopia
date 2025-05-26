"use client"

import { motion } from "framer-motion"
import { Brain, Globe, Zap, BarChart3, Users, Shield, Sparkles, TrendingUp, Database } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Brain,
      title: "Multi-Agent AI",
      description:
        "Advanced reinforcement learning with thousands of AI agents simulating real-world interactions and behaviors.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: "Planet-Scale Modeling",
      description: "Comprehensive Earth system modeling including climate, economics, demographics, and geopolitics.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Lightning-fast simulations powered by distributed computing and optimized neural networks.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with interactive visualizations, trend analysis, and predictive modeling.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Share scenarios, collaborate with experts, and build upon community-driven simulations.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with encrypted data, secure APIs, and compliance with global standards.",
      gradient: "from-red-500 to-pink-500",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              simulate the future
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our cutting-edge platform combines the latest in AI, machine learning, and data science to provide
            unprecedented insights into complex global systems.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -10,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                {/* Floating decoration */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">{feature.description}</p>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <Database className="h-8 w-8 text-purple-600" />
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to explore infinite possibilities?</h3>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of researchers, policymakers, and innovators using EarthSim.AI to make data-driven
              decisions about our planet's future.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Start Your First Simulation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
