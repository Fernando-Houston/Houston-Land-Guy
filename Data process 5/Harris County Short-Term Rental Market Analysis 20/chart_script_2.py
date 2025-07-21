import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('houston_str_market_data.csv')

# Create scaled metrics
df['ADR_Scaled'] = df['Average_Daily_Rate'] / 4  # Scale ADR for visual comparison
df['Revenue_Scaled'] = df['Annual_Revenue'] / 500  # Scale Revenue to fit same scale

# Create grouped bar chart
fig = go.Figure()

# Define colors from the brand palette
colors = ['#1FB8CD', '#FFC185', '#ECEBD5']

# Add bars for each metric
fig.add_trace(go.Bar(
    name='Occupancy (%)',
    x=df['Data_Source'],
    y=df['Occupancy_Rate'],
    marker_color=colors[0],
    cliponaxis=False
))

fig.add_trace(go.Bar(
    name='ADR (÷4)',
    x=df['Data_Source'],
    y=df['ADR_Scaled'],
    marker_color=colors[1],
    cliponaxis=False
))

fig.add_trace(go.Bar(
    name='Revenue (÷500)',
    x=df['Data_Source'],
    y=df['Revenue_Scaled'],
    marker_color=colors[2],
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Houston STR Market Data - 2025',
    xaxis_title='Data Source',
    yaxis_title='Scaled Values',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('houston_str_chart.png')
print("Chart saved successfully!")
print(f"Data shape: {df.shape}")
print("Scaling applied: ADR ÷ 4, Annual Revenue ÷ 500")