import pandas as pd
import plotly.graph_objects as go
import json

# Load the data
data = {
    "quarterly_data": [
        {"quarter": "Q1 2022", "avg_rent": 1220, "occupancy": 87.5, "absorption": 2100},
        {"quarter": "Q2 2022", "avg_rent": 1235, "occupancy": 88.2, "absorption": 2800},
        {"quarter": "Q3 2022", "avg_rent": 1245, "occupancy": 88.0, "absorption": 3200},
        {"quarter": "Q4 2022", "avg_rent": 1250, "occupancy": 87.8, "absorption": 2400},
        {"quarter": "Q1 2023", "avg_rent": 1265, "occupancy": 88.1, "absorption": 2160},
        {"quarter": "Q2 2023", "avg_rent": 1275, "occupancy": 88.4, "absorption": 3400},
        {"quarter": "Q3 2023", "avg_rent": 1285, "occupancy": 88.7, "absorption": 4100},
        {"quarter": "Q4 2023", "avg_rent": 1295, "occupancy": 89.0, "absorption": 3600},
        {"quarter": "Q1 2024", "avg_rent": 1310, "occupancy": 89.5, "absorption": 4200},
        {"quarter": "Q2 2024", "avg_rent": 1335, "occupancy": 91.2, "absorption": 4800},
        {"quarter": "Q3 2024", "avg_rent": 1350, "occupancy": 92.5, "absorption": 5200},
        {"quarter": "Q4 2024", "avg_rent": 1360, "occupancy": 93.2, "absorption": 4900},
        {"quarter": "Q1 2025", "avg_rent": 1367, "occupancy": 94.0, "absorption": 3595},
        {"quarter": "Q2 2025", "avg_rent": 1370, "occupancy": 93.8, "absorption": 3800}
    ]
}

# Convert to DataFrame
df = pd.DataFrame(data['quarterly_data'])

# Scale values for visualization while preserving actual values for hover
df['occupancy_scaled'] = df['occupancy'] * 15  # Scale occupancy to be visible alongside rent
df['absorption_scaled'] = df['absorption'] / 3  # Scale absorption to fit better

# Create the figure
fig = go.Figure()

# Add average rent line
fig.add_trace(go.Scatter(
    x=df['quarter'],
    y=df['avg_rent'],
    mode='lines+markers',
    name='Avg Rent ($)',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8, color='#1FB8CD'),
    hovertemplate='<b>%{x}</b><br>Rent: $%{y}<extra></extra>',
    cliponaxis=False
))

# Add occupancy rate line (scaled)
fig.add_trace(go.Scatter(
    x=df['quarter'],
    y=df['occupancy_scaled'],
    mode='lines+markers',
    name='Occupancy (%)',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=8, color='#FFC185'),
    hovertemplate='<b>%{x}</b><br>Occupancy: ' + df['occupancy'].astype(str) + '%<extra></extra>',
    cliponaxis=False
))

# Add absorption line (scaled)
fig.add_trace(go.Scatter(
    x=df['quarter'],
    y=df['absorption_scaled'],
    mode='lines+markers',
    name='Absorption',
    line=dict(color='#5D878F', width=3),
    marker=dict(size=8, color='#5D878F'),
    hovertemplate='<b>%{x}</b><br>Absorption: ' + df['absorption'].astype(str) + ' units<extra></extra>',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Houston Multifamily Market Trends',
    xaxis_title='Quarter',
    yaxis_title='Scaled Values',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(tickangle=45)

# Save the chart
fig.write_image('houston_multifamily_trends.png')