'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import { trackConversion } from '@/components/analytics/GoogleAnalytics'

interface LeadCaptureFormProps {
  source: string
  onSuccess?: (data: FormData) => void
  className?: string
  buttonText?: string
  showProjectDetails?: boolean
  glassmorphism?: boolean
}

interface FormData {
  name: string
  email: string
  phone?: string
  message?: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export function LeadCaptureForm({ source, onSuccess, className, buttonText = "Get Started", showProjectDetails = false, glassmorphism = false }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('You\'re already registered! We\'ll be in touch soon.')
        } else if (data.details) {
          toast.error(data.details[0]?.message || 'Please check your information')
        } else {
          toast.error(data.error || 'Failed to submit form')
        }
        return
      }

      toast.success('Thank you! We\'ll contact you within 24 hours.')
      
      // Track conversion in Google Analytics
      trackConversion(`lead_${source}`, 100)
      
      onSuccess?.(formData)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      })
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className={cn('space-y-4', className)}
    >
      <div>
        <label htmlFor="name" className={cn(
          "block text-sm font-medium",
          glassmorphism ? "text-white/90" : "text-gray-700"
        )}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          className={cn(
            "mt-1 block w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 border",
            glassmorphism ? [
              "bg-white/10 border-white/20 text-white placeholder-white/60",
              "backdrop-blur-sm focus:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30",
              errors.name ? "border-red-400" : "border-white/20"
            ] : [
              "form-input",
              errors.name ? "border-red-300" : "border-gray-300"
            ],
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="email" className={cn(
          "block text-sm font-medium",
          glassmorphism ? "text-white/90" : "text-gray-700"
        )}>
          Email <span className={glassmorphism ? "text-red-400" : "text-red-500"}>*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          className={cn(
            "mt-1 block w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 border",
            glassmorphism ? [
              "bg-white/10 border-white/20 text-white placeholder-white/60",
              "backdrop-blur-sm focus:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30",
              errors.email ? "border-red-400" : "border-white/20"
            ] : [
              "form-input",
              errors.email ? "border-red-300" : "border-gray-300"
            ],
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className={cn(
          "block text-sm font-medium",
          glassmorphism ? "text-white/90" : "text-gray-700"
        )}>
          Phone (Optional)
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="(123) 456-7890"
          className={cn(
            "mt-1 block w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 border",
            glassmorphism ? [
              "bg-white/10 border-white/20 text-white placeholder-white/60",
              "backdrop-blur-sm focus:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30",
              errors.phone ? "border-red-400" : "border-white/20"
            ] : [
              "form-input",
              errors.phone ? "border-red-300" : "border-gray-300"
            ],
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        />
        {errors.phone && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-600"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      <div>
        <label htmlFor="message" className={cn(
          "block text-sm font-medium",
          glassmorphism ? "text-white/90" : "text-gray-700"
        )}>
          Message (Optional)
        </label>
        <textarea
          name="message"
          id="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Tell us about your development project..."
          className={cn(
            "mt-1 block w-full rounded-lg px-4 py-3 text-sm transition-all duration-200 resize-none border",
            glassmorphism ? [
              "bg-white/10 border-white/20 text-white placeholder-white/60",
              "backdrop-blur-sm focus:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30",
              errors.message ? "border-red-400" : "border-white/20"
            ] : [
              "form-input",
              errors.message ? "border-red-300" : "border-gray-300"
            ],
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>

      <motion.button
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className={cn(
          glassmorphism ? [
            'w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-lg',
            'backdrop-blur-sm border border-white/30 transition-all duration-200',
            'hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50'
          ] : 'cta-primary w-full justify-center',
          isSubmitting && 'opacity-70 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Submitting...
          </>
        ) : (
          buttonText
        )}
      </motion.button>
    </motion.form>
  )
}