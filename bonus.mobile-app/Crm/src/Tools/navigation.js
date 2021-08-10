import { Navigation } from 'react-native-navigation'

export const goToAuth = () => Navigation.setRoot({
    root: {
        bottomTabs: {
            id: 'BottomTabsId',
            children: [
                {
                    component: {
                        name: 'SignIn',
                        // options: {
                        //     bottomTab: {
                        //         fontSize: 12,
                        //         text: 'Sign In',
                        //     }
                        // }
                    },
                },
            ],
        }
    }
});


export const goPersonalTrainings = () => Navigation.setRoot({
    root: {
        stack: {
            id: 'App',
            children: [
                {
                    component: {
                        name: 'PersonalTrainings',
                        options: {
                            topBar: {
                                backgroundColor: 'black',
                                //height: Constants.statusBarHeight
                            },
                        }
                    }
                }
            ],
        }
    }
})

