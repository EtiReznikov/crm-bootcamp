import React, { useState, useEffect } from 'react';
import { NavigationActions } from 'react-navigation';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
const EditPersonalTrainings = (props) => {
    const [date, setDate] = useState(moment(props.item.date).toDate());
    const [btnActive, setBtnActive] = useState(true)
    const [successStatus, setSuccessStatus] = useState(0)
    const onChange = (event, selectedDate) => {
        setSuccessStatus(0)
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const editDate = async () => {
        setBtnActive(false)
        try {
            const res = await axios.post('http://localhost:991/personalTraining/editPersonalTrainingTime/', {
                trainingId: props.item.id,
                date: new Date(date)
            })
            if (res.data === true) {
                setSuccessStatus(1)
                setBtnActive(true)
                props.resetLimitStart();
            }
            else {
                setBtnActive(true)
                setSuccessStatus(2)
            }

        }
        catch (error) {
            setBtnActive(true)
            setSuccessStatus(2)
        };
    }

    return (
        <View style={styles.container}>
            <Text style={styles.headline}>
                Edit {props.item.clientName} personal training date and time
            </Text>
            <DateTimePicker
                value={date}
                mode={'datetime'}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
                style={styles.datePicker}
            />
            {
                successStatus === 0 && <Text></Text>
            }
            {
                successStatus === 1 && <Text style={styles.success}>Date updated successfully</Text>
            }
            {
                successStatus === 2 && <Text style={styles.errorText}>Error updating date</Text>
            }
            <TouchableOpacity disabled={!btnActive}
                onPress={editDate} style={styles.btn}>
                <Text style={styles.btnText}>Submit</Text>
            </TouchableOpacity >
        </View >
    );
}
EditPersonalTrainings.options = {
    topBar: {
        background: {
            color: '#cccccc'
        },
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    headline: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: '20%',
        fontSize: 28,
        fontWeight: '500',
        color: "#000000",
        marginBottom: 10,
        textAlign: 'center'
    },
    item: {
        color: '#5a9beb',
        fontWeight: 'bold',
        fontSize: 20,
        borderColor: 'black',
        borderWidth: 1
    },
    errorText: {
        marginLeft: 15,
        width: 350,
        fontSize: 18,
        height: 55,
        color: 'red',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    success: {
        marginLeft: 15,
        width: 350,
        fontSize: 24,
        height: 55,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn:
    {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5a9beb',
        borderRadius: 5,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 24,
        color: "#FFFFFF"
    }

});

export default EditPersonalTrainings;