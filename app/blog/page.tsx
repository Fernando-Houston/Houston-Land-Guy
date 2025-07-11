'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, User, Tag } from 'lucide-react'

// This would typically come from a CMS or database
const blogPosts = [
  {
    id: 'houston-development-market-report-q1-2024',
    title: 'Houston Development Market Report Q1 2024',
    excerpt: 'Comprehensive analysis of Houston\'s real estate development market trends, including permit activity, pricing dynamics, and emerging opportunities across Harris County.',
    category: 'Market Reports',
    author: 'Houston Development Intelligence',
    date: '2024-01-15',
    readTime: '12 min read',
    featured: true,
    tags: ['Market Analysis', 'Houston Real Estate', 'Development Trends'],
    slug: 'houston-development-market-report-q1-2024'
  },
  {
    id: 'complete-guide-houston-development-regulations',
    title: 'Complete Guide to Houston Development Regulations',
    excerpt: 'Everything developers need to know about Houston\'s unique no-zoning approach, permitting requirements, and development regulations for successful projects.',
    category: 'Guides',
    author: 'Houston Development Intelligence',
    date: '2024-01-10',
    readTime: '15 min read',
    featured: true,
    tags: ['Regulations', 'Zoning', 'Permits', 'Development Guide'],
    slug: 'complete-guide-houston-development-regulations'
  },
  {
    id: 'houston-vs-austin-development-comparison',
    title: 'Houston vs. Austin: Development Opportunity Comparison',
    excerpt: 'In-depth comparison of development opportunities, costs, and ROI potential between Houston and Austin markets for real estate developers and investors.',
    category: 'Market Analysis',
    author: 'Houston Development Intelligence',
    date: '2024-01-08',
    readTime: '10 min read',
    featured: false,
    tags: ['Market Comparison', 'Houston', 'Austin', 'Investment Analysis'],
    slug: 'houston-vs-austin-development-comparison'
  },
  {
    id: 'energy-sector-impact-houston-real-estate',
    title: 'Energy Sector Impact on Houston Real Estate Development',
    excerpt: 'How oil prices, renewable energy trends, and corporate relocations in the energy sector are shaping Houston\'s commercial and residential development landscape.',
    category: 'Industry Insights',
    author: 'Houston Development Intelligence',
    date: '2024-01-05',
    readTime: '8 min read',
    featured: false,
    tags: ['Energy Sector', 'Commercial Real Estate', 'Market Trends'],
    slug: 'energy-sector-impact-houston-real-estate'
  },
  {
    id: 'houston-transportation-projects-development',
    title: 'Houston Transportation Projects and Development Opportunities',
    excerpt: 'Major infrastructure projects including highway expansions, rail systems, and their impact on surrounding development opportunities.',
    category: 'Infrastructure',
    author: 'Houston Development Intelligence',
    date: '2024-01-03',
    readTime: '9 min read',
    featured: false,
    tags: ['Infrastructure', 'Transportation', 'Development Opportunities'],
    slug: 'houston-transportation-projects-development'
  }
]

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-green-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Houston Development Intelligence <span className="gradient-text">Blog</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Expert insights, market analysis, and development guides for Houston real estate professionals. 
              Stay informed with the latest trends, regulations, and opportunities in Harris County development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
            <p className="mt-2 text-lg text-gray-600">Essential reading for Houston developers and investors</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="feature-card group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Recent Articles</h2>
            <p className="mt-2 text-lg text-gray-600">Stay updated with the latest Houston development insights</p>
          </motion.div>

          <div className="space-y-8">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 sm:ml-6">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium"
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay Ahead of Houston Development Trends
            </h2>
            <p className="mt-4 text-lg text-green-100 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive market insights and development opportunities
            </p>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-semibold rounded-lg text-green-600 bg-white hover:bg-gray-50 transition-all shadow-lg"
              >
                Get Market Updates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  )
}