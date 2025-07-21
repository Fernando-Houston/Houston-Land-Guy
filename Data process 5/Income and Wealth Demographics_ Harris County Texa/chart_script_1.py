import pandas as pd
import plotly.graph_objects as go
import plotly.express as px

# Create the data from the provided JSON
data = {
    "Zip Code": ["77010", "77005", "77094", "77059", "77046", "77008", "77007", "77024", "77019", "77018"],
    "Median Household Income": [221776, 213059, 179387, 158958, 145567, 140609, 140536, 132710, 118172, 111524],
    "Area": ["Medical Center", "West University", "Cinco Ranch", "Clear Lake", "Galleria", "Heights", "Heights", "Memorial", "River Oaks", "Heights"]
}

df = pd.DataFrame(data)

# Sort by income in descending order
df = df.sort_values('Median Household Income', ascending=True)  # ascending=True for horizontal bars

# Format income values for display
df['Income_Display'] = df['Median Household Income'].apply(lambda x: f"${x/1000:.0f}k")

# Define color mapping for areas using the brand colors in order
unique_areas = df['Area'].unique()
color_palette = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C', '#964325']
color_map = {area: color_palette[i % len(color_palette)] for i, area in enumerate(unique_areas)}

# Create horizontal bar chart
fig = go.Figure()

for area in unique_areas:
    area_data = df[df['Area'] == area]
    fig.add_trace(go.Bar(
        x=area_data['Median Household Income'],
        y=area_data['Zip Code'],
        orientation='h',
        name=area,
        marker_color=color_map[area],
        text=area_data['Income_Display'],
        textposition='inside',
        hovertemplate='<b>Zip: %{y}</b><br>Area: ' + area + '<br>Income: %{text}<extra></extra>',
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title="Highest Income Zip Codes in Houston Metro Area (2025)",
    xaxis_title="Income ($)",
    yaxis_title="Zip Code",
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    showlegend=True,
    bargap=0.2
)

# Format x-axis to show currency values
fig.update_xaxes(
    tickformat='$,.0s'
)

# Ensure y-axis shows zip codes as categorical labels
fig.update_yaxes(
    type='category'
)

# Save the chart
fig.write_image("houston_income_zip_codes.png")