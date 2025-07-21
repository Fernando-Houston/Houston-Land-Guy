# Create a comprehensive CSV file with Harris County and Houston Metro employment data

import pandas as pd
import csv

# Create employment statistics summary
employment_summary = pd.DataFrame({
    'Metric': [
        'Harris County Unemployment Rate (May 2025)',
        'Houston Metro Unemployment Rate (May 2025)', 
        'Texas State Unemployment Rate (June 2025)',
        'National Unemployment Rate (June 2025)',
        'Houston Metro Total Employment (May 2025)',
        'Harris County Civilian Labor Force (May 2025)',
        'Texas Civilian Labor Force (June 2025)',
        'Annual Job Growth (May 2024-2025)',
        'Annual Growth Rate (%)',
        'Jobs Lost Since December 2024',
        'Average Hourly Earnings',
        'Compensation Cost Increase (Annual %)',
        'Wages and Salaries Growth (Annual %)',
        'Harris County Minimum Wage (County Employees)'
    ],
    'Value': [
        '4.30%',
        '4.20%',
        '4.00%', 
        '4.10%',
        '3,471,300',
        '2,526,772',
        '15,850,100',
        '29,600',
        '0.90%',
        '-7,900',
        '$35.68',
        '7.50%',
        '4.80%',
        '$20.00/hour'
    ],
    'Source': [
        'Bureau of Labor Statistics',
        'Bureau of Labor Statistics',
        'Texas Workforce Commission',
        'Bureau of Labor Statistics',
        'Bureau of Labor Statistics',
        'Workforce Solutions',
        'Texas Workforce Commission',
        'Greater Houston Partnership',
        'Greater Houston Partnership',
        'Greater Houston Partnership',
        'Dallas Federal Reserve',
        'Bureau of Labor Statistics',
        'Bureau of Labor Statistics',
        'Harris County Commissioners Court'
    ]
})

# Create sector employment data
sector_data = pd.DataFrame({
    'Sector': [
        'Healthcare',
        'Construction', 
        'Professional & Business Services',
        'Energy/Oil & Gas',
        'Technology',
        'Aerospace',
        'Hospitality (Restaurants/Bars)',
        'Real Estate',
        'Information',
        'Manufacturing',
        'Government',
        'Trade, Transportation & Utilities'
    ],
    'Employment_Trend': [
        'Strong Growth',
        'Growing',
        'Declining',
        'Growing',
        'Strong Growth',
        'Stable',
        'Growing',
        'Growing',
        'Declining',
        'Stable',
        'Growing',
        'Growing'
    ],
    'Job_Changes_2025': [
        '+9,700 jobs',
        '+10,200 projected',
        '-2.5% annualized',
        '+2,900 jobs',
        '22,000+ new jobs expected',
        '140,000 total in Texas',
        '+9,200 jobs',
        '812+ openings',
        '-200 jobs',
        '+0.6%',
        '+5,500 projected',
        '+10,400 jobs'
    ],
    'Key_Details': [
        'Largest job growth sector',
        '15,200 jobs added in 2024',
        'Professional services weakness persists',
        '10.6% growth rate',
        '45.6% increase in job postings',
        '47% of aerospace jobs in air transport',
        'Arts & entertainment +2,800',
        '5.5% growth in 2024',
        'Tech advances reduce demand',
        'Slight positive growth',
        'Expected significant gains',
        'Second largest contributor'
    ]
})

# Create major employers data
major_employers = pd.DataFrame({
    'Company': [
        'Chevron Corporation',
        'American Bureau of Shipping',
        'Texas Medical Center',
        'Hewlett Packard Enterprise',
        'ServiceNow',
        'PwC',
        'ExxonMobil',
        'Shell',
        'Amazon',
        'Google',
        'Microsoft',
        'Harris County Government'
    ],
    'Sector': [
        'Energy',
        'Maritime Services',
        'Healthcare',
        'Technology',
        'Technology/AI',
        'Professional Services',
        'Energy',
        'Energy', 
        'Technology/E-commerce',
        'Technology',
        'Technology',
        'Government'
    ],
    'Hiring_Status_2025': [
        'Active Hiring',
        'Top Employer',
        'Expanding',
        'Major Tech Hub',
        'Best Large Company',
        'Best Large Company',
        'Relocating Operations',
        'Energy Transition Focus',
        'Distribution Expansion',
        'Tech Hub Growth',
        'Active Hiring',
        'Living Wage Implementation'
    ],
    'Employment_Size': [
        '45,000+ globally',
        '5,000-10,000',
        'Largest medical complex',
        'Major regional presence',
        '26,000 globally',
        '370,000 globally',
        'Major Houston presence',
        'Significant operations',
        'Multiple facilities',
        'Growing presence',
        'Expanding operations',
        'County-wide workforce'
    ]
})

# Save all data to CSV files
employment_summary.to_csv('harris_county_employment_summary_2025.csv', index=False)
sector_data.to_csv('houston_metro_sector_employment_2025.csv', index=False) 
major_employers.to_csv('houston_major_employers_2025.csv', index=False)

print("Created CSV files with comprehensive employment data:")
print("\n1. harris_county_employment_summary_2025.csv")
print(employment_summary.to_string(index=False))

print("\n\n2. houston_metro_sector_employment_2025.csv")
print(sector_data.to_string(index=False))

print("\n\n3. houston_major_employers_2025.csv") 
print(major_employers.to_string(index=False))

print(f"\nTotal records created: {len(employment_summary) + len(sector_data) + len(major_employers)}")