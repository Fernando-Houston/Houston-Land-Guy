import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

# Create organized data from the JSON
categories = ['Mortgages', 'Housing', 'Income & Jobs']
millennial_data = [61.83, 340.0, 124.0]  # Mortgages (k), Home Price (k), Income (k)
gen_z_data = [12.5, 1.85, 75.0]  # Share %, Rent (k), New Jobs (k)

# Create the grouped bar chart
fig = go.Figure()

# Add Millennial data
fig.add_trace(go.Bar(
    name='Millennial',
    x=categories,
    y=millennial_data,
    marker_color='#1FB8CD',
    text=[f'{val}k' if i != 0 else f'{val}%' for i, val in enumerate([61.83, 340.0, 124.0])],
    textposition='auto',
    hovertemplate='Millennial<br>%{x}: %{y}<extra></extra>'
))

# Add Gen Z data  
fig.add_trace(go.Bar(
    name='Gen Z',
    x=categories,
    y=gen_z_data,
    marker_color='#FFC185',
    text=[f'{val}%' if i == 0 else f'{val}k' for i, val in enumerate([12.5, 1.85, 75.0])],
    textposition='auto',
    hovertemplate='Gen Z<br>%{x}: %{y}<extra></extra>'
))

# Update layout
fig.update_layout(
    title='Houston Millennial & Gen Z Housing Data',
    xaxis_title='Categories',
    yaxis_title='Values',
    barmode='group',
    showlegend=True,
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('houston_housing_demographics.png')