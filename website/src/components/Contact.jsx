"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, MapPin, Mail, Phone, Github, Twitter, Linkedin, Globe, MessageSquare, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    //use send mail function to send mail pass to:process.env.EMAIL_USER,subject,text,html

    const formData = new FormData(e.target)
    console.log("Form Data:", Object.fromEntries(formData.entries()))

    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")
    console.log(name, email, subject, message)

    const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    // const html = `
    //   <p><strong>Name:</strong> ${name}</p>
    //   <p><strong>Email:</strong> ${email}</p>
    //   <p><strong>Subject:</strong> ${subject}</p>
    //   <p><strong>Message:</strong></p>
    //   <p>${message}</p>
    // `

    const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
    <table style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <tr><td style="background: linear-gradient(to right, #3b82f6, #8b5cf6); color: #fff; padding: 24px; text-align: center;">
        <h2>📬 New Message Received</h2>
      </td></tr>
      <tr><td style="padding: 32px;">
        <p>You received a new message through your website contact form.</p>
        <p><strong>👤 Name:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> ${email}</p>
        <p><strong>📝 Subject:</strong> ${subject}</p>
        <p><strong>💬 Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        <p style="color: #888;">You can reply directly to this email to respond.</p>
      </td></tr>
      <tr><td style="background-color: #f1f5f9; text-align: center; padding: 16px; font-size: 12px; color: #999;">
        &copy; 2025 T3Coders. All rights reserved.
      </td></tr>
    </table>
  </body>
  </html>
`


    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: process.env.NEXT_PUBLIC_EMAIL_USER, // your email
          subject: `New message from ${name}: ${subject}`,
          text,
          html,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      alert("Message sent successfully!")
      e.target.reset()

      setIsSubmitting(false)
    } catch (error) {
      console.error("Error sending message:", error)
      alert("Failed to send message. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: "t3coders.org@gmail.com",
      href: "mailto:t3coders.org@gmail.com",
      description: "Drop us a line anytime",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 79848 58394",
      href: "tel:+917984858394",
      description: "Mon-Fri from 9am to 6pm",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Globe, href: "#", label: "Website" },
  ]

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="h-4 w-4" />
            <span>Let's Connect</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              collaborate?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a researcher, developer, or climate enthusiast, we'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Methods */}
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${method.color} p-3 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                <a
                  href={method.href}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  {method.value}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Send us a message</h3>
                <p className="text-gray-600">Fill out the form and we'll get back to you within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <Input
                      name="name"
                      placeholder="Your name"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </motion.div>
                </div>

                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input
                    name="subject"
                    placeholder="What's this about?"
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.02 }} className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <Textarea
                    name="message"
                    placeholder="Tell us about your vision..."
                    required
                    rows={5}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 lg:mt-40"
          >
            {/* Social Links */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Follow Us</h4>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                  >
                    <social.icon className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{social.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
