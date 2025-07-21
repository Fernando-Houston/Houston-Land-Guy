// Conversational response handler for Fernando-X
// Focuses on natural, context-aware conversations instead of data dumps

interface ConversationMemory {
  lastTopic?: string
  userBudget?: number
  userGoal?: string
  mentionedAreas?: string[]
  previousQuestions?: string[]
}

export class ConversationalFernando {
  private memory: Map<string, ConversationMemory> = new Map()
  
  async getResponse(message: string, sessionId: string): Promise<string> {
    const userMemory = this.memory.get(sessionId) || {}
    const messageLower = message.toLowerCase()
    
    // Handle common typos and variations
    const cleanedMessage = messageLower
      .replace(/\bi\s*sm\b/g, "i am")
      .replace(/\bi\s*m\b/g, "i am")
      .replace(/\bbuy\.\s*a\b/g, "buy a")
    
    // Extract budget if mentioned
    const budgetMatch = message.match(/\$?(\d+)k?/i)
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1])
      userMemory.userBudget = messageLower.includes('k') ? amount * 1000 : amount
      this.memory.set(sessionId, userMemory)
    }
    
    // Handle budget constraints immediately
    if ((messageLower.includes('only have') || messageLower.includes('budget')) && userMemory.userBudget) {
      const budget = userMemory.userBudget
      
      if (budget < 250000) {
        return `Got it - $${budget.toLocaleString()} to work with. That's actually more flexible than you might think in Houston.

You've got three solid paths:

1. **Condos in cool areas** - Montrose has 1-bedrooms around $180K, perfect if you want walkability
2. **Houses in emerging neighborhoods** - Fifth Ward and Kashmere Gardens still have homes under $200K
3. **The smart play** - Buy a duplex in Near Northside for $220K, live in half, rent the other

What matters more to you - being close to downtown or having more space?`
      } else if (budget < 400000) {
        return `Perfect! $${budget.toLocaleString()} puts you right in Houston's sweet spot.

You can get a solid 3-bedroom house in established areas like Alief or Sharpstown, or a newer townhome in East Downtown.

The hidden gem right now? Spring Branch. Still affordable but gentrifying fast - your $${(budget/1000).toFixed(0)}K could be worth $450K in 3 years.

Are you looking for move-in ready or willing to do some updates?`
      }
    }
    
    // Handle "what else" contextually
    if (messageLower.includes('what else') || messageLower.includes('other options')) {
      if (userMemory.lastTopic === 'building') {
        return `Since you mentioned building earlier, here's what most people miss:

Prefab is getting good - really good. Companies like Dvele deliver modern homes for $150/sqft all-in. 

Or there's the container home route. I know a developer putting up 2-bedroom units for $80K total in Third Ward.

But honestly? With your budget, buying and renovating might be smarter. Want me to show you some fixer-uppers with good bones?`
      } else if (userMemory.userBudget && userMemory.userBudget < 300000) {
        return `Here's what I haven't mentioned yet:

**Owner financing** - Some sellers in Sunnyside and South Park will carry the note with just 10% down.

**Tax sales** - Harris County auctions happen monthly. Properties start at $5K but need cash.

**Wholesale deals** - I know investors offloading contracts in Greenspoint for $10-20K assignment fees.

Which of these sounds most interesting to you?`
      } else {
        return `Let me share something different...

The real opportunity in Houston isn't where everyone's looking. While everyone fights over Heights and Montrose, smart money is moving to:

- **Near Northside** - Still under $300/sqft but getting rail access
- **Kashmere Gardens** - Bad rep, but artists are moving in
- **Gulfton** - Most diverse zip code in America, rents rising fast

Want the data on any of these, or should I keep going?`
      }
    }
    
    // Handle "I'm looking to build"
    if (messageLower.includes('build') || messageLower.includes('construct')) {
      userMemory.lastTopic = 'building'
      userMemory.userGoal = 'build'
      this.memory.set(sessionId, userMemory)
      
      return `Building in Houston - love it! The permit process just got easier too.

Quick reality check: With construction at $145/sqft, a 1,500 sqft home runs about $220K just for building. Add land, utilities, and permits, you're looking at $280K minimum.

But here's the insider move: Acres Homes has lots for $15-30K, and the city offers tax abatements for new construction there.

What's your total budget for the project?`
    }
    
    // Handle area-specific questions
    const areaPattern = /(?:tell me about|what about|how is|info on)\s+(\w+(?:\s+\w+)?)/i
    const areaMatch = message.match(areaPattern)
    if (areaMatch) {
      const area = areaMatch[1]
      userMemory.mentionedAreas = [...(userMemory.mentionedAreas || []), area]
      this.memory.set(sessionId, userMemory)
      
      // Give specific, actionable info about the area
      const areaResponses: Record<string, string> = {
        'katy': `Katy's hot but getting pricey. New builds start at $350K now. 

The play here is Grand Lakes or Cane Island - still some lots under $300K. Great schools drive appreciation.

Fair warning: It's 30 miles out. The commute to downtown is brutal. Worth it if you work remote or in Energy Corridor.`,
        
        'heights': `The Heights is basically Houston's Brooklyn now - trendy but expensive.

You're looking at $500K minimum for anything decent. But here's the angle: Buy on the edges like Shady Acres. Same vibe, 30% cheaper.

Also, Heights allows ADUs now. Buy a lot, build two units, instant cash flow.`,
        
        'eado': `East Downtown (EaDo) is the bet for next 5 years. Still rough around edges but changing fast.

You can grab row houses for $350K or condos from $250K. The East River project will transform this area.

Get in before the stadium district fully develops. I'm seeing 15-20% annual appreciation here.`,
      }
      
      const response = areaResponses[area.toLowerCase()] || 
        `${area} is definitely worth exploring. What specifically interests you about this area - the prices, the growth potential, or something else?`
      
      return response
    }
    
    // Handle yes/no responses contextually
    if (messageLower === 'yes' || messageLower.includes('yes please') || messageLower.includes('sure')) {
      if (userMemory.lastTopic === 'permits') {
        return `Great! Houston permits are actually straightforward if you know the process.

For residential:
1. Submit plans online at BuildHouston.org
2. Pay fees (about $1,500 for a house)
3. Wait 2-4 weeks for approval

Pro tip: Use an expeditor service for $500 - cuts time in half.

The tricky part is deed restrictions. What neighborhood are you building in?`
      } else if (userMemory.lastTopic === 'building') {
        return `Let's talk specifics then.

First question - are you planning to:
- Build on land you already own?
- Buy a teardown and rebuild?
- Find raw land to develop?

Each path has different costs and timelines. The teardown route can save 3-4 months on utilities and infrastructure.`
      } else if (userMemory.mentionedAreas && userMemory.mentionedAreas.length > 0) {
        const lastArea = userMemory.mentionedAreas[userMemory.mentionedAreas.length - 1]
        return `Excellent choice! ${lastArea} has some unique opportunities right now.

What's drawing you to ${lastArea} specifically? The price point, the growth potential, or something else?

I can pull up specific listings or walk you through what's driving values there.`
      }
    }
    
    // Handle home buying queries
    if (cleanedMessage.includes('buy') && (cleanedMessage.includes('home') || cleanedMessage.includes('house') || cleanedMessage.includes('property'))) {
      userMemory.userGoal = 'buy'
      this.memory.set(sessionId, userMemory)
      
      return `Perfect! Houston's a great place to buy right now. To help you find the right home, I need to know:

1. What's your budget range?
2. Are you looking for a house, townhome, or condo?
3. Any preferred areas or important factors (schools, commute, etc.)?

Once I know that, I can show you exactly what's available and where you'll get the best value.`
    }
    
    // Default greeting - but make it conversational
    if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
      return `Hey! I'm Fernando-X. 

Instead of drowning you in data, let me ask - what's your real estate goal right now? 

Buying your first place? Looking for an investment? Or just trying to figure out if Houston's market is as crazy as everyone says?`
    }
    
    // If we don't have a specific response, ask a clarifying question
    return this.getClarifyingResponse(message, userMemory)
  }
  
  private getClarifyingResponse(message: string, memory: ConversationMemory): string {
    const messageLower = message.toLowerCase()
    
    // Handle generic real estate questions with context
    if (messageLower.includes('invest') || messageLower.includes('buy')) {
      if (memory.userBudget) {
        return `With $${memory.userBudget.toLocaleString()}, you've got options. But let me understand - are you looking to:

- Live in it yourself?
- Rent it out for income?
- Fix and flip it?
- Just park money for appreciation?

Different strategies work better in different parts of Houston.`
      } else {
        return `I can definitely help you invest in Houston real estate. 

Quick question to point you in the right direction - what's your budget range? And are you looking for something to live in or pure investment?`
      }
    }
    
    // Handle area questions
    if (messageLower.includes('where') || messageLower.includes('area') || messageLower.includes('neighborhood')) {
      return `Houston's huge - 600+ square miles! To narrow it down:

- What's most important: commute, schools, or neighborhood vibe?
- Any specific areas you're already considering?
- Budget range? (This really affects which areas make sense)

Once I know that, I can show you the hidden gems.`
    }
    
    // Handle "how" questions
    if (messageLower.includes('how do i') || messageLower.includes('how can i')) {
      if (messageLower.includes('start')) {
        return `Starting in Houston real estate? Smart move. Here's the real talk:

1. **Get pre-approved** - Know your actual budget, not just what you think
2. **Pick your strategy** - Flipping, renting, or living in it changes everything
3. **Choose your area** - I can help with this based on your goals

What's your main goal with real estate right now?`
      }
    }
    
    // If we have context but message is unclear
    if (memory.userBudget && !memory.userGoal) {
      return `I see you've got $${memory.userBudget.toLocaleString()} to invest. That opens up some interesting options.

Are you looking to:
- Buy and live in it yourself?
- Pure investment for rental income?
- Flip something for quick profit?

Each strategy has different sweet spots in Houston right now.`
    }
    
    if (memory.mentionedAreas && memory.mentionedAreas.length > 0) {
      return `You've mentioned ${memory.mentionedAreas.join(', ')}. 

What's most important for your decision - the neighborhood vibe, investment potential, or specific amenities like schools or commute?`
    }
    
    return `I want to make sure I'm actually helping here. 

Can you tell me more about what you're trying to accomplish? Like, are you moving to Houston, looking to invest, or something else entirely?`
  }
}

