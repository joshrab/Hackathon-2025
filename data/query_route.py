import pickle
import networkx as nx
import osmnx as ox
import folium
from geopy.geocoders import Nominatim
import matplotlib.pyplot as plt

# -------------------------------
# PARAMETERS & SETTINGS
# -------------------------------
GRAPH_FILE = "durham_graph.gpickle"            # Use the precomputed NC graph file
RISK_TOLERANCE = 0.7                       # Adjust risk tolerance at query time (0 = fastest, 1 = safest)
RISK_WEIGHT_FACTOR = 1000                  # Must be same as used during precomputation

def get_coordinates(address):
    geolocator = Nominatim(user_agent="my_app")
    location = geolocator.geocode(address)
    return (location.latitude, location.longitude) if location else None

# Example addresses in Durham, NC
address1 = "916 Jones Cir, Durham, NC 27703"
address2 = "1200 Pate Farm Ln, Durham, NC 27703"

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
route_map = folium.Map(location=ORIGIN_COORDS, zoom_start=14)
route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in route]
folium.PolyLine(route_coords, color="blue", weight=5, opacity=0.7).add_to(route_map)
folium.Marker(location=ORIGIN_COORDS, popup="Origin", icon=folium.Icon(color="green")).add_to(route_map)
folium.Marker(location=DESTINATION_COORDS, popup="Destination", icon=folium.Icon(color="red")).add_to(route_map)

map_file = "safe_route_map.html"
route_map.save(map_file)
print(f"Route map saved to {map_file}. Open it in your browser to view the route.")
