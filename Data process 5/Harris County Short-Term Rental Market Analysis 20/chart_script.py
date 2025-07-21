import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("houston_neighborhoods_performance.csv")

# Sort by revenue for better visualization
df = df.sort_values('Average_Annual_Revenue', ascending=True)

# Create text labels with abbreviated revenue values
df['revenue_label'] = df['Average_Annual_Revenue'].apply(lambda x: f"{x/1000:.0f}k")

# Define colors for market tiers using the brand colors in order
color_map = {
    'Premium': '#1FB8CD',
    'High': '#FFC185', 
    'Medium': '#ECEBD5',
    'Luxury': '#5D878F',
    'Suburban': '#D2BA4C'
}

# Create horizontal bar chart with data labels
fig = px.bar(df, 
             y='Neighborhood',
             x='Average_Annual_Revenue',
             color='Market_Tier',
             color_discrete_map=color_map,
             orientation='h',
             text='revenue_label',
             title='Houston STR Performance by Neighborhood',
             labels={'Average_Annual_Revenue': 'Annual Revenue',
                    'Neighborhood': 'Neighborhood',
                    'Market_Tier': 'Market Tier'})

# Update text position to be inside bars
fig.update_traces(textposition='inside', textfont_size=12)

# Update layout with centered legend (5 or fewer items)
fig.update_layout(
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Format axes without cliponaxis
fig.update_xaxes(
    tickformat=',.0f',
    title='Annual Revenue'
)

fig.update_yaxes(
    title='Neighborhood'
)

# Save the chart
fig.write_image("houston_str_performance.png")
print("Chart saved successfully!")