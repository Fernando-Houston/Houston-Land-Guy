import pandas as pd
import plotly.graph_objects as go
import plotly.io as pio

# Load the data
df = pd.read_csv("houston_rental_trends.csv")

# Convert Month to datetime for proper sorting - let pandas infer the format
df['Month'] = pd.to_datetime(df['Month'])
df = df.sort_values('Month')

# Create the line chart
fig = go.Figure()

# Add Average Rent line (scaled down by 100 to fit with occupancy rate scale)
fig.add_trace(go.Scatter(
    x=df['Month'],
    y=df['Average_Rent'] / 100,
    mode='lines+markers',
    name='Avg Rent',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=6),
    cliponaxis=False,
    hovertemplate='<b>Avg Rent</b><br>$%{customdata:,.0f}<br><extra></extra>',
    customdata=df['Average_Rent']
))

# Add Occupancy Rate line
fig.add_trace(go.Scatter(
    x=df['Month'],
    y=df['Occupancy_Rate'],
    mode='lines+markers',
    name='Occupancy Rate',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=6),
    cliponaxis=False,
    hovertemplate='<b>Occupancy Rate</b><br>%{y:.1f}%<br><extra></extra>'
))

# Update layout
fig.update_layout(
    title="Houston Rental Trends",
    xaxis_title="Month",
    yaxis_title="Scaled Values",
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')
fig.update_yaxes(showgrid=True, gridwidth=1, gridcolor='lightgray')

# Save the chart
fig.write_image("houston_rental_trends.png")