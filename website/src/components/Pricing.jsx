"use client"

import { motion } from "framer-motion"
import { Zap, Star, ArrowRight, Sparkles, Brain, Globe, BarChart3, Lightbulb, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Pricing() {
    const { isSignedIn, user } = useUser()
    const [userCredits, setUserCredits] = useState(0)
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn && user) {
            fetchUserCredits()
        }
    }, [isSignedIn, user])

    const fetchUserCredits = async () => {
        try {
            const res = await fetch('/api/user/credits')
            if (res.ok) {
                const data = await res.json()
                setUserCredits(data.credits)
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error)
        }
    }

    return (
        <section id="get-started" className="relative py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-30, -60, -30],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                />
            ))}

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <motion.div
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Sparkles className="h-4 w-4 animate-pulse text-blue-600" />
                        <span>AI Climate Intelligence</span>
                        <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Unlock Climate
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                            Intelligence
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Ask complex climate questions and get AI-powered insights instantly. Each question costs just 10 credits.
                    </p>

                    {isSignedIn && (
                        <motion.div
                            className="inline-flex mb-10 items-center space-x-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-300 text-emerald-700 px-8 py-4 rounded-full text-lg font-semibold"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Zap className="h-6 w-6 animate-pulse text-emerald-600" />
                            <span>Your Credits: {userCredits}</span>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-3xl p-1 mb-20"
                >
                    <div className="bg-white rounded-3xl p-8 md:p-12">
                        <div className="text-center">
                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-6">
                                <Zap className="h-5 w-5 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700">Credit System</span>
                            </div>
                            
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Simple. Transparent. Powerful.
                            </h3>
                            
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Every question costs 10 credits. No subscriptions, no hidden fees. Pay for what you use and get instant access to climate intelligence.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">10</div>
                                    <div className="text-sm text-gray-600">Credits per question</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">50</div>
                                    <div className="text-sm text-gray-600">Free credits for new users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600 mb-2">∞</div>
                                    <div className="text-sm text-gray-600">Credits never expire</div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link href="/pricing">
                                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all group">
                                        View Pricing Plans
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                
                                {!isSignedIn && (
                                    <Link href="/sign-up">
                                        <Button variant="outline" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all">
                                            Start Free Trial
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-300 text-emerald-700 px-6 py-3 rounded-full">
                        <Star className="h-5 w-5 animate-spin text-emerald-600" />
                        <span className="font-semibold">Trusted by researchers and policymakers worldwide</span>
                        <Star className="h-5 w-5 animate-spin text-emerald-600" />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
