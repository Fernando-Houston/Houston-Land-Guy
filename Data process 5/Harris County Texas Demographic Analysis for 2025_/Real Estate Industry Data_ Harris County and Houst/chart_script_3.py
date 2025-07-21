import plotly.graph_objects as go
import pandas as pd

# Create the data
data = {
    "submarkets": [
        {"submarket": "University Place", "avg_rent": 2618, "tier": "Premium"},
        {"submarket": "The Museum District", "avg_rent": 2477, "tier": "Premium"},
        {"submarket": "Neartown-Montrose", "avg_rent": 2351, "tier": "Premium"},
        {"submarket": "Downtown Houston", "avg_rent": 2346, "tier": "Premium"},
        {"submarket": "Memorial", "avg_rent": 2108, "tier": "Premium"},
        {"submarket": "Greater Heights", "avg_rent": 1876, "tier": "Mid-Tier"},
        {"submarket": "Energy Corridor", "avg_rent": 1559, "tier": "Mid-Tier"},
        {"submarket": "Uptown Houston", "avg_rent": 1513, "tier": "Mid-Tier"},
        {"submarket": "Copperfield", "avg_rent": 1490, "tier": "Mid-Tier"},
        {"submarket": "Westchase", "avg_rent": 1183, "tier": "Mid-Tier"},
        {"submarket": "East Houston", "avg_rent": 1145, "tier": "Affordable"},
        {"submarket": "Alief", "avg_rent": 1136, "tier": "Affordable"},
        {"submarket": "Gulfton", "avg_rent": 1055, "tier": "Affordable"},
        {"submarket": "Sharpstown", "avg_rent": 1018, "tier": "Affordable"}
    ]
}

# Create DataFrame
df = pd.DataFrame(data["submarkets"])

# Sort by tier priority and then by rent descending within each tier, then reverse for proper display order
tier_order = {"Premium": 0, "Mid-Tier": 1, "Affordable": 2}
df['tier_sort'] = df['tier'].map(tier_order)
df = df.sort_values(['tier_sort', 'avg_rent'], ascending=[True, False])

# Reverse the order so highest rents appear at top in horizontal bar chart
df = df.iloc[::-1].reset_index(drop=True)

# Abbreviate long submarket names to fit 15 character limit
name_mapping = {
    "University Place": "Univ Place",
    "The Museum District": "Museum Dist",
    "Neartown-Montrose": "Neartown-Mont",
    "Downtown Houston": "Downtown"
}

df['display_name'] = df['submarket'].map(name_mapping).fillna(df['submarket'])

# Define colors for each tier
color_mapping = {
    "Premium": "#1FB8CD",      # Strong cyan
    "Mid-Tier": "#FFC185",     # Light orange  
    "Affordable": "#ECEBD5"    # Light green
}

df['color'] = df['tier'].map(color_mapping)

# Format rent values for display - show full amounts
df['rent_display'] = df['avg_rent'].apply(lambda x: f"${x:,}")

# Create horizontal bar chart
fig = go.Figure()

for tier in ["Premium", "Mid-Tier", "Affordable"]:
    tier_data = df[df['tier'] == tier]
    
    fig.add_trace(go.Bar(
        y=tier_data['display_name'],
        x=tier_data['avg_rent'],
        name=tier,
        orientation='h',
        marker_color=color_mapping[tier],
        text=tier_data['rent_display'],
        textposition='inside',
        textfont=dict(size=11),
        hovertemplate='<b>%{y}</b><br>Avg Rent: $%{x:,.0f}<extra></extra>',
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title='Houston Rental Rates by Submarket 2025',
    xaxis_title='Avg Rent ($)',
    yaxis_title='Submarket',
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.05,
        xanchor='center',
        x=0.5
    ),
    showlegend=True
)

# Update axes
fig.update_xaxes(
    tickformat='$,.0f'
)
fig.update_yaxes()

# Save the chart
fig.write_image('houston_rental_rates.png')