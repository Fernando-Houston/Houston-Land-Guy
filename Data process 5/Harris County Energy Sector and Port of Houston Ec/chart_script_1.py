import plotly.graph_objects as go
import plotly.express as px
import numpy as np

# Data from the provided JSON
months = ['January', 'March', 'May']
teus = [356407, 386864, 381640]

# Convert month names to numbers for trend line calculation
month_numbers = [1, 3, 5]

# Calculate trend line
z = np.polyfit(month_numbers, teus, 1)
p = np.poly1d(z)
trend_teus = p(month_numbers)

# Create the figure
fig = go.Figure()

# Add the main data line
fig.add_trace(go.Scatter(
    x=months,
    y=teus,
    mode='lines+markers',
    name='Actual',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8, color='#1FB8CD'),
    hovertemplate='<b>%{x}</b><br>TEUs: %{y:,.0f}<extra></extra>',
    cliponaxis=False
))

# Add trend line
fig.add_trace(go.Scatter(
    x=months,
    y=trend_teus,
    mode='lines',
    name='Trend',
    line=dict(color='#FFC185', width=2, dash='dash'),
    hovertemplate='<b>%{x}</b><br>Trend: %{y:,.0f}<extra></extra>',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Port Houston Container Vol Growth 2025',
    xaxis_title='Month 2025',
    yaxis_title='TEUs',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    uniformtext_minsize=14,
    uniformtext_mode='hide'
)

# Format y-axis with abbreviated numbers
fig.update_yaxes(
    tickformat=',.0f'
)

# Save the chart
fig.write_image('port_houston_container_volume.png')