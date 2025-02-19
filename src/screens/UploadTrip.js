import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from "react-native";
import { db } from "@/fireBaseConfig";
import { collection, addDoc } from "firebase/firestore";

const UploadTrip = ({ navigation }) => {
  const [tripTitle, setTripTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [cleanupGoal, setCleanupGoal] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [loading, setLoading] = useState(false);

  // Static image URL
  const staticImageUrl = "https://drive.usercontent.google.com/download?id=1UcB1GAett1uo02U_87-kiG9IuhdgI9Wr&export=view&authuser=0";

  const handleUpload = async () => {
    if (!tripTitle || !date || !location || !maxParticipants || !cleanupGoal || !organizer) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "cleanup-trips"), {
        title: tripTitle,
        date,
        location,
        imageUrl: staticImageUrl, // Use the static image URL
        maxParticipants: parseInt(maxParticipants, 10),
        cleanupGoal,
        organizer: { name: organizer },
        participants: [],
      });

      Alert.alert("Success", "Trip uploaded successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error uploading trip:", error);
      Alert.alert("Error", "Failed to upload trip. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Cleanup Trip</Text>
      <TextInput style={styles.input} placeholder="Trip Title" value={tripTitle} onChangeText={setTripTitle} />
      <TextInput style={styles.input} placeholder="Date" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Max Participants" keyboardType="numeric" value={maxParticipants} onChangeText={setMaxParticipants} />
      <TextInput style={styles.input} placeholder="Cleanup Goal" value={cleanupGoal} onChangeText={setCleanupGoal} />
      <TextInput style={styles.input} placeholder="Organizer Name" value={organizer} onChangeText={setOrganizer} />
      
      <Text style={styles.label}>Trip Image:</Text>
      <Image source={{ uri: staticImageUrl }} style={styles.image} />

      <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Upload Trip</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UploadTrip;
