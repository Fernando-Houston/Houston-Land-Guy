import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("suburban_growth.csv")

# Sort counties from highest to lowest growth rate
df_sorted = df.sort_values('Growth_Rate_2020_2025', ascending=False)

# Create color mapping - use different shades of green with highlight for Liberty and Montgomery
colors = []
for county in df_sorted['County']:
    if county in ['Liberty', 'Montgomery']:
        colors.append('#2E8B57')  # Darker green for highest growth
    else:
        colors.append('#90EE90')  # Light green for others

# Create the bar chart with data labels
fig = go.Figure(data=[
    go.Bar(
        x=df_sorted['County'],
        y=df_sorted['Growth_Rate_2020_2025'],
        marker_color=colors,
        text=[f"{rate:.1f}%" for rate in df_sorted['Growth_Rate_2020_2025']],
        textposition='outside',
        cliponaxis=False
    )
])

# Update layout with shortened title (under 40 characters)
fig.update_layout(
    title="Houston Suburban Growth 2020-25",
    xaxis_title="County",
    yaxis_title="Growth Rate (%)"
)

# Format y-axis to show percentages
fig.update_yaxes(tickformat=".1f", ticksuffix="%")
fig.update_xaxes()

# Save the chart
fig.write_image("suburban_county_growth_chart.png")