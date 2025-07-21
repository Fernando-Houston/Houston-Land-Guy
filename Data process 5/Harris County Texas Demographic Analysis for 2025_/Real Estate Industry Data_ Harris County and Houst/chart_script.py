import plotly.graph_objects as go
import plotly.io as pio

# Data for rental rates (primary focus based on most complete dataset)
property_types = ["Studio", "1BR", "2BR", "3BR SFR"]
avg_rents = [1150, 1210, 1482, 2245]
rent_lows = [1109, 1145, 1357, 2091]
rent_highs = [1191, 1275, 1607, 2400]

# Calculate error bars (difference from average)
error_low = [avg - low for avg, low in zip(avg_rents, rent_lows)]
error_high = [high - avg for avg, high in zip(avg_rents, rent_highs)]

# Use more distinct brand colors for better differentiation
colors = ['#1FB8CD', '#FFC185', '#D2BA4C', '#B4413C']

# Create enhanced bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=property_types,
    y=avg_rents,
    error_y=dict(
        type='data',
        symmetric=False,
        array=error_high,
        arrayminus=error_low,
        color='rgba(0,0,0,0.4)',
        thickness=3,
        width=8
    ),
    marker_color=colors,
    marker_line=dict(color='white', width=1),
    text=[f'${rent/1000:.1f}k' for rent in avg_rents],
    textposition='outside',
    textfont=dict(size=12, color='black'),
    cliponaxis=False,
    hovertemplate='<b>%{x}</b><br>Avg Rent: $%{y:,.0f}<br>Range: $%{customdata[0]:,.0f} - $%{customdata[1]:,.0f}<extra></extra>',
    customdata=[[low, high] for low, high in zip(rent_lows, rent_highs)]
))

# Update layout with better formatting
fig.update_layout(
    title="Houston 2025 Rental Market Overview",
    xaxis_title="Property Type",
    yaxis_title="Monthly Rent ($k)",
    showlegend=False,
    plot_bgcolor='white',
    paper_bgcolor='white'
)

# Format axes
fig.update_yaxes(
    tickformat='$,.0f',
    range=[0, max(rent_highs) * 1.15],
    showgrid=True,
    gridcolor='rgba(0,0,0,0.1)'
)

fig.update_xaxes(
    showgrid=False
)

# Save the chart
fig.write_image("houston_rental_chart.png")