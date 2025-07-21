import pandas as pd
import plotly.graph_objects as go

# Create dataframe from the provided data
data = [
    {"Sector": "Healthcare", "Job_Change": 9700, "Growth_Type": "Positive"},
    {"Sector": "Hospitality (Restaurants/Bars)", "Job_Change": 9200, "Growth_Type": "Positive"},
    {"Sector": "Healthcare Services", "Job_Change": 6300, "Growth_Type": "Positive"},
    {"Sector": "Energy/Oil & Gas", "Job_Change": 2900, "Growth_Type": "Positive"},
    {"Sector": "Arts & Entertainment", "Job_Change": 2800, "Growth_Type": "Positive"},
    {"Sector": "Hotels", "Job_Change": 1200, "Growth_Type": "Positive"},
    {"Sector": "Construction", "Job_Change": 400, "Growth_Type": "Positive"},
    {"Sector": "Professional Services", "Job_Change": -3500, "Growth_Type": "Negative"},
    {"Sector": "Information", "Job_Change": -200, "Growth_Type": "Negative"}
]

df = pd.DataFrame(data)

# Abbreviate sector names to meet 15 character limit
sector_abbreviations = {
    "Healthcare": "Healthcare",
    "Hospitality (Restaurants/Bars)": "Hospitality",
    "Healthcare Services": "Healthcare Svc",
    "Energy/Oil & Gas": "Energy/Oil",
    "Arts & Entertainment": "Arts & Entmt",
    "Hotels": "Hotels",
    "Construction": "Construction",
    "Professional Services": "Professional",
    "Information": "Information"
}

df['Sector_Short'] = df['Sector'].map(sector_abbreviations)

# Create horizontal bar chart
fig = go.Figure()

# Add positive growth bars (green)
positive_data = df[df['Growth_Type'] == 'Positive']
fig.add_trace(go.Bar(
    y=positive_data['Sector_Short'],
    x=positive_data['Job_Change'],
    orientation='h',
    name='Positive',
    marker_color='green',
    text=positive_data['Job_Change'].apply(lambda x: f"{x/1000:.1f}k" if x >= 1000 else str(x)),
    textposition='outside',
    cliponaxis=False
))

# Add negative growth bars (red)
negative_data = df[df['Growth_Type'] == 'Negative']
fig.add_trace(go.Bar(
    y=negative_data['Sector_Short'],
    x=negative_data['Job_Change'],
    orientation='h',
    name='Negative',
    marker_color='red',
    text=negative_data['Job_Change'].apply(lambda x: f"{x/1000:.1f}k" if abs(x) >= 1000 else str(x)),
    textposition='outside',
    cliponaxis=False
))

fig.update_layout(
    title='Houston Job Growth by Sector 2025',
    xaxis_title='Job Growth',
    yaxis_title='Sector',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

fig.write_image('houston_job_growth.png')