import plotly.express as px
import pandas as pd

# Create the data from the provided JSON
data = {
    "Income Group": ["Top 20%", "Middle 60%", "Bottom 20%"],
    "Share of Total Income": [53, 44, 3],
    "Population Share": [20, 60, 20]
}

df = pd.DataFrame(data)

# Create pie chart
fig = px.pie(df, 
             values='Share of Total Income', 
             names='Income Group',
             title='Harris County Income Distribution (2025)')

# Use brand colors
colors = ['#1FB8CD', '#FFC185', '#ECEBD5']
fig.update_traces(marker=dict(colors=colors))

# Add percentage labels inside pie slices and configure text settings
fig.update_traces(textposition='inside', textinfo='percent+label')
fig.update_layout(uniformtext_minsize=14, uniformtext_mode='hide')

# Save the chart
fig.write_image('income_distribution_chart.png')