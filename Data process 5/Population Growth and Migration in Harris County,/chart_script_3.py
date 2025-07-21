import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("age_demographics.csv")

# Calculate percentages
df['Percentage'] = (df['Population'] / df['Population'].sum()) * 100

# Create formatted labels for data labels
text_labels = []
for pop, pct in zip(df['Population'], df['Percentage']):
    if pop >= 1000:
        pop_label = f"{pop/1000:.0f}k"
    else:
        pop_label = f"{pop:.0f}"
    text_labels.append(f"{pop_label}<br>{pct:.1f}%")

# Create the bar chart
fig = go.Figure(data=[
    go.Bar(
        x=df['Age_Group'],
        y=df['Population'],
        marker_color='#1FB8CD',  # Using consistent blue color
        text=text_labels,
        textposition='outside',
        cliponaxis=False
    )
])

# Update layout
fig.update_layout(
    title="Harris County Age Demographics 2025",
    xaxis_title="Age Group",
    yaxis_title="Population"
)

# Format y-axis to show in thousands with "k" suffix
fig.update_yaxes(
    tickformat=".0s"
)

# Rotate x-axis labels for readability
fig.update_xaxes(tickangle=-45)

# Save the chart
fig.write_image("harris_county_age_demographics.png")