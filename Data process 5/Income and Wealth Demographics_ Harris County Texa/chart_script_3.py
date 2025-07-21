import pandas as pd
import plotly.graph_objects as go

# Create the data
data = {
    "Housing Status": ["Renters", "Renters", "Homeowners"],
    "Burden Level": ["Cost-Burdened (30%+)", "Severely Cost-Burdened (50%+)", "Cost-Burdened (30%+)"],
    "Percentage": [52, 27, 24],
    "Description": ["Spend >30% income on housing", "Spend >50% income on housing", "Spend >30% income on housing"]
}

df = pd.DataFrame(data)

fig = go.Figure()

# Add bars with appropriate colors and text labels
# Renters Cost-Burdened
fig.add_trace(go.Bar(
    name="Rent Cost-Burd",
    x=["Renters"],
    y=[52],
    marker_color="#1FB8CD",
    text=["52%"],
    textposition='outside',
    cliponaxis=False
))

# Renters Severely Cost-Burdened  
fig.add_trace(go.Bar(
    name="Rent Sev-Burd",
    x=["Renters"],
    y=[27],
    marker_color="#5D878F",
    text=["27%"],
    textposition='outside',
    cliponaxis=False
))

# Homeowners Cost-Burdened
fig.add_trace(go.Bar(
    name="Own Cost-Burd",
    x=["Homeowners"],
    y=[24],
    marker_color="#FFC185",
    text=["24%"],
    textposition='outside',
    cliponaxis=False
))

fig.update_layout(
    title="Housing Cost Burden Houston Metro (2025)",
    xaxis_title="Housing Tenure",
    yaxis_title="Percentage (%)",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.write_image("houston_housing_burden.png")