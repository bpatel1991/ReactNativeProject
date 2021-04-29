import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet,
    Picker, Switch, Button, Alert, } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import * as Notifications from 'expo-notifications'

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
        };
    }

    static navigationOptions = {
        title: 'Reserve Campsite'
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        Alert.alert(
            'Begin Search?',
            `Number of Campers: ${this.state.campers} \n Hike-In? ${this.state.hikeIn} \n  Date: ${this.state.date}`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => this.resetForm(),
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: () => {
                            this.presentLocalNotification(this.state.date.toLocaleDateString('en-US'));
                            this.resetForm();
                        }
                    },
                ],
        )
    }

    resetForm() {
        this.setState({
            campers: 1,
            hikeIn: false,
            date: new Date(),
            showCalendar: false,
        });
    }
    //async/await: another way to handle promises- need to request permission from this device, and then wait for those permissiont obe sent back to our app ebfore we continue//
    //async function keyword async- special function that walways reutrns a promise, parameter (date) this will be requested reservation date//
    async presentLocalNotification(date) {
        function sendNotification() { //function called sendNotification, no parameters//
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldShowAlert: true //override default behavior (false) by using this set notification handler and setting it to true and to show alert//
                })
            });
            //from Notifications API, pass this to an object that holds title and body//
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Campsite Reservation Search',
                    body: `Search for ${date} requested` 
                },
                trigger: null //cause notification to fire immediately, can be also used to schedule notification in future, give it a time value like 30 seconds into future, repeat, etc//
            });
        }
        //checking to see if we have permissions from device to send notifications at all, if we do not, wait to request permission. If we do, send notification//
        //await keyword is JS ES8 keyword that can only be used INSIDE async function, followed by a promise//
        let permissions = await Notifications.getPermissionsAsync();
        if (!permissions.granted) {
            permissions = await Notifications.requestPermissionsAsync();
        }
        if (permissions.granted) {
            sendNotification();
        }
    }

    render() {
        return (  
            <ScrollView>
                <Animatable.View 
                    animation='zoomIn' duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Campers</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.campers}
                            onValueChange={itemValue => this.setState({campers: itemValue})}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Hike-In?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.hikeIn}
                            trackColor={{true: '#5637DD', false: null}}
                            onValueChange={value => this.setState({hikeIn: value})}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date</Text>
                        <Button
                            onPress={() =>
                                this.setState({showCalendar: !this.state.showCalendar})
                            }
                            title={this.state.date.toLocaleDateString('en-US')}
                            color='#5637DD'
                            accessibilityLabel='Tap me to select a reservation date'
                        />
                    </View>
                    {this.state.showCalendar && (
                        <DateTimePicker
                            value={this.state.date}
                            mode={'date'}
                            display='default'
                            onChange={(event, selectedDate) => {
                                selectedDate && this.setState({date: selectedDate, showCalendar: false});
                            }}
                            style={styles.formItem}
                        />
                    )}
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title='Search'
                            color='#5637DD'
                            accessibilityLabel='Tap me to search for available campsites to reserve'
                        />
                    </View>
                </Animatable.View>        
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
});

export default Reservation;