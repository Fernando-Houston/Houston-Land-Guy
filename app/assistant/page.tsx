'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, Send, Brain, Mic, MicOff, Download, 
  ThumbsUp, ThumbsDown, Copy, RefreshCw, Zap, 
  TrendingUp, MapPin, DollarSign, Building2, Users,
  ChevronRight, Sparkles, Clock, CheckCircle
} from 'lucide-react'
import { processQuery, type QueryResult } from '@/lib/services/houston-assistant'

interface Message {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  queryResult?: QueryResult
}

interface QuickAction {
  label: string
  query: string
  icon: any
  color: string
}

const quickActions: QuickAction[] = [
  {
    label: "Hot Markets Analysis",
    query: "Tell me about Cypress and Katy markets - why are they #1 and #2 hottest in the US?",
    icon: MapPin,
    color: "bg-blue-500"
  },
  {
    label: "Major Projects Update",
    query: "What's the status of East River, TMC3, and IAH Terminal projects?",
    icon: Building2,
    color: "bg-green-500"
  },
  {
    label: "Top Developers",
    query: "Who are the most active developers? I heard D.R. Horton has 300+ permits",
    icon: DollarSign,
    color: "bg-purple-500"
  },
  {
    label: "Spring Branch ROI",
    query: "Why is Spring Branch showing 18.3% returns? Is it a good investment?",
    icon: Clock,
    color: "bg-orange-500"
  },
  {
    label: "Best Neighborhoods",
    query: "Compare River Oaks, Memorial, and The Heights for development potential",
    icon: TrendingUp,
    color: "bg-indigo-500"
  },
  {
    label: "$13.8B Pipeline",
    query: "Tell me about the $13.8 billion development pipeline in Houston",
    icon: Users,
    color: "bg-teal-500"
  }
]

const exampleQueries = [
  "Why is Cypress 77433 the #2 hottest market in the US?",
  "Compare D.R. Horton vs Lennar Homes performance",
  "What's happening with the $2.5B East River project?",
  "Show me neighborhoods with <2 months inventory",
  "Which areas have the best school ratings?",
  "Explain the TMC Innovation District opportunity"
]

export default function HoustonAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showFeedback, setShowFeedback] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      content: "Hi! I'm Fernando-X, your Houston development expert assistant. I can help you with property searches, ROI calculations, permitting questions, financing options, and market analysis. What would you like to know about Houston development?",
      type: 'assistant',
      timestamp: new Date(),
      queryResult: {
        response: "Welcome to Houston Development Intelligence!",
        confidence: 1.0,
        intent: 'welcome',
        followUpQuestions: [
          "What type of development are you interested in?",
          "Are you looking for specific neighborhoods?",
          "Do you need help with financing or permits?"
        ],
        dataUsed: ['Houston Development Intelligence'],
        actionItems: [
          "Explore our development tools",
          "Search for properties",
          "Run ROI calculations"
        ]
      }
    }
    setMessages([welcomeMessage])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const queryResult = await processQuery(message)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: queryResult.response,
        type: 'assistant',
        timestamp: new Date(),
        queryResult
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error processing query:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact support if the issue persists.",
        type: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsLoading(false)
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.query)
  }

  const handleExampleQuery = (query: string) => {
    setInputValue(query)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleFeedback = (messageId: string, positive: boolean) => {
    setShowFeedback(messageId)
    // In production, send feedback to analytics
    console.log('Feedback:', messageId, positive ? 'positive' : 'negative')
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mr-3">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Fernando-X</h1>
              <p className="text-sm text-gray-600">Your AI expert for Houston real estate development</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-4xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white shadow-sm border'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.type === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                      {formatTimestamp(message.timestamp)}
                      {message.queryResult && (
                        <span className="ml-2">
                          • {(message.queryResult.confidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Follow-up Questions */}
                {message.type === 'assistant' && message.queryResult?.followUpQuestions && (
                  <div className="mt-3 space-y-2">
                    {message.queryResult.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(question)}
                        className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Items */}
                {message.type === 'assistant' && message.queryResult?.actionItems && (
                  <div className="mt-3 bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center text-sm font-medium text-blue-900 mb-2">
                      <Zap className="h-4 w-4 mr-1" />
                      Recommended Actions
                    </div>
                    <div className="space-y-1">
                      {message.queryResult.actionItems.map((action, index) => (
                        <div key={index} className="flex items-center text-sm text-blue-700">
                          <ChevronRight className="h-3 w-3 mr-1" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Actions */}
                {message.type === 'assistant' && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, true)}
                      className="p-1 text-gray-400 hover:text-green-600 rounded"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleFeedback(message.id, false)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-gray-600">Analyzing...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 bg-white border-t">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mr-3`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{action.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Example Questions</h3>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleQuery(query)}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Houston development..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full transition-colors ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by Houston Development Intelligence</span>
        </div>
      </div>
    </div>
  )
}