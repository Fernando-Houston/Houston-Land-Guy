import plotly.express as px
import plotly.graph_objects as go
import json

# Data from the provided JSON
data = {
    "gdp_by_sector": [
        {"sector": "Trade, Transportation, Utilities", "value": 142.2, "percentage": 20.4},
        {"sector": "Professional/Business Services", "value": 113.6, "percentage": 16.3},
        {"sector": "Energy (Oil, Gas, Mining)", "value": 104.6, "percentage": 15.0},
        {"sector": "Healthcare/Education", "value": 83.6, "percentage": 12.0},
        {"sector": "Manufacturing", "value": 78.8, "percentage": 11.3},
        {"sector": "Real Estate", "value": 69.7, "percentage": 10.0},
        {"sector": "Government", "value": 55.8, "percentage": 8.0},
        {"sector": "Other", "value": 48.8, "percentage": 7.0}
    ]
}

# Extract data for the chart
sectors = []
percentages = []
values = []

for item in data["gdp_by_sector"]:
    # Abbreviate sector names to meet 15 character limit
    sector = item["sector"]
    if sector == "Trade, Transportation, Utilities":
        sector = "Trade/Trans/Util"
    elif sector == "Professional/Business Services":
        sector = "Prof/Bus Svcs"
    elif sector == "Energy (Oil, Gas, Mining)":
        sector = "Energy/Oil/Gas"
    elif sector == "Healthcare/Education":
        sector = "Health/Edu"
    
    sectors.append(sector)
    percentages.append(item["percentage"])
    values.append(item["value"])

# Brand colors in specified order
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C', '#964325', '#944454']

# Create pie chart
fig = go.Figure(data=[go.Pie(
    labels=sectors,
    values=percentages,
    text=[f"{p}%" for p in percentages],
    textinfo='text',
    hovertemplate='<b>%{label}</b><br>%{value}%<br>$%{customdata:.1f}b<extra></extra>',
    customdata=values,
    marker=dict(colors=colors)
)])

fig.update_layout(
    title="Houston Metro GDP by Sector 2025",
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

# Save the chart
fig.write_image("houston_gdp_pie_chart.png")