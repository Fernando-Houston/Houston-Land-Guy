# Create Houston metro workforce and economic data
import pandas as pd

# Houston Employment and Economic Data for 2025
houston_economic_data = {
    'Metric': [
        'Total Employment (Metro Houston)',
        'Unemployment Rate (May 2025)', 
        'Job Growth (May 2024-May 2025)',
        'Jobs Added (May 2024-May 2025)',
        'Average Annual Wage (Harris County)',
        'Bachelor\'s Degree or Higher (%)',
        'High School Graduate or Higher (%)',
        'Engineers & Architects',
        'Science & Engineering Degrees (%)'
    ],
    'Value': [
        '3,471,300',
        '4.2%',
        '0.9%', 
        '29,600',
        '$81,506',
        '33.7%',
        '82.3%',
        '59,395',
        '41%'
    ],
    'Source Year': [2025, 2025, 2025, 2025, 2024, 2025, 2025, 2024, 2024]
}

economic_df = pd.DataFrame(houston_economic_data)
print("Houston Metro Economic & Workforce Indicators")
print("="*55)
print(economic_df.to_string(index=False))

# Create job forecasts data
job_forecast_data = {
    'Sector': [
        'Trade, Transportation & Utilities',
        'Professional & Business Services',
        'Education & Health Services',
        'Construction',
        'Leisure & Hospitality',
        'Manufacturing',
        'Government',
        'Financial Activities'
    ],
    'Expected Job Growth 2025': [
        'High',
        'Moderate',
        'High',
        'High',
        'Moderate',
        'Moderate',
        'Moderate',
        'Low'
    ],
    'Jobs Added Q4 2024': [11862, -187, 7400, 4564, 3000, 2100, 8103, 1200]
}

forecast_df = pd.DataFrame(job_forecast_data)
print("\n\nHouston Job Growth by Sector")
print("="*40)
print(forecast_df.to_string(index=False))

# Brain Gain/Drain Analysis Data
migration_data = {
    'Category': [
        'Houston Metro Ranking (U-Haul Growth)',
        'Net Migration Gain (Homebuyers)',
        'Companies Announced Expansion/Relocation (Q1 2025)',
        'New Business Facilities (Q1 2025)',
        'Tech Investment Growth',
        'Startup Ecosystem Ranking (Global)',
        'Startup Ecosystem Ranking (US)'
    ],
    'Value': [
        '#9',
        '3,800',
        '142',
        '38',
        '164% ($284M to $750M)',
        '#52',
        '#18'
    ]
}

migration_df = pd.DataFrame(migration_data)
print("\n\nHouston Brain Gain/Migration Indicators")
print("="*45)
print(migration_df.to_string(index=False))

# Save all data to CSV files
economic_df.to_csv('houston_economic_indicators_2025.csv', index=False)
forecast_df.to_csv('houston_job_forecast_2025.csv', index=False)
migration_df.to_csv('houston_migration_indicators_2025.csv', index=False)
print(f"\n\nData saved to CSV files")