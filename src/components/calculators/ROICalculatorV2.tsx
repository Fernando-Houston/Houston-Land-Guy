'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  ChevronRight,
  Save,
  Download
} from 'lucide-react';
import { createAutocompleteInput, extractAddressComponents } from '@/src/lib/google-maps';
import { useROICalculation, useLeadCapture, useSaveCalculation, usePropertyAnalysis } from '@/src/hooks/useAPI';
import { PropertyDetails, DevelopmentCosts, ROIProjection, LeadFormData } from '@/src/types/calculator';

const calculatorSchema = z.object({
  projectType: z.enum(['residential', 'commercial', 'mixed-use']),
  buildingSqFt: z.number().min(1000).max(1000000),
  qualityLevel: z.enum(['low', 'mid', 'high']),
  financingType: z.enum(['cash', 'loan']),
  loanTerms: z.object({
    downPayment: z.number().min(0).max(100),
    interestRate: z.number().min(0).max(20),
    loanTerm: z.number().min(1).max(30)
  }).optional()
});

const leadFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.enum(['residential', 'commercial', 'mixed-use']),
  investmentRange: z.string(),
  timeframe: z.string()
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;
type LeadFormData = z.infer<typeof leadFormSchema>;

export default function ROICalculatorV2() {
  const [step, setStep] = useState<'address' | 'details' | 'lead' | 'results'>('address');
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [developmentCosts, setDevelopmentCosts] = useState<DevelopmentCosts | null>(null);
  const [roiProjection, setROIProjection] = useState<ROIProjection | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculationId, setCalculationId] = useState<string | null>(null);
  const [savedCalculations, setSavedCalculations] = useState<string[]>([]);
  
  const addressInputRef = useRef<HTMLInputElement>(null);
  
  // API hooks
  const { calculate } = useROICalculation();
  const { capture } = useLeadCapture();
  const { save } = useSaveCalculation();
  const { data: propertyData, isLoading: propertyLoading } = usePropertyAnalysis(property?.address || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      projectType: 'residential',
      qualityLevel: 'mid',
      financingType: 'loan',
      loanTerms: {
        downPayment: 20,
        interestRate: 6.5,
        loanTerm: 30
      }
    }
  });

  const {
    register: registerLead,
    handleSubmit: handleSubmitLead,
    formState: { errors: leadErrors }
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema)
  });

  useEffect(() => {
    if (step === 'address' && addressInputRef.current) {
      createAutocompleteInput(addressInputRef.current, (place) => {
        const addressComponents = extractAddressComponents(place);
        const geometry = place.geometry!;
        
        setProperty({
          address: addressComponents.formatted,
          lat: geometry.location!.lat(),
          lng: geometry.location!.lng(),
          lotSize: 0,
          currentValue: 0,
          zoning: '',
          neighborhood: addressComponents.neighborhood
        });
        
        setStep('details');
      });
    }
  }, [step]);

  useEffect(() => {
    if (propertyData && property) {
      setProperty(prev => ({
        ...prev!,
        currentValue: propertyData.estimatedValue || 350000,
        lotSize: propertyData.lotSize || 7500,
        zoning: propertyData.zoning || 'Residential'
      }));
    }
  }, [propertyData, property]);

  const onCalculate = async (data: CalculatorFormData) => {
    if (!property) return;
    
    setLoading(true);
    try {
      // Call server-side ROI calculation
      const result = await calculate({
        property,
        ...data,
        userId: localStorage.getItem('userId') // Optional user tracking
      });

      setDevelopmentCosts(result.costs);
      setROIProjection(result.projection);
      setCalculationId(result.id);
      
      // Track interaction
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'roi_calculation_completed',
          properties: {
            projectType: data.projectType,
            buildingSqFt: data.buildingSqFt,
            roi: result.projection.roi
          }
        })
      });

      setStep('lead');
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onLeadSubmit = async (leadData: LeadFormData) => {
    setLoading(true);
    try {
      await capture({
        ...leadData,
        propertyAddress: property?.address,
        calculationId,
        calculatedROI: roiProjection?.roi,
        totalInvestment: developmentCosts?.total,
        source: 'roi_calculator'
      });

      // A/B test: Track lead capture point
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'lead_captured',
          properties: {
            capturePoint: 'after_calculation',
            email: leadData.email
          }
        })
      });

      setStep('results');
    } catch (error) {
      console.error('Lead submission error:', error);
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  const saveCalculation = useCallback(async () => {
    if (!calculationId) return;
    
    try {
      await save({ calculationId });
      setSavedCalculations(prev => [...prev, calculationId]);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center';
      notification.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Calculation saved successfully!
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [calculationId, save]);

  const downloadPDFReport = useCallback(async () => {
    if (!calculationId) return;
    
    try {
      const response = await fetch(`/api/reports/pdf/${calculationId}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `roi-report-${calculationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  }, [calculationId]);

  const startNewCalculation = () => {
    setStep('address');
    setProperty(null);
    setDevelopmentCosts(null);
    setROIProjection(null);
    setCalculationId(null);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="feature-card rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white relative overflow-hidden">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative">
            <h1 className="text-3xl font-bold mb-2">Houston Development ROI Calculator</h1>
            <p className="text-green-100">Calculate your potential returns in seconds</p>
            <div className="mt-4 flex items-center gap-6 text-sm text-green-100">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time data
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Market validated
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant results
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'address' && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      Property Address
                    </label>
                    <input
                      ref={addressInputRef}
                      type="text"
                      placeholder="Enter Houston property address..."
                      className="form-input text-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      Start typing an address in Houston to see suggestions
                    </p>
                  </div>
                  
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                      <span className="ml-3 text-gray-600">Analyzing property data...</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'details' && property && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <form onSubmit={handleSubmit(onCalculate)} className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Address:</span>
                        <p className="font-medium">{property.address}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Value:</span>
                        <p className="font-medium">
                          {propertyLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin inline" />
                          ) : (
                            `$${property.currentValue.toLocaleString()}`
                          )}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Lot Size:</span>
                        <p className="font-medium">{property.lotSize.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Zoning:</span>
                        <p className="font-medium">{property.zoning}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Type
                      </label>
                      <select
                        {...register('projectType')}
                        className="form-input"
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed-use">Mixed Use</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Building Size (sq ft)
                      </label>
                      <input
                        type="number"
                        {...register('buildingSqFt', { valueAsNumber: true })}
                        placeholder="e.g., 25000"
                        className="form-input"
                      />
                      {errors.buildingSqFt && (
                        <p className="text-red-500 text-xs mt-1">{errors.buildingSqFt.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality Level
                      </label>
                      <select
                        {...register('qualityLevel')}
                        className="form-input"
                      >
                        <option value="low">Economy</option>
                        <option value="mid">Standard</option>
                        <option value="high">Premium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Financing Type
                      </label>
                      <select
                        {...register('financingType')}
                        className="form-input"
                      >
                        <option value="cash">Cash</option>
                        <option value="loan">Loan</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="cta-primary w-full flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Calculate ROI
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'lead' && (
              <motion.div
                key="lead"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your ROI Analysis is Ready!
                  </h2>
                  <p className="text-gray-600">
                    Get your detailed report with market insights and projections
                  </p>
                </div>

                <form onSubmit={handleSubmitLead(onLeadSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        {...registerLead('firstName')}
                        className="form-input"
                      />
                      {leadErrors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{leadErrors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        {...registerLead('lastName')}
                        className="form-input"
                      />
                      {leadErrors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{leadErrors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        {...registerLead('email')}
                        className="form-input"
                      />
                      {leadErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{leadErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        {...registerLead('phone')}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investment Range
                      </label>
                      <select
                        {...registerLead('investmentRange')}
                        className="form-input"
                      >
                        <option value="<500k">Under $500K</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value=">5m">Over $5M</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Timeline
                      </label>
                      <select
                        {...registerLead('timeframe')}
                        className="form-input"
                      >
                        <option value="immediate">Immediate (0-3 months)</option>
                        <option value="short">Short-term (3-6 months)</option>
                        <option value="medium">Medium-term (6-12 months)</option>
                        <option value="long">Long-term (12+ months)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Get My Detailed Report
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('results')}
                      className="cta-secondary"
                    >
                      Skip
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 'results' && developmentCosts && roiProjection && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Your ROI Analysis
                    </h2>
                    <div className="flex items-center justify-center space-x-4 text-lg">
                      <span className="text-gray-600">Projected ROI:</span>
                      <span className={`text-4xl font-bold ${roiProjection.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roiProjection.roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={saveCalculation}
                      disabled={savedCalculations.includes(calculationId!)}
                      className="cta-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {savedCalculations.includes(calculationId!) ? 'Saved' : 'Save Calculation'}
                    </button>
                    <button
                      onClick={downloadPDFReport}
                      className="cta-secondary flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        Development Costs
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Land Acquisition</span>
                          <span className="font-medium">${developmentCosts.landAcquisition.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Construction</span>
                          <span className="font-medium">${developmentCosts.construction.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Permits & Fees</span>
                          <span className="font-medium">${developmentCosts.permits.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilities</span>
                          <span className="font-medium">${developmentCosts.utilities.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contingency</span>
                          <span className="font-medium">${developmentCosts.contingency.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Financing</span>
                          <span className="font-medium">${developmentCosts.financing.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-300">
                          <span className="font-semibold">Total Investment</span>
                          <span className="font-bold text-lg">${developmentCosts.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                        Profit Projections
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Projected Revenue</span>
                          <span className="font-medium">${roiProjection.projectedRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Net Profit</span>
                          <span className={`font-medium ${roiProjection.netProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${roiProjection.netProfit.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI</span>
                          <span className={`font-medium ${roiProjection.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {roiProjection.roi.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IRR (Annual)</span>
                          <span className="font-medium">{roiProjection.irr.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payback Period</span>
                          <span className="font-medium">{roiProjection.paybackPeriod.toFixed(1)} months</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Project Timeline</h3>
                    <div className="space-y-2">
                      {roiProjection.timeline.map((phase, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700">{phase.phase}</span>
                          <span className="text-sm text-gray-600">
                            Months {phase.startMonth + 1}-{phase.endMonth} ({phase.duration} months)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={startNewCalculation}
                      className="cta-primary px-8"
                    >
                      Calculate Another Property
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}