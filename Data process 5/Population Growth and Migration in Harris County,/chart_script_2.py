import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('origin_countries.csv')

# Sort by Percentage_of_Foreign_Born in descending order
df_sorted = df.sort_values('Percentage_of_Foreign_Born', ascending=True)  # ascending=True for horizontal bars to show highest at top

# Create color list - Mexico gets darker blue, others get lighter blue
colors = []
for country in df_sorted['Country']:
    if country == 'Mexico':
        colors.append('#13343B')  # Dark cyan for Mexico
    else:
        colors.append('#1FB8CD')  # Strong cyan for others

# Create horizontal bar chart
fig = go.Figure(go.Bar(
    y=df_sorted['Country'],
    x=df_sorted['Percentage_of_Foreign_Born'],
    orientation='h',
    marker_color=colors,
    text=[f"{val}%" for val in df_sorted['Percentage_of_Foreign_Born']],
    textposition='outside',
    cliponaxis=False
))

# Update layout with shortened title and axis labels
fig.update_layout(
    title="Top Origin Countries Houston Immigrants",
    xaxis_title="% Foreign-Born",
    yaxis_title="Country"
)

# Save the chart
fig.write_image('houston_immigrants_chart.png')
print("Chart saved successfully!")