import { MarketIntelligenceDashboard } from '@/components/tools/MarketIntelligenceDashboard';

export const metadata = {
  title: 'Market Intelligence - Houston Development Intelligence',
  description: 'Real-time Houston market data, neighborhood comparisons, and development insights.',
};

export default function IntelligencePage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Market Intelligence
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Real-time data and insights for Houston's hottest development neighborhoods
          </p>
        </div>
        <MarketIntelligenceDashboard />
      </div>
    </div>
  );
}