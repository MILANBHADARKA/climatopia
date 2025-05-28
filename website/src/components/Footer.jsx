"use client"

import { motion } from "framer-motion"
import { Globe, Zap, Twitter, Github, Linkedin, Mail, ArrowUp, Heart } from "lucide-react"

export default function Footer() {
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API Docs", href: "#docs" },
      { name: "Integrations", href: "#integrations" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Press Kit", href: "#press" },
    ],
    resources: [
      { name: "Documentation", href: "#docs" },
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-white text-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              {/* Logo */}
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  {/* Replace with your actual logo */}
                  <img src="/logo.png" alt="CLIMATOPIA Logo" className="h-40 w-40 object-contain" />

                  {/* Optional animated icon (e.g., Zap) */}
                  <Zap className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
                </div>
              </motion.div>


              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Empowering humanity with AI-driven planet simulations. Make informed decisions about our shared future
                through cutting-edge technology and data science.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 group"
                  >
                    <social.icon className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-black font-semibold text-lg mb-6 capitalize">{category}</h3>
                  <ul className="space-y-4">
                    {links.map((link, linkIndex) => (
                      <motion.li key={linkIndex} whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <a
                          href={link.href}
                          className="text-gray-600 hover:text-black transition-colors duration-200 block"
                        >
                          {link.name}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-gray-600"
            >
              <span>© 2024 Climatopia Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for our planet.</span>
            </motion.div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Globe className="h-32 w-32 text-blue-400" />
        </motion.div>
      </div>

      <div className="absolute bottom-20 right-10 opacity-10">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Zap className="h-24 w-24 text-yellow-400" />
        </motion.div>
      </div>
    </footer>
  )
}
