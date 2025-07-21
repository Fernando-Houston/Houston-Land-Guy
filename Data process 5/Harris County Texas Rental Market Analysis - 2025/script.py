# Let me organize the rental market data I've gathered so far and create a comprehensive summary
import pandas as pd

# Create a comprehensive summary of Houston rental market data for 2025
houston_data = {
    'Metric': [
        'Overall Average Rent',
        'Overall Average Rent (Alt Source)',
        'Overall Average Rent (Q1 2025 CBRE)',
        'Median Rent',
        'Studio Apartments',
        '1-Bedroom Apartments', 
        '2-Bedroom Apartments',
        '3-Bedroom Apartments',
        'Overall Occupancy Rate (Q1 2025)',
        'Class A Occupancy',
        'Class B Occupancy',
        'Annual Rent Growth (2025 YTD)',
        'YoY Rent Growth Projection',
        'New Units Delivered (2024)',
        'Units Under Construction',
        'Projected 2025 Deliveries'
    ],
    'Value': [
        '$1,197 (Feb 2025)',
        '$1,260 (June 2025)',
        '$1,367 (Q1 2025)',
        '$1,750 (Q2 2025)',
        '$1,071 - $1,191',
        '$1,145 - $1,275',
        '$1,357 - $1,607',
        '$1,849 - $2,091',
        '93.9% (Nearly 94%)',
        '84.1% (Q4 2024)',
        '90.7% (Q4 2024)',
        '3-4% annually projected',
        '2.1% - 2.2%',
        '20,355 units',
        '9,321 - 12,000 units',
        '9,400 - 14,000 units'
    ],
    'Source': [
        'HAR Houston Association of Realtors',
        'Redfin June 2025',
        'CBRE Q1 2025',
        'Relocity Q2 2025',
        'Multiple Sources',
        'Multiple Sources',
        'Multiple Sources',
        'Multiple Sources',
        'CBRE Q1 2025',
        'Transwestern Q4 2024',
        'Transwestern Q4 2024',
        'HAR Houston Association',
        'Yardi Matrix/MMG',
        'Yardi Matrix',
        'Greater Houston Partnership/Northmarq',
        'RealPage/Matthews'
    ]
}

df = pd.DataFrame(houston_data)
print("Houston Rental Market Data Summary - 2025")
print("=" * 60)
print(df.to_string(index=False))

# Top performing submarkets by rent growth
print("\n\nTop Performing Submarkets by Rent Growth (2024-2025):")
print("=" * 60)

submarket_growth = {
    'Submarket': [
        'Greenspoint/Northborough/Aldine',
        'Northline',
        'I-69',
        'I-10 East/Woodforest/Channelview',
        'North Central Houston',
        'Galleria/Uptown',
        'Downtown/Montrose/River Oaks'
    ],
    'YoY Rent Growth': [
        '7.3%',
        '7.0%',
        '6.6%',
        '5.9%',
        '4.2%',
        '>2.3%',
        '>2.3%'
    ]
}

df_growth = pd.DataFrame(submarket_growth)
print(df_growth.to_string(index=False))

print("\n\nKey Market Trends:")
print("=" * 30)
print("• Construction Activity: Sharp 64% drop in new starts during 2024")
print("• Supply Pipeline: Down 57% year-over-year to ~13,700 units under construction")
print("• Market Stabilization: Expected by late 2025 as supply catches up with demand")
print("• Mid-tier Recovery: 4,300 units net absorption vs. negative 5,000 in 2022-2023")
print("• Concessions: Averaging 4-6 weeks free rent in competitive markets")