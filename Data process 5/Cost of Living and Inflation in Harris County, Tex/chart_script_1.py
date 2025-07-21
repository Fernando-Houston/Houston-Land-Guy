import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Data with abbreviated category names to meet 15 character limit
data = {
    "Category": ["Struct Steel", "Cement", "Labor Wages", "Lumber"],
    "YOY Change": [11.2, 3.0, 4.4, -4.8]
}
df = pd.DataFrame(data)

# Create colors - positive values orange, negative teal
colors = ['#FFC185' if x > 0 else '#1FB8CD' for x in df['YOY Change']]

fig = go.Figure()

# Add bars
fig.add_trace(go.Bar(
    x=df['Category'],
    y=df['YOY Change'],
    marker_color=colors,
    text=[f"{val}%" for val in df['YOY Change']],
    textposition='outside',
    cliponaxis=False
))

# Add reference line at 0%
fig.add_hline(y=0, line_dash="dash", line_color="gray")

# Update layout
fig.update_layout(
    title="2025 Construction Cost Drivers Houston",
    xaxis_title="Category",
    yaxis_title="YOY Change (%)",
    yaxis_range=[-6, 12],
    showlegend=False
)

fig.write_image("construction_cost_drivers.png")