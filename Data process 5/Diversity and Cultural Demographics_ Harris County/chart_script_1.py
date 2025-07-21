import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Load the data
df = pd.read_csv('houston_metro_foreign_born_2025.csv')

# Use the Foreign_Born_Population column for the pie chart
county_col = 'County'
pop_col = 'Foreign_Born_Population'

# Calculate total from actual data
total_foreign_born = df[pop_col].sum()
print(f"Total foreign-born population: {total_foreign_born}")

# Sort by population 
df_sorted = df.sort_values(by=pop_col, ascending=False)

# Format numbers for display (abbreviate large numbers)
def format_number(num):
    if num >= 1_000_000:
        return f"{num/1_000_000:.1f}m"
    elif num >= 1_000:
        return f"{num/1_000:.1f}k"
    else:
        return str(int(num))

# Abbreviate county names to fit 15 character limit for labels
df_sorted['short_county'] = df_sorted[county_col].str.replace(' County', '').str.replace(' Co.', '')
df_sorted['short_county'] = df_sorted['short_county'].apply(lambda x: x[:15] if len(x) > 15 else x)

# Format numbers for text labels
df_sorted['formatted_pop'] = df_sorted[pop_col].apply(format_number)
df_sorted['percentage'] = (df_sorted[pop_col] / total_foreign_born * 100)

# Create custom text that includes both raw numbers and percentages
df_sorted['text_labels'] = df_sorted['formatted_pop'] + '<br>' + df_sorted['percentage'].round(1).astype(str) + '%'

# Create pie chart with both numbers and percentages
fig = go.Figure(data=[go.Pie(
    labels=df_sorted['short_county'],
    values=df_sorted[pop_col],
    text=df_sorted['text_labels'],
    textinfo='label+text',
    textposition='inside',
    hovertemplate='<b>%{label}</b><br>%{value:,.0f} (%{percent})<extra></extra>'
)])

# Format total for subtitle
total_formatted = format_number(total_foreign_born)

# Update layout with exact requested title
fig.update_layout(
    title=f"Foreign-Born Pop Dist - Houston Metro 2025<br><sub>Total: {total_formatted}</sub>",
    uniformtext_minsize=16, 
    uniformtext_mode='hide'
)

# Save the chart
fig.write_image("houston_foreign_born_pie_chart.png")
print("Chart saved as houston_foreign_born_pie_chart.png")