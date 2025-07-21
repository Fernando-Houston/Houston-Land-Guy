import plotly.graph_objects as go
import pandas as pd

# Data from the provided JSON
years = [2022, 2023, 2024, 2025]
units_under_construction = [28000, 32100, 20000, 13700]
annual_deliveries = [16000, 18000, 20355, 12000]

# Create the line chart
fig = go.Figure()

# Add line for Units Under Construction
fig.add_trace(go.Scatter(
    x=years,
    y=units_under_construction,
    mode='lines+markers',
    name='Under Construct',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8),
    cliponaxis=False
))

# Add line for Annual Deliveries
fig.add_trace(go.Scatter(
    x=years,
    y=annual_deliveries,
    mode='lines+markers',
    name='Annual Delivery',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=8),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Houston Apt Pipeline Decline 2022-25',
    xaxis_title='Year',
    yaxis_title='Units',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format y-axis to show values in thousands (k)
fig.update_yaxes(
    tickformat='.0f',
    tickmode='array',
    tickvals=[10000, 15000, 20000, 25000, 30000, 35000],
    ticktext=['10k', '15k', '20k', '25k', '30k', '35k']
)

# Format x-axis
fig.update_xaxes(
    tickmode='array',
    tickvals=years,
    ticktext=['2022', '2023', '2024', '2025']
)

# Save the chart
fig.write_image('houston_apartment_pipeline.png')