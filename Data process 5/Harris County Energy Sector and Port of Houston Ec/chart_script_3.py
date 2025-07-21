import plotly.graph_objects as go
import plotly.express as px
import json

# Load the data
data = {"employment_comparison": [{"sector": "Upstream Oil & Gas", "category": "Direct", "jobs": 208200}, {"sector": "Total Oil & Gas", "category": "Direct", "jobs": 480460}, {"sector": "Energy Services", "category": "Statewide", "jobs": 635000}, {"sector": "Port Houston Terminals", "category": "Direct", "jobs": 190000}, {"sector": "Port Houston Total", "category": "Texas Supported", "jobs": 1540000}]}

# Create lists for plotting
sectors = []
categories = []
jobs = []

for item in data["employment_comparison"]:
    sectors.append(item["sector"])
    categories.append(item["category"])
    jobs.append(item["jobs"])

# Shorten sector names to fit 15 character limit
sector_map = {
    "Upstream Oil & Gas": "Upstream O&G",
    "Total Oil & Gas": "Total O&G", 
    "Energy Services": "Energy Svcs",
    "Port Houston Terminals": "Port Terminal",
    "Port Houston Total": "Port Total"
}

sectors_short = [sector_map[s] for s in sectors]

# Create category mapping for legend
category_map = {
    "Direct": "Direct",
    "Statewide": "Statewide", 
    "Texas Supported": "TX Supported"
}

categories_short = [category_map[c] for c in categories]

# Create the grouped bar chart
fig = go.Figure()

# Get unique categories for grouping
unique_categories = list(set(categories_short))
colors = ["#1FB8CD", "#FFC185", "#ECEBD5"]

for i, cat in enumerate(unique_categories):
    # Filter data for this category
    cat_sectors = [sectors_short[j] for j, c in enumerate(categories_short) if c == cat]
    cat_jobs = [jobs[j] for j, c in enumerate(categories_short) if c == cat]
    
    fig.add_trace(go.Bar(
        name=cat,
        x=cat_sectors,
        y=cat_jobs,
        marker_color=colors[i % len(colors)],
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title="Energy vs Port Jobs Texas 2025",
    xaxis_title="Sector",
    yaxis_title="Jobs",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format y-axis to show abbreviated numbers
fig.update_yaxes(
    tickformat='.2s'
)

# Save the chart
fig.write_image("employment_comparison_chart.png")