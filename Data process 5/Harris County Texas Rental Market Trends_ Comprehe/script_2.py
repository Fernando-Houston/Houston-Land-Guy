# Create supply and construction data based on the research findings
construction_data = {
    'Year': [2020, 2021, 2022, 2023, 2024, 2025],
    'Units_Under_Construction': [32100, 28500, 25400, 20300, 16700, 13700],
    'New_Deliveries': [14200, 16800, 18600, 24900, 20300, 12000],
    'Vacancy_Rate': [8.5, 7.8, 9.2, 10.1, 8.9, 7.2]
}

construction_df = pd.DataFrame(construction_data)
print("Houston Multifamily Supply and Construction Trends")
print(construction_df)

# Save to CSV
construction_df.to_csv('houston_construction_trends.csv', index=False)
print("\nData saved to houston_construction_trends.csv")