import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, ImageBackground } from "react-native";
import { auth, db } from "@/fireBaseConfig";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRoute } from "@react-navigation/native";

const TripDetails = ({ navigation }) => {
    const route = useRoute();
    const { tripId } = route.params;

    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const tripRef = doc(db, "cleanup-trips", tripId);
                const tripSnap = await getDoc(tripRef);

                if (tripSnap.exists()) {
                    const tripData = tripSnap.data();
                    setTrip({
                        id: tripSnap.id,
                        ...tripData,
                        participants: Array.isArray(tripData.participants) ? tripData.participants : [],
                    });
                } else {
                    setError("Trip not found!");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
                setError("Failed to load trip details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchTripDetails();
    }, [tripId]);

    const handleSignUp = async () => {
        if (!trip || !userId) {
            Alert.alert("Error", "You must be logged in to sign up.");
            return;
        }

        const isAlreadySignedUp = trip.participants.some(p => p.id === userId);
        const isFull = trip.participants.length >= trip.maxParticipants;

        if (isAlreadySignedUp || isFull) return;

        try {
            const tripRef = doc(db, "cleanup-trips", tripId);
            const auth = getAuth();
            const user = auth.currentUser;
            const newParticipant = { id: user.uid, name: user.displayName || "Hassan" };

            await updateDoc(tripRef, {
                participants: arrayUnion(newParticipant)
            });

            setTrip((prevTrip) => ({
                ...prevTrip,
                participants: [...prevTrip.participants, newParticipant],
            }));

            Alert.alert("Success", "You have signed up for this trip!");
        } catch (error) {
            console.error("Error signing up:", error);
            Alert.alert("Error", "Failed to sign up. Try again later.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;

    if (error) return <Text style={styles.errorText}>{error}</Text>;

    if (!trip) return <Text style={styles.errorText}>Trip not found.</Text>;

    return (
        <ImageBackground source={require('../assets/screen.jpeg')} style={styles.background}>
            <ScrollView>
                <Image source={{ uri: trip.imageUrl }} style={styles.image} />
                <Text style={styles.title}>{trip.title}</Text>
                <Text style={styles.info}>📍 {trip.address}</Text>
                <Text style={styles.info}>📅 {trip.date} | 🕒 {trip.time}</Text>
                <Text style={styles.info}>👤 Organizer: {trip.organizer?.name}</Text>
                <Text style={styles.info}>🎯 Cleanup Goal: {trip.cleanupGoal}</Text>
                <Text style={styles.info}>👥 Max Participants: {trip.maxParticipants}</Text>

                <Text style={styles.subTitle}>Participants:</Text>
                <View style={styles.participantsContainer}>
                    {trip.participants.length > 0 ? (
                        trip.participants.map((participant, index) => (
                            <View key={index} style={styles.participantItem}>
                                <Image source={participant.avatar ? { uri: participant.avatar } : require("../assets/avatar.jpeg")} style={styles.avatar} />
                                <Text style={styles.participant}>{participant.name}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noParticipants}>No participants yet.</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.button, (!userId || trip.participants.some(p => p.id === userId) || trip.participants.length >= trip.maxParticipants) && styles.disabledButton]}
                    onPress={handleSignUp}
                    disabled={!userId || trip.participants.some(p => p.id === userId) || trip.participants.length >= trip.maxParticipants}
                >
                    <Text style={styles.buttonText}>
                        {!userId ? "Log in to Sign Up" : trip.participants.some(p => p.id === userId) ? "Already Signed Up" : "Sign Up"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: "cover" },
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
    image: { width: "100%", height: 250, borderRadius: 15, marginBottom: 15 },
    title: { fontSize: 28, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 10 },
    info: { fontSize: 18, color: "#555", textAlign: "center", marginVertical: 5 },
    subTitle: { fontSize: 22, fontWeight: "bold", color: "#007AFF", marginTop: 20, textAlign: "center" },
    participantsContainer: { backgroundColor: "#FFF", padding: 10, borderRadius: 10, marginVertical: 10 },
    participantItem: { flexDirection: "row", alignItems: "center", padding: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    participant: { fontSize: 16, color: "#333" },
    noParticipants: { textAlign: "center", color: "#999" },

    // Button Styles
    button: {
        backgroundColor: "#007AFF", // Blue background
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
        alignSelf: "center", // Centers the button horizontally
        width: "80%", // Makes it look more balanced
    },
    buttonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    disabledButton: {
        backgroundColor: "#999", // Grey background when disabled
    }
});


export default TripDetails;
