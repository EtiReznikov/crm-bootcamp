import { Navigation } from 'react-native-navigation';

export function registerScreens() {
  Navigation.registerComponent('PersonalTrainings', () => require('../Screens/PersonalTrainings').default);
  Navigation.registerComponent('Initializing', (sc) => require('../Screens/Initializing').default);
  Navigation.registerComponent('SignIn', () => require('../Screens/LoginScreen').default);
  Navigation.registerComponent('EditPersonalTraining', () => require('../Screens/EditPersonalTraining').default);
}