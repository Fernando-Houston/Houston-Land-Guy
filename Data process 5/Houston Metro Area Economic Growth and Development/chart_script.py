import plotly.graph_objects as go
import plotly.io as pio

# Data for Houston Metro Area Key Economic Indicators
indicators = ["GDP Growth", "Pop Growth", "Job Growth", "Unemployment", "Export Value", "New Business"]

# Scale the large values appropriately for visualization
# Export value: 180.9 billion -> scale to percentage-like range (divide by 40 to get ~4.5)
# New business: 125,329 -> convert to percentage (assuming base of ~3M businesses = ~4.2%)
values = [2.2, 2.5, 1.6, 4.5, 4.52, 4.18]
original_values = [2.2, 2.5, 1.6, 4.5, 180.9, 125329]
units = ["%", "%", "%", "%", "Billion USD", "Count"]

# Create hover text with original values and appropriate formatting
hover_text = []
for i, (indicator, orig_val, unit) in enumerate(zip(indicators, original_values, units)):
    if unit == "Billion USD":
        hover_text.append(f"{indicator}<br>$180.9b USD")
    elif unit == "Count":
        hover_text.append(f"{indicator}<br>125,329 entities")
    else:
        hover_text.append(f"{indicator}<br>{orig_val}{unit}")

# Colors from the specified palette
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C']

# Create bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=indicators,
    y=values,
    marker_color=colors,
    text=[f"{v}%" if i < 4 else f"{v:.1f}" for i, v in enumerate(values)],
    textposition='outside',
    hovertemplate='%{customdata}<extra></extra>',
    customdata=hover_text,
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title="Houston Economic Indicators 2025",
    xaxis_title="Indicators",
    yaxis_title="Values (%)",
    showlegend=False
)

# Save the chart
fig.write_image("houston_economic_indicators.png")