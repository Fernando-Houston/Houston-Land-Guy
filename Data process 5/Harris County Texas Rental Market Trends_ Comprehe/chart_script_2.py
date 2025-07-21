import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('houston_construction_trends.csv')

# Create the combination chart with single y-axis
fig = go.Figure()

# Add Units Under Construction bars
fig.add_trace(go.Bar(
    x=df['Year'],
    y=df['Units_Under_Construction'],
    name='Under Construct',
    marker_color='#1FB8CD',
    cliponaxis=False
))

# Add New Deliveries bars
fig.add_trace(go.Bar(
    x=df['Year'],
    y=df['New_Deliveries'],
    name='New Deliveries',
    marker_color='#FFC185',
    cliponaxis=False
))

# Scale vacancy rate to fit with units data (multiply by 2000 to make it visible)
scaled_vacancy = df['Vacancy_Rate'] * 2000

# Add Vacancy Rate line (scaled to be visible with units)
fig.add_trace(go.Scatter(
    x=df['Year'],
    y=scaled_vacancy,
    mode='lines+markers',
    name='Vacancy Rate',
    line=dict(color='#ECEBD5', width=3),
    marker=dict(size=8),
    cliponaxis=False,
    hovertemplate='Year: %{x}<br>Vacancy Rate: %{customdata:.1f}%<extra></extra>',
    customdata=df['Vacancy_Rate']
))

# Update layout
fig.update_layout(
    title='Houston Multifamily Construction Trends',
    xaxis_title='Year',
    yaxis_title='Number of Units',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format y-axis to show abbreviated numbers
fig.update_yaxes(tickformat='.0s')

# Add annotation to explain vacancy rate scaling
fig.add_annotation(
    text="Vacancy Rate scaled for visibility",
    xref="paper", yref="paper",
    x=0.02, y=0.98,
    showarrow=False,
    font=dict(size=10),
    bgcolor="rgba(255,255,255,0.8)"
)

# Save the chart
fig.write_image('houston_construction_chart.png')

print("Updated chart saved successfully!")