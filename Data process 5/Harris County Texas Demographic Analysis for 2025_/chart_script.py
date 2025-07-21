import plotly.express as px
import pandas as pd
import json

# Load the data
data = [
  {"age_group": "0-4", "population": 327107, "percent": 6.63, "generation": "Generation Alpha"},
  {"age_group": "5-9", "population": 337232, "percent": 6.84, "generation": "Generation Alpha"},
  {"age_group": "10-14", "population": 352520, "percent": 7.15, "generation": "Generation Alpha"},
  {"age_group": "15-17", "population": 208209, "percent": 4.22, "generation": "Generation Alpha"},
  {"age_group": "18-20", "population": 215445, "percent": 4.37, "generation": "Generation Z"},
  {"age_group": "21-24", "population": 274989, "percent": 5.57, "generation": "Generation Z"},
  {"age_group": "25-34", "population": 719305, "percent": 14.58, "generation": "Millennials"},
  {"age_group": "35-44", "population": 719632, "percent": 14.59, "generation": "Millennials"},
  {"age_group": "45-54", "population": 620281, "percent": 12.57, "generation": "Generation X"},
  {"age_group": "55-64", "population": 527096, "percent": 10.69, "generation": "Generation X"},
  {"age_group": "65-74", "population": 387404, "percent": 7.85, "generation": "Baby Boomers"},
  {"age_group": "75-84", "population": 185835, "percent": 3.77, "generation": "Baby Boomers"},
  {"age_group": "85+", "population": 57651, "percent": 1.17, "generation": "Silent Generation"}
]

df = pd.DataFrame(data)

# Define generation colors using brand colors in order
generation_colors = {
    'Generation Alpha': '#1FB8CD',
    'Generation Z': '#FFC185', 
    'Millennials': '#ECEBD5',
    'Generation X': '#5D878F',
    'Baby Boomers': '#D2BA4C',
    'Silent Generation': '#B4413C'
}

# Create bar chart
fig = px.bar(df, 
             x='age_group', 
             y='population',
             color='generation',
             color_discrete_map=generation_colors,
             title='Harris County Age by Generation 2025')

# Update layout
fig.update_layout(
    xaxis_title='Age Groups',
    yaxis_title='Population'
)

# Format y-axis to show population in abbreviated format
def format_population(val):
    if val >= 1000000:
        return f'{val/1000000:.1f}m'
    elif val >= 1000:
        return f'{val/1000:.0f}k'
    else:
        return f'{val:.0f}'

fig.update_yaxes(
    tickformat='.0s'
)

# Add hover template with population numbers and percentages
fig.update_traces(
    hovertemplate='<b>%{x}</b><br>' +
                  'Pop: %{y:,.0f}<br>' +
                  'Percent: %{customdata:.1f}%<br>' +
                  '%{fullData.name}' +
                  '<extra></extra>',
    customdata=df['percent']
)

# Save the chart
fig.write_image('harris_county_demographics.png')