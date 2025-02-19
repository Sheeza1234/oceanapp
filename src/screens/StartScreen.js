import React from 'react'
import { ImageBackground,StyleSheet } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'

export default function StartScreen({ navigation }) {
  return (
  
           <ImageBackground
             source={require("../assets/splashscreen.jpg")} 
             style={styles.background}
           >
      <Logo />
      <Header style={styles.title}>BlueWave Cleanup</Header>
      <Paragraph style={styles.description}>
      Represents ocean waves and cleanup efforts..
      </Paragraph>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        style={styles.button}
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
      </ImageBackground>
    
  )
}
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
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  button:{
    width:'80%',
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "black",
  },
  description: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
})
