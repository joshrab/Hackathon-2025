import os
import pandas as pd
import networkx as nx
import osmnx as ox
import folium
from shapely.geometry import Point, LineString

# -------------------------------
# PARAMETERS
# -------------------------------
# Risk tolerance parameter (0 = fastest route, 1 = safest route)
risk_tolerance = 0.5  # Adjust between 0 and 1

# A scaling factor to bring the risk units in line with distance (meters)
risk_weight_factor = 1000

# Distance threshold (in meters) to consider an accident affecting an edge
accident_radius = 100

# File with Durham, NC accident data (must include: Start_Lat, Start_Lng, Severity)
accident_csv = "Durham_Accidents_Filtered.csv"

# Define sample origin and destination addresses (or lat/lng coordinates) in Durham, NC.
# For demonstration, we use approximate coordinates.
origin_point = (35.9940, -78.8986)  # Example: near downtown Durham
destination_point = (36.0000, -78.9200)  # Example: a location in Durham

# -------------------------------
# STEP 1: Load Accident Data
# -------------------------------
if not os.path.exists(accident_csv):
    raise FileNotFoundError(f"Accident file '{accident_csv}' not found.")

df_accidents = pd.read_csv(accident_csv)
print(f"Loaded {len(df_accidents)} accident records.")

# Convert accident rows into shapely Points
accident_points = []
for _, row in df_accidents.iterrows():
    if pd.notnull(row["Start_Lat"]) and pd.notnull(row["Start_Lng"]):
        pt = Point(row["Start_Lng"], row["Start_Lat"])  # Note: Point(lon, lat)
        # Use severity as weight; if not available, assume 1
        severity = row["Severity"] if pd.notnull(row["Severity"]) else 1
        accident_points.append((pt, severity))
print(f"Processed {len(accident_points)} accident locations.")

# -------------------------------
# STEP 2: Download Road Network for Durham, NC
# -------------------------------
# Get a drivable road network for Durham, NC.
# You can adjust the network type as needed (e.g., "drive").
print("Downloading road network for Durham, NC...")
G = ox.graph_from_place("Durham, North Carolina, USA", network_type="drive")
print("Road network downloaded.") 

# Ensure that each edge has a 'geometry'; if not, create one from the nodes.
for u, v, k, data in G.edges(keys=True, data=True):
    if "geometry" not in data:
        # Get node coordinates and create a straight line
        point_u = Point((G.nodes[u]['x'], G.nodes[u]['y']))
        point_v = Point((G.nodes[v]['x'], G.nodes[v]['y']))
        data["geometry"] = LineString([point_u, point_v])
    # Also compute the edge length if not present
    if "length" not in data:
        data["length"] = data["geometry"].length

# -------------------------------
# STEP 3: Compute Risk Scores for Each Edge
# -------------------------------
def compute_edge_risk(edge_geom):
    """Return a risk score for an edge based on nearby accidents."""
    risk = 0
    # Use the edge's midpoint as a reference
    midpoint = edge_geom.interpolate(0.5, normalized=True)
    for accident_pt, severity in accident_points:
        # Compute distance in meters (osmnx uses UTM if projected, but our data is in lat/lng)
        # For simplicity we assume a Euclidean approximation (works locally)
        dist = midpoint.distance(accident_pt) * 111139  # approximate conversion: degrees to meters
        if dist <= accident_radius:
            risk += severity
    return risk

# Add a risk score attribute for each edge.
print("Computing risk scores for each edge (this may take a minute)...")
for u, v, k, data in G.edges(keys=True, data=True):
    edge_geom = data["geometry"]
    risk = compute_edge_risk(edge_geom)
    data["risk"] = risk

# -------------------------------
# STEP 4: Combine Edge Weights Based on Distance and Risk
# -------------------------------
# We add a new attribute 'combined_weight' to each edge.
# Combined weight = (1 - risk_tolerance)*length + (risk_tolerance)*(risk * risk_weight_factor)
for u, v, k, data in G.edges(keys=True, data=True):
    distance = data.get("length", 0)
    risk_score = data.get("risk", 0)
    data["combined_weight"] = (1 - risk_tolerance) * distance + (risk_tolerance) * (risk_score * risk_weight_factor)

# -------------------------------
# STEP 5: Compute the Route Using NetworkX
# -------------------------------
# Convert origin/destination lat/lng to the nearest nodes in the graph.
origin_node = ox.distance.nearest_nodes(G, X=origin_point[1], Y=origin_point[0])
destination_node = ox.distance.nearest_nodes(G, X=destination_point[1], Y=destination_point[0])

print("Computing the optimal route...")
try:
    route = nx.shortest_path(G, origin_node, destination_node, weight="combined_weight")
except nx.NetworkXNoPath:
    raise Exception("No route found between the selected origin and destination.")

print("Route computed.")

# -------------------------------
# STEP 6: Visualize the Route on a Map
# -------------------------------
# Create a Folium map centered on the origin.
route_map = folium.Map(location=origin_point, zoom_start=14)

# Plot the route on the map.
route_nodes = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
folium.PolyLine(route_nodes, color="blue", weight=5, opacity=0.7).add_to(route_map)

# Mark the origin and destination.
folium.Marker(location=origin_point, popup="Origin", icon=folium.Icon(color="green")).add_to(route_map)
folium.Marker(location=destination_point, popup="Destination", icon=folium.Icon(color="red")).add_to(route_map)

# Optionally, add accident markers to see risk areas.
for accident_pt, severity in accident_points:
    # Convert accident point (lon, lat) to (lat, lon)
    folium.CircleMarker(
        location=(accident_pt.y, accident_pt.x),
        radius=5,
        popup=f"Severity: {severity}",
        color="orange",
        fill=True,
        fill_color="orange"
    ).add_to(route_map)

# Save the map to an HTML file.
map_filename = "safest_route_map.html"
route_map.save(map_filename)
print(f"\nInteractive route map saved as '{map_filename}'.")

# -------------------------------
# STEP 7: Conclusions & Next Steps
# -------------------------------
print("\n--- Project Summary & Conclusions ---")
print("1. Loaded accident data and constructed a road network for Durham, NC.")
print("2. Computed a risk score for each road segment based on nearby accidents.")
print("3. Combined travel distance and risk into a custom edge weight. With a risk_tolerance")
print("   parameter, you can adjust the route planning: lower values favor fastest routes,")
print("   higher values favor safer routes.")
print("4. Computed and visualized the optimal route on a Folium map.")
print("5. Next steps: further refine risk scoring (e.g. using historical accident density),")
print("   integrate live traffic data, or build an interactive web interface with a slider")
print("   (e.g., using Dash or Streamlit) to dynamically adjust the risk tolerance.")

print("\nProject completed successfully!")
