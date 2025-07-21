import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
institutions = ["Rice University", "University of Houston", "University of Houston-Clear Lake", "University of Houston-Downtown", "Houston Community College"]
graduation_rates = [96, 54, 52, 33, 15]
institution_types = ["Private", "Public R1", "Public", "Public", "Community College"]

# Define colors for each institution type using brand colors
# Mapping to closest available brand colors
type_colors = {
    "Private": "#1FB8CD",        # Strong cyan (closest to blue available)
    "Public R1": "#ECEBD5",      # Light green
    "Public": "#FFC185",         # Light orange  
    "Community College": "#B4413C"  # Moderate red
}

# Abbreviate institution names to fit 15 character limit
abbreviated_institutions = [
    "Rice Univ",
    "UH Main", 
    "UH Clear Lake",
    "UH Downtown",
    "Houston CC"
]

# Create separate traces for each institution type to enable legend
fig = go.Figure()

# Group data by institution type
type_data = {}
for i, inst_type in enumerate(institution_types):
    if inst_type not in type_data:
        type_data[inst_type] = {'x': [], 'y': [], 'text': []}
    type_data[inst_type]['x'].append(abbreviated_institutions[i])
    type_data[inst_type]['y'].append(graduation_rates[i])
    type_data[inst_type]['text'].append(f"{graduation_rates[i]}%")

# Add traces for each institution type
for inst_type, data in type_data.items():
    fig.add_trace(go.Bar(
        x=data['x'],
        y=data['y'],
        name=inst_type,
        marker_color=type_colors[inst_type],
        text=data['text'],
        textposition='outside',
        cliponaxis=False
    ))

# Update layout with legend centered under title (4 legend items, so center it)
fig.update_layout(
    title="Houston Univ Grad Rates",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Update axes
fig.update_xaxes(tickangle=45)
fig.update_yaxes(title="6-Yr Grad Rate (%)")

# Save the chart
fig.write_image("houston_graduation_rates.png")