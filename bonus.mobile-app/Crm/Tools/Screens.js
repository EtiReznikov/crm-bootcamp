import { Navigation } from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('Home', () => require('../Screens/Home').default);
  Navigation.registerComponent('Initializing', (sc) => require('../Screens/Initializing').default);
  Navigation.registerComponent('SignIn', () => require('../Screens/LoginScreen').default);
}