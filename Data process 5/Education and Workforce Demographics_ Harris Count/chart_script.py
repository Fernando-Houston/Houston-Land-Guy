import plotly.graph_objects as go

# Data from the provided JSON
education_levels = ["High School Graduate", "Bachelor's Degree", "Some College, No Degree", "Less than 9th Grade", "Master's Degree", "Some High School, No Diploma", "Associate Degree", "Professional Degree", "Doctorate Degree"]
percentages = [23.35, 20.79, 18.54, 10.53, 8.72, 7.21, 6.85, 2.39, 1.62]
higher_ed = [False, True, False, False, True, False, False, True, True]

# Combine data for sorting
combined_data = list(zip(education_levels, percentages, higher_ed))

# Sort by percentage (highest to lowest) - data is already sorted
# Abbreviate education levels to meet 15 character limit
abbreviated_levels = ["HS Graduate", "Bachelor's", "Some College", "< 9th Grade", "Master's", "Some HS", "Associate", "Professional", "Doctorate"]

# Create colors based on education level (below bachelor's vs bachelor's and above)
colors = ['#FFC185' if not he else '#1FB8CD' for he in higher_ed]

# Create horizontal bar chart
fig = go.Figure(go.Bar(
    y=abbreviated_levels,
    x=percentages,
    orientation='h',
    marker_color=colors,
    text=[f'{p}%' for p in percentages],
    textposition='inside',
    textfont=dict(size=12),
    cliponaxis=False
))

fig.update_layout(
    title="Harris County Educational Attainment 2025",
    xaxis_title="Percentage",
    yaxis_title="Education Level"
)

fig.write_image("harris_county_education.png")