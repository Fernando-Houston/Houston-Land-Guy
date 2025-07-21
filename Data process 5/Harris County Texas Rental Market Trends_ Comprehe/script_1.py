# Create neighborhood rental comparison data based on the research
neighborhood_data = {
    'Neighborhood': ['Downtown Houston', 'The Heights', 'Montrose', 'Energy Corridor', 'Medical Center', 
                    'Katy', 'Cypress', 'Sugar Land', 'The Woodlands', 'Clear Lake'],
    'Average_Rent_2024': [2300, 1950, 1850, 1500, 2000, 1600, 1350, 1700, 1800, 1200],
    'Average_Rent_2025': [2403, 2050, 1920, 1563, 2131, 1620, 1378, 1625, 1823, 1253],
    'YoY_Growth': [4.5, 5.1, 3.8, 4.2, 6.6, 1.3, 2.1, -4.4, 1.3, 4.4],
    'Occupancy_Rate': [94.5, 93.2, 92.8, 91.5, 94.0, 90.8, 89.5, 92.1, 93.5, 90.2]
}

neighborhood_df = pd.DataFrame(neighborhood_data)
print("Houston Neighborhood Rental Comparison (2024 vs 2025)")
print(neighborhood_df)

# Save to CSV
neighborhood_df.to_csv('houston_neighborhood_comparison.csv', index=False)
print("\nData saved to houston_neighborhood_comparison.csv")