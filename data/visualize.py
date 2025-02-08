import pandas as pd
import folium
from folium.plugins import MarkerCluster
import os

# ----------------------------
# STEP 1: Load and Prepare Data
# ----------------------------

# File containing the filtered Durham accident data
csv_file = "Durham_Accidents_Filtered.csv"

# Check if the file exists
if not os.path.exists(csv_file):
    raise FileNotFoundError(f"CSV file '{csv_file}' not found. Please check the file path.")

# Read the CSV file into a DataFrame
df = pd.read_csv(csv_file)

# Display a summary of the loaded data (for debugging)
print("Data preview:")
print(df.head())
print("\nTotal accidents loaded:", len(df))

# ----------------------------
# STEP 2: Create the Map Visualization
# ----------------------------

# If you have multiple rows, you might want to calculate the center of the map automatically.
# For this sample, we use the first accident's coordinates as the initial center.
if not df.empty and pd.notnull(df.loc[0, "Start_Lat"]) and pd.notnull(df.loc[0, "Start_Lng"]):
    init_lat = df.loc[0, "Start_Lat"]
    init_lng = df.loc[0, "Start_Lng"]
else:
    # Default coordinates (change as needed)
    init_lat, init_lng = 41.477951, -72.68351700000002

# Create a Folium map centered at the initial coordinates with a starting zoom level.
accident_map = folium.Map(location=[init_lat, init_lng], zoom_start=13)

# Create a MarkerCluster to group nearby accident markers
marker_cluster = MarkerCluster().add_to(accident_map)

# Loop through each accident in the DataFrame and add a marker
for idx, row in df.iterrows():
    # Ensure that we have valid latitude and longitude data
    if pd.notnull(row["Start_Lat"]) and pd.notnull(row["Start_Lng"]):
        lat = row["Start_Lat"]
        lng = row["Start_Lng"]
        
        # Build a popup with some accident details
        popup_text = (
            f"<b>ID:</b> {row['ID']}<br>"
            f"<b>Street:</b> {row['Street']}<br>"
            f"<b>City:</b> {row['City']}<br>"
            f"<b>County:</b> {row['County']}<br>"
            f"<b>State:</b> {row['State']}<br>"
            f"<b>Zipcode:</b> {row['Zipcode']}<br>"
            f"<b>Weather:</b> {row['Weather_Condition']}<br>"
            f"<b>Temperature:</b> {row['Temperature(F)']} °F<br>"
            f"<b>Humidity:</b> {row['Humidity(%)']}%<br>"
            f"<b>Severity:</b> {row['Severity']}<br>"
            f"<b>Time:</b> {row['Weather_Timestamp']}<br>"
        )
        
        # Color-code the marker by severity:
        # 1 => green (low severity), 2 => orange (moderate), 3+ => red (high)
        severity = row["Severity"]
        if severity == 1:
            marker_color = "green"
        elif severity == 2:
            marker_color = "orange"
        else:
            marker_color = "red"
        
        # Add the marker to the cluster
        folium.Marker(
            location=[lat, lng],
            popup=folium.Popup(popup_text, max_width=300),
            icon=folium.Icon(color=marker_color, icon="exclamation-sign")
        ).add_to(marker_cluster)

# Save the map to an HTML file so you can open it in a web browser
map_filename = "accidents_map.html"
accident_map.save(map_filename)
print(f"\nInteractive map has been saved as '{map_filename}'.")

# ----------------------------
# STEP 3: Conclusions and Project Summary
# ----------------------------
print("\n--- Project Summary & Conclusions ---")
print("1. Data Loading:")
print("   - Successfully loaded the filtered Durham accident data from the CSV file.")
print(f"   - Total records loaded: {len(df)}")
print("2. Data Visualization:")
print("   - An interactive map was generated with accident locations marked.")
print("   - Markers are color-coded by severity (green for low, orange for moderate, red for high).")
print("   - Clicking on a marker reveals detailed information about the accident (ID, location, weather, etc.).")
print("3. Implications for Safer Routes:")
print("   - With this visualization, high-risk locations can be identified.")
print("   - By avoiding routes with clusters of accidents (or high-severity accidents), safer routing options can be planned for teen drivers.")
print("   - This approach can be extended further by integrating route optimization APIs (like Google Maps or  OpenStreetMap routing services) that can factor in accident data.")
print("\nNext steps could include integrating real-time accident data and enhancing the route planning  algorithm to dynamically avoid high-risk areas.")

print("\nProject completed successfully!")

