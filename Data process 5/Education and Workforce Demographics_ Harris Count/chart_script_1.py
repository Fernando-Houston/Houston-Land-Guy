import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv("houston_job_forecast_2025.csv")

# Abbreviate sector names to fit 15 character limit
sector_abbreviations = {
    'Trade, Transportation & Utilities': 'Trade & Trans',
    'Professional & Business Services': 'Prof Services',
    'Education & Health Services': 'Educ & Health',
    'Construction': 'Construction',
    'Leisure & Hospitality': 'Leisure & Hosp',
    'Manufacturing': 'Manufacturing',
    'Financial Activities': 'Financial',
    'Government': 'Government'
}

df['Sector_Abbrev'] = df['Sector'].map(sector_abbreviations)

# Define color mapping based on expected job growth
color_map = {
    'High': '#ECEBD5',    # Light green from brand colors
    'Moderate': '#1FB8CD', # Strong cyan (blue-ish) from brand colors  
    'Low': '#B4413C'      # Moderate red from brand colors
}

# Create the bar chart
fig = px.bar(df, 
             x='Sector_Abbrev', 
             y='Jobs Added Q4 2024',
             color='Expected Job Growth 2025',
             color_discrete_map=color_map,
             title='Houston Job Growth by Sector (Q4 2024)')

# Update layout
fig.update_layout(
    xaxis_title='Sector',
    yaxis_title='Jobs Added',
    legend_title='Growth Outlook',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Rotate x-axis labels for better readability
fig.update_xaxes(tickangle=45)

# Format y-axis to show numbers with k for thousands
def format_thousands(x):
    if abs(x) >= 1000:
        return f'{x/1000:.1f}k'
    else:
        return str(int(x))

# Apply custom formatting to y-axis
fig.update_yaxes(tickformat='.0f')

# Custom hover template to show full values
fig.update_traces(
    hovertemplate='<b>%{x}</b><br>Jobs Added: %{y:,.0f}<br>Growth Outlook: %{customdata}<extra></extra>',
    customdata=df['Expected Job Growth 2025']
)

# Save the chart
fig.write_image("houston_job_growth_chart.png")
print("Chart saved successfully!")