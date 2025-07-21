import plotly.graph_objects as go
import pandas as pd

# Create the data - scale multifamily units by 100 to make them more visible on the same axis as SF
data = {
    'Quarter': ['Q1 2025', 'Q2 2025'],
    'Multifamily (x100)': [410000, 380000],  # Scaled by 100 for visibility
    'Office SF': [-845223, 433000],
    'Industrial SF': [791664, 2000000], 
    'Retail SF': [155610, -93516]
}

df = pd.DataFrame(data)

# Original multifamily values for hover text
multifamily_original = [4100, 3800]

# Create the line chart
fig = go.Figure()

# Add lines for each property type with distinct colors and markers
fig.add_trace(go.Scatter(
    x=df['Quarter'],
    y=df['Multifamily (x100)'],
    mode='lines+markers',
    name='Multifamily',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=10),
    customdata=multifamily_original,
    hovertemplate='<b>Multifamily</b><br>Quarter: %{x}<br>Absorption: %{customdata:,.0f} Units<extra></extra>'
))

fig.add_trace(go.Scatter(
    x=df['Quarter'],
    y=df['Office SF'],
    mode='lines+markers',
    name='Office',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=10),
    hovertemplate='<b>Office</b><br>Quarter: %{x}<br>Absorption: %{y:,.0f} SF<extra></extra>'
))

fig.add_trace(go.Scatter(
    x=df['Quarter'],
    y=df['Industrial SF'],
    mode='lines+markers', 
    name='Industrial',
    line=dict(color='#ECEBD5', width=3),
    marker=dict(size=10),
    hovertemplate='<b>Industrial</b><br>Quarter: %{x}<br>Absorption: %{y:,.0f} SF<extra></extra>'
))

fig.add_trace(go.Scatter(
    x=df['Quarter'],
    y=df['Retail SF'],
    mode='lines+markers',
    name='Retail', 
    line=dict(color='#5D878F', width=3),
    marker=dict(size=10),
    hovertemplate='<b>Retail</b><br>Quarter: %{x}<br>Absorption: %{y:,.0f} SF<extra></extra>'
))

# Add horizontal reference line at zero
fig.add_hline(y=0, line_dash="dash", line_color="gray", line_width=2, opacity=0.7)

# Update layout with legend positioned horizontally under title (4 items)
fig.update_layout(
    title='Houston RE Absorption Trends 2025',
    xaxis_title='Quarter',
    yaxis_title='Absorption (SF)',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    hovermode='closest'
)

# Format y-axis with abbreviated numbers
fig.update_yaxes(
    tickformat=',.0s',
    exponentformat='SI'
)

# Add annotation explaining multifamily scaling
fig.add_annotation(
    text="*Multifamily scaled x100 for visibility",
    xref="paper", yref="paper",
    x=0.02, y=0.02,
    showarrow=False,
    font=dict(size=10, color="gray"),
    align="left"
)

# Save the chart
fig.write_image('houston_absorption_trends.png')