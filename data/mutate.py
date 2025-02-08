import pandas as pd

# Load the dataset
csv_file = "US_Accidents_March23.csv"  # Ensure this file is in the working directory
df = pd.read_csv(csv_file)

# Select only the required columns
columns_needed = [
    "ID", "Source", "Severity", "Start_Lat", "Start_Lng", "End_Lat", "End_Lng", "Street", 
    "City", "County", "State", "Zipcode", "Country", "Weather_Timestamp", "Temperature(F)", 
    "Wind_Chill(F)", "Humidity(%)", "Pressure(in)", "Visibility(mi)", "Wind_Direction", 
    "Wind_Speed(mph)", "Precipitation(in)", "Weather_Condition", "Bump", "Crossing", "Give_Way", 
    "Junction", "No_Exit", "Railway", "Roundabout", "Station", "Stop", "Traffic_Calming", 
    "Traffic_Signal", "Turning_Loop", "Sunrise_Sunset", "Civil_Twilight", "Nautical_Twilight", 
    "Astronomical_Twilight"
]

df = df[columns_needed]

# Filter for US data
df_us = df[df["Country"] == "US"]
df_us.to_csv("US_Accidents_Filtered.csv", index=False)
print("US data saved as 'US_Accidents_Filtered.csv'")

# Filter for Durham data
df_durham = df_us[
    (df_us["City"].str.lower() == "durham") & 
    (df_us["State"].str.upper() == "NC")
]
df_durham.to_csv("Durham_Accidents_Filtered.csv", index=False)
print("Durham data saved as 'Durham_Accidents_Filtered.csv'")
