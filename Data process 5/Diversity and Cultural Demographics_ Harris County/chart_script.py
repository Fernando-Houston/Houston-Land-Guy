import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('harris_county_demographics_2025.csv')

# View all data
print("Full dataset:")
print(df)

# Calculate total population to verify
total_pop = df['Population_2025'].sum()
print(f"\nCalculated total population: {total_pop:,}")

# Abbreviate race/ethnicity names for y-axis (15 char limit)
df['Race_Short'] = df['Race/Ethnicity'].str.replace('White (Non-Hispanic)', 'White Non-Hisp')
df['Race_Short'] = df['Race_Short'].str.replace('Black/African American', 'Black/Afr Am')
df['Race_Short'] = df['Race_Short'].str.replace('Hispanic/Latino', 'Hispanic/Latino')
df['Race_Short'] = df['Race_Short'].str.replace('Two or More Races', 'Two+ Races')
df['Race_Short'] = df['Race_Short'].str.replace('American Indian', 'Am Indian')
df['Race_Short'] = df['Race_Short'].str.replace('Native Hawaiian', 'Nat Hawaiian')

# Define colors (using the brand colors in order)
colors = ['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C', '#964325', '#944454']

# Sort by population for better visualization
df_sorted = df.sort_values('Population_2025', ascending=True)

# Create horizontal bar chart
fig = go.Figure(data=[
    go.Bar(
        y=df_sorted['Race_Short'],
        x=df_sorted['Population_2025'],
        orientation='h',
        marker=dict(color=colors[:len(df_sorted)]),
        text=[f"{pop/1000000:.1f}m ({pct}%)" for pop, pct in zip(df_sorted['Population_2025'], df_sorted['Percentage_2025'])],
        textposition='auto',
        cliponaxis=False,
        hovertemplate='<b>%{y}</b><br>Population: %{x:,.0f}<br>Percentage: %{customdata}%<extra></extra>',
        customdata=df_sorted['Percentage_2025']
    )
])

fig.update_layout(
    title=dict(
        text="Harris County TX Race/Ethnic 2025<br><sub>Total Population: 4.93m</sub>",
        x=0.5
    ),
    xaxis_title="Population",
    yaxis_title="Race/Ethnicity",
    showlegend=False
)

fig.update_xaxes(
    tickformat='.1s'
)

print("\nChart created successfully!")
fig.write_image("harris_county_chart.png")