import pandas as pd
import plotly.express as px

# Load the data
df = pd.read_csv("houston_neighborhoods_performance.csv")

# Check the data to understand the scale
print("First few rows of data:")
print(df.head())
print("\nOccupancy Rate range:")
print(f"Min: {df['Occupancy_Rate'].min()}, Max: {df['Occupancy_Rate'].max()}")

# If occupancy rate is in decimal form (0.45 for 45%), convert for proper percentage display
if df['Occupancy_Rate'].max() <= 1:
    df['Occupancy_Rate_Display'] = df['Occupancy_Rate'] * 100
    x_col = 'Occupancy_Rate_Display'
    x_label = 'Occupancy Rate (%)'
    x_format = '.0f'
else:
    x_col = 'Occupancy_Rate'
    x_label = 'Occupancy Rate'
    x_format = '.0f'

# Create scatter plot
fig = px.scatter(df, 
                 x=x_col, 
                 y='Average_Daily_Rate',
                 size='Average_Annual_Revenue',
                 color='Market_Tier',
                 hover_name='Neighborhood',  # Show neighborhood names in hover
                 hover_data={'Average_Annual_Revenue': ':$,.0f',
                           'Occupancy_Rate': ':.1%' if 'Display' in x_col else ':.0f',
                           'Average_Daily_Rate': ':$,.0f'},
                 title="Houston STR: Occupancy vs Rate",  # Under 40 chars
                 labels={x_col: x_label,
                         'Average_Daily_Rate': 'Avg Daily Rate'},
                 color_discrete_sequence=['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C'])

# Update layout for legend positioning (assuming 5 or fewer market tiers)
fig.update_layout(legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5))

# Format y-axis to show dollar signs
fig.update_yaxes(tickformat='$,.0f')

# Format x-axis 
fig.update_xaxes(tickformat=x_format)

# Save the chart
fig.write_image("houston_str_scatter.png")