export const conversationalFernando = new ConversationalFernando()

// Helper function to determine if we should use conversational response
export function shouldUseConversationalResponse(message: string): boolean {
  const messageLower = message.toLowerCase()
  
  // Use conversational for:
  // - Questions about specific areas without data requests
  // - Budget discussions
  // - "What else" or follow-up questions
  // - Building/construction conversations
  // - General advice seeking
  // - Yes/no responses
  
  const conversationalTriggers = [
    'only have',
    'budget',
    'what else',
    'other options',
    'tell me more',
    'how about',
    'what about',
    'i want to',
    'i\'m looking',
    'i am looking',
    'i sm looking',  // common typo
    'should i',
    'what do you think',
    'yes',
    'no',
    'okay',
    'build',
    'construct',
    'advice',
    'recommend',
    'suggest',
    'help me',
    'first time',
    'new to',
    'buy',
    'buying',
    'purchase',
    'home',
    'house',
    'property'
  ]
  
  const dataRequestTriggers = [
    'population data',
    'market stats',
    'permit data',
    'developer data',
    'employment data',
    'demographic data',
    'rental data',
    'construction costs',
    'cap rates',
    'roi data'
  ]
  
  // If it's a data request, use the data engine
  if (dataRequestTriggers.some(trigger => messageLower.includes(trigger))) {
    return false
  }
  
  // If it's conversational, use conversational
  if (conversationalTriggers.some(trigger => messageLower.includes(trigger))) {
    return true
  }
  
  // Short messages are usually conversational
  if (message.split(' ').length < 10) {
    return true
  }
  
  return false
}