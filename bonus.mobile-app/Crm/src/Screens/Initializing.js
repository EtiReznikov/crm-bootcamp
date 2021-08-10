
// Initializing.js
import React from 'react'
import {
    View,
    Image,
    Text,
    StyleSheet,
    Animated,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goToAuth, goPersonalTrainings } from '../../src/Tools/navigation'

import { USER_KEY, USER_ID } from '../../src/Tools/config'

export default class Initialising extends React.Component {

    state = {
        fadeValue: new Animated.Value(0),
        duration: 3000
    };

    _start = () => {
        return Animated.parallel([
            Animated.timing(this.state.fadeValue, {
                toValue: 1,
                duration: this.state.duration,
                useNativeDriver: true
            })
        ]).start();
    };

    async componentDidMount() {
        try {
            this._start();
            const token = await AsyncStorage.getItem(USER_KEY);
            const userId = await AsyncStorage.getItem(USER_ID);

            if (token && userId) {
                setTimeout(() => {
                    goPersonalTrainings()
                }, this.state.duration + 500);
            } else {
                setTimeout(() => {
                    goToAuth()
                }, this.state.duration + 500);
            }
        } catch (err) {
            console.log('error: ', err)
            setTimeout(() => {
                goToAuth()
            }, this.state.duration + 500);
        }
    }

    render() {

        const fontSize = parseInt(this.state.fontSize)
        console.log("font size:", fontSize)
        return (
            <View style={styles.container}>
                <Animated.View
                    style={{
                        opacity: this.state.fadeValue,
                        justifyContent: "center"
                    }}
                >
                    <Text style={{
                        fontSize: 60,
                        fontWeight: "500",
                        color: "#5a9beb",
                        marginBottom: 10
                    }}>Welcome</Text>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

})