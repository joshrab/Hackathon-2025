import os
import pandas as pd
import networkx as nx
import osmnx as ox
import folium
from shapely.geometry import Point, LineString

# -------------------------------
# PARAMETERS & SETTINGS
# -------------------------------
RISK_TOLERANCE = 0.5          # Value between 0 (fastest) and 1 (safest)
ACCIDENT_RADIUS = 100         # Distance in meters to consider an accident 'near' an edge
RISK_WEIGHT_FACTOR = 1000     # Multiplier to balance risk scores with distance

# Coordinates for routing (example values in Durham, NC)
ORIGIN_COORDS = (35.9940, -78.8986)        # (lat, lon)
DESTINATION_COORDS = (36.0000, -78.9200)     # (lat, lon)

# -------------------------------
# STEP 1: Load Accident Data
# -------------------------------
accident_file = "Durham_Accidents_Filtered.csv"
if not os.path.exists(accident_file):
    raise FileNotFoundError(f"{accident_file} not found. Please make sure it is in the project folder.")
    
df_accidents = pd.read_csv(accident_file)
# Convert the Weather_Timestamp column to datetime (if needed)
df_accidents["Weather_Timestamp"] = pd.to_datetime(df_accidents["Weather_Timestamp"], errors="coerce")

# Create shapely Point objects for accident locations
accident_points = []
for _, row in df_accidents.iterrows():
    if pd.notnull(row["Start_Lat"]) and pd.notnull(row["Start_Lng"]):
        point = Point(row["Start_Lng"], row["Start_Lat"])  # Note: Point(lon, lat)
        # Use accident severity as the risk weight (default to 1 if missing)
        severity = row["Severity"] if pd.notnull(row["Severity"]) else 1
        accident_points.append((point, severity))
print(f"Processed {len(accident_points)} accident locations.")

# -------------------------------
# STEP 2: Download Road Network
# -------------------------------
print("Downloading road network for Durham, NC...")
G = ox.graph_from_place("Durham, North Carolina, USA", network_type="drive")
print("Road network downloaded.")

# Ensure each edge has a geometry and length
for u, v, k, data in G.edges(keys=True, data=True):
    if "geometry" not in data:
        point_u = Point((G.nodes[u]['x'], G.nodes[u]['y']))
        point_v = Point((G.nodes[v]['x'], G.nodes[v]['y']))
        data["geometry"] = LineString([point_u, point_v])
    if "length" not in data:
        data["length"] = data["geometry"].length

# -------------------------------
# STEP 3: Compute Risk Score for Each Edge
# -------------------------------
def compute_edge_risk(geom):
    risk = 0
    midpoint = geom.interpolate(0.5, normalized=True)
    for accident_point, severity in accident_points:
        # Approximate conversion from degrees to meters (latitude ~111,139 m per degree)
        distance_m = midpoint.distance(accident_point) * 111139
        if distance_m <= ACCIDENT_RADIUS:
            risk += severity
    return risk

print("Computing risk scores for each edge...")
for u, v, k, data in G.edges(keys=True, data=True):
    geom = data["geometry"]
    data["risk"] = compute_edge_risk(geom)

# -------------------------------
# STEP 4: Compute Combined Edge Weight
# -------------------------------
for u, v, k, data in G.edges(keys=True, data=True):
    distance = data.get("length", 0)
    risk = data.get("risk", 0)
    data["combined_weight"] = (1 - RISK_TOLERANCE) * distance + RISK_TOLERANCE * (risk * RISK_WEIGHT_FACTOR)

# -------------------------------
# STEP 5: Compute a Route Using NetworkX
# -------------------------------
origin_node = ox.distance.nearest_nodes(G, X=ORIGIN_COORDS[1], Y=ORIGIN_COORDS[0])
destination_node = ox.distance.nearest_nodes(G, X=DESTINATION_COORDS[1], Y=DESTINATION_COORDS[0])

print("Computing the safest route...")
try:
    route = nx.shortest_path(G, origin_node, destination_node, weight="combined_weight")
except nx.NetworkXNoPath:
    raise Exception("No route found between the specified points.")
print("Route computed.")

# -------------------------------
# STEP 6: Visualize the Route
# -------------------------------
route_map = folium.Map(location=ORIGIN_COORDS, zoom_start=14)
route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
folium.PolyLine(route_coords, color="blue", weight=5, opacity=0.7).add_to(route_map)
# Mark start and end points
folium.Marker(location=ORIGIN_COORDS, popup="Origin", icon=folium.Icon(color="green")).add_to(route_map)
folium.Marker(location=DESTINATION_COORDS, popup="Destination", icon=folium.Icon(color="red")).add_to(route_map)

# Optionally, mark accident locations on the map
for pt, severity in accident_points:
    folium.CircleMarker(
        location=(pt.y, pt.x),
        radius=4,
        popup=f"Severity: {severity}",
        color="orange",
        fill=True,
        fill_color="orange"
    ).add_to(route_map)

# Save map to an HTML file
map_file = "safe_route_map.html"
route_map.save(map_file)
print(f"Map saved to {map_file}. Open it in your browser to view the route.")
