// Fernando-X Voice Interface
// Enables voice input and output for natural conversations

export interface VoiceConfig {
  language: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  voiceName?: string
  pitch?: number
  rate?: number
}

export interface VoiceTranscript {
  text: string
  confidence: number
  isFinal: boolean
  alternatives?: Array<{
    text: string
    confidence: number
  }>
}

export interface VoiceSession {
  id: string
  isListening: boolean
  isProcessing: boolean
  isSpeaking: boolean
  transcript: string
  error?: string
}

export type VoiceEventType = 
  | 'start'
  | 'stop'
  | 'result'
  | 'error'
  | 'speechstart'
  | 'speechend'
  | 'soundstart'
  | 'soundend'

export interface VoiceEvent {
  type: VoiceEventType
  data?: any
  timestamp: Date
}

class VoiceInterface {
  private recognition: any // SpeechRecognition
  private synthesis: SpeechSynthesis
  private config: VoiceConfig
  private session: VoiceSession | null = null
  private listeners: Map<VoiceEventType, Array<(event: VoiceEvent) => void>> = new Map()
  private wakeWordDetector: any = null
  private audioContext: AudioContext | null = null
  private isInitialized: boolean = false
  
  constructor(config: Partial<VoiceConfig> = {}) {
    this.config = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      maxAlternatives: 3,
      voiceName: 'Google US English',
      pitch: 1.0,
      rate: 1.0,
      ...config
    }
    
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis
    }
  }
  
  // Initialize voice interface
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true
    
    try {
      // Check browser support
      if (!this.checkBrowserSupport()) {
        throw new Error('Speech recognition not supported in this browser')
      }
      
      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition
      
      this.recognition = new SpeechRecognition()
      this.configureRecognition()
      
      // Initialize audio context for advanced features
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Load voices
      await this.loadVoices()
      
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize voice interface:', error)
      return false
    }
  }
  
  // Check browser support
  private checkBrowserSupport(): boolean {
    if (typeof window === 'undefined') return false
    
    const hasSpeechRecognition = 'SpeechRecognition' in window || 
                                'webkitSpeechRecognition' in window
    const hasSpeechSynthesis = 'speechSynthesis' in window
    
    return hasSpeechRecognition && hasSpeechSynthesis
  }
  
  // Configure speech recognition
  private configureRecognition() {
    if (!this.recognition) return
    
    this.recognition.continuous = this.config.continuous
    this.recognition.interimResults = this.config.interimResults
    this.recognition.maxAlternatives = this.config.maxAlternatives
    this.recognition.lang = this.config.language
    
    // Set up event handlers
    this.recognition.onstart = () => {
      this.emit('start', { sessionId: this.session?.id })
    }
    
    this.recognition.onresult = (event: any) => {
      const results = this.processResults(event.results)
      this.emit('result', results)
      
      // Update session transcript
      if (this.session && results.length > 0) {
        const bestResult = results[0]
        if (bestResult.isFinal) {
          this.session.transcript = bestResult.text
        }
      }
    }
    
    this.recognition.onerror = (event: any) => {
      const error = `Speech recognition error: ${event.error}`
      this.emit('error', { error, details: event })
      
      if (this.session) {
        this.session.error = error
        this.session.isListening = false
      }
    }
    
    this.recognition.onend = () => {
      this.emit('stop', { sessionId: this.session?.id })
      if (this.session) {
        this.session.isListening = false
      }
    }
    
    this.recognition.onspeechstart = () => {
      this.emit('speechstart', {})
    }
    
    this.recognition.onspeechend = () => {
      this.emit('speechend', {})
    }
    
    this.recognition.onsoundstart = () => {
      this.emit('soundstart', {})
    }
    
    this.recognition.onsoundend = () => {
      this.emit('soundend', {})
    }
  }
  
  // Process recognition results
  private processResults(results: any): VoiceTranscript[] {
    const transcripts: VoiceTranscript[] = []
    
    for (let i = results.length - 1; i >= 0; i--) {
      const result = results[i]
      const alternatives: Array<{ text: string; confidence: number }> = []
      
      for (let j = 0; j < result.length; j++) {
        alternatives.push({
          text: result[j].transcript,
          confidence: result[j].confidence || 0
        })
      }
      
      if (alternatives.length > 0) {
        transcripts.push({
          text: alternatives[0].text,
          confidence: alternatives[0].confidence,
          isFinal: result.isFinal,
          alternatives: alternatives.slice(1)
        })
      }
    }
    
    return transcripts
  }
  
  // Start listening
  async startListening(): Promise<VoiceSession> {
    if (!this.isInitialized) {
      await this.initialize()
    }
    
    if (!this.recognition) {
      throw new Error('Speech recognition not initialized')
    }
    
    // Create new session
    this.session = {
      id: this.generateSessionId(),
      isListening: true,
      isProcessing: false,
      isSpeaking: false,
      transcript: ''
    }
    
    try {
      // Request microphone permission
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } else {
        throw new Error('Navigator not available')
      }
      
      // Start recognition
      this.recognition.start()
      
      return this.session
    } catch (error) {
      this.session.isListening = false
      this.session.error = 'Microphone access denied'
      throw error
    }
  }
  
  // Stop listening
  stopListening() {
    if (this.recognition && this.session?.isListening) {
      this.recognition.stop()
      this.session.isListening = false
    }
  }
  
  // Speak text
  async speak(text: string, options: {
    voiceName?: string
    pitch?: number
    rate?: number
    volume?: number
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not available'))
        return
      }
      
      // Cancel any ongoing speech
      this.synthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Configure voice
      const voices = this.synthesis.getVoices()
      const voiceName = options.voiceName || this.config.voiceName
      const voice = voices.find(v => v.name === voiceName) || voices[0]
      
      if (voice) {
        utterance.voice = voice
      }
      
      utterance.pitch = options.pitch || this.config.pitch || 1.0
      utterance.rate = options.rate || this.config.rate || 1.0
      utterance.volume = options.volume || 1.0
      utterance.lang = this.config.language
      
      // Update session state
      if (this.session) {
        this.session.isSpeaking = true
      }
      
      utterance.onend = () => {
        if (this.session) {
          this.session.isSpeaking = false
        }
        resolve()
      }
      
      utterance.onerror = (event) => {
        if (this.session) {
          this.session.isSpeaking = false
        }
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }
      
      this.synthesis.speak(utterance)
    })
  }
  
  // Stop speaking
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel()
      if (this.session) {
        this.session.isSpeaking = false
      }
    }
  }
  
  // Load available voices
  private async loadVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const loadVoicesTimeout = setTimeout(() => {
        resolve(this.synthesis.getVoices())
      }, 100)
      
      this.synthesis.onvoiceschanged = () => {
        clearTimeout(loadVoicesTimeout)
        resolve(this.synthesis.getVoices())
      }
    })
  }
  
  // Get available voices
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : []
  }
  
  // Set voice configuration
  setConfig(config: Partial<VoiceConfig>) {
    this.config = { ...this.config, ...config }
    
    if (this.recognition) {
      this.recognition.lang = this.config.language
      this.recognition.continuous = this.config.continuous
      this.recognition.interimResults = this.config.interimResults
      this.recognition.maxAlternatives = this.config.maxAlternatives
    }
  }
  
  // Event handling
  on(event: VoiceEventType, callback: (event: VoiceEvent) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }
  
  off(event: VoiceEventType, callback: (event: VoiceEvent) => void) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  private emit(type: VoiceEventType, data?: any) {
    const event: VoiceEvent = {
      type,
      data,
      timestamp: new Date()
    }
    
    const callbacks = this.listeners.get(type)
    if (callbacks) {
      callbacks.forEach(callback => callback(event))
    }
  }
  
  // Wake word detection (Hey Fernando)
  async enableWakeWord(wakePhrase: string = 'hey fernando'): Promise<void> {
    // This would integrate with a wake word detection service
    // For now, we'll use continuous recognition with keyword matching
    
    this.wakeWordDetector = {
      phrase: wakePhrase.toLowerCase(),
      isActive: true
    }
    
    // Set up continuous listening for wake word
    this.on('result', (event) => {
      if (this.wakeWordDetector?.isActive && event.data) {
        const transcripts = event.data as VoiceTranscript[]
        for (const transcript of transcripts) {
          if (transcript.text.toLowerCase().includes(this.wakeWordDetector.phrase)) {
            this.onWakeWordDetected()
            break
          }
        }
      }
    })
  }
  
  private onWakeWordDetected() {
    // Play acknowledgment sound
    this.playSound('wake')
    
    // Emit wake word event
    this.emit('wakeword' as VoiceEventType, { detected: true })
    
    // Start active listening
    if (this.session) {
      this.session.isProcessing = true
    }
  }
  
  // Play feedback sounds
  private playSound(type: 'wake' | 'start' | 'stop' | 'error') {
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    // Configure sound based on type
    switch (type) {
      case 'wake':
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
        break
      case 'start':
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        break
      case 'stop':
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
        break
      case 'error':
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
        break
    }
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }
  
  // Generate session ID
  private generateSessionId(): string {
    return `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  // Get current session
  getSession(): VoiceSession | null {
    return this.session
  }
  
  // Clean up
  destroy() {
    this.stopListening()
    this.stopSpeaking()
    
    if (this.audioContext) {
      this.audioContext.close()
    }
    
    this.listeners.clear()
    this.session = null
    this.isInitialized = false
  }
}

// Singleton instance
export const voiceInterface = new VoiceInterface()
export default VoiceInterface