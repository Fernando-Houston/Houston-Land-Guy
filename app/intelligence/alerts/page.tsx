import MarketAlertsPanel from '@/components/alerts/MarketAlertsPanel'

export const metadata = {
  title: 'Market Alerts | Houston Development Intelligence',
  description: 'Real-time market alerts and notifications for Houston real estate opportunities.',
}

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Market Alerts</h1>
          <p className="text-gray-600 mt-2">
            Real-time notifications for price drops, new listings, and market trends
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MarketAlertsPanel />
      </div>
    </div>
  )
}