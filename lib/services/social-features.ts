import { fernandoXAI } from './ai-service'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'developer' | 'investor' | 'seller' | 'professional'
  expertise: string[]
  connections: string[]
  joinedAt: Date
}

export interface Post {
  id: string
  authorId: string
  author?: User
  content: string
  images?: string[]
  propertyId?: string
  projectId?: string
  tags: string[]
  likes: string[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
  visibility: 'public' | 'connections' | 'private'
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  author?: User
  content: string
  likes: string[]
  replies: Comment[]
  createdAt: Date
}

export interface Group {
  id: string
  name: string
  description: string
  category: 'neighborhood' | 'investment' | 'development' | 'market'
  members: string[]
  admins: string[]
  posts: string[]
  private: boolean
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'group_invite' | 'property_match'
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  attachments?: {
    type: 'property' | 'document' | 'image'
    url: string
    name: string
  }[]
  read: boolean
  createdAt: Date
}

export interface MarketInsight {
  id: string
  authorId: string
  author?: User
  title: string
  content: string
  category: 'trend' | 'analysis' | 'opportunity' | 'warning'
  area?: string
  metrics?: Record<string, any>
  votes: { up: string[]; down: string[] }
  verified: boolean
  createdAt: Date
}

class SocialFeaturesService {
  private posts: Map<string, Post> = new Map()
  private groups: Map<string, Group> = new Map()
  private users: Map<string, User> = new Map()
  private insights: Map<string, MarketInsight> = new Map()
  
  // User Management
  async getUser(userId: string): Promise<User | null> {
    return this.users.get(userId) || this.generateMockUser(userId)
  }
  
  async getUserConnections(userId: string): Promise<User[]> {
    const user = await this.getUser(userId)
    if (!user) return []
    
    return Promise.all(
      user.connections.map(id => this.getUser(id))
    ).then(users => users.filter(Boolean) as User[])
  }
  
  async connectWithUser(userId: string, targetUserId: string): Promise<boolean> {
    const user = await this.getUser(userId)
    const targetUser = await this.getUser(targetUserId)
    
    if (!user || !targetUser) return false
    
    // Add connections bidirectionally
    if (!user.connections.includes(targetUserId)) {
      user.connections.push(targetUserId)
    }
    if (!targetUser.connections.includes(userId)) {
      targetUser.connections.push(userId)
    }
    
    // Send notification
    await this.createNotification({
      userId: targetUserId,
      type: 'follow',
      title: 'New Connection',
      message: `${user.name} is now connected with you`,
      link: `/profile/${userId}`
    })
    
    return true
  }
  
  // Posts & Feed
  async createPost(
    authorId: string,
    content: string,
    options?: {
      images?: string[]
      propertyId?: string
      projectId?: string
      tags?: string[]
      visibility?: 'public' | 'connections' | 'private'
    }
  ): Promise<Post> {
    const postId = `post-${Date.now()}`
    const author = await this.getUser(authorId)
    
    const post: Post = {
      id: postId,
      authorId,
      author: author || undefined,
      content,
      images: options?.images || [],
      propertyId: options?.propertyId,
      projectId: options?.projectId,
      tags: options?.tags || this.extractTags(content),
      likes: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      visibility: options?.visibility || 'public'
    }
    
    this.posts.set(postId, post)
    
    // AI content moderation
    const moderation = await fernandoXAI.moderateContent(content)
    if (moderation.flagged) {
      post.visibility = 'private'
    }
    
    return post
  }
  
  async getFeed(
    userId: string,
    options?: {
      limit?: number
      offset?: number
      filter?: 'all' | 'connections' | 'groups'
    }
  ): Promise<Post[]> {
    const user = await this.getUser(userId)
    if (!user) return []
    
    const allPosts = Array.from(this.posts.values())
    let filteredPosts = allPosts
    
    // Filter based on visibility and connections
    filteredPosts = filteredPosts.filter(post => {
      if (post.visibility === 'public') return true
      if (post.visibility === 'connections' && user.connections.includes(post.authorId)) return true
      if (post.authorId === userId) return true
      return false
    })
    
    // Apply additional filters
    if (options?.filter === 'connections') {
      filteredPosts = filteredPosts.filter(post => 
        user.connections.includes(post.authorId)
      )
    }
    
    // Sort by recency
    filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    
    // Pagination
    const limit = options?.limit || 20
    const offset = options?.offset || 0
    return filteredPosts.slice(offset, offset + limit)
  }
  
