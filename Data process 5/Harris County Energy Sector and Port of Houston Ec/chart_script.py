import plotly.express as px
import pandas as pd

# Create dataframe from the provided data
data = {"economic_impact": [{"region": "Texas", "impact_billions": 439}, {"region": "United States", "impact_billions": 906}]}
df = pd.DataFrame(data["economic_impact"])

# Create horizontal bar chart
fig = px.bar(df, 
             x="impact_billions", 
             y="region", 
             orientation='h',
             title="Port of Houston Economic Impact 2025",
             color="region",
             color_discrete_sequence=["#1FB8CD", "#FFC185"],
             text="impact_billions")  # Add text labels on bars

# Update layout following the instructions
fig.update_layout(
    xaxis_title="Impact ($B USD)",
    yaxis_title="",
    showlegend=False  # Remove legend since region names are already on y-axis
)

# Apply cliponaxis=False to the traces
fig.update_traces(cliponaxis=False)

# Format x-axis to show values with proper dollar format
fig.update_xaxes(tickformat="$,.0f", ticksuffix="B")

# Format text labels on bars to show dollar values
fig.update_traces(texttemplate='$%{text}B', textposition="inside")

# Save the chart
fig.write_image("port_houston_economic_impact.png")