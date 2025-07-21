# Create comprehensive demographic trend analysis
import pandas as pd
import numpy as np

# Houston neighborhood diversity data based on research
neighborhood_demographics = {
    'Neighborhood': [
        'Alief', 'Chinatown/Sharpstown', 'Third Ward', 'East End',
        'Heights', 'Montrose', 'Medical Center', 'Bellaire',
        'Gulfton', 'Spring Branch', 'Katy', 'Sugar Land'
    ],
    'Population_2025': [102240, 76077, 14295, 32000, 40870, 28960, 8515, 18000, 43950, 30080, 40000, 120000],
    'Hispanic_Latino_Pct': [65, 45, 12, 78, 25, 22, 15, 35, 82, 70, 22, 28],
    'Asian_Pct': [25, 38, 5, 8, 12, 8, 26, 42, 5, 15, 25, 38],
    'Black_Pct': [8, 5, 72, 10, 18, 22, 23, 8, 8, 10, 12, 8],
    'White_Pct': [12, 15, 10, 15, 45, 48, 36, 25, 5, 8, 41, 26],
    'Foreign_Born_Pct': [45, 42, 8, 35, 15, 12, 27, 38, 55, 45, 28, 32]
}

df_neighborhoods = pd.DataFrame(neighborhood_demographics)

print("Houston Neighborhood Demographics 2025")
print("="*60)
print(df_neighborhoods.to_string(index=False))

# Calculate total foreign-born population
total_foreign_born = (df_neighborhoods['Population_2025'] * df_neighborhoods['Foreign_Born_Pct'] / 100).sum()
print(f"\nTotal Foreign-Born in Selected Neighborhoods: {total_foreign_born:,.0f}")

# Economic impact data
economic_impact = {
    'Metric': [
        'Total Immigrant Population (Houston Metro)',
        'Foreign-Born GDP Contribution',
        'Latino GDP Contribution',
        'Immigrant Taxes Paid (2021)',
        'Latino Spending Power',
        'Immigrant Businesses Started'
    ],
    'Value_2025': ['1.7 million', '$116+ billion', '$139.5 billion', '$16.3 billion', '$50.2 billion', '42% of new businesses'],
    'Percentage_of_Total': ['24%', '25%', '25%', 'N/A', '27%', 'N/A']
}

df_economic = pd.DataFrame(economic_impact)

print("\n\nHouston Immigration Economic Impact 2025")
print("="*50)
print(df_economic.to_string(index=False))

# Save data
df_neighborhoods.to_csv('houston_neighborhood_demographics_2025.csv', index=False)
df_economic.to_csv('houston_immigration_economic_impact_2025.csv', index=False)

print("\nData saved to CSV files successfully!")