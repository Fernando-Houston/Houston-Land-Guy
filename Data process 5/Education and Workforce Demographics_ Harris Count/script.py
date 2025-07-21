import pandas as pd
import numpy as np

# Create Harris County Educational Attainment data for 2025
educational_data = {
    'Education Level': ['Less than 9th Grade', 'Some High School, No Diploma', 'High School Graduate', 
                       'Some College, No Degree', 'Associate Degree', 'Bachelor\'s Degree', 
                       'Master\'s Degree', 'Professional Degree', 'Doctorate Degree'],
    'Harris County (%)': [10.53, 7.21, 23.35, 18.54, 6.85, 20.79, 8.72, 2.39, 1.62],
    'Harris County (Persons)': [338846, 231927, 751240, 596484, 220264, 668829, 280644, 77011, 51959],
    'Texas (%)': [7.32, 6.92, 24.40, 20.40, 7.67, 21.30, 8.82, 1.84, 1.33]
}

ed_df = pd.DataFrame(educational_data)
ed_df['Higher Education'] = ed_df['Education Level'].apply(lambda x: 'Bachelor\'s+' if x in ['Bachelor\'s Degree', 'Master\'s Degree', 'Professional Degree', 'Doctorate Degree'] else 'Below Bachelor\'s')

print("Harris County Educational Attainment 2025")
print("="*50)
print(ed_df.to_string(index=False))

# Calculate key statistics
bachelor_plus = ed_df[ed_df['Higher Education'] == 'Bachelor\'s+']['Harris County (%)'].sum()
high_school_plus = ed_df[~ed_df['Education Level'].isin(['Less than 9th Grade', 'Some High School, No Diploma'])]['Harris County (%)'].sum()

print(f"\nKey Statistics:")
print(f"High School Graduate or Higher: {high_school_plus:.1f}%")
print(f"Bachelor's Degree or Higher: {bachelor_plus:.1f}%")

# Save to CSV
ed_df.to_csv('harris_county_educational_attainment_2025.csv', index=False)
print(f"\nData saved to CSV file")