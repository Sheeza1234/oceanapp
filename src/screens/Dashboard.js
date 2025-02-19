import React, { useState, useCallback } from "react";
import { Button as RNButton, Text, View, Image, StyleSheet, ImageBackground, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { db } from "@/fireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

const Dashboard = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const tripsCollection = collection(db, "cleanup-trips");
      const querySnapshot = await getDocs(tripsCollection);
      const tripsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsList);
      setFilteredTrips(tripsList);
    } catch (err) {
      console.error("Error fetching trips: ", err);
      setError("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterTrips(query, selectedLocation, selectedDate, maxParticipants);
  };

  const handleFilter = (location, date, maxPart) => {
    setSelectedLocation(location);
    setSelectedDate(date);
    setMaxParticipants(maxPart);
    filterTrips(searchQuery, location, date, maxPart);
  };

  const filterTrips = (query, location, date, maxPart) => {
    let filtered = trips.filter((trip) => {
      const title = trip.title ? trip.title.toLowerCase() : "";
      const tripLocation = trip.location ? trip.location.toLowerCase() : "";
      const organizerName = trip.organizer?.name ? trip.organizer.name.toLowerCase() : "";
  
      return title.includes(query.toLowerCase()) || 
             tripLocation.includes(query.toLowerCase()) || 
             organizerName.includes(query.toLowerCase());
    });
  
    if (location) filtered = filtered.filter((trip) => trip.location === location);
    if (date) filtered = filtered.filter((trip) => trip.date === date);
    if (maxPart) filtered = filtered.filter((trip) => trip.maxParticipants && trip.maxParticipants <= parseInt(maxPart, 10));
  
    setFilteredTrips(filtered);
  };
  

  if (loading) return <Text style={{ textAlign: "center" }}>Loading...</Text>;
  if (error) return <Text style={{ textAlign: "center", color: "red" }}>{error}</Text>;

  return (
    <ImageBackground source={require('../assets/screen.jpeg')}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>BlueWave Cleanup Trips</Text>
          <TextInput
            style={styles.input}
            placeholder="Search by name, location, or organizer"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        <Picker
  selectedValue={selectedLocation}
  onValueChange={(value) => handleFilter(value, selectedDate, maxParticipants)}

>
  <Picker.Item label="Select Location" value="" />
  {[...new Set(trips.map((trip) => trip.location))].map((loc) => (
    <Picker.Item key={loc} label={loc} value={loc} />
  ))}
</Picker>

          <TextInput
            style={styles.input}
            placeholder="Filter by Date (YYYY-MM-DD)"
            value={selectedDate}
            onChangeText={(date) => handleFilter(selectedLocation, date, maxParticipants)}
          />
          <TextInput
            style={styles.input}
            placeholder="Max Participants"
            keyboardType="numeric"
            value={maxParticipants}
            onChangeText={(num) => handleFilter(selectedLocation, selectedDate, num)}
          />
          <View style={styles.grid}>
            {filteredTrips.map((trip) => (
              <View key={trip.id} style={styles.card}>
                {trip.imageUrl && (
                  <Image source={{ uri: trip.imageUrl }} style={styles.image} />
                )}
                <View style={styles.cardContent}>
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <Text style={styles.tripInfo}>📍 {trip.location}</Text>
                  <Text style={styles.tripInfo}>📅 {trip.date}</Text>
                  <Text style={styles.tripInfo}>👥 Max Participants: {trip.maxParticipants}</Text>
                  <RNButton
                    title="View Details"
                    onPress={() => navigation.navigate("TripsDetail", { tripId: trip.id })}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.uploadButtonContainer}>
            <RNButton title="Upload Trip" onPress={() => navigation.navigate("UploadTrip")} />
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "gray",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  tripName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tripInfo: {
    color: "black",
    marginTop: 4,
  },
  uploadButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
});

export default Dashboard;
