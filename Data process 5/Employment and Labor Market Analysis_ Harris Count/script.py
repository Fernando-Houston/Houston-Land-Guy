# Let's create a summary of the key employment statistics I've gathered for 2025

# Key employment data for Harris County and Houston Metro Area 2025

employment_data = {
    "Harris County Unemployment Rate": "4.30% (May 2025)",
    "Houston Metro Total Employment": "3,471,300 jobs (May 2025)",
    "Annual Job Growth": "29,600 jobs added (May 2024 to May 2025)",
    "Annual Growth Rate": "0.9% year-over-year",
    "January Job Losses": "-41,800 jobs (seasonal adjustment)",
    "Net Job Change Since December 2024": "-7,900 jobs",
    "Texas Unemployment Rate": "4.0% (June 2025)",
    "Texas Labor Force": "15,850,100 people (record high)",
    "Harris County Civilian Labor Force": "2,526,772 (May 2025)"
}

sector_performance = {
    "Healthcare": {"status": "Growth", "details": "9,700 jobs added (largest sector growth)"},
    "Construction": {"status": "Growth", "details": "15,200 jobs gained in 2024, 10,200 projected for 2025"},
    "Professional Services": {"status": "Decline", "details": "Down 2.5% annualized in recent months"},
    "Energy/Oil & Gas": {"status": "Growth", "details": "2,900 new jobs, 10.6% growth rate"},
    "Technology": {"status": "Growth", "details": "22,000+ new tech jobs expected, 45.6% growth in postings"},
    "Aerospace": {"status": "Stable", "details": "140,000 workers in Texas aerospace sector"},
    "Hospitality": {"status": "Growth", "details": "9,200 jobs added in restaurants/bars since start of 2025"},
    "Real Estate": {"status": "Growth", "details": "812+ job openings, 5.5% growth in 2024"}
}

wage_data = {
    "Compensation Cost Increase": "7.5% annual increase (March 2025)",
    "Wages and Salaries Growth": "4.8% annual increase",
    "Harris County Minimum Wage": "$20/hour for county employees (May 2025)",
    "Average Hourly Earnings": "$35.68 (May 2025)",
    "Average Hourly Earnings Growth": "2.3% year-over-year",
    "Tech Sector Average Salary": "$94,628",
    "Data Scientists Salary": "$108,000"
}

print("=== HARRIS COUNTY & HOUSTON METRO EMPLOYMENT DATA 2025 ===\n")

print("KEY EMPLOYMENT STATISTICS:")
for key, value in employment_data.items():
    print(f"• {key}: {value}")

print(f"\nSECTOR PERFORMANCE:")
for sector, info in sector_performance.items():
    print(f"• {sector}: {info['status']} - {info['details']}")

print(f"\nWAGE & COMPENSATION DATA:")
for metric, value in wage_data.items():
    print(f"• {metric}: {value}")

print("\nSOURCE SUMMARY:")
print("Data compiled from Bureau of Labor Statistics, Texas Workforce Commission,")
print("Greater Houston Partnership, Dallas Federal Reserve, and other authoritative sources")