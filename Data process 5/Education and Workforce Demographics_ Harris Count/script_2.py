# Create a comprehensive dataset for workforce development programs and initiatives
workforce_programs_data = {
    'Program/Initiative': [
        'UpSkill Houston Participants',
        'Hire Up Harris (ARPA Program)',
        'Apprenticeship Advantage',
        'Houston Community College Centers of Excellence',
        'Partnership PartnerUp Houston Mentors',
        'Ion Innovation District Startups',
        'Greentown Labs Climate Tech',
        'VAST Academy Students',
        'Career4U Academy Programs'
    ],
    'Participants/Capacity': [
        'Over 200 employers engaged',
        '700 residents enrolled',
        '966 residents enrolled', 
        '14 centers',
        '10+ companies, 7 universities',
        '4,000+ startups',
        '40,000+ sq ft facility',
        'Ongoing since 1990',
        '5 academies offered'
    ],
    'Focus Area': [
        'Middle-skill jobs',
        'Skills training + wraparound services',
        'Registered apprenticeships',
        'Industry-specific training',
        'Professional mentoring',
        'Innovation/entrepreneurship',
        'Climate technology',
        'Disabilities inclusion',
        'Non-degree certificates'
    ]
}

programs_df = pd.DataFrame(workforce_programs_data)
print("Houston Workforce Development Programs & Initiatives")
print("="*60)
print(programs_df.to_string(index=False))

# Key economic impact numbers
economic_impact = {
    'Metric': [
        'Energy Transition Jobs (Potential by 2050)',
        'Hydrogen Industry Jobs (Potential)',
        'Middle-skill Jobs Current Need',
        'Tech Job Postings Growth (YoY)',
        'Venture Capital Investment Growth',
        'Companies Relocating/Expanding (2024)',
        'Forecast New Jobs (2025)',
        'Population with Science/Engineering Degrees'
    ],
    'Value': [
        '180,000',
        '20,000 middle-skill ($75K avg)',
        '855,000 lack credentials',
        '45.6%',
        '$284M to $750M',
        '540 companies',
        '71,200',
        '41% of bachelor\'s degrees'
    ]
}

impact_df = pd.DataFrame(economic_impact)
print("\n\nWorkforce & Economic Impact Projections")
print("="*50)
print(impact_df.to_string(index=False))

# University graduation rates comparison
university_data = {
    'Institution': [
        'Rice University',
        'University of Houston',
        'University of Houston-Clear Lake',
        'University of Houston-Downtown',
        'Houston Community College'
    ],
    'Graduation Rate': ['96%', '54% (6-year)', '52% (6-year)', '33% (6-year)', '15% (6-year)'],
    'Type': ['Private', 'Public R1', 'Public', 'Public', 'Community College'],
    'Notable Features': [
        'Elite private, high selectivity',
        'Large diverse enrollment, 46K students',
        'Regional campus, 60% 4-year rate',
        'Urban-serving, diverse population',
        'Transfer focus, workforce training'
    ]
}

university_df = pd.DataFrame(university_data)
print("\n\nHouston Area University Graduation Rates")
print("="*50)
print(university_df.to_string(index=False))

# Save data
programs_df.to_csv('houston_workforce_programs.csv', index=False)
impact_df.to_csv('houston_economic_impact.csv', index=False)
university_df.to_csv('houston_university_rates.csv', index=False)

print(f"\n\nAll data saved to CSV files")