import ROICalculator from '@/src/components/calculators/ROICalculatorV2';

export const metadata = {
  title: 'ROI Calculator - Houston Development Intelligence',
  description: 'Calculate your potential return on investment for Houston development projects with our advanced ROI calculator.',
};

export default function ROICalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="container mx-auto px-4">
        <ROICalculator />
      </div>
    </main>
  );
}