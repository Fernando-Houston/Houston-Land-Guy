import plotly.graph_objects as go
import plotly.io as pio

# Data for Q1 2025
quarters = ['Q1 2025']
new_announcements = [142]
capital_investment = [2.7]  # in billions

# Create figure
fig = go.Figure()

# Add bar chart for New Business Announcements (primary metric)
fig.add_trace(go.Bar(
    x=quarters,
    y=new_announcements,
    name='New Announces',
    marker_color='#1FB8CD',
    cliponaxis=False,
    width=0.4
))

# Add line with markers for Capital Investment (scaled to fit same axis)
# Scale: multiply by 50 to make it visible alongside announcements
investment_scaled = [val * 50 for val in capital_investment]
fig.add_trace(go.Scatter(
    x=quarters,
    y=investment_scaled,
    mode='lines+markers',
    name='Cap Invest x50',
    line=dict(color='#FFC185', width=4),
    marker=dict(size=12, color='#FFC185'),
    cliponaxis=False
))

# Add text annotations for the additional metrics
fig.add_annotation(
    x='Q1 2025',
    y=120,
    text='Jobs: 3.4k<br>Sq Ft: 15.4M',
    showarrow=True,
    arrowhead=2,
    arrowsize=1,
    arrowwidth=2,
    arrowcolor='#5D878F',
    bgcolor='#ECEBD5',
    bordercolor='#5D878F',
    font=dict(size=12)
)

# Update layout
fig.update_layout(
    title="Houston Business Momentum Q1 2025",
    yaxis_title="Announcements",
    xaxis_title="Quarter",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Add note about scaling
fig.add_annotation(
    x=0.02,
    y=0.02,
    xref='paper',
    yref='paper',
    text='*Cap Invest scaled 50x for visibility ($2.7B actual)',
    showarrow=False,
    font=dict(size=10, color='gray'),
    bgcolor='white',
    bordercolor='gray'
)

# Save the chart
fig.write_image("houston_business_momentum_q1.png")