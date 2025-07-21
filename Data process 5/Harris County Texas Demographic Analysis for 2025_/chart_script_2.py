import plotly.graph_objects as go

# Data for household composition
categories = ["Family Households", "Non-Family Households"]
percentages = [58.1, 41.9]
households = [532530, 384006]

# Create labels with both percentages and household counts
text_labels = [f"{pct}%<br>{round(hh/1000)}k HH" for pct, hh in zip(percentages, households)]

# Create pie chart
fig = go.Figure(data=[go.Pie(
    labels=categories,
    values=percentages,
    text=text_labels,
    textinfo="label+text",
    hovertemplate="<b>%{label}</b><br>%{percent}<br>%{customdata:,} households<br><extra></extra>",
    customdata=households,
    marker=dict(colors=['#1FB8CD', '#FFC185'])
)])

fig.update_layout(
    title="Houston HH Composition - 2025<br><sub>Total HH: 916k | Avg Size: 2.0</sub>",
    uniformtext_minsize=14, 
    uniformtext_mode='hide'
)

fig.write_image("houston_household_composition.png")