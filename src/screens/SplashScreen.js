import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { theme } from '../core/theme'
import { Button as PaperButton } from 'react-native-paper'

const SplashScreens = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../assets/splashscreen.jpg")} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Image source={require("../assets/logos.png")} style={styles.logo} />
        <Text style={styles.title}>BlueWave Cleanup</Text>
        <Text style={styles.description}>
          Join our mission to clean the ocean while enjoying your passion for
          paddling. Sign up for cleanup trips and make a difference!
        </Text>
        <TouchableOpacity style={styles.button} onPress={()=>{navigation.navigate('StartScreen')}}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Adds a slight dark overlay for readability
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
  },
  description: {
    fontSize: 24,
    color: "#E5E7EB",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'gray' ,
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SplashScreens;
