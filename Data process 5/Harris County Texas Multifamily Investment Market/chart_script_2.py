import plotly.graph_objects as go
from plotly.subplots import make_subplots

# Data
years = ["2021", "2022", "2023", "2024", "2025 YTD"]
volume_billions = [2.8, 3.1, 0.6, 1.2, 0.8]
transaction_count = [145, 168, 89, 134, 92]

# Create subplots with secondary y-axis
fig = make_subplots(specs=[[{"secondary_y": True}]])

# Add bar chart for volume
fig.add_trace(
    go.Bar(
        x=years,
        y=volume_billions,
        name='Volume ($B)',
        marker_color='#1FB8CD',
        cliponaxis=False
    ),
    secondary_y=False,
)

# Add line chart for transaction count
fig.add_trace(
    go.Scatter(
        x=years,
        y=transaction_count,
        mode='lines+markers',
        name='Transactions',
        line=dict(color='#FFC185', width=3),
        marker=dict(size=8),
        cliponaxis=False
    ),
    secondary_y=True,
)

# Set x-axis title and ensure categorical display
fig.update_xaxes(title_text="Year", type='category')

# Set y-axes titles
fig.update_yaxes(title_text="Volume ($B)", secondary_y=False)
fig.update_yaxes(title_text="Transactions", secondary_y=True)

# Update layout
fig.update_layout(
    title="Houston Multifamily Investment Activity 2021-2025",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image("houston_multifamily_chart.png")