  async likePost(postId: string, userId: string): Promise<boolean> {
    const post = this.posts.get(postId)
    if (!post) return false
    
    if (!post.likes.includes(userId)) {
      post.likes.push(userId)
      post.updatedAt = new Date()
      
      // Notify post author
      if (post.authorId !== userId) {
        await this.createNotification({
          userId: post.authorId,
          type: 'like',
          title: 'Post Liked',
          message: 'Someone liked your post',
          link: `/post/${postId}`
        })
      }
    }
    
    return true
  }
  
  async commentOnPost(
    postId: string,
    authorId: string,
    content: string
  ): Promise<Comment> {
    const post = this.posts.get(postId)
    if (!post) throw new Error('Post not found')
    
    const author = await this.getUser(authorId)
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId,
      author: author || undefined,
      content,
      likes: [],
      replies: [],
      createdAt: new Date()
    }
    
    post.comments.push(comment)
    post.updatedAt = new Date()
    
    // Notify post author
    if (post.authorId !== authorId) {
      await this.createNotification({
        userId: post.authorId,
        type: 'comment',
        title: 'New Comment',
        message: `${author?.name || 'Someone'} commented on your post`,
        link: `/post/${postId}`
      })
    }
    
    return comment
  }
  
  // Groups
  async createGroup(
    creatorId: string,
    name: string,
    description: string,
    category: Group['category'],
    isPrivate: boolean = false
  ): Promise<Group> {
    const groupId = `group-${Date.now()}`
    
    const group: Group = {
      id: groupId,
      name,
      description,
      category,
      members: [creatorId],
      admins: [creatorId],
      posts: [],
      private: isPrivate,
      createdAt: new Date()
    }
    
    this.groups.set(groupId, group)
    return group
  }
  
  async joinGroup(groupId: string, userId: string): Promise<boolean> {
    const group = this.groups.get(groupId)
    if (!group) return false
    
    if (!group.members.includes(userId)) {
      group.members.push(userId)
      
      // Notify group admins
      for (const adminId of group.admins) {
        if (adminId !== userId) {
          const user = await this.getUser(userId)
          await this.createNotification({
            userId: adminId,
            type: 'group_invite',
            title: 'New Group Member',
            message: `${user?.name || 'Someone'} joined ${group.name}`,
            link: `/groups/${groupId}`
          })
        }
      }
    }
    
    return true
  }
  
  async getGroups(
    userId?: string,
    filter?: 'all' | 'my_groups' | 'recommended'
  ): Promise<Group[]> {
    let groups = Array.from(this.groups.values())
    
    if (filter === 'my_groups' && userId) {
      groups = groups.filter(g => g.members.includes(userId))
    } else if (filter === 'recommended' && userId) {
      // AI-powered group recommendations
      const user = await this.getUser(userId)
      if (user) {
        groups = groups.filter(g => {
          // Recommend based on user's role and expertise
          if (user.role === 'developer' && g.category === 'development') return true
          if (user.role === 'investor' && g.category === 'investment') return true
          return !g.private && !g.members.includes(userId)
        })
      }
    } else if (!userId) {
      // Only show public groups to non-authenticated users
      groups = groups.filter(g => !g.private)
    }
    
    return groups
  }
  
  // Market Insights
  async shareMarketInsight(
    authorId: string,
    title: string,
    content: string,
    category: MarketInsight['category'],
    area?: string,
    metrics?: Record<string, any>
  ): Promise<MarketInsight> {
    const insightId = `insight-${Date.now()}`
    const author = await this.getUser(authorId)
    
    const insight: MarketInsight = {
      id: insightId,
      authorId,
      author: author || undefined,
      title,
      content,
      category,
      area,
      metrics,
      votes: { up: [], down: [] },
      verified: false,
      createdAt: new Date()
    }
    
    // AI verification for insights
    const verification = await fernandoXAI.verifyMarketInsight({
      content,
      metrics,
      area
    })
    
    insight.verified = verification.isValid
    
    this.insights.set(insightId, insight)
    return insight
  }
  
