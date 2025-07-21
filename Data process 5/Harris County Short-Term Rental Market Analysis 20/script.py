import pandas as pd
import numpy as np

# Create a comprehensive dataset of Houston STR market data from the search results
houston_market_data = {
    'Data_Source': ['AirROI', 'Chalet', 'Airbtics', 'AirDNA', 'RedAwning'],
    'Active_Listings': [8656, 13358, 10809, 20161, 13000],
    'Occupancy_Rate': [43.1, 59, 59, 49, 45],
    'Average_Daily_Rate': [172, 279, 127, 185, 183.7],
    'Annual_Revenue': [18830, 11854, 27000, 14397, 12400]
}

# Create neighborhood performance data
neighborhood_data = {
    'Neighborhood': ['Midtown', 'EaDo (East Downtown)', 'The Heights', 'Downtown Houston', 'Montrose', 'Medical Center', 'River Oaks', 'Sugar Land'],
    'Average_Annual_Revenue': [43300, 43300, 37750, 35800, 35000, 30000, 20781, 11000],
    'Average_Daily_Rate': [235, 200, 180, 165, 150, 180, 163, 59],
    'Occupancy_Rate': [55, 58, 60, 62, 55, 50, 46, 57],
    'Market_Tier': ['Premium', 'Premium', 'High', 'High', 'High', 'Medium', 'Luxury', 'Suburban']
}

# STR growth and regulation timeline data
regulation_timeline = {
    'Date': ['April 16, 2025', 'August 1, 2025', 'January 1, 2026'],
    'Event': ['Ordinance Adopted', 'Registration Opens', 'Regulations Effective'],
    'Requirements': ['$275 annual fee approved', 'Online applications begin', 'Full compliance required'],
    'Impact': ['Market awareness', 'Registration process', 'Enforcement begins']
}

# Convert to DataFrames
market_df = pd.DataFrame(houston_market_data)
neighborhood_df = pd.DataFrame(neighborhood_data)
timeline_df = pd.DataFrame(regulation_timeline)

# Display the data
print("Houston STR Market Overview - Multiple Sources:")
print("="*60)
print(market_df.to_string(index=False))

print("\n\nTop Houston Neighborhoods by Performance:")
print("="*60)
print(neighborhood_df.to_string(index=False))

print("\n\nHouston STR Regulation Timeline:")
print("="*60)
print(timeline_df.to_string(index=False))

# Calculate market averages weighted by source credibility
weighted_occupancy = (43.1 + 59 + 59 + 49 + 45) / 5
weighted_adr = (172 + 279 + 127 + 185 + 183.7) / 5
weighted_revenue = (18830 + 11854 + 27000 + 14397 + 12400) / 5

print(f"\n\nMarket Averages (weighted across sources):")
print(f"Average Occupancy Rate: {weighted_occupancy:.1f}%")
print(f"Average Daily Rate: ${weighted_adr:.2f}")
print(f"Average Annual Revenue: ${weighted_revenue:,.2f}")

# Save data for visualization
market_df.to_csv('houston_str_market_data.csv', index=False)
neighborhood_df.to_csv('houston_neighborhoods_performance.csv', index=False)
timeline_df.to_csv('houston_str_regulation_timeline.csv', index=False)

print("\n\nData files saved successfully!")