import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Text } from "react-native-paper";
import { ImageBackground } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../fireBaseConfig"; // Import Firebase auth
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      // Firebase authentication
      await signInWithEmailAndPassword(auth, email.value, password.value);
      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }],
      });
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground source={require("../assets/splashscreen.jpg")} style={styles.background}>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        style={styles.button}
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        style={styles.button}
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" style={styles.buttons} onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text style={styles.links}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  forgotPassword: { width: "100%", alignItems: "flex-end", marginBottom: 24, marginRight: 40 },
  row: { flexDirection: "row", marginTop: 4, fontSize: 19 },
  forgot: { fontSize: 15, color: "black" },
  link: { fontWeight: "bold", color: theme.colors.primary, fontSize: 15 },
  links: { fontWeight: "bold", color: "black", fontSize: 15 },
  background: { flex: 1, resizeMode: "cover", justifyContent: "center", alignItems: "center" },
  
});
