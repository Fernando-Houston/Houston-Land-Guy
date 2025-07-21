import pandas as pd
import numpy as np

# Create comprehensive data for Harris County population growth and migration patterns
# Based on the research findings

# Harris County Population Growth 2020-2025
years = ['2020', '2021', '2022', '2023', '2024', '2025']
harris_population = [4800000, 4845000, 4890000, 4903000, 5009000, 4943000]  # Based on various sources
houston_metro = [7089000, 7200000, 7341000, 7480000, 7796000, 7800000]  # Metro population

# Create population growth dataframe
population_df = pd.DataFrame({
    'Year': years,
    'Harris_County': harris_population,
    'Houston_Metro': houston_metro
})

print("Harris County and Houston Metro Population Growth 2020-2025:")
print(population_df)

# Migration components for Harris County 2024
migration_components = {
    'Component': ['International Migration', 'Domestic Migration', 'Natural Increase (Births-Deaths)', 'Total Change'],
    'People': [102000, -31000, 49000, 106000],  # Based on research findings
    'Percentage': [96.2, -29.2, 46.2, 100.0]
}

migration_df = pd.DataFrame(migration_components)
print("\nHarris County 2024 Population Change Components:")
print(migration_df)

# Top origin countries for Houston immigrants
origin_countries = {
    'Country': ['Mexico', 'El Salvador', 'Vietnam', 'India', 'Honduras', 'Nigeria', 'Guatemala', 'China', 'Venezuela', 'Cuba'],
    'Percentage_of_Foreign_Born': [37.0, 8.2, 6.1, 5.4, 4.3, 4.1, 3.9, 3.7, 3.2, 2.8],
    'Recent_Growth_Rate': [2, 22, 15, 45, 59, 139, 42, 18, 464, 223]  # Percent growth 2010-2021
}

countries_df = pd.DataFrame(origin_countries)
print("\nTop Origin Countries for Houston Area Immigrants:")
print(countries_df)

# Age demographics Harris County 2025
age_groups = {
    'Age_Group': ['0-4', '5-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65-74', '75+'],
    'Population': [327107, 898251, 490434, 719305, 719632, 620281, 527096, 387404, 243500],
    'Percentage': [6.6, 18.2, 9.9, 14.6, 14.6, 12.6, 10.7, 7.8, 4.9]
}

age_df = pd.DataFrame(age_groups)
print("\nHarris County Age Demographics 2025:")
print(age_df)

# Suburban county growth rates 2020-2025
suburban_counties = {
    'County': ['Montgomery', 'Fort Bend', 'Liberty', 'Waller', 'Brazoria', 'Galveston'],
    'Population_2025': [774954, 972496, 119892, 87000, 420346, 370458],
    'Growth_Rate_2020_2025': [23.9, 17.3, 29.6, 18.9, 12.5, 5.4]
}

suburban_df = pd.DataFrame(suburban_counties)
print("\nHouston Area Suburban County Growth 2020-2025:")
print(suburban_df)

# Save datasets for charts
population_df.to_csv('harris_population_growth.csv', index=False)
migration_df.to_csv('migration_components.csv', index=False) 
countries_df.to_csv('origin_countries.csv', index=False)
age_df.to_csv('age_demographics.csv', index=False)
suburban_df.to_csv('suburban_growth.csv', index=False)

print("\nAll datasets saved as CSV files for chart creation.")