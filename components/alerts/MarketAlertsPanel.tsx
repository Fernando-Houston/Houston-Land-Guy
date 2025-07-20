'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, BellOff, Settings, Plus, Trash2, MapPin, DollarSign,
  Home, FileText, TrendingUp, Package, X, Check, AlertCircle,
  Clock, Mail, MessageSquare, Smartphone, Volume2, Filter
} from 'lucide-react'
import { marketAlerts } from '@/lib/services/market-alerts'
import type { Alert, AlertPreference, WatchedArea } from '@/lib/services/market-alerts'

export default function MarketAlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [preferences, setPreferences] = useState<AlertPreference | null>(null)
  const [watchedAreas, setWatchedAreas] = useState<WatchedArea[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showAddArea, setShowAddArea] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<Alert['type'] | 'all'>('all')
  
  // Mock user ID - in production get from auth
  const userId = 'user-123'

  useEffect(() => {
    loadData()
    
    // Subscribe to real-time alerts
    const unsubscribe = marketAlerts.subscribe(userId, (alert) => {
      setAlerts(prev => [alert, ...prev])
      setUnreadCount(prev => prev + 1)
      
      // Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(alert.title, {
          body: alert.message,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        })
      }
    })

    return unsubscribe
  }, [])

  const loadData = async () => {
    const [userAlerts, userPrefs, userAreas] = await Promise.all([
      marketAlerts.getAlerts(userId),
      marketAlerts.getAlertPreferences(userId),
      marketAlerts.getWatchedAreas(userId)
    ])
    
    setAlerts(userAlerts)
    setPreferences(userPrefs)
    setWatchedAreas(userAreas)
    setUnreadCount(userAlerts.filter(a => !a.read).length)
  }

  const handleMarkAsRead = async (alertId: string) => {
    await marketAlerts.markAsRead(userId, alertId)
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, read: true } : a))
    setUnreadCount(Math.max(0, unreadCount - 1))
  }

  const handleMarkAllAsRead = async () => {
    await marketAlerts.markAllAsRead(userId)
    setAlerts(alerts.map(a => ({ ...a, read: true })))
    setUnreadCount(0)
  }

  const handleDeleteAlert = async (alertId: string) => {
    await marketAlerts.deleteAlert(userId, alertId)
    setAlerts(alerts.filter(a => a.id !== alertId))
  }

  const handleUpdatePreferences = async (updates: Partial<AlertPreference>) => {
    await marketAlerts.setAlertPreferences(userId, updates)
    setPreferences({ ...preferences!, ...updates })
  }

  const handleAddWatchedArea = async (area: Omit<WatchedArea, 'id' | 'userId' | 'createdAt'>) => {
    const newArea = await marketAlerts.addWatchedArea(userId, area)
    setWatchedAreas([...watchedAreas, newArea])
    setShowAddArea(false)
  }

  const handleRemoveWatchedArea = async (areaId: string) => {
    await marketAlerts.removeWatchedArea(userId, areaId)
    setWatchedAreas(watchedAreas.filter(a => a.id !== areaId))
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price_drop': return <DollarSign className="h-5 w-5" />
      case 'new_listing': return <Home className="h-5 w-5" />
      case 'permit_filed': return <FileText className="h-5 w-5" />
      case 'market_trend': return <TrendingUp className="h-5 w-5" />
      case 'inventory_change': return <Package className="h-5 w-5" />
      case 'investment_opportunity': return <TrendingUp className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(a => a.type === filter)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Market Alerts</h2>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('price_drop')}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'price_drop'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Price Drops
          </button>
          <button
            onClick={() => setFilter('new_listing')}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'new_listing'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Listings
          </button>
          <button
            onClick={() => setFilter('market_trend')}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              filter === 'market_trend'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trends
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && preferences && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b overflow-hidden"
          >
            <div className="p-6 space-y-6">
              {/* Alert Types */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alert Types</h3>
                <div className="space-y-2">
                  {Object.entries(preferences.alertTypes).map(([key, enabled]) => (
                    <label key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleUpdatePreferences({
                          alertTypes: { ...preferences.alertTypes, [key]: e.target.checked }
                        })}
                        className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Channels */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Delivery Channels</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdatePreferences({
                      channels: { ...preferences.channels, email: !preferences.channels.email }
                    })}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      preferences.channels.email
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePreferences({
                      channels: { ...preferences.channels, push: !preferences.channels.push }
                    })}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      preferences.channels.push
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm font-medium">Push</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePreferences({
                      channels: { ...preferences.channels, sms: !preferences.channels.sms }
                    })}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      preferences.channels.sms
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">SMS</span>
                  </button>
                  <button
                    onClick={() => handleUpdatePreferences({
                      channels: { ...preferences.channels, inApp: !preferences.channels.inApp }
                    })}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                      preferences.channels.inApp
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                    <span className="text-sm font-medium">In-App</span>
                  </button>
                </div>
              </div>

              {/* Watched Areas */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Watched Areas</h3>
                  <button
                    onClick={() => setShowAddArea(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Area
                  </button>
                </div>
                <div className="space-y-2">
                  {watchedAreas.map(area => (
                    <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{area.name}</p>
                          <p className="text-xs text-gray-600">
                            {area.criteria.propertyTypes?.join(', ') || 'All property types'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveWatchedArea(area.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center">
            <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No alerts yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add watched areas to start receiving alerts
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredAlerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  !alert.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.message}
                        </p>
                        {alert.data.address && (
                          <p className="text-xs text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {alert.data.address}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!alert.read && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAlert(alert.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                          title="Delete alert"
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      {alert.data.propertyId && (
                        <a
                          href={`/properties/${alert.data.propertyId}`}
                          className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Property →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Area Modal */}
      <AnimatePresence>
        {showAddArea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddArea(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Watched Area</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleAddWatchedArea({
                  name: formData.get('name') as string,
                  type: 'zipcode',
                  boundaries: formData.get('zipcode') as string,
                  criteria: {
                    priceRange: {
                      min: Number(formData.get('minPrice')) || undefined,
                      max: Number(formData.get('maxPrice')) || undefined
                    }
                  },
                  alerts: {
                    priceDropPercent: 5,
                    inventoryChangePercent: 20
                  },
                  active: true
                })
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="e.g., River Oaks"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      name="zipcode"
                      type="text"
                      required
                      placeholder="77019"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Min Price
                      </label>
                      <input
                        name="minPrice"
                        type="number"
                        placeholder="$0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Price
                      </label>
                      <input
                        name="maxPrice"
                        type="number"
                        placeholder="No limit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddArea(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Area
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}