import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      activeDeals: [
        {
          id: 1,
          property: '1234 Main St, Houston',
          status: 'under_contract',
          value: 450000,
          expectedClose: '2025-08-15'
        },
        {
          id: 2,
          property: '5678 Oak Blvd, Katy',
          status: 'due_diligence',
          value: 825000,
          expectedClose: '2025-09-01'
        }
      ],
      pipeline: {
        prospecting: 12,
        analyzing: 8,
        negotiating: 3,
        closing: 2
      }
    }
  })
}