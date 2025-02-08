import pickle
import networkx as nx
import osmnx as ox
import folium
import sys

# -------------------------------
# PARAMETERS & SETTINGS
# -------------------------------
GRAPH_FILE = "durham_graph.gpickle"
# Adjust risk tolerance at query time (0 = fastest, 1 = safest)
RISK_TOLERANCE = 0.7
RISK_WEIGHT_FACTOR = 1000  # Must be same as used in precomputation

# Define your query origin and destination coordinates (lat, lon)
# ORIGIN_COORDS = (35.957622, -78.850555)        # (lat, lon)
# DESTINATION_COORDS = (35.950523, -78.861716)    # (lat, lon)
ORIGIN_COORDS = (float(sys.argv[1]), float(sys.argv[2]))  # (lat, lon)
DESTINATION_COORDS = (float(sys.argv[3]), float(sys.argv[4]))  # (lat, lon)

# Print origin and destination coordinates
print(f"Origin coordinates: {ORIGIN_COORDS}")
print(f"Destination coordinates: {DESTINATION_COORDS}")

# -------------------------------
# STEP 1: Load the Precomputed Graph
# -------------------------------
with open(GRAPH_FILE, "rb") as f:
    G = pickle.load(f)
print(f"Loaded graph from {GRAPH_FILE}.")

# -------------------------------
# STEP 2: Update Combined Weight (if needed)
# -------------------------------
# If you want to allow dynamic risk tolerance, update the combined weight for each edge.
for u, v, k, data in G.edges(keys=True, data=True):
    distance = data.get("length", 0)
    risk = data.get("risk", 0)
    data["combined_weight"] = (1 - RISK_TOLERANCE) * distance + RISK_TOLERANCE * (risk * RISK_WEIGHT_FACTOR)

# -------------------------------
# STEP 3: Find Nearest Nodes for Origin and Destination
# -------------------------------
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
route_map = folium.Map(location=ORIGIN_COORDS, zoom_start=14)
route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
folium.PolyLine(route_coords, color="blue", weight=5, opacity=0.7).add_to(route_map)
# Mark origin and destination
folium.Marker(location=ORIGIN_COORDS, popup="Origin", icon=folium.Icon(color="green")).add_to(route_map)
folium.Marker(location=DESTINATION_COORDS, popup="Destination", icon=folium.Icon(color="red")).add_to(route_map)

# Save the map to an HTML file
map_file = "safe_route_map.html"
route_map.save(map_file)
print(f"Route map saved to {map_file}. Open it in your browser to view the route.")
