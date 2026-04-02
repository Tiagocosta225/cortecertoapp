import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BarberSchedulerScreen from './screens/BarberSchedulerScreen';
import ClientBookingScreen from './screens/ClientBookingScreen';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Agendamento" component={ClientBookingScreen} />
        <Stack.Screen name="AgendaBarbeiro" component={BarberSchedulerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
