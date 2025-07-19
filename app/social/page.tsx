import SocialFeed from '@/components/social/SocialFeed'

export const metadata = {
  title: 'Community | Houston Development Intelligence',
  description: 'Connect with Houston real estate professionals, share insights, and discover opportunities.',
}

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600 mt-2">
            Connect with Houston real estate professionals, share market insights, and discover opportunities
          </p>
        </div>
      </div>
      <SocialFeed />
    </div>
  )
}