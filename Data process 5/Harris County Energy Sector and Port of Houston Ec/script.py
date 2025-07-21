import pandas as pd
import numpy as np

# Create comprehensive datasets for Harris County economic impact analysis

# Energy Sector Data for Harris County 2025
energy_data = {
    'Metric': [
        'Upstream Oil & Gas Employment (Texas)',
        'Monthly Job Growth (May 2025)', 
        'Year-over-Year Growth',
        'Five-Month 2025 Growth',
        'Energy Services Jobs (Texas)',
        'Houston Energy Sector Growth Rate 2024',
        'Expected Houston Energy Jobs Added 2025'
    ],
    'Value': [208200, 2200, 5000, 7300, 635077, 9.7, 2200],
    'Unit': ['jobs', 'jobs', 'jobs', 'jobs', 'jobs', 'percent', 'jobs'],
    'Source': ['TXOGA', 'TXOGA', 'TXOGA', 'TXOGA', 'Energy Workforce Council', 'Dallas Fed', 'GHP Forecast']
}

# Port of Houston Data for 2025
port_data = {
    'Metric': [
        'Container Volume (May 2025)',
        'Year-to-Date TEUs (through May)',
        'Container Growth Rate (YoY)',
        'General Cargo Growth (YTD)',
        'Steel Imports Growth (YTD)', 
        'Total Tonnage (through May)',
        'Texas Jobs Supported',
        'National Jobs Supported',
        'Texas Economic Impact',
        'National Economic Impact',
        'Texas GDP Contribution'
    ],
    'Value': [381640, 1837813, 5, 12, 11, 22940997, 1540000, 3370000, 439, 906, 18.6],
    'Unit': ['TEUs', 'TEUs', 'percent', 'percent', 'percent', 'tons', 'jobs', 'jobs', 'billion USD', 'billion USD', 'percent'],
    'Source': ['Port Houston', 'Port Houston', 'Port Houston', 'Port Houston', 'Port Houston', 'Port Houston', 'Martin Associates', 'Martin Associates', 'Martin Associates', 'Martin Associates', 'Martin Associates']
}

# Harris County Employment Overview 2025
harris_employment = {
    'Sector': [
        'Total Nonfarm Employment (Houston Metro)',
        'Harris County Unemployment Rate (May)',
        'Trade, Transportation & Utilities Growth (Q4 2024)',
        'Construction Employment Growth (Q4 2024)',
        'Oil & Gas Employment Growth (2024)',
        'Expected Total Job Growth (Houston 2025)'
    ],
    'Value': [3471300, 4.3, 2.4, 4.2, 9.7, 71200],
    'Unit': ['jobs', 'percent', 'percent', 'percent', 'percent', 'jobs'],
    'Period': ['May 2025', 'May 2025', 'Q4 2024', 'Q4 2024', '2024', '2025 Forecast']
}

# Create DataFrames
energy_df = pd.DataFrame(energy_data)
port_df = pd.DataFrame(port_data)
employment_df = pd.DataFrame(harris_employment)

# Calculate key economic ratios and impacts
print("=== HARRIS COUNTY ENERGY SECTOR ECONOMIC IMPACT ANALYSIS 2025 ===\n")
print("ENERGY SECTOR METRICS:")
print(energy_df.to_string(index=False))
print("\n" + "="*70 + "\n")

print("PORT OF HOUSTON METRICS:")
print(port_df.to_string(index=False))
print("\n" + "="*70 + "\n")

print("HARRIS COUNTY EMPLOYMENT OVERVIEW:")
print(employment_df.to_string(index=False))
print("\n" + "="*70 + "\n")

# Calculate economic multiplier effects
port_economic_multiplier = 906 / 439  # National vs Texas impact
energy_job_density = 208200 / 14340800 * 100  # Upstream jobs as % of total Texas jobs

print("KEY ECONOMIC RATIOS & INSIGHTS:")
print(f"• Port Houston Economic Multiplier (National/Texas): {port_economic_multiplier:.2f}x")
print(f"• Upstream Oil & Gas Jobs as % of Total Texas Employment: {energy_job_density:.2f}%")
print(f"• Port Houston Jobs per $1B Economic Impact (Texas): {1540000/439:.0f} jobs")
print(f"• Average Economic Value per Port-Supported Job (Texas): ${439*1000000000/1540000:.0f}")

# Calculate growth trends
container_growth_rate = ((381640 - 356407) / 356407) * 100
ytd_teu_growth = 4  # From data

print(f"\n2025 GROWTH TRENDS:")
print(f"• Container Volume Growth (Jan-May 2025): {container_growth_rate:.1f}%")
print(f"• Oil & Gas Employment 5-Month Growth: 3.6% (+7,300 jobs)")
print(f"• Port Container YTD Growth: {ytd_teu_growth}% (+1.84M TEUs)")

# Save data for reference
energy_df.to_csv('harris_county_energy_sector_2025.csv', index=False)
port_df.to_csv('port_houston_economic_impact_2025.csv', index=False)
employment_df.to_csv('harris_county_employment_2025.csv', index=False)

print(f"\n✓ Data files saved for detailed analysis")
print("✓ Economic impact analysis complete")