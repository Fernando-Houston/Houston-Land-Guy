import plotly.graph_objects as go
import pandas as pd

# Data from the provided JSON
data = {
    "bedroom_types": ["Studio", "1-Bedroom", "2-Bedroom", "3-Bedroom"],
    "rent_low": [1071, 1145, 1357, 1849],
    "rent_high": [1191, 1275, 1607, 2091],
    "rent_average": [1131, 1210, 1482, 1970]
}

# Create DataFrame
df = pd.DataFrame(data)

# Calculate error values for error bars
df['error_lower'] = df['rent_average'] - df['rent_low']
df['error_upper'] = df['rent_high'] - df['rent_average']

# Create the bar chart with error bars
fig = go.Figure()

fig.add_trace(go.Bar(
    x=df['bedroom_types'],
    y=df['rent_average'],
    error_y=dict(
        type='data',
        symmetric=False,
        array=df['error_upper'],
        arrayminus=df['error_lower'],
        visible=True
    ),
    marker_color='#1FB8CD',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Houston Apt Rents by Bedroom - 2025",
    xaxis_title="Bedroom Type",
    yaxis_title="Rent ($)",
    showlegend=False
)

# Format y-axis 
fig.update_yaxes(
    tickformat='$,.0f'
)

fig.update_xaxes()

# Save the chart
fig.write_image("houston_apartment_rents_2025.png")