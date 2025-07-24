'use client';

import { useState, useEffect } from 'react';
import { Settings, Plus, X, GripVertical, Eye, EyeOff } from 'lucide-react';

interface Widget {
  id: string;
  name: string;
  component: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  category: 'market' | 'portfolio' | 'activity' | 'tools';
}

interface DashboardLayout {
  widgets: Widget[];
  columns: number;
}

const availableWidgets: Omit<Widget, 'enabled' | 'position'>[] = [
  {
    id: 'market-overview',
    name: 'Market Overview',
    component: 'MarketOverviewWidget',
    size: 'medium',
    category: 'market'
  },
  {
    id: 'saved-searches',
    name: 'Saved Searches',
    component: 'SavedSearchesWidget',
    size: 'medium',
    category: 'activity'
  },
  {
    id: 'recent-activity',
    name: 'Recent Activity',
    component: 'RecentActivityWidget',
    size: 'medium',
    category: 'activity'
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    component: 'QuickActionsWidget',
    size: 'small',
    category: 'tools'
  },
  {
    id: 'portfolio-summary',
    name: 'Portfolio Summary',
    component: 'PortfolioSummaryWidget',
    size: 'medium',
    category: 'portfolio'
  },
  {
    id: 'market-heatmap',
    name: 'Market Heat Map',
    component: 'MarketHeatMap',
    size: 'large',
    category: 'market'
  }
];

interface DashboardCustomizerProps {
  onLayoutChange: (layout: DashboardLayout) => void;
  currentLayout: DashboardLayout;
}

export default function DashboardCustomizer({ onLayoutChange, currentLayout }: DashboardCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState<DashboardLayout>(currentLayout);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  useEffect(() => {
    setLayout(currentLayout);
  }, [currentLayout]);

  const handleToggleWidget = (widgetId: string) => {
    const updatedWidgets = layout.widgets.map(widget =>
      widget.id === widgetId
        ? { ...widget, enabled: !widget.enabled }
        : widget
    );
    
    const newLayout = { ...layout, widgets: updatedWidgets };
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleAddWidget = (widgetToAdd: Omit<Widget, 'enabled' | 'position'>) => {
    const maxPosition = Math.max(...layout.widgets.map(w => w.position), -1);
    const newWidget: Widget = {
      ...widgetToAdd,
      enabled: true,
      position: maxPosition + 1
    };
    
    const newLayout = {
      ...layout,
      widgets: [...layout.widgets, newWidget]
    };
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleRemoveWidget = (widgetId: string) => {
    const updatedWidgets = layout.widgets.filter(widget => widget.id !== widgetId);
    const newLayout = { ...layout, widgets: updatedWidgets };
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleReorderWidget = (widgetId: string, newPosition: number) => {
    const updatedWidgets = layout.widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, position: newPosition };
      }
      if (widget.position >= newPosition && widget.id !== widgetId) {
        return { ...widget, position: widget.position + 1 };
      }
      return widget;
    });
    
    const newLayout = { ...layout, widgets: updatedWidgets };
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();
    
    if (!draggedWidget || draggedWidget === targetWidgetId) {
      setDraggedWidget(null);
      return;
    }

    const draggedWidgetData = layout.widgets.find(w => w.id === draggedWidget);
    const targetWidgetData = layout.widgets.find(w => w.id === targetWidgetId);
    
    if (draggedWidgetData && targetWidgetData) {
      handleReorderWidget(draggedWidget, targetWidgetData.position);
    }
    
    setDraggedWidget(null);
  };

  const enabledWidgets = layout.widgets.filter(w => w.enabled).sort((a, b) => a.position - b.position);
  const availableToAdd = availableWidgets.filter(aw => 
    !layout.widgets.some(w => w.id === aw.id)
  );

  const resetToDefault = () => {
    const defaultLayout: DashboardLayout = {
      columns: 3,
      widgets: [
        { ...availableWidgets[0], enabled: true, position: 0 }, // Market Overview
        { ...availableWidgets[3], enabled: true, position: 1 }, // Quick Actions
        { ...availableWidgets[1], enabled: true, position: 2 }, // Saved Searches
        { ...availableWidgets[2], enabled: true, position: 3 }, // Recent Activity
        { ...availableWidgets[4], enabled: true, position: 4 }, // Portfolio Summary
        { ...availableWidgets[5], enabled: true, position: 5 }  // Market Heat Map
      ]
    };
    setLayout(defaultLayout);
    onLayoutChange(defaultLayout);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'market':
        return '📊';
      case 'portfolio':
        return '💼';
      case 'activity':
        return '⚡';
      case 'tools':
        return '🛠️';
      default:
        return '📋';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        <Settings className="w-4 h-4 mr-2" />
        Customize Dashboard
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Dashboard Settings</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* Current Widgets */}
            <div className="px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Current Widgets</h4>
              <div className="space-y-2">
                {enabledWidgets.map((widget) => (
                  <div
                    key={widget.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, widget.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, widget.id)}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{getCategoryIcon(widget.category)}</span>
                      <span className="text-sm font-medium text-gray-900">{widget.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleWidget(widget.id)}
                        className="p-1 text-gray-500 hover:text-gray-700 rounded"
                      >
                        {widget.enabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRemoveWidget(widget.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Widgets */}
            {availableToAdd.length > 0 && (
              <div className="px-4 py-3 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Available Widgets</h4>
                <div className="space-y-2">
                  {availableToAdd.map((widget) => (
                    <div
                      key={widget.id}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getCategoryIcon(widget.category)}</span>
                        <span className="text-sm font-medium text-gray-900">{widget.name}</span>
                      </div>
                      <button
                        onClick={() => handleAddWidget(widget)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout Options */}
            <div className="px-4 py-3">
              <h4 className="font-medium text-gray-900 mb-3">Layout Options</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Columns</label>
                  <select
                    value={layout.columns}
                    onChange={(e) => {
                      const newLayout = { ...layout, columns: parseInt(e.target.value) };
                      setLayout(newLayout);
                      onLayoutChange(newLayout);
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                  </select>
                </div>
                
                <button
                  onClick={resetToDefault}
                  className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}