import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goToAuth, goEditPersonalTrainings } from '../Tools/navigation'
import { USER_KEY } from '../Tools/config'
import { USER_ID } from '../Tools/config'
import axios from 'axios';
import { Navigation } from 'react-native-navigation'
import moment from 'moment';
const Item = ({ clientName, date, time }) => (
  <View style={styles.item}>
    <Text style={styles.clientName}>{clientName}</Text>
    <Text style={styles.date}>{date} {time}</Text>
  </View>
);

const PersonalTrainings = (props) => {
  const [data, setData] = useState([]);
  const [limitStart, setLimitStart] = useState(0);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resetLimitStart = () => {
    setLimitStart(0);
    setDataHasChanged(!dataHasChanged)
  }

  const numOfRows = 10;
  const renderItem = ({ item }) => {
    let date = moment(item.date);
    return (
      < TouchableOpacity onPress={() => editPersonalTraining(item)}>
        <Item clientName={item.clientName}
          time={date.format("HH:mm")}
          date={date.format("DD-MM-YYYY")}
          trainingId={item.trainingId}
        />
      </TouchableOpacity >
    )
  }


  editPersonalTraining = (item) => {
    Navigation.push(props.componentId, {
      component: {
        name: 'EditPersonalTraining',
        passProps: {
          item: item,
          resetLimitStart: resetLimitStart
        }
      }
    });
  }

  logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY)
      await AsyncStorage.removeItem(USER_ID)
      goToAuth()
    } catch (err) {
      console.log('error signing out...: ', err)
    }
  }

  getData = async () => {
    let isRendered = true;
    try {
      const userId = await AsyncStorage.getItem(USER_ID);
      const res = await axios.post('http://localhost:991/personalTraining/getPersonalTrainingByUser/', {
        userId: userId,
        startLimit: limitStart,
        numOfRows: numOfRows
      })
      let tempData = [];
      for (item of res.data) {
        let temp =
        {
          clientName: item.client_name,
          date: item.date,
          id: item.personal_training_id
        }
        tempData.push(temp)
      }
      if (isRendered) {
        if (data === [] || limitStart === 0)
          setData(tempData)
        else
          setData(data.concat(tempData))
        setIsLoading(false)
      }
    }
    catch (error) {
      isRendered = false
      console.log(error);
    };
  }

  useEffect(async () => {
    await getData();
  }, [limitStart, dataHasChanged]);

  loadMoreData = async () => {
    setLimitStart(limitStart + numOfRows)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.containerAreaView}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => {
            setIsLoading(true)
            loadMoreData();
          }}
        />
      </SafeAreaView>
      {isLoading &&
        <ActivityIndicator size="large" />}
      < TouchableOpacity
        onPress={logout}
        style={styles.logout}>
        <Text style={styles.btnText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

PersonalTrainings.options = {
  topBar: {
    background: {
      color: '#cccccc'
    },

    title: {
      text: 'Future personal trainings',
      color: '#FFFFFF',
      fontSize: 25
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    color: '#5a9beb',
    borderColor: '#cccccc',
    borderWidth: 2,
    borderRadius: 3,
    margin: 3,
  },
  clientName: {
    fontSize: 24,
    paddingLeft: 5,
    paddingTop: 3
  },
  logout: {
    fontSize: 34,
    marginBottom: 18
  },
  date: {
    fontSize: 20,
    paddingLeft: 5,
    paddingBottom: 3
  },
  containerAreaView: {
    marginTop: 10,
    width: '90%',
    flex: 1,
  },
  headline: {
    width: '90%',
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '500',
    color: "#5a9beb",
    marginBottom: 10
  },
});

export default PersonalTrainings;