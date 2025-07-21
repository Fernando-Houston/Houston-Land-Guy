# Create a comprehensive summary of key findings for the Houston STR market analysis

import pandas as pd

# Market Performance Summary
market_summary = {
    'Metric': [
        'Total Active Listings (Range)',
        'Average Occupancy Rate',
        'Average Daily Rate (Range)', 
        'Average Annual Revenue (Range)',
        'Top Performing Neighborhoods',
        'Regulatory Status',
        'Registration Fee',
        'Effective Date'
    ],
    'Value': [
        '8,656 - 20,161 listings',
        '51.0% (43-59% range)',
        '$127 - $279 ($189 average)',
        '$11,854 - $27,000 ($16,896 average)',
        'Midtown, EaDo, The Heights',
        'New ordinance adopted',
        '$275 annual fee',
        'January 1, 2026'
    ],
    'Source': [
        'Multiple data providers',
        'Weighted average across sources',
        'Market data analysis',
        'Market data analysis', 
        'Neighborhood performance data',
        'Houston City Council',
        'City ordinance',
        'City ordinance'
    ]
}

# Regulatory Impact Analysis
regulatory_impact = {
    'Impact_Category': [
        'Market Entry Barrier',
        'Compliance Costs',
        'Operational Requirements',
        'Revenue Effect',
        'Market Maturation',
        'Investor Sentiment'
    ],
    'Current_Status': [
        'Low (pre-regulation)',
        'Minimal',
        'Self-regulated',
        'Unregulated growth',
        'Rapid expansion',
        'Very positive'
    ],
    'Post_2026_Projection': [
        'Moderate ($275 fee)',
        'Annual registration required',
        'Insurance, emergency contacts',
        'Potential slight decrease',
        'Professionalizing market',
        'Cautiously optimistic'
    ]
}

# Neighborhood Performance Tiers
tier_analysis = {
    'Market_Tier': ['Premium', 'High', 'Medium', 'Luxury', 'Suburban'],
    'Neighborhoods': [
        'Midtown, EaDo',
        'The Heights, Downtown, Montrose', 
        'Medical Center',
        'River Oaks',
        'Sugar Land, Katy, Cypress'
    ],
    'Revenue_Range': [
        '$40,000 - $45,000',
        '$35,000 - $38,000',
        '$30,000',
        '$20,000 - $25,000',
        '$10,000 - $15,000'
    ],
    'Key_Characteristics': [
        'High ADR, trendy areas',
        'Balanced occupancy/rates',
        'Business/medical travel',
        'Luxury but lower occupancy',
        'Family-friendly, lower ADR'
    ]
}

# Convert to DataFrames and display
summary_df = pd.DataFrame(market_summary)
regulatory_df = pd.DataFrame(regulatory_impact)
tier_df = pd.DataFrame(tier_analysis)

print("HOUSTON SHORT-TERM RENTAL MARKET ANALYSIS - 2025")
print("="*70)

print("\n📊 MARKET PERFORMANCE SUMMARY:")
print("-" * 50)
print(summary_df.to_string(index=False))

print("\n🏛️ REGULATORY IMPACT ANALYSIS:")
print("-" * 50)
print(regulatory_df.to_string(index=False))

print("\n🏘️ NEIGHBORHOOD PERFORMANCE TIERS:")
print("-" * 50)
print(tier_df.to_string(index=False))

# Save summary data
summary_df.to_csv('houston_str_market_summary.csv', index=False)
regulatory_df.to_csv('houston_str_regulatory_impact.csv', index=False)
tier_df.to_csv('houston_str_neighborhood_tiers.csv', index=False)

print(f"\n\n✅ Analysis complete! Summary tables saved to CSV files.")
print(f"📈 Market shows strong performance with regulatory transition ahead.")
print(f"🎯 Top opportunities in urban core neighborhoods.")