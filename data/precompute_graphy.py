import os
import pandas as pd
import osmnx as ox
import networkx as nx
from shapely.geometry import Point, LineString
import pickle

# -------------------------------
# PARAMETERS & SETTINGS
# -------------------------------
ACCIDENT_CSV = "Durham_Accidents_Filtered.csv"  # Your Durham accident data CSV file
OUTPUT_GRAPH_FILE = "durham_graph.gpickle"
ACCIDENT_RADIUS = 100         # in meters
# A multiplier to balance risk scores relative to distance (tweak as needed)
RISK_WEIGHT_FACTOR = 1000

# -------------------------------
# STEP 1: Load Accident Data
# -------------------------------
if not os.path.exists(ACCIDENT_CSV):
    raise FileNotFoundError(f"{ACCIDENT_CSV} not found. Please put it in the project folder.")

df_accidents = pd.read_csv(ACCIDENT_CSV)
# Convert timestamp to datetime if needed
df_accidents["Weather_Timestamp"] = pd.to_datetime(df_accidents["Weather_Timestamp"], errors="coerce")

# Create a list of accident points (as shapely Points) and their severity
accident_points = []
for _, row in df_accidents.iterrows():
    if pd.notnull(row["Start_Lat"]) and pd.notnull(row["Start_Lng"]):
        pt = Point(row["Start_Lng"], row["Start_Lat"])  # Note: Point(lon, lat)
        severity = row["Severity"] if pd.notnull(row["Severity"]) else 1
        accident_points.append((pt, severity))
print(f"Loaded and processed {len(accident_points)} accident points.")

# -------------------------------
# STEP 2: Download the Road Network
# -------------------------------
# Download the road network for Durham (or a larger NC area if desired)
print("Downloading road network for Durham, NC...")
G = ox.graph_from_place("Durham, North Carolina, USA", network_type="drive")
print("Road network downloaded.")

# Ensure each edge has geometry and length attributes
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
    """Compute risk for an edge given its geometry, based on nearby accidents."""
    risk = 0
    # Use the midpoint of the edge as a reference
    midpoint = geom.interpolate(0.5, normalized=True)
    for accident_pt, severity in accident_points:
        # Approximate conversion: 1 degree ≈ 111,139 meters (for small distances)
        distance_m = midpoint.distance(accident_pt) * 111139
        if distance_m <= ACCIDENT_RADIUS:
            risk += severity
    return risk

print("Computing risk scores for each edge...")
for u, v, k, data in G.edges(keys=True, data=True):
    geom = data["geometry"]
    data["risk"] = compute_edge_risk(geom)
    # (Optional) You can also precompute a "base" combined weight using a default risk tolerance.
    # For example, assume risk_tolerance_default = 0.5:
    default_risk_tolerance = 0.5
    data["combined_weight"] = ((1 - default_risk_tolerance) * data["length"] +
                               default_risk_tolerance * (data["risk"] * RISK_WEIGHT_FACTOR))

# -------------------------------
# STEP 4: Save the Graph to Disk
# -------------------------------
with open(OUTPUT_GRAPH_FILE, "wb") as f:
    pickle.dump(G, f)
print(f"Graph with risk scores and combined weights saved to {OUTPUT_GRAPH_FILE}.")
