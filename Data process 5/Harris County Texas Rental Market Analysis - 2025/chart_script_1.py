import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
submarkets = ["Greenspoint/Northborough/Aldine", "Northline", "I-69", "I-10 East/Woodforest/Channelview", "North Central Houston", "Galleria/Uptown", "Downtown/Montrose/River Oaks"]
rent_growth = [7.3, 7.0, 6.6, 5.9, 4.2, 2.5, 2.3]

# Better abbreviated submarket names (under 15 characters)
abbreviated_submarkets = [
    "Greenspoint+",
    "Northline", 
    "I-69",
    "I-10 East+",
    "N Central Hou",
    "Galleria+",
    "Downtown+"
]

# Reverse the order so highest growth appears at the top
reversed_submarkets = abbreviated_submarkets[::-1]
reversed_growth = rent_growth[::-1]

# Create horizontal bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=reversed_growth,
    y=reversed_submarkets,
    orientation='h',
    marker_color='#1FB8CD',
    text=[f"{val}%" for val in reversed_growth],
    textposition='inside',
    textfont=dict(color='white')
))

# Update layout with shortened title (under 40 characters)
fig.update_layout(
    title="Houston Rent Growth 2024-25",
    xaxis_title="Growth %",
    yaxis_title="Submarket"
)

# Save the chart
fig.write_image("houston_rent_growth_chart.png")