import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("harris_population_growth.csv")

# Display the data structure to understand it
print("Data structure:")
print(df.head())
print("\nColumn names:")
print(df.columns.tolist())

# Create the line chart
fig = go.Figure()

# Add Harris County line
fig.add_trace(go.Scatter(
    x=df['Year'],
    y=df['Harris_County'] / 1000000,  # Convert to millions
    mode='lines+markers',
    name='Harris County',
    line=dict(color='#1FB8CD', width=3),
    marker=dict(size=8),
    cliponaxis=False,
    hovertemplate='<b>Harris County</b><br>Year: %{x}<br>Population: %{y:.1f}M<extra></extra>'
))

# Add Houston Metro line
fig.add_trace(go.Scatter(
    x=df['Year'],
    y=df['Houston_Metro'] / 1000000,  # Convert to millions
    mode='lines+markers',
    name='Houston Metro',
    line=dict(color='#FFC185', width=3),
    marker=dict(size=8),
    cliponaxis=False,
    hovertemplate='<b>Houston Metro</b><br>Year: %{x}<br>Population: %{y:.1f}M<extra></extra>'
))

# Update layout
fig.update_layout(
    title='Harris & Houston Population Growth',
    xaxis_title='Year',
    yaxis_title='Population (M)',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format y-axis to show values in millions
fig.update_yaxes(tickformat='.1f', ticksuffix='M')

# Save the chart
fig.write_image("harris_houston_population_growth.png")