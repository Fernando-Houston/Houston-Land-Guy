import pandas as pd
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('migration_components.csv')

# Filter out the total row, keep only the components
components_df = df[df['Component'] != 'Total Change'].copy()

# Define colors for each component
colors = {
    'International Migration': '#ECEBD5',  # Using light green from brand colors
    'Domestic Migration': '#B4413C',      # Using moderate red from brand colors  
    'Natural Increase (Births-Deaths)': '#1FB8CD'  # Using strong cyan from brand colors
}

# Create the horizontal bar chart
fig = go.Figure()

for idx, row in components_df.iterrows():
    component = row['Component']
    people = row['People']
    percentage = row['Percentage']
    
    # Abbreviate component names to fit 15 character limit
    if component == 'International Migration':
        short_name = 'Int\'l Migration'
    elif component == 'Domestic Migration':
        short_name = 'Dom Migration'
    else:  # Natural Increase
        short_name = 'Natural Inc'
    
    # Format the text labels
    people_k = f"{people/1000:.0f}k"
    text_label = f"{people_k} ({percentage:.1f}%)"
    
    fig.add_trace(go.Bar(
        x=[people/1000],  # Convert to thousands
        y=[short_name],
        orientation='h',
        name=short_name,
        marker_color=colors.get(component, '#1FB8CD'),
        text=text_label,
        textposition='auto',
        showlegend=False,
        cliponaxis=False
    ))

# Update layout
fig.update_layout(
    title="Harris County 2024 Pop Change Components",
    xaxis_title="People (k)",
    yaxis_title=""
)

# Save the chart
fig.write_image("harris_county_migration_chart.png")
print("Chart saved successfully!")