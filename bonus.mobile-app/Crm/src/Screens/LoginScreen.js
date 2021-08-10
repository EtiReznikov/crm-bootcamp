// SignIn.js
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { goPersonalTrainings } from '../../src/Tools/navigation'
import { USER_KEY, USER_ID } from '../../src/Tools/config'
import { emailValidation } from '../../src/Tools/validation';
export default class SignIn extends React.Component {
  state = {
    email: '', password: '', btnActive: true, emailError: false
  }
  onChangeText = (key, value) => {
    this.setState({ [key]: value })
  }
  signIn = async () => {
    this.setState({ ['btnActive']: false })
    const email = this.state.email;
    const password = this.state.password;
    const valid = emailValidation(email);

    if (valid === 0) {
      try {
        const res = await axios.post('http://localhost:8005/Auth/Login', {
          email: email,
          password: password
        })

        AsyncStorage.setItem(USER_KEY, res.data.token)
        AsyncStorage.setItem(USER_ID, res.data.userId.toString())
        goPersonalTrainings()
      }
      catch (error) {
        console.log(error);
        this.setState({ ['emailError']: true })
        this.setState({ ['btnActive']: true })
      };
    }
    else {
      this.setState({ ['emailError']: true })
      this.setState({ ['btnActive']: true })
    }

  }
  render() {
    return (

      <View style={styles.container}>
        <Text style={styles.headLine}>
          Login
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor='#000000'
          onChangeText={val => {
            this.setState({ ['emailError']: false });
            this.onChangeText('email', val)
          }
          }
        />
        <TextInput
          style={styles.input}
          placeholder='Password'
          autoCapitalize="none"
          secureTextEntry={true}
          placeholderTextColor='#000000'
          onChangeText={val => {
            this.setState({ ['emailError']: false });
            this.onChangeText('password', val)
          }
          }
        />
        {
          this.state.emailError ? <Text style={styles.errorText}>Invalid email or password</Text> : <Text style={styles.errorText}></Text>
        }
        {this.state.btnActive &&
          < TouchableOpacity disabled={!this.state.btnActive}
            onPress={this.signIn}
            style={styles.btn}>
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableOpacity>
        }
        {!this.state.btnActive &&
          < TouchableOpacity disabled={!this.state.btnActive}
            style={styles.btn}>
            <ActivityIndicator size='large' />
          </TouchableOpacity>
        }
      </View >
    )
  }
}

const styles = StyleSheet.create({
  headLine: {
    fontSize: 34,
    fontWeight: '500',
    color: "#5a9beb",
    marginBottom: 10
  },
  input: {
    width: 350,
    fontSize: 18,
    fontWeight: '500',
    height: 55,
    margin: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    width: 350,
    fontSize: 18,
    height: 55,
    color: 'red',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 24,
    color: "#FFFFFF"
  },
  btn: {
    width: 350,
    fontSize: 24,
    fontWeight: '500',
    height: 55,
    backgroundColor: '#5a9beb',
    margin: 10,
    padding: 8,
    borderRadius: 14,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },

})