import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';

//login is class component//
class Login extends Component {
// set up constructor//
    constructor(props) {
        super(props);
        //temporarily holds user name and password, initialize to empty strings//
        this.state = {
            username: '',
            password: '',
            remember: false //use state to hold value of remember me checkbox, initialize to false//
        };
    }
//set up screen title name since it will be in navigation options//
    static navigationOptions = {
        title: 'Login'
    }
//logs state to console, will come back to this later//
    handleLogin() {
        console.log(JSON.stringify(this.state));
        //if remember me checkbox is checked, save user name and password to secure store using setItemAsync method//
        if (this.state.remember) {
            SecureStore.setItemAsync(
                'userinfo',
                JSON.stringify({ //convert US and PW to string before storing it//
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch(error => console.log('Could not save user info', error)); //return promise that will reject if there is an error. check for a rejected promise by adding this catch block: any error message will be passed in as an argument, so we can log the error to the console//
        } else {
            SecureStore.deleteItemAsync('userinfo').catch(
                error => console.log('Could not delete user info', error)
                //if remember me checkbox is not checked, then we want to delete any user info in the secure store. else block: securestore's deleteitemasync to delete any info stored. If there is an error in deleting it, catch block: check for error, if error will console log error//
            );
        }
    }
//since user info gets deleted from store, if the remember me checkbox is unchekced when form is sumbmitted, if there is any info stored in store, we can deduce when the checkbox was last checked//
    componentDidMount() {
        SecureStore.getItemAsync('userinfo') //checks to see if any info is stored under user info//
            .then(userdata => { //if there is info, access that info value using then method, userdata contains JSON string with user name and password//
                 
                const userinfo = JSON.parse(userdata);
                if (userinfo) { 
                    this.setState({username: userinfo.username}); //username info//
                    this.setState({password: userinfo.password}); //user password info//
                    this.setState({remember: true})
                }         //updates remember to true//
            });
    }
//form in view component, style container//
    render() {
        return (
            <View style={styles.container}>
                <Input //username input component//
                    placeholder='Username'
                    leftIcon={{type: 'font-awesome', name: 'user-o'}}
                    onChangeText={username => this.setState({username})} //whenever text value for this input is changed, it'll update username in the state using setState//
                    value={this.state.username} //controlled component, always reflects the current state//
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <Input //password input component//
                    placeholder='Password'
                    leftIcon={{type: 'font-awesome', name: 'key'}}
                    onChangeText={password => this.setState({password})} //updates state for password using setState//
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />
                <CheckBox
                    title='Remember Me'
                    center
                    checked={this.state.remember} //controlled by login components state property of remember//
                    onPress={() => this.setState({remember: !this.state.remember})} //changes remember state to opposite of what it currently is. If it is false, it will change to true//
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                    <Button 
                        onPress={() => this.handleLogin()} //onpress props that calls the handle login method created earlier//
                        title='Login'
                        color='#5637DD' //dark purple//
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20
    },
    formIcon: {
        marginRight: 10
    },
    formInput: {
        padding: 10
    },
    formCheckbox: {
        margin: 10,
        backgroundColor: null
    },
    formButton: {
        margin: 40
    }
});

export default Login;