'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, MessageCircle, Share2, Send, Image as ImageIcon, Hash,
  Users, TrendingUp, Shield, MoreHorizontal,
  ThumbsUp, ThumbsDown, Bookmark, Eye, Building2
} from 'lucide-react'
import { socialFeatures } from '@/lib/services/social-features'
import Link from 'next/link'
import Image from 'next/image'

interface Post {
  id: string
  authorId: string
  author?: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  images?: string[]
  propertyId?: string
  tags: string[]
  likes: string[]
  comments: any[]
  createdAt: Date
  visibility: string
}

interface MarketInsight {
  id: string
  authorId: string
  author?: any
  title: string
  content: string
  category: string
  area?: string
  metrics?: Record<string, any>
  votes: { up: string[]; down: string[] }
  verified: boolean
  createdAt: Date
}

export default function SocialFeed() {
  const [activeTab, setActiveTab] = useState<'feed' | 'insights' | 'groups'>('feed')
  const [posts, setPosts] = useState<Post[]>([])
  const [insights, setInsights] = useState<MarketInsight[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [newPostContent, setNewPostContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentUserId] = useState('user1') // Mock current user

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Initialize sample data
      await socialFeatures.initializeSampleData()
      
      if (activeTab === 'feed') {
        const feedPosts = await socialFeatures.getFeed(currentUserId)
        setPosts(feedPosts)
      } else if (activeTab === 'insights') {
        const trendingInsights = await socialFeatures.getTrendingInsights()
        setInsights(trendingInsights)
      } else if (activeTab === 'groups') {
        const userGroups = await socialFeatures.getGroups(currentUserId, 'all')
        setGroups(userGroups)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return
    
    try {
      const post = await socialFeatures.createPost(currentUserId, newPostContent)
      setPosts([post, ...posts])
      setNewPostContent('')
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  const handleLikePost = async (postId: string) => {
    await socialFeatures.likePost(postId, currentUserId)
    setPosts(posts.map(post => {
      if (post.id === postId && !post.likes.includes(currentUserId)) {
        return { ...post, likes: [...post.likes, currentUserId] }
      }
      return post
    }))
  }

  const handleVoteInsight = async (insightId: string, voteType: 'up' | 'down') => {
    await socialFeatures.voteOnInsight(insightId, currentUserId, voteType)
    setInsights(insights.map(insight => {
      if (insight.id === insightId) {
        const newVotes = { ...insight.votes }
        
        // Remove from opposite vote
        const oppositeVote = voteType === 'up' ? 'down' : 'up'
        newVotes[oppositeVote] = newVotes[oppositeVote].filter(id => id !== currentUserId)
        
        // Add to current vote if not already voted
        if (!newVotes[voteType].includes(currentUserId)) {
          newVotes[voteType] = [...newVotes[voteType], currentUserId]
        }
        
        return { ...insight, votes: newVotes }
      }
      return insight
    }))
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const renderPost = (post: Post) => (
    <motion.div
      key={post.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
            {post.author?.avatar ? (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-gray-600">
                {post.author?.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="capitalize">{post.author?.role}</span>
              <span>•</span>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/social/tags/${tag}`}
                className="text-purple-600 hover:text-purple-700 text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4 rounded-lg overflow-hidden">
          {post.images.map((image, index) => (
            <div key={index} className="relative aspect-video bg-gray-100">
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Property Link */}
      {post.propertyId && (
        <Link
          href={`/properties/${post.propertyId}`}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg mb-4 hover:bg-gray-100 transition-colors"
        >
          <Building2 className="h-5 w-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">View Property Details</p>
            <p className="text-xs text-gray-600">Click to see full listing</p>
          </div>
        </Link>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleLikePost(post.id)}
            className={`flex items-center space-x-2 ${
              post.likes.includes(currentUserId)
                ? 'text-purple-600'
                : 'text-gray-600 hover:text-purple-600'
            } transition-colors`}
          >
            <Heart
              className={`h-5 w-5 ${
                post.likes.includes(currentUserId) ? 'fill-current' : ''
              }`}
            />
            <span className="text-sm font-medium">{post.likes.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        <button className="text-gray-600 hover:text-purple-600 transition-colors">
          <Bookmark className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  )

  const renderInsight = (insight: MarketInsight) => {
    const netVotes = insight.votes.up.length - insight.votes.down.length
    const hasUpvoted = insight.votes.up.includes(currentUserId)
    const hasDownvoted = insight.votes.down.includes(currentUserId)

    return (
      <motion.div
        key={insight.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-start space-x-4">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-2">
            <button
              onClick={() => handleVoteInsight(insight.id, 'up')}
              className={`p-2 rounded-lg transition-colors ${
                hasUpvoted
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
            </button>
            <span className={`font-semibold ${
              netVotes > 0 ? 'text-green-600' :
              netVotes < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {netVotes > 0 ? '+' : ''}{netVotes}
            </span>
            <button
              onClick={() => handleVoteInsight(insight.id, 'down')}
              className={`p-2 rounded-lg transition-colors ${
                hasDownvoted
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {insight.title}
                </h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>{insight.author?.name}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(insight.createdAt)}</span>
                  {insight.area && (
                    <>
                      <span>•</span>
                      <span>{insight.area}</span>
                    </>
                  )}
                </div>
              </div>
              {insight.verified && (
                <div className="flex items-center space-x-1 text-green-600">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-4">{insight.content}</p>

            {/* Metrics */}
            {insight.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(insight.metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {typeof value === 'number' ? 
                        value > 100 ? value.toLocaleString() : `${value}%`
                        : value
                      }
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Category Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                insight.category === 'opportunity' ? 'bg-green-100 text-green-700' :
                insight.category === 'warning' ? 'bg-red-100 text-red-700' :
                insight.category === 'trend' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 500 + 100)} views</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const renderGroup = (group: any) => (
    <motion.div
      key={group.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{group.name}</h3>
          <p className="text-sm text-gray-600">{group.description}</p>
        </div>
        {group.private && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
            Private
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{group.members.length} members</span>
          </div>
          <span className="capitalize px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
            {group.category}
          </span>
        </div>
        {group.members.includes(currentUserId) ? (
          <button className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
            Joined
          </button>
        ) : (
          <button
            onClick={() => socialFeatures.joinGroup(group.id, currentUserId)}
            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            Join Group
          </button>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex space-x-3">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-semibold">U</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share your insights, opportunities, or questions..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ImageIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Hash className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'feed'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'insights'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Market Insights
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
            activeTab === 'groups'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Groups
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'feed' && posts.map(post => renderPost(post))}
            {activeTab === 'insights' && insights.map(insight => renderInsight(insight))}
            {activeTab === 'groups' && groups.map(group => renderGroup(group))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}