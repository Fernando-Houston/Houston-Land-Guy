import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
submarkets = [
    "Downtown/Montrose/River Oaks",
    "Galleria/Uptown", 
    "Memorial/West University",
    "Northwest Houston",
    "Sugar Land/Stafford",
    "The Woodlands",
    "Katy/Cinco Ranch",
    "Heights/Washington Ave"
]

cap_rates = [4.8, 5.2, 5.0, 5.5, 5.3, 4.9, 5.4, 4.7]

# Abbreviated submarket names (15 char limit)
abbreviated_names = [
    "Downtown/Montr",
    "Galleria/Up", 
    "Memorial/West",
    "Northwest HOU", 
    "Sugar Land/St",
    "The Woodlands",
    "Katy/Cinco",
    "Heights/Wash"
]

# Color palette as specified
colors = [
    "#1FB8CD",  # Strong cyan
    "#FFC185",  # Light orange
    "#ECEBD5",  # Light green
    "#5D878F",  # Cyan
    "#D2BA4C",  # Moderate yellow
    "#B4413C",  # Moderate red
    "#964325",  # Dark orange
    "#944454"   # Pink-red
]

# Create bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=abbreviated_names,
    y=cap_rates,
    marker_color=colors,
    text=[f"{rate}%" for rate in cap_rates],
    textposition='outside',
    cliponaxis=False,
    showlegend=False
))

# Update layout
fig.update_layout(
    title="Houston Cap Rates by Submarket - 2025",
    xaxis_title="Submarket",
    yaxis_title="Cap Rate (%)"
)

# Save the chart
fig.write_image("houston_cap_rates.png")