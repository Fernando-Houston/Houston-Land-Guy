import plotly.express as px
import pandas as pd

# Create dataframe from the provided data
data = {
    "Race/Ethnicity": ["All Households", "White (Non-Hispanic)", "Black/African American", "Asian", "Hispanic/Latino", "Native American/Alaskan Native", "Some Other Race", "2+ Races"],
    "Median Income": [71811, 93060, 55900, 98032, 63594, 64151, 56569, 69706]
}

df = pd.DataFrame(data)

# Abbreviate race/ethnicity labels to 15 characters or less
df['Race/Ethnicity'] = df['Race/Ethnicity'].replace({
    'White (Non-Hispanic)': 'White',
    'Black/African American': 'Black/African',
    'Hispanic/Latino': 'Hispanic',
    'Native American/Alaskan Native': 'Native American',
    'Some Other Race': 'Other Race',
    '2+ Races': 'Multiracial'
})

# Add text labels for the bars (abbreviated with k for thousands)
df['Income_Label'] = df['Median Income'].apply(lambda x: f'${x//1000}k')

# Create the horizontal bar chart
fig = px.bar(df, 
             y='Race/Ethnicity', 
             x='Median Income',
             orientation='h',
             title='Median Income by Race Harris County 2025',
             color='Race/Ethnicity',
             text='Income_Label',
             color_discrete_sequence=['#1FB8CD', '#FFC185', '#ECEBD5', '#5D878F', '#D2BA4C', '#B4413C', '#964325', '#944454'])

# Update layout and axes
fig.update_xaxes(title="Income (k)")
fig.update_yaxes(title="Race/Ethnicity")

# Format x-axis to show in thousands
fig.update_xaxes(tickvals=[0, 25000, 50000, 75000, 100000], 
                 ticktext=['0k', '25k', '50k', '75k', '100k'])

# Position text labels outside the bars and apply cliponaxis to traces
fig.update_traces(textposition='outside', cliponaxis=False)

# Save the chart
fig.write_image('income_by_race_chart.png')