import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import Video from 'react-native-video';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices
} from 'react-native-webrtc';
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
const pc = new RTCPeerConnection(configuration);

let isFront = true;

class App extends Component {
  state = {
    stream: ''
  }
  getUserMedia = () => {
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "back")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30
          },
          facingMode: (isFront ? "user" : "environment"),
          optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
        }
      })
        .then(stream => {
          this.setState({ stream })
        })
        .catch(error => {
          // Log error
        });
    })
  }

  getDisplayMedia = () => {

    mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    })
      .then(stream => {
        this.setState({ stream })
      })
      .catch(error => {
        // Log error
      });

  }
  render() {
    console.log(this.state.stream)
    return (
      <View>
        <Video resizeMode='cover' source={{ uri: this.state.stream }}   // Can be a URL or a local file.

          style={styles.backgroundVideo} />
        {/* <View style={{ flexDirection: 'row', width: 350, justifyContent: 'flex-end', marginTop: 20 }}>
          <Video resizeMode='cover' source={{ uri: 'http://clips.vorwaerts-gmbh.de/VfE_html5.mp4' }}   // Can be a URL or a local file.

            style={styles.backgroundVideoTwo} />
        </View> */}
        <TouchableOpacity onPress={() => this.getUserMedia()}><View style={{ width: 30, height: 30, backgroundColor: 'green', marginTop: 30, marginLeft: 30 }}></View></TouchableOpacity>
        <TouchableOpacity onPress={() => this.getDisplayMedia()}><View style={{ width: 30, height: 30, backgroundColor: 'blue', marginTop: 30, marginLeft: 30 }}></View></TouchableOpacity>

      </View>
    )
  }
}
var styles = StyleSheet.create({
  backgroundVideo: {
    width: 500,
    height: 400
  },
  backgroundVideoTwo: {
    width: 100,
    height: 120,

  },
});
export default App