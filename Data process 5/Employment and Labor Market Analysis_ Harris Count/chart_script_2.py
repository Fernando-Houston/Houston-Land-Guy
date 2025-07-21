import plotly.graph_objects as go
import pandas as pd

# Create the data for percentage growth only
growth_data = [
    {"Metric": "Total Comp Costs", "Percentage_Growth": 7.5},
    {"Metric": "Wages & Salaries", "Percentage_Growth": 4.8},
    {"Metric": "Hourly Earn Grow", "Percentage_Growth": 2.3}
]

df_growth = pd.DataFrame(growth_data)

# Create the bar chart for percentage growth
fig = go.Figure()

# Add bars for percentage growth
fig.add_trace(go.Bar(
    x=df_growth['Metric'],
    y=df_growth['Percentage_Growth'],
    marker_color=['#1FB8CD', '#FFC185', '#ECEBD5'],
    name='% Growth',
    hovertemplate='%{x}: %{y}%<extra></extra>',
    cliponaxis=False
))

# Add text annotation for the hourly earnings dollar amount
fig.add_annotation(
    x=2,
    y=8.5,
    text="Avg Hourly Rate:<br>$35.68",
    showarrow=True,
    arrowhead=2,
    arrowcolor="#5D878F",
    arrowwidth=2,
    font=dict(size=12, color="#5D878F"),
    bgcolor="rgba(93, 135, 143, 0.1)",
    bordercolor="#5D878F",
    borderwidth=1
)

# Update layout
fig.update_layout(
    title="Houston Wage & Cost Data 2025",
    xaxis_title="Wage Metrics",
    yaxis_title="% Growth",
    showlegend=False,
    yaxis=dict(range=[0, 9])
)

# Update axes
fig.update_xaxes(tickangle=45)

# Save the chart
fig.write_image("houston_wage_compensation_chart.png")