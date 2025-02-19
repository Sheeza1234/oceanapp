
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/src/screens/LoginScreen';
import RegisterScreen from '@/src/screens/RegisterScreen';
import StartScreen from '@/src/screens/StartScreen';
import ResetPasswordScreen from '@/src/screens/ResetPasswordScreen';
import Dashboard from '@/src/screens/Dashboard';
import SplashScreens from '@/src/screens/SplashScreen'
import TripDetails from '@/src/screens/TripDetails'
import UploadTrip from '@/src/screens/UploadTrip'


export default function RootLayout() {
  
  const Stack = createStackNavigator();
  return (
           <Stack.Navigator screenOptions={{ headerShown: false }}>
             <Stack.Screen name="SplashScreens" component={SplashScreens} />
             <Stack.Screen name="StartScreen" component={StartScreen} />
             <Stack.Screen name="LoginScreen" component={LoginScreen} />
             <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
             <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
             <Stack.Screen name="Dashboard" component={Dashboard} />
             <Stack.Screen name="TripsDetail" component={TripDetails} />
             <Stack.Screen name="UploadTrip" component={UploadTrip} />
  </Stack.Navigator>
  );
}
