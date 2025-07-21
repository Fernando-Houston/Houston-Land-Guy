# Create a comprehensive CSV dataset with Houston rental market data
import pandas as pd

# Create detailed rental market dataset
houston_rental_data = {
    'Category': [
        'Overall Average Rent', 'Overall Average Rent', 'Overall Average Rent', 'Overall Average Rent',
        'Studio Apartments', 'Studio Apartments', 
        '1-Bedroom Apartments', '1-Bedroom Apartments',
        '2-Bedroom Apartments', '2-Bedroom Apartments',
        '3-Bedroom Apartments', '3-Bedroom Apartments',
        'Occupancy Rate', 'Occupancy Rate', 'Occupancy Rate', 'Occupancy Rate',
        'Rent Growth', 'Rent Growth', 'Rent Growth',
        'Construction Activity', 'Construction Activity', 'Construction Activity', 'Construction Activity'
    ],
    'Metric': [
        'Feb 2025', 'June 2025', 'Q1 2025 CBRE', 'Q2 2025 Median',
        'Range Low', 'Range High',
        'Range Low', 'Range High', 
        'Range Low', 'Range High',
        'Range Low', 'Range High',
        'Overall Market Q1 2025', 'Class A Q4 2024', 'Class B Q4 2024', '10-Year Historical Avg',
        '2025 YTD Projected', '2025 Annual Forecast', 'Leading Submarkets',
        '2024 Deliveries', 'Current Under Construction', '2025 Projected Deliveries', 'New Starts 2024'
    ],
    'Value': [
        1197, 1260, 1367, 1750,
        1071, 1191,
        1145, 1275,
        1357, 1607,
        1849, 2091,
        93.9, 84.1, 90.7, 91.4,
        3.5, 2.1, 7.3,
        20355, 12000, 9400, 6300
    ],
    'Unit': [
        'USD/month', 'USD/month', 'USD/month', 'USD/month',
        'USD/month', 'USD/month',
        'USD/month', 'USD/month',
        'USD/month', 'USD/month', 
        'USD/month', 'USD/month',
        'Percent', 'Percent', 'Percent', 'Percent',
        'Percent', 'Percent', 'Percent',
        'Units', 'Units', 'Units', 'Units'
    ],
    'Source': [
        'HAR', 'Redfin', 'CBRE', 'Relocity',
        'Multiple Sources', 'Multiple Sources',
        'Multiple Sources', 'Multiple Sources',
        'Multiple Sources', 'Multiple Sources',
        'Multiple Sources', 'Multiple Sources', 
        'CBRE', 'Transwestern', 'Transwestern', 'Historical Data',
        'HAR/Industry Average', 'MMG/Yardi Matrix', 'Greenspoint Submarket',
        'Yardi Matrix', 'Northmarq', 'RealPage/Matthews', 'MMG'
    ]
}

# Create submarkets performance data
submarket_data = {
    'Submarket': [
        'Greenspoint/Northborough/Aldine', 'Northline', 'I-69', 'I-10 East/Woodforest/Channelview',
        'North Central Houston', 'Galleria/Uptown', 'Downtown/Montrose/River Oaks',
        'Memorial/West University', 'Katy/Cinco Ranch/Waterside', 'The Woodlands',
        'Bear Creek/Copperfield', 'Spring/Tomball', 'Energy Corridor'
    ],
    'YoY_Rent_Growth_Pct': [7.3, 7.0, 6.6, 5.9, 4.2, 2.3, 2.3, 'N/A', 'N/A', 'Negative', 'N/A', 'N/A', 'N/A'],
    'Occupancy_Performance': ['Strong', 'Strong', 'Strong', 'Good', 'Good', 'Good', 'Good', 'Outperforming', 'Strong Absorption', 'Declining', 'Strong Absorption', 'Strong Absorption', 'Stable'],
    'Construction_Activity': ['Low', 'Low', 'Moderate', 'Low', 'Moderate', 'High', 'High', 'Moderate', 'Peak Supply', 'High', 'High', 'High', 'Moderate'],
    'Market_Tier': ['Affordable', 'Affordable', 'Mid-Tier', 'Affordable', 'Mid-Tier', 'Luxury', 'Luxury', 'Luxury', 'Luxury', 'Luxury', 'Mid-Tier', 'Mid-Tier', 'Mid-Tier']
}

# Create neighborhood rent data by zip code (sample from sources)
zip_code_data = {
    'Zip_Code': [
        '77003', '77007', '77019', '77024', '77027', '77056', '77098',
        '77042', '77063', '77082', '77094', '77401', '77479', '77494'
    ],
    'Neighborhood': [
        'East Downtown', 'Heights', 'River Oaks', 'Memorial', 'River Oaks', 'Galleria', 'Heights',
        'Energy Corridor', 'Westchase', 'Westchase', 'Cinco Ranch', 'Bellaire', 'Sugar Land', 'Cinco Ranch Southwest'  
    ],
    'Average_Rent': [
        1857, 1995, 2500, 1942, 2500, 2200, 1995,
        988, 1206, 1200, 2400, 1834, 2300, 3152
    ],
    'Tier_Classification': [
        'A-1', 'A-1', 'A-1', 'A-1', 'A-1', 'A-1', 'A-1',
        'B', 'B', 'B', 'A-1', 'A-1', 'A-1', 'A-1'
    ]
}

# Save data to CSV files
df_main = pd.DataFrame(houston_rental_data)
df_submarkets = pd.DataFrame(submarket_data) 
df_zip_codes = pd.DataFrame(zip_code_data)

df_main.to_csv('houston_rental_market_2025.csv', index=False)
df_submarkets.to_csv('houston_submarkets_performance_2025.csv', index=False)
df_zip_codes.to_csv('houston_zip_code_rents_2025.csv', index=False)

print("Houston Rental Market Analysis Datasets Created:")
print("=" * 60)
print(f"1. houston_rental_market_2025.csv - {len(df_main)} data points")
print(f"2. houston_submarkets_performance_2025.csv - {len(df_submarkets)} submarkets")  
print(f"3. houston_zip_code_rents_2025.csv - {len(df_zip_codes)} zip codes")

# Display sample data
print("\n\nSample Main Market Data:")
print(df_main.head(10).to_string(index=False))

print("\n\nSample Submarket Performance:")
print(df_submarkets.head(7).to_string(index=False))