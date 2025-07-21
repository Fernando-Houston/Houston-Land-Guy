import plotly.graph_objects as go
import json

# Data from the provided JSON
data = {"Category":["All items","Core","Food","Energy"],"Houston":[1.8,2.1,3.3,-3.5],"United States":[2.7,2.9,3.0,-0.8]}

categories = data["Category"]
houston_values = data["Houston"]
us_values = data["United States"]

# Create the grouped bar chart
fig = go.Figure()

# Add Houston bars
fig.add_trace(go.Bar(
    name='Houston CPI',
    x=categories,
    y=houston_values,
    marker_color='#1FB8CD',
    text=[f'{val:.1f}%' for val in houston_values],
    textposition='outside',
    cliponaxis=False
))

# Add US bars  
fig.add_trace(go.Bar(
    name='US CPI',
    x=categories,
    y=us_values,
    marker_color='#FFC185',
    text=[f'{val:.1f}%' for val in us_values],
    textposition='outside',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='YoY Price Changes Jun 2025: Houston vs US',
    xaxis_title='CPI Categories',
    yaxis_title='Percent Change',
    barmode='group',
    yaxis=dict(range=[-4, 4], ticksuffix='%'),
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('houston_vs_us_cpi_chart.png')