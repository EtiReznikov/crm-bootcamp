// /**
//  * @format
//  */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';



import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/Tools/Screens'

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
