import pandas as pd
import plotly.graph_objects as go

# Create the data from the provided JSON with normalized metrics for comparison
data = {
    "Office": {"vacancy": 25.9, "absorption": 433, "rent": 29.00, "key": "1st pos since '21"},
    "Industrial": {"vacancy": 6.2, "absorption": 2900, "rent": 10.27, "key": "17.8m SF pipeline"},
    "Retail": {"vacancy": 5.5, "absorption": -94, "rent": 20.60, "key": "Stable since '22"},
    "Multifamily": {"vacancy": 6.0, "absorption": 4100, "rent": 1367, "key": "Highest since '22"}
}

sectors = list(data.keys())

# Create grouped bar chart showing vacancy rates and normalized absorption
fig = go.Figure()

# Define colors from the brand palette
colors = ["#1FB8CD", "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C"]

# Add vacancy rate bars
vacancy_rates = [data[sector]["vacancy"] for sector in sectors]
fig.add_trace(go.Bar(
    name='Vacancy Rate',
    x=sectors,
    y=vacancy_rates,
    marker_color=colors[0],
    hovertemplate="<b>%{x}</b><br>Vacancy: %{y}%<extra></extra>",
    cliponaxis=False,
    yaxis='y'
))

# Normalize absorption data for visualization (scale to be comparable to vacancy rates)
absorption_values = [data[sector]["absorption"] for sector in sectors]
# Scale absorption to 0-30 range for visual comparison
max_abs = max(abs(val) for val in absorption_values)
normalized_absorption = [(val/max_abs) * 15 + 10 for val in absorption_values]

fig.add_trace(go.Bar(
    name='Net Absorption',
    x=sectors,
    y=normalized_absorption,
    marker_color=colors[1],
    hovertemplate="<b>%{x}</b><br>" +
                  "Absorption: " +
                  ["433k SF" if i==0 else "2.9m SF" if i==1 else "-94k SF" if i==2 else "4.1k units" for i in range(4)][0] +
                  "<extra></extra>",
    cliponaxis=False,
    customdata=[f"{absorption_values[i]}k SF" if sectors[i] != "Multifamily" else f"{absorption_values[i]} units" for i in range(4)]
))

# Update hover template for absorption to show actual values
for i, sector in enumerate(sectors):
    if sector == "Multifamily":
        absorption_text = f"{absorption_values[i]} units"
    else:
        if absorption_values[i] >= 1000:
            absorption_text = f"{absorption_values[i]/1000:.1f}m SF"
        else:
            absorption_text = f"{absorption_values[i]}k SF"
    
    fig.data[1].hovertemplate = fig.data[1].hovertemplate.replace(
        "Absorption: 433k SF" if i==0 else "Absorption: 2.9m SF" if i==1 else "Absorption: -94k SF" if i==2 else "Absorption: 4.1k units",
        f"Absorption: {absorption_text}"
    )

# Update layout
fig.update_layout(
    title="Houston CRE Key Metrics by Sector",
    yaxis_title="Vacancy Rate (%)",
    xaxis_title="Sector",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    barmode='group'
)

# Add annotations showing key metrics
annotations = []
key_metrics = [data[sector]["key"] for sector in sectors]

for i, (sector, metric) in enumerate(zip(sectors, key_metrics)):
    annotations.append(dict(
        x=i,
        y=max(vacancy_rates[i], normalized_absorption[i]) + 2,
        text=metric,
        showarrow=False,
        font=dict(size=10),
        xanchor="center"
    ))

fig.update_layout(annotations=annotations)

# Save the chart
fig.write_image("houston_cre_metrics.png")