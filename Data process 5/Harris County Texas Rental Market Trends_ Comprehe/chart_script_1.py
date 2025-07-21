import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio

# Load the data
df = pd.read_csv("houston_neighborhood_comparison.csv")

# Sort by growth rate from highest to lowest
df_sorted = df.sort_values('YoY_Growth', ascending=True)  # ascending=True for horizontal bars to show highest at top

# Truncate neighborhood names to 15 characters
df_sorted['Neighborhood_Short'] = df_sorted['Neighborhood'].apply(lambda x: x[:15] if len(x) > 15 else x)

# Create color array based on positive/negative growth - green for positive, red for negative
colors = ['#1FB8CD' if growth >= 0 else '#B4413C' for growth in df_sorted['YoY_Growth']]

# Create horizontal bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    y=df_sorted['Neighborhood_Short'],
    x=df_sorted['YoY_Growth'],
    orientation='h',
    marker_color=colors,
    text=[f"{val:.1f}%" for val in df_sorted['YoY_Growth']],
    textposition='auto'
))

# Update layout with shortened title (under 40 chars)
fig.update_layout(
    title="YoY Houston Rent Growth 2024-25",
    xaxis_title="Rent Growth (%)",
    yaxis_title="Neighborhood"
)

# Save the chart
fig.write_image("houston_rent_growth.png")