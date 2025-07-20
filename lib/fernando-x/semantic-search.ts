// Fernando-X Semantic Search Engine
// Uses embeddings for intelligent context-aware search

import { KnowledgeNode } from './knowledge-base'

export interface SearchResult {
  node: KnowledgeNode
  score: number
  highlights: string[]
  context: string
}

export interface EmbeddingVector {
  id: string
  vector: number[]
  metadata: {
    nodeId: string
    chunk: string
    position: number
  }
}

class SemanticSearchEngine {
  private embeddings: Map<string, EmbeddingVector> = new Map()
  private indexReady: boolean = false
  
  // Simulate embedding generation (in production, use OpenAI embeddings)
  private async generateEmbedding(text: string): Promise<number[]> {
    // Simple hash-based pseudo-embedding for demo
    // In production: const response = await openai.embeddings.create({ input: text, model: "text-embedding-ada-002" })
    const words = text.toLowerCase().split(/\s+/)
    const vector = new Array(384).fill(0)
    
    words.forEach((word, i) => {
      const hash = this.hashString(word)
      vector[hash % 384] += 1 / (i + 1) // Position-weighted
    })
    
    // Normalize
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0))
    return vector.map(val => val / (magnitude || 1))
  }
  
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
  
  // Calculate cosine similarity between vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
  
  // Index knowledge nodes for semantic search
  async indexKnowledge(nodes: KnowledgeNode[]): Promise<void> {
    console.log(`Indexing ${nodes.length} knowledge nodes...`)
    
    for (const node of nodes) {
      // Create embeddings for title
      const titleEmbedding = await this.generateEmbedding(node.title)
      this.embeddings.set(`${node.id}-title`, {
        id: `${node.id}-title`,
        vector: titleEmbedding,
        metadata: {
          nodeId: node.id,
          chunk: node.title,
          position: 0
        }
      })
      
      // Create embeddings for content chunks
      const chunks = this.chunkText(node.content, 200) // 200 word chunks
      for (let i = 0; i < chunks.length; i++) {
        const chunkEmbedding = await this.generateEmbedding(chunks[i])
        this.embeddings.set(`${node.id}-chunk-${i}`, {
          id: `${node.id}-chunk-${i}`,
          vector: chunkEmbedding,
          metadata: {
            nodeId: node.id,
            chunk: chunks[i],
            position: i + 1
          }
        })
      }
      
      // Create embeddings for tags
      const tagsText = node.metadata.tags.join(' ')
      if (tagsText) {
        const tagsEmbedding = await this.generateEmbedding(tagsText)
        this.embeddings.set(`${node.id}-tags`, {
          id: `${node.id}-tags`,
          vector: tagsEmbedding,
          metadata: {
            nodeId: node.id,
            chunk: tagsText,
            position: -1 // Special position for tags
          }
        })
      }
    }
    
    this.indexReady = true
    console.log(`Indexed ${this.embeddings.size} embeddings`)
  }
  
  // Chunk text into smaller pieces
  private chunkText(text: string, maxWords: number): string[] {
    const sentences = text.split(/[.!?]+/)
    const chunks: string[] = []
    let currentChunk: string[] = []
    let wordCount = 0
    
    for (const sentence of sentences) {
      const words = sentence.trim().split(/\s+/)
      if (wordCount + words.length > maxWords && currentChunk.length > 0) {
        chunks.push(currentChunk.join('. ') + '.')
        currentChunk = []
        wordCount = 0
      }
      if (sentence.trim()) {
        currentChunk.push(sentence.trim())
        wordCount += words.length
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join('. ') + '.')
    }
    
    return chunks
  }
  
  // Semantic search using embeddings
  async search(query: string, topK: number = 10): Promise<SearchResult[]> {
    if (!this.indexReady) {
      throw new Error('Search index not ready. Please index knowledge first.')
    }
    
    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query)
    
    // Calculate similarities
    const similarities: Array<{
      embedding: EmbeddingVector
      score: number
    }> = []
    
    for (const [_, embedding] of this.embeddings) {
      const score = this.cosineSimilarity(queryEmbedding, embedding.vector)
      similarities.push({ embedding, score })
    }
    
    // Sort by similarity score
    similarities.sort((a, b) => b.score - a.score)
    
    // Group by node and get best matches
    const nodeScores = new Map<string, {
      maxScore: number
      matches: Array<{ chunk: string; score: number }>
    }>()
    
    for (const { embedding, score } of similarities) {
      const nodeId = embedding.metadata.nodeId
      if (!nodeScores.has(nodeId)) {
        nodeScores.set(nodeId, { maxScore: 0, matches: [] })
      }
      
      const nodeData = nodeScores.get(nodeId)!
      nodeData.maxScore = Math.max(nodeData.maxScore, score)
      nodeData.matches.push({
        chunk: embedding.metadata.chunk,
        score
      })
    }
    
    // Get top K nodes
    const topNodes = Array.from(nodeScores.entries())
      .sort(([_, a], [__, b]) => b.maxScore - a.maxScore)
      .slice(0, topK)
    
    // This will be populated after we implement the method
    return []
  }
  
  // Extract highlights from text
  private extractHighlights(text: string, query: string, maxHighlights: number = 3): string[] {
    const queryWords = query.toLowerCase().split(/\s+/)
    const sentences = text.split(/[.!?]+/)
    
    // Score sentences by query word matches
    const scoredSentences = sentences.map(sentence => {
      const sentenceLower = sentence.toLowerCase()
      let score = 0
      let matchedWords = 0
      
      queryWords.forEach(word => {
        if (sentenceLower.includes(word)) {
          score += 2
          matchedWords++
        }
      })
      
      // Bonus for multiple word matches
      if (matchedWords > 1) score += matchedWords
      
      return { sentence: sentence.trim(), score }
    })
    
    // Get top sentences
    return scoredSentences
      .filter(s => s.score > 0 && s.sentence.length > 10)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxHighlights)
      .map(s => s.sentence)
  }
  
  // Generate contextual summary
  private generateContext(node: KnowledgeNode, query: string): string {
    const queryLower = query.toLowerCase()
    
    // Determine query intent
    let context = ''
    
    if (queryLower.includes('invest') || queryLower.includes('roi')) {
      context = 'Investment perspective: '
    } else if (queryLower.includes('develop') || queryLower.includes('build')) {
      context = 'Development perspective: '
    } else if (queryLower.includes('risk') || queryLower.includes('concern')) {
      context = 'Risk analysis: '
    } else if (queryLower.includes('opportunity') || queryLower.includes('potential')) {
      context = 'Opportunity analysis: '
    } else {
      context = 'Overview: '
    }
    
    // Extract relevant section based on query
    const lines = node.content.split('\n')
    for (const line of lines) {
      if (line.toLowerCase().includes(queryLower.split(' ')[0])) {
        context += line.trim()
        break
      }
    }
    
    if (context.length < 50) {
      context += lines.find(l => l.length > 20) || node.title
    }
    
    return context
  }
  
  // Hybrid search combining semantic and keyword matching
  async hybridSearch(
    query: string,
    nodes: KnowledgeNode[],
    options: {
      semanticWeight?: number
      keywordWeight?: number
      topK?: number
    } = {}
  ): Promise<SearchResult[]> {
    const {
      semanticWeight = 0.7,
      keywordWeight = 0.3,
      topK = 10
    } = options
    
    // Ensure index is ready
    if (!this.indexReady) {
      await this.indexKnowledge(nodes)
    }
    
    // Get semantic search results
    const semanticResults = await this.search(query, topK * 2)
    
    // Get keyword search results
    const keywordResults = this.keywordSearch(query, nodes, topK * 2)
    
    // Combine scores
    const combinedScores = new Map<string, {
      node: KnowledgeNode
      semanticScore: number
      keywordScore: number
      totalScore: number
      highlights: string[]
      context: string
    }>()
    
    // Add semantic results
    semanticResults.forEach(result => {
      combinedScores.set(result.node.id, {
        node: result.node,
        semanticScore: result.score,
        keywordScore: 0,
        totalScore: result.score * semanticWeight,
        highlights: result.highlights,
        context: result.context
      })
    })
    
    // Add/update with keyword results
    keywordResults.forEach(result => {
      const existing = combinedScores.get(result.node.id)
      if (existing) {
        existing.keywordScore = result.score
        existing.totalScore = (existing.semanticScore * semanticWeight) + (result.score * keywordWeight)
        // Merge highlights
        existing.highlights = [...new Set([...existing.highlights, ...result.highlights])]
      } else {
        combinedScores.set(result.node.id, {
          node: result.node,
          semanticScore: 0,
          keywordScore: result.score,
          totalScore: result.score * keywordWeight,
          highlights: result.highlights,
          context: result.context
        })
      }
    })
    
    // Sort by total score and return top K
    return Array.from(combinedScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, topK)
      .map(item => ({
        node: item.node,
        score: item.totalScore,
        highlights: item.highlights.slice(0, 3),
        context: item.context
      }))
  }
  
  // Traditional keyword search
  private keywordSearch(query: string, nodes: KnowledgeNode[], topK: number): SearchResult[] {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2)
    
    const scored = nodes.map(node => {
      let score = 0
      const highlights: string[] = []
      
      // Title matching (highest weight)
      const titleLower = node.title.toLowerCase()
      queryWords.forEach(word => {
        if (titleLower.includes(word)) score += 10
      })
      
      // Content matching
      const contentLower = node.content.toLowerCase()
      queryWords.forEach(word => {
        const matches = (contentLower.match(new RegExp(word, 'g')) || []).length
        score += matches * 2
      })
      
      // Tag matching
      queryWords.forEach(word => {
        node.metadata.tags.forEach(tag => {
          if (tag.includes(word)) score += 5
        })
      })
      
      // Location matching
      if (node.metadata.location) {
        queryWords.forEach(word => {
          if (node.metadata.location!.toLowerCase().includes(word)) score += 8
        })
      }
      
      // Extract highlights if score > 0
      if (score > 0) {
        highlights.push(...this.extractHighlights(node.content, query))
      }
      
      return {
        node,
        score: score / queryWords.length, // Normalize by query length
        highlights,
        context: this.generateContext(node, query)
      }
    })
    
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
  
  // Get similar nodes using embeddings
  async findSimilar(nodeId: string, topK: number = 5): Promise<KnowledgeNode[]> {
    const nodeEmbedding = this.embeddings.get(`${nodeId}-title`)
    if (!nodeEmbedding) return []
    
    const similarities: Array<{ nodeId: string; score: number }> = []
    
    // Compare with other node title embeddings
    for (const [key, embedding] of this.embeddings) {
      if (key.endsWith('-title') && embedding.metadata.nodeId !== nodeId) {
        const score = this.cosineSimilarity(nodeEmbedding.vector, embedding.vector)
        similarities.push({
          nodeId: embedding.metadata.nodeId,
          score
        })
      }
    }
    
    // Sort and return top K
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
      .map(s => s.nodeId) as any // Will be resolved with actual nodes
  }
  
  // Clear the index
  clearIndex(): void {
    this.embeddings.clear()
    this.indexReady = false
  }
  
  // Get index statistics
  getIndexStats(): {
    totalEmbeddings: number
    uniqueNodes: number
    indexReady: boolean
  } {
    const uniqueNodes = new Set<string>()
    this.embeddings.forEach(emb => {
      uniqueNodes.add(emb.metadata.nodeId)
    })
    
    return {
      totalEmbeddings: this.embeddings.size,
      uniqueNodes: uniqueNodes.size,
      indexReady: this.indexReady
    }
  }
}

export const semanticSearch = new SemanticSearchEngine()
export default SemanticSearchEngine