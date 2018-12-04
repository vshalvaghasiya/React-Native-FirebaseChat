import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import firebase from 'react-native-firebase';
import _ from 'underscore';

import CardChat from './src/cards/Cardchat';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.messageRef = firebase.database().ref('messages');
    this.messageReadRef = firebase.database().ref();
    this.state = {
      messages: [],
      message: 'Conversation Not Found...!',
      text: '',
    }
  }

  componentWillMount() {
    firebase.database().ref('messages/').on('value', function (snapshot) {
      let data = snapshot.val();
      if (data) {
        let items = Object.values(data);
        let temp = _.sortBy(items, 'createdAt');
        this.setState({ messages: temp, text: '' });
      }
    }.bind(this));
  }

  renderMessage() {
    if (this.state && this.state.messages && this.state.messages.length > 0) {
      return this.state.messages.map((item, index) =>
        <CardChat
          key={`index-${index}`}
          items={item}
          index={index}
        />
      );
    } else {
      return (
        <View>
          <Text style={{ padding: 20, fontSize: 18 }}>Conversation Not Found...!</Text>
        </View>
      );
    }
  }

  sendMessage() {
    var device = ''
    var id = "1"
    if (Platform.OS == 'ios') {
      device = 'I'
      id = "1"
    } else {
      device = 'A'
      id = "2"
    }
    this.messageRef.push({
      id: id,
      name: 'Vishal',
      text: this.state.text,
      createdAt: new Date(),
      device: device,
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView ref="scrollView"
          onContentSizeChange={(width, height) => this.refs.scrollView.scrollTo({ y: height - width })} >
          {this.renderMessage()}
        </ScrollView>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.textAreaContainer} >
            <TextInput
              style={styles.textArea}
              returnKeyType="send"
              underlineColorAndroid="transparent"
              placeholder="EnterText"
              placeholderTextColor="grey"
              numberOfLines={10}
              multiline={true}
              onChangeText={(text) => this.setState({text})}
              value={ this.state.text }
            />
          </View>
          <View style={styles.sendButton}>
            <TouchableOpacity onPress={() => { this.sendMessage() }}>
              <Image source={require('./src/assets/send.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textAreaContainer: {
    borderColor: 'lightgrey',
    borderWidth: 2,
    padding: 5,
    margin: 10,
    height: 50,
    borderRadius: 10,
    flex: 1
  },
  textArea: {
    height: 40,
    fontSize: 16,
    justifyContent: "flex-start"
  },
  sendButton: {
    margin: 10,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  }
})