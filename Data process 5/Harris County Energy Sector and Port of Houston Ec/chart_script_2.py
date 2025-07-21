import plotly.graph_objects as go
import plotly.io as pio

# Data from the provided JSON
employment_data = [
    {"period": "April 2025", "jobs": 206000, "note": "Estimated"},
    {"period": "May 2025", "jobs": 208200, "note": "Actual"},
    {"period": "May 2024", "jobs": 203200, "note": "Prior Year"}
]

growth_metrics = [
    {"metric": "Year-over-year", "change": 5000, "percentage": 2.5},
    {"metric": "Five-month 2025", "change": 7300, "percentage": 3.6}
]

# Extract data for the chart - focus on 2025 data plus May 2024 for context
periods = ["May 2024", "Apr 2025", "May 2025"]
jobs = [203200, 206000, 208200]

# Convert to thousands for display
jobs_k = [job/1000 for job in jobs]

# Create colors - using the brand colors in order
colors = ['#ECEBD5', '#1FB8CD', '#FFC185']

# Create text labels with job numbers and growth info
text_labels = ['203.2k', '206.0k', '208.2k<br>+2.5% YoY<br>+3.6% 5mo']

# Create the bar chart
fig = go.Figure()

fig.add_trace(go.Bar(
    x=periods,
    y=jobs_k,
    marker_color=colors,
    cliponaxis=False,
    text=text_labels,
    textposition='outside',
    hovertemplate='<b>%{x}</b><br>Jobs: %{y:.1f}k<extra></extra>'
))

# Update layout
fig.update_layout(
    title="TX Oil & Gas Employment Growth 2025",
    yaxis_title="Jobs (000s)",
    xaxis_title="Period"
)

# Save the chart
fig.write_image("texas_oil_gas_employment_2025.png")