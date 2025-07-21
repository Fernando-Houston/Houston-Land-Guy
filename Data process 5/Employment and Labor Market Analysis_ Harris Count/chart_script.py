import pandas as pd
import plotly.graph_objects as go

# Create the data
data = [
    {"Month": "January 2025", "Harris County": 4.4, "National": 4.1},
    {"Month": "February 2025", "Harris County": 4.5, "National": 4.2},
    {"Month": "March 2025", "Harris County": 4.3, "National": 4.1},
    {"Month": "April 2025", "Harris County": 4.0, "National": 4.2},
    {"Month": "May 2025", "Harris County": 4.3, "National": 4.2}
]

df = pd.DataFrame(data)

# Abbreviate month names to fit 15 character limit
df['Month'] = df['Month'].str.replace(' 2025', ' 25')

# Create the line chart
fig = go.Figure()

# Add Harris County line
fig.add_trace(go.Scatter(
    x=df['Month'], 
    y=df['Harris County'],
    mode='lines+markers',
    name='Harris County',
    line=dict(color='#1FB8CD'),
    cliponaxis=False
))

# Add National line
fig.add_trace(go.Scatter(
    x=df['Month'], 
    y=df['National'],
    mode='lines+markers',
    name='National',
    line=dict(color='#FFC185'),
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='Unemployment Trends Jan-May 2025',
    xaxis_title='Month',
    yaxis_title='Rate (%)',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Save the chart
fig.write_image('unemployment_trends.png')