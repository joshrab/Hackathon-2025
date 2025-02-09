import os
import pickle
import pandas as pd
import networkx as nx
import osmnx as ox
import folium
import sys
from folium.plugins import MarkerCluster
from geopy.geocoders import Nominatim
import matplotlib.pyplot as plt

# -------------------------------
# PARAMETERS & SETTINGS
# -------------------------------
GRAPH_FILE = "durham_graph.gpickle"  # Use your precomputed NC (or Durham) graph file
ACCIDENT_CSV = "Durham_Accidents_Filtered.csv"  # CSV file with accident data for Durham (or surroundings)
RISK_TOLERANCE = 0.7  # Adjust risk tolerance at query time (0 = fastest, 1 = safest)
RISK_WEIGHT_FACTOR = 1000  # Must be same as used during precomputation

def get_coordinates(address):
    geolocator = Nominatim(user_agent="my_app")
    location = geolocator.geocode(address)
    return (location.latitude, location.longitude) if location else None

# Example addresses in Durham, NC
# address1 = "916 Jones Cir, Durham, NC 27703"
# address2 = "1200 Pate Farm Ln, Durham, NC 27703"
address1 = sys.argv[1]
address2 = sys.argv[2]

print("Query Route Addresses:", address1, address2)

coords1 = get_coordinates(address1)
coords2 = get_coordinates(address2)

print("Address 1 coordinates:", coords1)
print("Address 2 coordinates:", coords2)

if coords1 is None:
    raise ValueError(f"Could not geocode address: {address1}")
if coords2 is None:
    raise ValueError(f"Could not geocode address: {address2}")

# Define query origin and destination coordinates (lat, lon)
ORIGIN_COORDS = coords1
DESTINATION_COORDS = coords2

# -------------------------------
# STEP 1: Load the Precomputed Graph
# -------------------------------
with open(GRAPH_FILE, "rb") as f:
    G = pickle.load(f)
print(f"Loaded graph from {GRAPH_FILE}.")

# -------------------------------
# STEP 2: Update Combined Weight (if needed)
# -------------------------------
for u, v, k, data in G.edges(keys=True, data=True):
    distance = data.get("length", 0)
    risk = data.get("risk", 0)
    data["combined_weight"] = (1 - RISK_TOLERANCE) * distance + RISK_TOLERANCE * (risk * RISK_WEIGHT_FACTOR)

# -------------------------------
# STEP 3: Find Nearest Nodes for Origin and Destination
# -------------------------------
# Note: ox.distance.nearest_nodes expects X=longitude, Y=latitude.
origin_node = ox.distance.nearest_nodes(G, X=ORIGIN_COORDS[1], Y=ORIGIN_COORDS[0])
destination_node = ox.distance.nearest_nodes(G, X=DESTINATION_COORDS[1], Y=DESTINATION_COORDS[0])


# -------------------------------
# STEP 4: Compute the Safest Route
# -------------------------------
try:
    route = nx.shortest_path(G, origin_node, destination_node, weight="combined_weight")
    print("Route computed successfully.")
except nx.NetworkXNoPath:
    raise Exception("No route found between the selected points.")

# -------------------------------
# STEP 5: Visualize the Route Using Folium
# -------------------------------
# Create the map centered on the origin coordinates.
route_map = folium.Map(location=ORIGIN_COORDS, zoom_start=14)

# Plot the safe route as a polyline.
route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
folium.PolyLine(route_coords, color="blue", weight=5, opacity=0.7).add_to(route_map)

# Mark the origin and destination.
folium.Marker(location=ORIGIN_COORDS, popup="Origin", icon=folium.Icon(color="green")).add_to(route_map)
folium.Marker(location=DESTINATION_COORDS, popup="Destination", icon=folium.Icon(color="red")).add_to(route_map)

# -------------------------------
# STEP 6: Add Accident Markers to the Map
# -------------------------------
if os.path.exists(ACCIDENT_CSV):
    df_accidents = pd.read_csv(ACCIDENT_CSV)
    print("Accident data preview:")
    print(df_accidents.head())
    print("\nTotal accidents loaded:", len(df_accidents))
    
    # Create a marker cluster for accident markers.
    marker_cluster = MarkerCluster().add_to(route_map)
    
    for idx, row in df_accidents.iterrows():
        # Check that latitude and longitude are available.
        if pd.notnull(row["Start_Lat"]) and pd.notnull(row["Start_Lng"]):
            lat = row["Start_Lat"]
            lng = row["Start_Lng"]
            
            # Build a popup with accident details.
            popup_text = (
                f"<b>ID:</b> {row['ID']}<br>"
                f"<b>Street:</b> {row['Street']}<br>"
                f"<b>City:</b> {row['City']}<br>"
                f"<b>County:</b> {row['County']}<br>"
                f"<b>State:</b> {row['State']}<br>"
                f"<b>Weather:</b> {row['Weather_Condition']}<br>"
                f"<b>Temperature:</b> {row['Temperature(F)']} °F<br>"
                f"<b>Humidity:</b> {row['Humidity(%)']}%<br>"
                f"<b>Severity:</b> {row['Severity']}<br>"
                f"<b>Time:</b> {row['Weather_Timestamp']}<br>"
            )
            
            # Color-code the marker by severity:
            severity = row["Severity"]
            if severity == 1:
                marker_color = "green"
            elif severity == 2:
                marker_color = "orange"
            else:
                marker_color = "red"
            
            folium.Marker(
                location=[lat, lng],
                popup=folium.Popup(popup_text, max_width=300),
                icon=folium.Icon(color=marker_color, icon="exclamation-sign")
            ).add_to(marker_cluster)
else:
    print(f"Accident file {ACCIDENT_CSV} not found.")

# -------------------------------
# STEP 7: Save the Map to an HTML File
# -------------------------------
map_file = "safe_route_map.html"
route_map.save(map_file)
print(f"Route map saved to {map_file}. Open it in your browser to view the route and accident markers.")
