# Create demographic data analysis for Harris County 2025
import pandas as pd
import numpy as np

# Create Harris County demographic data based on the sources
harris_county_demographics = {
    'Race/Ethnicity': [
        'White (Non-Hispanic)', 
        'Hispanic/Latino', 
        'Black/African American', 
        'Asian', 
        'Two or More Races',
        'American Indian/Alaska Native',
        'Native Hawaiian/Pacific Islander',
        'Some Other Race'
    ],
    'Population_2025': [1214690, 2234676, 979237, 359679, 883280, 59853, 4262, 980574],
    'Percentage_2025': [24.6, 45.3, 19.9, 7.3, 17.9, 1.2, 0.1, 19.9],
    'Population_2020': [1150000, 2070000, 920000, 330000, 780000, 55000, 3800, 850000]
}

# Create DataFrame
df_harris = pd.DataFrame(harris_county_demographics)

# Calculate growth
df_harris['Growth_2020_2025'] = df_harris['Population_2025'] - df_harris['Population_2020']
df_harris['Growth_Rate'] = (df_harris['Growth_2020_2025'] / df_harris['Population_2020'] * 100).round(2)

print("Harris County Texas Demographics 2025")
print("="*50)
print(f"Total Population (2025): 4,932,706")
print(f"Population Growth 2020-2025: 4.26%")
print("\nRacial/Ethnic Breakdown:")
print(df_harris[['Race/Ethnicity', 'Population_2025', 'Percentage_2025', 'Growth_Rate']].to_string(index=False))

# Create Houston Metro Area Foreign-Born Data
metro_foreign_born = {
    'County': ['Harris', 'Fort Bend', 'Montgomery', 'Galveston', 'Brazoria'],
    'Total_Population': [4932706, 917000, 749613, 350682, 372031],
    'Foreign_Born_Population': [1300000, 284000, 65000, 42000, 48000],
    'Foreign_Born_Percentage': [26.4, 31.0, 8.7, 12.0, 12.9]
}

df_metro = pd.DataFrame(metro_foreign_born)
df_metro['Total_Foreign_Born'] = df_metro['Foreign_Born_Population'].sum()

print("\n\nHouston Metro Area Foreign-Born Population 2025")
print("="*50)
print(df_metro.to_string(index=False))
print(f"\nTotal Foreign-Born in Houston Metro: {df_metro['Foreign_Born_Population'].sum():,}")

# Save data
df_harris.to_csv('harris_county_demographics_2025.csv', index=False)
df_metro.to_csv('houston_metro_foreign_born_2025.csv', index=False)

print(f"\n\nData saved to CSV files successfully!")