// /**
//  * @format
//  */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => console.log("HIHIIHIH"));

// Navigation.registerComponent('com.myApp.WelcomeScreen', () => App);
// Navigation.events().registerAppLaunchedListener(() => {
//     Navigation.setRoot({
//         root: {
//             stack: {
//                 children: [
//                     {
//                         component: {
//                             name: 'com.myApp.WelcomeScreen'
//                         }
//                     }
//                 ]
//             }
//         }
//     });
// });

import { Navigation } from 'react-native-navigation';
import { registerScreens } from './Tools/Screens'

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
    Navigation.setRoot({
        root: {
            component: {
                name: 'Initializing'
            }
        },
    });
});
