import { Button, Container, H1 } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Text, View, Linking, TouchableHighlight, PermissionsAndroid, Platform, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { stopNavigating } from "../actions/ExploreActions";
import StatusBarOverlay from "../components/StatusBarOverlay";
import Colors from "../constants/Colors";
import { CameraKitCameraScreen } from "react-native-camera-kit";

class ScanScreen extends Component {
  static propTypes = {
    stopNavigating: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      //variable to hold the qr value
      qrvalue: '',
      opneScanner: false,
    };
    this.onDismissPress = this.onDismissPress.bind(this);
  }
  onOpenlink() {
    //Function to open URL, If scanned 
    Linking.openURL(this.state.qrvalue);
    //Linking used to open the URL in any browser that you have installed
  }
  onBarcodeScan(qrvalue) {
    alert(qrvalue);
    //called after te successful scanning of QRCode/Barcode
    this.setState({ qrvalue: qrvalue, opneScanner: false });
  }
  onOpneScanner() {
    var that =this;
    //To Start Scanning
    if(Platform.OS === 'android'){
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,{
              'title': 'CameraExample App Camera Permission',
              'message': 'CameraExample App needs access to your camera '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({ qrvalue: '' });
            that.setState({ opneScanner: true });
          } else {
            alert("CAMERA permission denied");
          }
        } catch (err) {
          alert("Camera permission err",err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    }else{
      that.setState({ qrvalue: '' });
      that.setState({ opneScanner: true });
    }    
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <CameraKitCameraScreen
           actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
          showFrame={true}
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={'blue'}
          //Color can be of your choice
          frameColor={'yellow'}
          //If frame is visible then frame color
          colorForScannerFrame={'black'}
          //Scanner Frame color
          onReadQRCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
      </View>
    );
  }

  onDismissPress() {
    this.props.stopNavigating();
    this.props.navigation.navigate("MainExplore");
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2c3539',
    padding: 10,
    width:300,
    marginTop:16
  },
  heading: { 
    color: 'black', 
    fontSize: 24, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 30 
  },
  simpleText: { 
    color: 'black', 
    fontSize: 20, 
    alignSelf: 'center', 
    padding: 10, 
    marginTop: 16
  },
  arriveImage: {
    height: 128,
    width: 128,
    marginBottom: 20
  },
  dismissButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    alignSelf: "center"
  }
});

const mapStateToProps = state => ({
  rangeOption: state.settingsReducer.rangeOption
});

const mapDispatchToProps = dispatch => ({
  stopNavigating: () => dispatch(stopNavigating())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanScreen);
