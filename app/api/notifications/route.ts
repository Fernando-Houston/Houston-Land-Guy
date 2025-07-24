import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    // Mock notifications data for now
    // In production, this would query a Notifications table
    const mockNotifications = [
      {
        id: 'notif_1',
        userId: userId || 'demo_user',
        title: 'Market Alert: River Oaks',
        message: 'New luxury listing detected - $2.8M, 15% below market value',
        type: 'market',
        category: 'market',
        priority: 'high',
        read: false,
        actionUrl: '/intelligence/deal-flow',
        actionLabel: 'View Opportunity',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        data: {
          zipCode: '77019',
          propertyValue: 2800000,
          marketValue: 3300000,
          savings: 500000
        }
      },
      {
        id: 'notif_2',
        userId: userId || 'demo_user',
        title: 'Deal Flow Update',
        message: '3 new properties match your investment criteria',
        type: 'deal',
        category: 'deal',
        priority: 'medium',
        read: false,
        actionUrl: '/intelligence/deal-flow',
        actionLabel: 'Review Deals',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        data: {
          newDeals: 3,
          totalMatches: 12,
          avgScore: 87
        }
      },
      {
        id: 'notif_3',
        userId: userId || 'demo_user',
        title: 'Price Drop Alert',
        message: 'Memorial property reduced by $75,000 - now $825,000',
        type: 'warning',
        category: 'alert',
        priority: 'medium',
        read: true,
        actionUrl: '/properties/memorial-123',
        actionLabel: 'View Property',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        data: {
          previousPrice: 900000,
          currentPrice: 825000,
          reduction: 75000,
          address: '123 Memorial Dr'
        }
      },
      {
        id: 'notif_4',
        userId: userId || 'demo_user',
        title: 'Market Intelligence Report',
        message: 'Weekly Houston market analysis is ready',
        type: 'info',
        category: 'update',
        priority: 'low',
        read: true,
        actionUrl: '/reports/weekly',
        actionLabel: 'Read Report',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        data: {
          reportType: 'weekly',
          dataPoints: 1247,
          insights: 15
        }
      },
      {
        id: 'notif_5',
        userId: userId || 'demo_user',
        title: 'Portfolio Update',
        message: 'Your Heights property appreciated 3.2% this month',
        type: 'success',
        category: 'market',
        priority: 'low',
        read: true,
        actionUrl: '/intelligence/portfolio',
        actionLabel: 'View Portfolio',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        data: {
          property: 'Heights Property',
          appreciation: 3.2,
          newValue: 512000,
          previousValue: 496000
        }
      }
    ];

    let filteredNotifications = mockNotifications;

    // Filter by category if specified
    if (category) {
      filteredNotifications = filteredNotifications.filter(n => n.category === category);
    }

    // Filter by read status if specified
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.read);
    }

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit);

    const summary = {
      total: mockNotifications.length,
      unread: mockNotifications.filter(n => !n.read).length,
      categories: {
        market: mockNotifications.filter(n => n.category === 'market').length,
        deal: mockNotifications.filter(n => n.category === 'deal').length,
        alert: mockNotifications.filter(n => n.category === 'alert').length,
        update: mockNotifications.filter(n => n.category === 'update').length
      }
    };

    return NextResponse.json({
      success: true,
      notifications: filteredNotifications,
      summary,
      pagination: {
        limit,
        total: filteredNotifications.length,
        hasMore: mockNotifications.length > limit
      }
    });

  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, message, type, category, priority, actionUrl, actionLabel, data } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would create a notification in the database
    const newNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      type: type || 'info',
      category: category || 'system',
      priority: priority || 'medium',
      read: false,
      actionUrl: actionUrl || null,
      actionLabel: actionLabel || null,
      timestamp: new Date(),
      data: data || {}
    };

    return NextResponse.json({
      success: true,
      notification: newNotification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, action, userId } = body;

    if (!notificationId || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing notification ID or action' },
        { status: 400 }
      );
    }

    // Mock update logic
    // In production, this would update the notification in the database
    let result;

    switch (action) {
      case 'markAsRead':
        result = { notificationId, read: true, updatedAt: new Date() };
        break;
      case 'markAsUnread':
        result = { notificationId, read: false, updatedAt: new Date() };
        break;
      case 'delete':
        result = { notificationId, deleted: true, deletedAt: new Date() };
        break;
      case 'markAllAsRead':
        result = { userId, allMarkedAsRead: true, updatedAt: new Date() };
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      message: `Notification ${action} completed successfully`
    });

  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}