import pandas as pd

# -------------------------------
# STEP 1: Load and Prepare the Data
# -------------------------------
# Change the filename if needed.
csv_file = "Durham_Accidents_Filtered.csv"
df = pd.read_csv(csv_file)

# Parse the weather timestamp column as datetime
df["Weather_Timestamp"] = pd.to_datetime(df["Weather_Timestamp"], errors="coerce")

# For analysis, extract the hour from the timestamp (if available)
df["accident_hour"] = df["Weather_Timestamp"].dt.hour

# -------------------------------
# STEP 2: Analyze the Time of Day
# -------------------------------
# Group by accident hour to see when most accidents occur
hourly_accidents = df.groupby("accident_hour").size().reset_index(name="accident_count")
print("Accidents by Hour:")
print(hourly_accidents.sort_values("accident_hour"))

# Identify the hour with the highest number of accidents
if not hourly_accidents.empty:
    max_hour = hourly_accidents.loc[hourly_accidents["accident_count"].idxmax(), "accident_hour"]
    print(f"\nThe riskiest hour based on accident counts is approximately {max_hour}:00.")
else:
    print("No accident hour data available.")

# -------------------------------
# STEP 3: Analyze Weather Conditions
# -------------------------------
# Group by weather condition to see which conditions are most common during accidents
weather_accidents = df.groupby("Weather_Condition").size().reset_index(name="accident_count")
print("\nAccidents by Weather Condition:")
print(weather_accidents.sort_values("accident_count", ascending=False))

# Calculate the average severity for each weather condition
severity_by_weather = df.groupby("Weather_Condition")["Severity"].mean().reset_index(name="avg_severity")
print("\nAverage Accident Severity by Weather Condition:")
print(severity_by_weather.sort_values("avg_severity", ascending=False))

# -------------------------------
# STEP 4: Analyze Day vs. Night
# -------------------------------
# If the 'Sunrise_Sunset' column is available, compare accident counts during day and night
if "Sunrise_Sunset" in df.columns:
    day_night_accidents = df.groupby("Sunrise_Sunset").size().reset_index(name="accident_count")
    print("\nAccidents by Time of Day (Sunrise/Sunset):")
    print(day_night_accidents)
else:
    print("\nNo 'Sunrise_Sunset' column available for day/night analysis.")

# -------------------------------
# STEP 5: Draw Conclusions
# -------------------------------
print("\n--- Conclusions ---")

# Conclusion on time of day:
if not hourly_accidents.empty:
    print(f"1. Time of Day: The data indicates that accidents peak around {max_hour}:00, "
          "suggesting that drivers should exercise extra caution during this period.")

# Conclusion on weather conditions:
if not weather_accidents.empty:
    # Identify the weather condition with the highest accident count
    top_weather = weather_accidents.loc[weather_accidents["accident_count"].idxmax()]
    print(f"2. Weather Conditions: The most common weather condition during accidents is "
          f"'{top_weather['Weather_Condition']}' with {top_weather['accident_count']} incidents.")
    
    # Merge weather counts with average severity for a deeper insight.
    weather_summary = pd.merge(weather_accidents, severity_by_weather, on="Weather_Condition")
    for _, row in weather_summary.iterrows():
        print(f"   - {row['Weather_Condition']}: {row['accident_count']} accidents, "
              f"average severity {row['avg_severity']:.2f}.")
    
# Conclusion on day vs. night:
if "Sunrise_Sunset" in df.columns:
    for _, row in day_night_accidents.iterrows():
        print(f"3. Day vs. Night: {row['Sunrise_Sunset']} periods have {row['accident_count']} accidents.")
else:
    print("3. Day vs. Night: Data on sunrise/sunset was not available for further analysis.")

print("\nOverall, these insights can help inform efforts to mitigate risk by focusing on "
      "high-incident time periods and adverse weather conditions. Further analysis could include "
      "correlating temperature, humidity, and other environmental factors with accident severity, "
      "or examining trends over longer periods.")

