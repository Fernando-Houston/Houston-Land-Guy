import plotly.graph_objects as go

# Data
property_types = ["Overall Market", "Class A", "Class B"]
occupancy_rates = [93.9, 84.1, 90.7]
historical_avg = 91.4

# Colors from brand palette (using darker color for Class B)
colors = ['#1FB8CD', '#FFC185', '#5D878F']

# Create bar chart
fig = go.Figure()

# Add bars
fig.add_trace(go.Bar(
    x=property_types,
    y=occupancy_rates,
    marker_color=colors,
    cliponaxis=False,
    name="Q1 2025"
))

# Add horizontal line for historical average
fig.add_hline(y=historical_avg, 
              line_dash="dash", 
              line_color="#D2BA4C",
              line_width=2)

# Add invisible trace for legend
fig.add_trace(go.Scatter(
    x=[None],
    y=[None],
    mode='lines',
    line=dict(color='#D2BA4C', dash='dash', width=2),
    name='10-Yr Avg',
    showlegend=True
))

# Update layout
fig.update_layout(
    title="Houston Apt Occupancy by Class - Q1 2025",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(title="Property Class")
fig.update_yaxes(title="Occupancy %")

# Save chart
fig.write_image("houston_occupancy_chart.png")