  async voteOnInsight(
    insightId: string,
    userId: string,
    voteType: 'up' | 'down'
  ): Promise<boolean> {
    const insight = this.insights.get(insightId)
    if (!insight) return false
    
    // Remove from opposite vote list
    const oppositeVote = voteType === 'up' ? 'down' : 'up'
    insight.votes[oppositeVote] = insight.votes[oppositeVote].filter(id => id !== userId)
    
    // Add to vote list if not already voted
    if (!insight.votes[voteType].includes(userId)) {
      insight.votes[voteType].push(userId)
    }
    
    return true
  }
  
  async getTrendingInsights(limit: number = 10): Promise<MarketInsight[]> {
    const insights = Array.from(this.insights.values())
    
    // Calculate trending score
    insights.sort((a, b) => {
      const aScore = a.votes.up.length - a.votes.down.length + 
                    (a.verified ? 10 : 0) +
                    (Date.now() - a.createdAt.getTime() < 86400000 ? 5 : 0) // Boost recent
      const bScore = b.votes.up.length - b.votes.down.length + 
                    (b.verified ? 10 : 0) +
                    (Date.now() - b.createdAt.getTime() < 86400000 ? 5 : 0)
      return bScore - aScore
    })
    
    return insights.slice(0, limit)
  }
  
  // Messaging
  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    attachments?: Message['attachments']
  ): Promise<Message> {
    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      receiverId,
      content,
      attachments,
      read: false,
      createdAt: new Date()
    }
    
    // Notify receiver
    const sender = await this.getUser(senderId)
    await this.createNotification({
      userId: receiverId,
      type: 'mention',
      title: 'New Message',
      message: `${sender?.name || 'Someone'} sent you a message`,
      link: `/messages/${senderId}`
    })
    
    return message
  }
  
  // Notifications
  async createNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<Notification> {
    const fullNotification: Notification = {
      id: `notif-${Date.now()}`,
      ...notification,
      read: false,
      createdAt: new Date()
    }
    
    // In production, this would be stored in database and pushed via WebSocket
    return fullNotification
  }
  
  // Helper methods
  private extractTags(content: string): string[] {
    const tags = content.match(/#\w+/g) || []
    return tags.map(tag => tag.substring(1))
  }
  
  private generateMockUser(userId: string): User {
    const roles: User['role'][] = ['developer', 'investor', 'seller', 'professional']
    const expertiseOptions = [
      'Residential Development',
      'Commercial Real Estate',
      'Land Acquisition',
      'Property Management',
      'Market Analysis',
      'Investment Strategy'
    ]
    
    const user: User = {
      id: userId,
      name: `User ${userId.slice(-4)}`,
      email: `user${userId.slice(-4)}@example.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      expertise: expertiseOptions.slice(0, Math.floor(Math.random() * 3) + 1),
      connections: [],
      joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    }
    
    this.users.set(userId, user)
    return user
  }
  
  // Initialize with sample data
  async initializeSampleData() {
    // Create sample users
    const users = ['user1', 'user2', 'user3', 'user4', 'user5']
    for (const userId of users) {
      await this.getUser(userId)
    }
    
    // Create connections
    await this.connectWithUser('user1', 'user2')
    await this.connectWithUser('user1', 'user3')
    await this.connectWithUser('user2', 'user4')
    
    // Create sample posts
    await this.createPost('user1', 
      'Just closed on a great development opportunity in Cypress! 🎉 #RealEstate #HoustonDevelopment',
      { tags: ['RealEstate', 'HoustonDevelopment'] }
    )
    
    await this.createPost('user2',
      'Market analysis shows strong growth potential in The Heights area. Seeing 15% YoY appreciation! 📈',
      { tags: ['MarketAnalysis', 'Investment'] }
    )
    
    // Create sample groups
    await this.createGroup(
      'user1',
      'Houston Developers Network',
      'Connect with fellow developers and share opportunities',
      'development'
    )
    
    await this.createGroup(
      'user2',
      'Investment Strategies Houston',
      'Discuss investment strategies and market trends',
      'investment'
    )
    
    // Create sample insights
    await this.shareMarketInsight(
      'user3',
      'Emerging Opportunity: East End Development',
      'The East End is showing strong indicators for growth with new Metro line completion',
      'opportunity',
      'East End',
      { priceGrowth: 12.5, demandScore: 85 }
    )
  }
}

export const socialFeatures = new SocialFeaturesService()
export default SocialFeaturesService