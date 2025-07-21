import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('houston_neighborhood_demographics_2025.csv')

# Create the horizontal stacked bar chart
fig = go.Figure()

# Define colors using the brand colors in order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F']

# Add each ethnic group as a separate trace
fig.add_trace(go.Bar(
    name='Hispanic/Latino',
    y=df['Neighborhood'],
    x=df['Hispanic_Latino_Pct'],
    orientation='h',
    marker_color=colors[0],
    cliponaxis=False
))

fig.add_trace(go.Bar(
    name='Asian',
    y=df['Neighborhood'],
    x=df['Asian_Pct'],
    orientation='h',
    marker_color=colors[1],
    cliponaxis=False
))

fig.add_trace(go.Bar(
    name='Black',
    y=df['Neighborhood'],
    x=df['Black_Pct'],
    orientation='h',
    marker_color=colors[2],
    cliponaxis=False
))

fig.add_trace(go.Bar(
    name='White',
    y=df['Neighborhood'],
    x=df['White_Pct'],
    orientation='h',
    marker_color=colors[3],
    cliponaxis=False
))

# Update layout for stacked bars
fig.update_layout(
    barmode='stack',
    title='Racial/Ethnic Diversity Across Houston 2025',
    xaxis_title='Percentage',
    yaxis_title='Neighborhoods',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(range=[0, 100])

# Save the chart
fig.write_image('houston_demographics_chart.png')
fig.show()