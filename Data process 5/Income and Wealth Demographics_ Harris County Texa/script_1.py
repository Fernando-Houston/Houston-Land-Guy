# Create comprehensive housing affordability data for visualization
housing_affordability_data = {
    'Housing Metric': [
        'Cost-Burdened Renters (>30% income)',
        'Severely Cost-Burdened Renters (>50% income)',  
        'Cost-Burdened Homeowners (>30% income)',
        'Households Below Poverty Line',
        'Families Below Poverty with Children',
        'Households Experiencing ALICE',
        'Extremely Low-Income Renters Severely Burdened'
    ],
    'Percentage': [52, 27, 24, 13.6, 10.4, 33, 83],
    'Population_Affected': [
        'Houston 3-county renters',
        'Houston 3-county renters', 
        'Houston 3-county homeowners',
        'Harris County families',
        'Harris County families',
        'Houston 3-county households',
        'Houston metro ELI renters'
    ]
}

# Economic mobility and opportunity data
economic_mobility_data = {
    'Economic Indicator': [
        'Children from Low-Income Families Earning More than Parents',
        'Black-White Earnings Gap (Low-Income Children)',
        'Economic Mobility Improvement (2008-2023)',
        'Annual Income Increase from Mobility Gains',
        'High-Wage Jobs (>$40K annually)',
        'Unbanked Households Rate vs National',
        'Subprime Credit Score Population'
    ],
    'Houston_Value': [50.1, 8400, 1.1, 350, 55, 'Double', '24-32%'],
    'Comparison': ['Below historical 90%', '$12.5K gap in 2010', 'Ranked 11th of 50 metros', '$350 over 15 years', 'Above 50%', 'vs national average', 'High-risk credit']
}

# Save housing affordability data
housing_df = pd.DataFrame(housing_affordability_data)
mobility_df = pd.DataFrame(economic_mobility_data)

print("=== HOUSING AFFORDABILITY CRISIS DATA ===")
print(housing_df.to_string(index=False))

print("\n\n=== ECONOMIC MOBILITY AND OPPORTUNITY ===") 
print(mobility_df.to_string(index=False))

# Create specific data for the housing burden chart
housing_burden_chart_data = {
    'Housing Status': ['Renters', 'Renters', 'Homeowners'],
    'Burden Level': ['Cost-Burdened (30%+)', 'Severely Cost-Burdened (50%+)', 'Cost-Burdened (30%+)'],
    'Percentage': [52, 27, 24],
    'Description': ['Spend >30% income on housing', 'Spend >50% income on housing', 'Spend >30% income on housing']
}

housing_burden_df = pd.DataFrame(housing_burden_chart_data)
housing_burden_df.to_csv('housing_affordability_burden.csv', index=False)

print(f"\n\nHousing burden data saved for visualization!")
print("\n=== KEY FINDINGS SUMMARY ===")
print("• 52% of Houston-area renters are cost-burdened")
print("• 27% of renters are severely cost-burdened (>50% income on housing)")
print("• Median home price ($325K) vs affordable price ($195K) = $130K gap")
print("• 15,000 additional renter households became cost-burdened in one year")
print("• White households earn 66% more than Black households")
print("• Top 20% receive 53% of income; Bottom 20% receive 3%")
print("• Houston ranks 11th among 50 largest metros for economic mobility gains")