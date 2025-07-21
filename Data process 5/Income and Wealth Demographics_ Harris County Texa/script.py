# Let's analyze and organize the Harris County income and demographics data we've collected
import pandas as pd
import numpy as np

# Harris County 2025 Income Data
harris_county_data = {
    'Metric': [
        'Median Household Income (Harris County)',
        'Median Household Income (Houston City)',
        'Average Household Income (Harris County)',
        'Average Household Income (Houston City)',
        'Area Median Income (4-person household)',
        'Middle Class Range (Houston) - Min',
        'Middle Class Range (Houston) - Max',
        'Comfortable Living Income (Single)',
        'Comfortable Living Income (Family of 4)',
        'Poverty Rate (Families)',
        'Cost-Burdened Renters',
        'Severely Cost-Burdened Renters',
        'Median Home Price (Harris County)',
        'Affordable Home Price (Median Income)',
        'Affordability Gap'
    ],
    'Value': [
        '$72,336',
        '$62,894',
        '$106,576',
        '$97,458',
        '$80,900',
        '$41,754',
        '$125,274',
        '$90,064',
        '$206,669',
        '13.57%',
        '52%',
        '27%',
        '$325,000',
        '$195,000',
        '$130,000'
    ],
    'Source': [
        'Understanding Houston 2023',
        'DataUSA 2023',
        'Houston State of Health 2025',
        'NCHStats 2025',
        'City of Houston AMI 2025',
        'SmartAsset 2025',
        'SmartAsset 2025',
        'SmartAsset 2025',
        'SmartAsset 2025',
        'Houston State of Health 2025',
        'Understanding Houston 2024',
        'Understanding Houston 2024',
        'Kinder Institute 2025',
        'Kinder Institute 2025',
        'Kinder Institute 2025'
    ]
}

# Income by Race/Ethnicity in Harris County (2023 data)
income_by_race = {
    'Race/Ethnicity': [
        'All Households',
        'White (Non-Hispanic)',
        'Black/African American',
        'Asian',
        'Hispanic/Latino',
        'Native American/Alaskan Native',
        'Some Other Race',
        '2+ Races'
    ],
    'Median Income': [
        71811,
        93060,
        55900,
        98032,
        63594,
        64151,
        56569,
        69706
    ],
    'Average Income': [
        106576,
        113969,
        73118,
        115714,
        79531,
        82820,
        71221,
        88527
    ]
}

# Top 10 Highest Income Zip Codes in Houston
top_zip_codes = {
    'Zip Code': ['77010', '77005', '77094', '77059', '77046', '77008', '77007', '77024', '77019', '77018'],
    'Median Household Income': [221776, 213059, 179387, 158958, 145567, 140609, 140536, 132710, 118172, 111524],
    'Area': ['Medical Center', 'West University', 'Cinco Ranch', 'Clear Lake', 'Galleria', 'Heights', 'Heights', 'Memorial', 'River Oaks', 'Heights']
}

# Convert to DataFrames
df_main = pd.DataFrame(harris_county_data)
df_race = pd.DataFrame(income_by_race)
df_zips = pd.DataFrame(top_zip_codes)

print("=== HARRIS COUNTY INCOME AND WEALTH DEMOGRAPHICS 2025 ===")
print("\n1. KEY INCOME STATISTICS")
print(df_main.to_string(index=False))

print("\n\n2. INCOME BY RACE/ETHNICITY (Harris County)")
df_race['Income Gap vs White'] = ((df_race['Median Income'] / df_race.loc[df_race['Race/Ethnicity'] == 'White (Non-Hispanic)', 'Median Income'].values[0]) * 100).round(1)
print(df_race.to_string(index=False))

print("\n\n3. HIGHEST INCOME ZIP CODES (Houston Metro)")
df_zips['Income_Formatted'] = df_zips['Median Household Income'].apply(lambda x: f"${x:,}")
print(df_zips[['Zip Code', 'Income_Formatted', 'Area']].to_string(index=False))

# Calculate income inequality metrics
white_median = df_race.loc[df_race['Race/Ethnicity'] == 'White (Non-Hispanic)', 'Median Income'].values[0]
black_median = df_race.loc[df_race['Race/Ethnicity'] == 'Black/African American', 'Median Income'].values[0]
hispanic_median = df_race.loc[df_race['Race/Ethnicity'] == 'Hispanic/Latino', 'Median Income'].values[0]

white_black_gap = white_median - black_median
white_hispanic_gap = white_median - hispanic_median

print(f"\n\n4. INCOME INEQUALITY ANALYSIS")
print(f"White-Black Income Gap: ${white_black_gap:,} ({((white_median/black_median - 1) * 100):.1f}% higher)")
print(f"White-Hispanic Income Gap: ${white_hispanic_gap:,} ({((white_median/hispanic_median - 1) * 100):.1f}% higher)")
print(f"Top 20% of households receive: 53% of total income")
print(f"Bottom 20% of households receive: 3% of total income")

# Save data for chart creation
df_main.to_csv('harris_county_income_stats.csv', index=False)
df_race.to_csv('income_by_race_ethnicity.csv', index=False)
df_zips.to_csv('top_income_zip_codes.csv', index=False)

print(f"\n\nData files saved successfully for visualization!")