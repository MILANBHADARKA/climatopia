"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check, Zap, Star, ArrowRight, Sparkles, Clock, Users, Trophy, Shield, Headphones, Globe, X, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function PricingPage() {
    const { isSignedIn, user } = useUser()
    const [userCredits, setUserCredits] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [purchasedCredits, setPurchasedCredits] = useState(0)
    const [purchasedPlan, setPurchasedPlan] = useState(null)
    const router = useRouter()

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

    const faqs = [
        {
            question: "How do credits work?",
            answer: "Each AI question costs 10 credits. Credits never expire and can be used whenever you need climate insights."
        },
        {
            question: "Can I upgrade my plan anytime?",
            answer: "Yes! You can purchase additional credits anytime. Your existing credits will be added to your new purchase."
        },
        {
            question: "What types of questions can I ask?",
            answer: "Ask about climate projections, what-if scenarios, carbon emissions, sea level rise, temperature changes, and much more."
        },
        {
            question: "Is there a free trial?",
            answer: "New users automatically receive 50 free credits to explore our platform and experience the power of AI-driven climate insights."
        }
    ]

    const PaymentLoader = () => (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4"
                    >
                        <div className="text-center">
                            {/* Animated Credit Card Icon */}
                            <motion.div
                                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <CreditCard className="h-10 w-10 text-white" />
                            </motion.div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing Payment</h3>
                            <p className="text-gray-600 mb-6">Please complete the payment in the Razorpay window</p>

                            {/* Modern Loading Animation */}
                            <div className="flex justify-center space-x-2 mb-4">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                    animate={{
                                        width: ["0%", "70%", "0%"]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>

                            <p className="text-sm text-gray-500">
                                🔒 Your payment is secured with industry-standard encryption
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    // Success Modal Component
    const SuccessModal = () => (
        <AnimatePresence>
            {showSuccessModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={() => { setShowSuccessModal(false); setLoading(false); }}
                >
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => { setShowSuccessModal(false); setLoading(false); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="text-center">
                            {/* Success Animation */}
                            <motion.div
                                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mb-6 relative"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <CheckCircle className="h-12 w-12 text-white" />

                                {/* Confetti Effect */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                                        initial={{ scale: 0, x: 0, y: 0 }}
                                        animate={{
                                            scale: [0, 1, 0],
                                            x: Math.cos(i * 45 * Math.PI / 180) * 60,
                                            y: Math.sin(i * 45 * Math.PI / 180) * 60,
                                        }}
                                        transition={{
                                            duration: 1,
                                            delay: 0.5 + i * 0.1,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </motion.div>

                            <motion.h3
                                className="text-3xl font-bold text-gray-900 mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                Payment Successful! 🎉
                            </motion.h3>

                            <motion.div
                                className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex items-center justify-center space-x-3 mb-4">
                                    <Zap className="h-8 w-8 text-emerald-600" />
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-emerald-600">
                                            +{purchasedCredits}
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">
                                            Credits Added
                                        </div>
                                    </div>
                                </div>

                                {purchasedPlan && (
                                    <div className="text-center">
                                        <div className="text-lg font-semibold text-gray-900 mb-1">
                                            {purchasedPlan.name}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {purchasedPlan.usageType}
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                className="bg-blue-50 rounded-xl p-4 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Total Credits:</span>
                                    <span className="font-bold text-blue-600">{userCredits} Credits</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-gray-600">Questions Available:</span>
                                    <span className="font-bold text-purple-600">{Math.floor(userCredits / 10)} Questions</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <Button
                                    onClick={() => {
                                        setShowSuccessModal(false)
                                        router.push('/')
                                    }}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                                >
                                    Start Exploring Climate Data
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => { setShowSuccessModal(false); setLoading(false); }}
                                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Continue Shopping
                                </Button>
                            </motion.div>

                            <motion.p
                                className="text-xs text-gray-500 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                Receipt has been sent to your email address
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

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
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planType })
            })

            const orderData = await orderRes.json()

            if (!orderRes.ok) {
                throw new Error(orderData.error)
            }

            const selectedPlan = plans.find(plan => plan.type === planType)

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
                            await fetchUserCredits()
                            setPurchasedCredits(orderData.credits)
                            setPurchasedPlan(selectedPlan)
                            setShowSuccessModal(true)

                            // Dispatch custom event to notify other components (like Navbar)
                            window.dispatchEvent(new CustomEvent('creditUpdated'))
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
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false)
                    }
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.error('Payment error:', error)
            alert('Failed to initiate payment')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
            {/* Payment Loader */}
            <PaymentLoader />

            {/* Success Modal */}
            <SuccessModal />

            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden">
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
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200 text-gray-700 px-6 py-3 rounded-full text-sm font-medium mb-8"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Sparkles className="h-4 w-4 animate-pulse text-blue-600" />
                            <span>AI-Powered Climate Intelligence</span>
                            <Sparkles className="h-4 w-4 animate-pulse text-purple-600" />
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                Unlock Climate
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                                Intelligence
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Get instant AI-powered answers to complex climate questions. From temperature projections to carbon scenarios - explore what matters most.
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

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {plans.map((plan, index) => {
                            const IconComponent = plan.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 100, rotateX: -15 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{
                                        duration: 0.8,
                                        delay: index * 0.2,
                                        type: "spring",
                                        stiffness: 100
                                    }}
                                    whileHover={{
                                        y: -20,
                                        rotateY: 5,
                                        transition: { duration: 0.3 }
                                    }}
                                    className={`relative group ${plan.popular ? 'lg:scale-110 lg:-mt-8' : ''}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                                                {plan.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>

                                    <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl p-8 h-full overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
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

                                            <div className="mb-4">
                                                <div className="text-lg font-semibold text-blue-600 mb-1">{plan.usageType}</div>
                                                <div className="text-sm font-medium text-gray-600">{plan.costPerQuestion}</div>
                                                {plan.savings && (
                                                    <div className="inline-flex items-center mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                        💰 {plan.savings}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-baseline justify-center mb-6">
                                                <span className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                    ₹{plan.price}
                                                </span>
                                            </div>

                                            <div className={`bg-gradient-to-r ${plan.gradient} rounded-full p-4 mb-4`}>
                                                <div className="flex items-center justify-center space-x-2 text-white font-bold text-lg">
                                                    <Zap className="h-5 w-5" />
                                                    <span>{plan.credits} Credits</span>
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
                                                    {loading ? (
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        >
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                                        </motion.div>
                                                    ) : (
                                                        <>
                                                            Get Credits Now
                                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                        </>
                                                    )}
                                                </span>
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
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-300 text-emerald-700 px-6 py-3 rounded-full">
                            <Star className="h-5 w-5 animate-spin text-emerald-600" />
                            <span className="font-semibold">New users get 50 free credits to get started!</span>
                            <Star className="h-5 w-5 animate-spin text-emerald-600" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">Everything you need to know about our credit system</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-lg"
                            >
                                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </div>
    )
}
