'use client'

import Link from "next/link";
import { ArrowRight, Calculator, TrendingUp, Building2, BarChart3, Users, CheckCircle } from "lucide-react";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh]">
        {/* Video Background - Desktop Only */}
        <div className="absolute inset-0 w-full h-full hidden md:block">
          <video
            id="hero-video"
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/thumbnails/thumbnail.jpg"
          >
            <source 
              src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/manifest/video.m3u8" 
              type="application/x-mpegURL" 
            />
            <source 
              src="https://customer-6njalxhlz5ulnoaq.cloudflarestream.com/df599a037464f8c9e45dc495484035ee/watch" 
              type="video/mp4" 
            />
          </video>
        </div>
        
        {/* Mobile Background - Static gradient */}
        <div className="absolute inset-0 w-full h-full md:hidden bg-gradient-to-br from-green-500 via-emerald-600 to-gray-900"></div>
        
        
        {/* Video Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        {/* Subtle Pattern Overlay for texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Houston&apos;s Premier Development
                <motion.span 
                  className="block text-3xl sm:text-4xl lg:text-5xl text-green-300 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Intelligence Platform
                </motion.span>
              </h1>
              <motion.p 
                className="mt-6 text-lg text-gray-100 lg:text-xl"
                {...fadeInUp}
                transition={{ delay: 0.4 }}
              >
                Discover exclusive <strong>Houston development opportunities</strong> and <strong>off-market land deals</strong> across Harris County. 
                Our advanced market intelligence platform provides <strong>Houston land development</strong> insights, 
                ROI calculators, and comprehensive analysis tools for builders, developers, and investors seeking 
                premium <strong>Harris County property</strong> investments.
              </motion.p>
              
              {/* Trust Indicators */}
              <motion.div 
                className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 justify-items-center"
                {...fadeInUp}
                transition={{ delay: 0.5 }}
              >
                <div className="text-white text-center">
                  <div className="text-3xl sm:text-4xl font-bold">$483M+</div>
                  <div className="text-sm opacity-90">in Transactions</div>
                </div>
                <div className="text-white text-center">
                  <div className="text-3xl sm:text-4xl font-bold">15+</div>
                  <div className="text-sm opacity-90">Years Experience</div>
                </div>
                <div className="text-white text-center">
                  <div className="text-3xl sm:text-4xl font-bold">1,200+</div>
                  <div className="text-sm opacity-90">Projects Analyzed</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-10 flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-4 sm:space-y-0"
                {...fadeInUp}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/roi-calculator"
                    className="cta-primary w-full sm:w-auto inline-flex items-center justify-center"
                  >
                    Try ROI Calculator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/intelligence"
                    className="cta-secondary w-full sm:w-auto inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                  >
                    View Market Intelligence
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                className="mt-6 flex flex-wrap justify-center items-center gap-6"
                {...fadeInUp}
                transition={{ delay: 0.7 }}
              >
                <div className="trust-badge text-white/90">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>No obligation</span>
                </div>
                <div className="trust-badge text-white/90">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>100% confidential</span>
                </div>
                <div className="trust-badge text-white/90">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Instant results</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Exclusive <span className="gradient-text">Houston Development Opportunities</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive <strong>Houston real estate</strong> intelligence and <strong>Harris County development</strong> tools 
              designed specifically for builders, developers, and investors in the Houston market.
            </p>
          </motion.div>
          
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Houston Land Development ROI Calculator',
                description: 'Calculate potential returns for Houston development projects with real-time Harris County market data and advanced financial modeling',
                icon: Calculator,
                bgClass: 'bg-green-100',
                iconClass: 'text-green-600',
              },
              {
                name: 'Houston Real Estate Market Intelligence',
                description: 'Access Houston development trends, Harris County permit data, pricing analysis, and neighborhood development potential updated daily',
                icon: TrendingUp,
                bgClass: 'bg-emerald-100',
                iconClass: 'text-emerald-600',
              },
              {
                name: 'Harris County Zoning Analysis',
                description: 'Instantly understand Houston zoning regulations, development restrictions, and compliance requirements for any Harris County property',
                icon: Building2,
                bgClass: 'bg-teal-100',
                iconClass: 'text-teal-600',
              },
              {
                name: 'Houston Development Feasibility Studies',
                description: 'Generate comprehensive feasibility reports for Houston development sites with construction costs, market comps, and ROI projections',
                icon: BarChart3,
                bgClass: 'bg-green-100',
                iconClass: 'text-green-700',
              },
              {
                name: 'Houston Builder Lots Network',
                description: 'Connect with vetted Houston contractors, architects, and development professionals specializing in Harris County projects',
                icon: Users,
                bgClass: 'bg-emerald-100',
                iconClass: 'text-emerald-700',
              },
              {
                name: 'Off-Market Houston Land Deals',
                description: 'Get exclusive access to off-market land opportunities and Houston development sites matching your investment criteria',
                icon: TrendingUp,
                bgClass: 'bg-green-100',
                iconClass: 'text-green-800',
              },
            ].map((feature) => (
              <motion.div
                key={feature.name}
                className="feature-card group"
                variants={fadeInUp}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <div className={`flex items-center justify-center h-12 w-12 rounded-md ${feature.bgClass} ${feature.iconClass} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
              variants={fadeInUp}
            >
              Ready to Transform Your Development Process?
            </motion.h2>
            <motion.p 
              className="mt-4 text-lg text-green-100 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Join hundreds of Houston builders using data-driven insights to maximize ROI and minimize risk
            </motion.p>
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/consultation"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
                >
                  Schedule Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/roi-calculator"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-base font-semibold rounded-lg text-white bg-transparent hover:bg-white hover:text-green-600 transition-all"
                >
                  Try Calculator First
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Trust Indicators */}
            <motion.div 
              className="mt-12 flex flex-wrap justify-center gap-8 text-white/90"
              variants={fadeInUp}
            >
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>30-minute consultation</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>Custom market analysis</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                <span>No obligation</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Lead Capture Section */}
      <motion.section 
        className="relative py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4">
              Get Your Free Analysis
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Instant access to ROI calculations and market insights for your next Houston development project
            </p>
            {/* Force deployment trigger */}
          </motion.div>
          
          <motion.div 
            className="max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative rounded-3xl p-8 shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
                WebkitBackdropFilter: 'blur(30px)'
              }}
            >
              <LeadCaptureForm source="BOTTOM_FORM" glassmorphism={true} />
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-center gap-4 text-sm text-white/70">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Trusted by 500+ developers</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}