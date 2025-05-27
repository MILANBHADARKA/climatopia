"use client"

import { motion } from "framer-motion"
import { Check, Zap, Star, ArrowRight, Sparkles, Clock, Users, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';


export default function Pricing() {
    const { isSignedIn, user } = useUser()
    const [userCredits, setUserCredits] = useState(0)
    const [loading, setLoading] = useState(false)
    const router = useRouter();


    const plans = [
        {
            type: "basic",
            name: "Basic Pack",
            price: 99,
            credits: 100,
            costPerQuestion: "₹9.9 per question",
            usageType: "Casual Explorer",
            popular: false,
            gradient: "from-blue-500 via-cyan-500 to-teal-500",
            icon: Clock,
            badge: "Starter",
            color: "blue"
        },
        {
            type: "standard",
            name: "Standard Pack",
            price: 139,
            credits: 150,
            costPerQuestion: "₹9.3 per question",
            usageType: "Regular Researcher",
            popular: true,
            gradient: "from-purple-500 via-pink-500 to-rose-500",
            icon: Users,
            badge: "Popular",
            color: "purple",
            savings: "Save ₹9!"
        },
        {
            type: "premium",
            name: "Premium Pack",
            price: 449,
            credits: 500,
            costPerQuestion: "₹8.9 per question",
            usageType: "Climate Analyst",
            popular: false,
            gradient: "from-emerald-500 via-green-500 to-lime-500",
            icon: Trophy,
            badge: "Pro",
            color: "emerald",
            savings: "Save ₹51!"
        }
    ]

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

    const handleSubscribe = async (planType) => {
        if (!isSignedIn) {
            router.push('/sign-in')
            return
        }

        setLoading(true)

        try {
            // Create Razorpay order
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType })
            })

            const orderData = await orderRes.json()

            if (!orderRes.ok) {
                throw new Error(orderData.error)
            }

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Climatopia',
                description: `${orderData.credits} Credits`,
                order_id: orderData.orderId,
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch('/api/orders/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(response)
                        })

                        if (verifyRes.ok) {
                            alert('Payment successful! Credits added to your account.')
                            fetchUserCredits() // Refresh credits
                        } else {
                            alert('Payment verification failed')
                        }
                    } catch (error) {
                        console.error('Verification error:', error)
                        alert('Payment verification failed')
                    }
                },
                prefill: {
                    name: user?.fullName,
                    email: user?.emailAddresses[0]?.emailAddress
                },
                theme: {
                    color: '#3B82F6'
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Payment error:', error)
            alert('Failed to initiate payment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="pricing" className="relative py-32 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gray-400/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-20, -40, -20],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
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
                        <span>Credit Packages</span>
                        <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                            Power Up Your
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                            Climate Journey
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Unlock the mysteries of climate change with AI-powered insights. Each question costs 10 credits.
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {plans.map((plan, index) => {
                        const IconComponent = plan.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 100, rotateX: -15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                    type: "spring",
                                    stiffness: 100
                                }}
                                viewport={{ once: true }}
                                whileHover={{
                                    y: -20,
                                    rotateY: 5,
                                    transition: { duration: 0.3 }
                                }}
                                className={`relative group ${plan.popular ? 'lg:scale-110 lg:-mt-8' : ''
                                    }`}
                            >
                                {/* Glowing Border Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 h-full overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
                                    {/* Card Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-transparent"></div>
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-32 h-32 border border-gray-200/30 rounded-full"
                                                style={{
                                                    top: `${-20 + i * 20}%`,
                                                    right: `${-20 + i * 15}%`,
                                                }}
                                            ></div>
                                        ))}
                                    </div>

                                    <div className="relative text-center mb-8">
                                        <motion.div
                                            className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${plan.gradient} mb-6 shadow-2xl`}
                                            whileHover={{
                                                scale: 1.1,
                                                rotate: 360
                                            }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <IconComponent className="h-10 w-10 text-white" />
                                        </motion.div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        
                                        {/* Usage Type & Cost Per Question */}
                                        <div className="mb-4">
                                            <div className="text-lg font-semibold text-blue-600 mb-1">{plan.usageType}</div>
                                            <div className="text-sm font-medium text-gray-600">{plan.costPerQuestion}</div>
                                            {plan.savings && (
                                                <div className="inline-flex items-center mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                    💰 {plan.savings}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-baseline justify-center mb-4">
                                            <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                ₹{plan.price}
                                            </span>
                                        </div>

                                        {/* Credit Visualization */}
                                        <div className="relative mb-6">
                                            <div className={`bg-gradient-to-r ${plan.gradient} rounded-full p-4 mb-2`}>
                                                <div className="flex items-center justify-center space-x-2 text-white font-bold text-lg">
                                                    <Zap className="h-5 w-5" />
                                                    <span>{plan.credits} Credits</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500 mb-2">
                                                = {Math.floor(plan.credits / 10)} AI-Powered Questions
                                            </div>
                                            
                                            {/* Question Examples */}
                                            <div className="text-xs text-gray-400 italic">
                                                "What if CO₂ levels double?" • "What if sea levels rise 2m?"
                                            </div>

                                            {/* Credit Bar Visualization */}
                                            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className={`h-full bg-gradient-to-r ${plan.gradient}`}
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${(plan.credits / 500) * 100}%` }}
                                                    transition={{ duration: 1.5, delay: index * 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button
                                            onClick={() => handleSubscribe(plan.type)}
                                            disabled={loading}
                                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-500 group relative overflow-hidden ${plan.popular
                                                ? `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-2xl hover:shadow-purple-500/25`
                                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 hover:border-gray-400'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                {loading ? 'Processing...' : 'Get Credits Now'}
                                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                            {plan.popular && (
                                                <motion.div
                                                    className="absolute inset-0 bg-white/20"
                                                    initial={{ x: '-100%' }}
                                                    whileHover={{ x: '100%' }}
                                                    transition={{ duration: 0.6 }}
                                                />
                                            )}
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-300 text-emerald-700 px-6 py-3 rounded-full">
                        <Star className="h-5 w-5 animate-spin text-emerald-600" />
                        <span className="font-semibold">New users get 50 free credits to get started!</span>
                        <Star className="h-5 w-5 animate-spin text-emerald-600" />
                    </div>
                </motion.div>
            </div>

            {/* Load Razorpay script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </section>
    )
}
