import { NextResponse } from 'next/server'
import { weeklyUpdateGenerator } from '@/lib/content-automation/weekly-update-generator'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    // Generate the weekly update
    const update = await weeklyUpdateGenerator.generateWeeklyUpdate()
    
    // Create the blog post content
    const blogPostContent = `'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, TrendingUp, Building2, DollarSign } from 'lucide-react'
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm'

export default function ${update.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}() {
  return (
    <>
      <section className="bg-gradient-to-br from-gray-50 to-green-50 py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Market Update
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              ${update.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <time dateTime="${update.publishDate.toISOString()}">${update.publishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="prose prose-lg max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 mb-12 not-prose">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Summary</h2>
              <p className="text-gray-700 leading-relaxed">${update.summary}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">$${update.metrics.averagePricePerSqFt}</div>
                  <div className="text-sm text-gray-600 mt-1">Per Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${update.permitData.totalPermits}</div>
                  <div className="text-sm text-gray-600 mt-1">Permits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${update.marketTiming.score}</div>
                  <div className="text-sm text-gray-600 mt-1">Market Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${update.marketTiming.recommendation}</div>
                  <div className="text-sm text-gray-600 mt-1">Signal</div>
                </div>
              </div>
            </div>

            ${update.content.split('\n').map(line => {
              if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`
              if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`
              if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`
              if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`
              if (line.trim() === '') return '<br />'
              return `<p>${line}</p>`
            }).join('\n')}
          </motion.div>

          <motion.div 
            className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Weekly Market Updates
              </h3>
              <p className="text-gray-600">
                Never miss a market opportunity with our weekly intelligence reports
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <LeadCaptureForm source="WEEKLY_UPDATE_${update.id.toUpperCase()}" />
            </div>
          </motion.div>
        </div>
      </article>
    </>
  )
}
`

    // Create metadata
    const metadata = {
      title: update.seoTitle,
      description: update.seoDescription,
      keywords: update.keywords,
      publishDate: update.publishDate,
      slug: update.slug,
      id: update.id
    }

    // Save to blog directory
    const blogDir = join(process.cwd(), 'app', 'blog', update.slug)
    const metadataPath = join(blogDir, 'metadata.json')
    
    // For now, just return the generated content
    // In production, this would save files and trigger deployment
    
    return NextResponse.json({
      success: true,
      update: {
        ...update,
        blogPostContent
      },
      metadata
    })
  } catch (error) {
    console.error('Error generating weekly update:', error)
    return NextResponse.json(
      { error: 'Failed to generate weekly update' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to generate a weekly update'
  })
}