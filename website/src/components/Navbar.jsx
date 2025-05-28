"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import {
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react"
import { useAuth } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useEffect } from "react"
import useCredit from "@/providers/UserCredit"
import MetaMaskGate from "./MetaMaskGate"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMetaMaskGate, setShowMetaMaskGate] = useState(false)
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const pathname = usePathname()
  const { userCredits, setUserCredits } = useCredit()

  const allNavItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
    { name: "Pricing", href: "/pricing" },
    { name: "WhatIF", href: "/WhatIF" },
    { name: "Community", href: "/community" },
    { name: "Profile", href: "/profile" },
  ]

  // Filter nav items based on current route
  const navItems = allNavItems.filter((item) => {
    if (pathname === "/") {
      return true // Show all items on home page
    } else {
      return item.name !== "Features" && item.name !== "Contact"
    }
  })

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

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUserCredits()

      // Listen for custom credit update events
      const handleCreditUpdate = () => {
        fetchUserCredits()
      }

      window.addEventListener('creditUpdated', handleCreditUpdate)

      return () => {
        window.removeEventListener('creditUpdated', handleCreditUpdate)
      }
    }
  }, [isSignedIn, user])

  // Listen for focus events to refresh credits when user comes back to tab
  useEffect(() => {
    const handleFocus = () => {
      if (isSignedIn && user) {
        fetchUserCredits()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isSignedIn, user])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="CLIMATOPIA Logo"
                className="h-40 w-40 object-contain"
              />
              <Zap className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons or User Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-full border border-blue-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowMetaMaskGate(true)}
                  title="Connect MetaMask"
                >
                  <span className="text-sm font-semibold text-gray-700">
                    MetaMask
                  </span>
                </motion.div>

                {/* Credits Display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 rounded-full border border-blue-200 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-green-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {userCredits} Credits
                  </span>
                </motion.div>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                      Sign In
                    </Button>
                  </SignInButton>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignUpButton mode="modal">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                      Get Started
                    </Button>
                  </SignUpButton>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              <div className="pt-4 space-y-2">
                {isSignedIn ? (
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl border border-blue-200 cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMetaMaskGate(true)}
                    >
                      <motion.div
                        className="w-2 h-2 bg-green-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm font-semibold text-gray-700">
                        {userCredits} Credits Available
                      </span>
                    </motion.div>
                    <div className="flex justify-center">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                ) : (
                  <>
                    <SignInButton mode="modal">
                      <Button variant="ghost" className="w-full text-gray-700">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        Get Started
                      </Button>
                    </SignUpButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MetaMask Gate Modal */}
      <AnimatePresence>
        {showMetaMaskGate && (
          <MetaMaskGate onClose={() => setShowMetaMaskGate(false)} />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}