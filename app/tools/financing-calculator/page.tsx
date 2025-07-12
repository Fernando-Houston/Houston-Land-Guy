'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calculator, FileText, Download, Info, PiggyBank, Building } from 'lucide-react';
import { trackToolUsage } from '@/components/analytics/GoogleAnalytics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LeadCaptureForm } from '@/components/forms/LeadCaptureForm';

// Current market rates (normally would fetch from API)
const currentRates = {
  construction: {
    prime: 7.25,
    spread: 1.5,
    effective: 8.75
  },
  permanent: {
    commercial: 7.5,
    sba504: 6.8,
    conventional: 7.2,
    hardMoney: 12.5
  }
};

const loanTypes = [
  {
    id: 'construction',
    name: 'Construction Loan',
    description: 'Short-term financing for building phase',
    term: '12-18 months',
    rate: currentRates.construction.effective,
    ltv: 80,
    features: ['Interest-only payments', 'Draws based on completion', 'Converts to permanent']
  },
  {
    id: 'conventional',
    name: 'Conventional Commercial',
    description: 'Traditional bank financing',
    term: '20-25 years',
    rate: currentRates.permanent.conventional,
    ltv: 75,
    features: ['Fixed or variable rates', '20% down typical', 'Personal guarantee required']
  },
  {
    id: 'sba504',
    name: 'SBA 504 Loan',
    description: 'Government-backed for owner-occupied',
    term: '10-20 years',
    rate: currentRates.permanent.sba504,
    ltv: 90,
    features: ['10% down payment', 'Below-market rates', 'Owner-occupancy required']
  },
  {
    id: 'bridge',
    name: 'Bridge/Hard Money',
    description: 'Fast, short-term financing',
    term: '6-24 months',
    rate: currentRates.permanent.hardMoney,
    ltv: 70,
    features: ['Quick closing', 'Asset-based', 'Higher rates']
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function FinancingCalculatorPage() {
  const [projectCost, setProjectCost] = useState(1000000);
  const [downPayment, setDownPayment] = useState(200000);
  const [loanAmount, setLoanAmount] = useState(800000);
  const [selectedLoanType, setSelectedLoanType] = useState('conventional');
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(currentRates.permanent.conventional);
  const [showResults, setShowResults] = useState(false);
  const [capturedLead, setCapturedLead] = useState(false);

  // Calculate loan details
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTerm * 12;
  const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalPayments = monthlyPayment * numPayments;
  const totalInterest = totalPayments - loanAmount;

  // Generate amortization schedule
  const generateAmortizationData = () => {
    const data = [];
    let balance = loanAmount;
    
    for (let year = 1; year <= Math.min(loanTerm, 10); year++) {
      const yearlyInterest = balance * (interestRate / 100);
      const yearlyPrincipal = (monthlyPayment * 12) - yearlyInterest;
      balance -= yearlyPrincipal;
      
      data.push({
        year: `Year ${year}`,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(Math.max(0, balance))
      });
    }
    
    return data;
  };

  // Payment breakdown for pie chart
  const paymentBreakdown = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest }
  ];

  // Comparison data
  const loanComparison = loanTypes.map(loan => ({
    name: loan.name,
    monthlyPayment: calculateMonthlyPayment(loanAmount, loan.rate, loan.id === 'construction' ? 1 : 20),
    totalCost: calculateTotalCost(loanAmount, loan.rate, loan.id === 'construction' ? 1 : 20),
    rate: loan.rate
  }));

  function calculateMonthlyPayment(amount: number, rate: number, term: number) {
    const r = rate / 100 / 12;
    const n = term * 12;
    return amount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  function calculateTotalCost(amount: number, rate: number, term: number) {
    return calculateMonthlyPayment(amount, rate, term) * term * 12;
  }

  useEffect(() => {
    setLoanAmount(projectCost - downPayment);
  }, [projectCost, downPayment]);

  useEffect(() => {
    const loan = loanTypes.find(l => l.id === selectedLoanType);
    if (loan) {
      setInterestRate(loan.rate);
    }
  }, [selectedLoanType]);

  const handleCalculate = () => {
    setShowResults(true);
    trackToolUsage('Financing Calculator', 'calculate');
  };

  const handleLeadCapture = () => {
    setCapturedLead(true);
  };

  const downloadReport = () => {
    alert('Downloading detailed financing report...');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Development Financing Calculator</h1>
          <p className="text-gray-600">
            Compare loan options and calculate payments for your Houston development project
          </p>
        </motion.div>

        {/* Current Rates */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Current Market Rates (December 2024)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Construction</p>
              <p className="text-xl font-bold text-blue-600">{currentRates.construction.effective}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Conventional</p>
              <p className="text-xl font-bold text-blue-600">{currentRates.permanent.conventional}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">SBA 504</p>
              <p className="text-xl font-bold text-blue-600">{currentRates.permanent.sba504}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Hard Money</p>
              <p className="text-xl font-bold text-blue-600">{currentRates.permanent.hardMoney}%</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Project Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Project Cost
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={projectCost}
                      onChange={(e) => setProjectCost(Number(e.target.value))}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {((downPayment / projectCost) * 100).toFixed(1)}% down
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Loan Amount:</span>
                    <span className="font-bold text-green-600">
                      ${loanAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Loan Options
              </h3>
              
              <div className="space-y-3">
                {loanTypes.map((loan) => (
                  <label
                    key={loan.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedLoanType === loan.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="loanType"
                      value={loan.id}
                      checked={selectedLoanType === loan.id}
                      onChange={(e) => setSelectedLoanType(e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{loan.name}</h4>
                        <span className="text-sm font-bold text-green-600">{loan.rate}%</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{loan.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {loan.term}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {loan.ltv}% LTV
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full mt-6 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Calculate Financing
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {showResults ? (
              <>
                {/* Payment Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Payment</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Interest</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Payments</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${totalPayments.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Effective Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{interestRate}%</p>
                    </div>
                  </div>
                </div>

                {/* Loan Comparison Chart */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Loan Type Comparison</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={loanComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      <Bar dataKey="monthlyPayment" fill="#3B82F6" name="Monthly Payment" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Payment Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={paymentBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {paymentBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                    <ul className="space-y-2">
                      {loanTypes.find(l => l.id === selectedLoanType)?.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Amortization Schedule */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Amortization Schedule (First 10 Years)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={generateAmortizationData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="principal" stroke="#10B981" name="Principal" strokeWidth={2} />
                      <Line type="monotone" dataKey="interest" stroke="#EF4444" name="Interest" strokeWidth={2} />
                      <Line type="monotone" dataKey="balance" stroke="#3B82F6" name="Balance" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* CTA Section */}
                {!capturedLead && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8"
                  >
                    <h3 className="text-xl font-semibold mb-4">Get Personalized Financing Options</h3>
                    <p className="text-gray-700 mb-6">
                      Connect with our network of Houston development lenders for competitive rates and terms tailored to your project.
                    </p>
                    <LeadCaptureForm 
                      source="financing_calculator"
                      onSuccess={handleLeadCapture}
                      buttonText="Get Lender Recommendations"
                    />
                  </motion.div>
                )}

                {capturedLead && (
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700 mb-4">
                      We'll connect you with top Houston development lenders within 24 hours.
                    </p>
                    <button
                      onClick={downloadReport}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Financing Report
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Ready to Calculate Your Financing?
                </h3>
                <p className="text-gray-600">
                  Enter your project details and select a loan type to see detailed payment calculations
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-yellow-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Houston Development Financing Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p>• Construction loans typically convert to permanent financing</p>
              <p>• SBA 504 requires 51% owner occupancy for eligibility</p>
              <p>• Most lenders require 20-25% down for development projects</p>
            </div>
            <div>
              <p>• Personal guarantees are standard for loans under $5M</p>
              <p>• Pre-leasing can improve loan terms significantly</p>
              <p>• Consider rate locks for volatile interest environments</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}