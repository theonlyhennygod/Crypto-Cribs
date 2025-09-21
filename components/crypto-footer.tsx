"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function CryptoFooter() {
  const socialLinks = [
    { name: "Discord", emoji: "💬", href: "#" },
    { name: "Twitter", emoji: "🐦", href: "#" },
    { name: "Telegram", emoji: "📱", href: "#" },
    { name: "GitHub", emoji: "⚡", href: "#" }
  ]

  const quickLinks = [
    { name: "How it Works", href: "#" },
    { name: "Properties", href: "#properties" },
    { name: "Rewards", href: "#" },
    { name: "Staking", href: "#" }
  ]

  const cryptoLinks = [
    { name: "XRPL Explorer", href: "https://testnet.xrpl.org" },
    { name: "Flare Network", href: "https://flare.network" },
    { name: "Token Contract", href: "#" },
    { name: "Audit Report", href: "#" }
  ]

  const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Risk Disclosure", href: "#" },
    { name: "Bug Bounty", href: "#" }
  ]

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/20 border-t border-border/50" suppressHydrationWarning>
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Crypto Cribs
                </span>
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                The future of travel is decentralized. Join the revolution where your money moves at light speed, 
                your privacy is protected, and your loyalty is actually rewarded.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  🔥 0% Platform Fees
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  ⚡ 3-5s Settlements
                </Badge>
              </div>

              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/50 hover:border-primary/30 hover:bg-primary/10"
                    >
                      {social.emoji}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Crypto Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Blockchain</h4>
            <ul className="space-y-3">
              {cryptoLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <Separator className="mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              © 2024 Crypto Cribs. Built with ❤️ for the Web3 community.
            </p>
            <p className="text-xs">
              ⚠️ Crypto investments carry risk. Only invest what you can afford to lose.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>XRPL Testnet</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Flare Coston2</span>
            </div>
          </div>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 text-xs text-muted-foreground/50"
        >
          <p>🚀 To the moon and beyond... but first, let's book that vacation 🌙</p>
        </motion.div>
      </div>
    </footer>
  )
}
