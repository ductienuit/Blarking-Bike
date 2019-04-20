import { MapView } from "expo";
import { Button, Container, Fab, Icon, Text, Toast } from "native-base";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Vibration,
  View,
  Modal,
  TouchableOpacity
} from "react-native";
import ReactNativeAN from "react-native-alarm-notification";
import RNGooglePlaces from "react-native-google-places";
import BackgroundGeolocation from "react-native-mauron85-background-geolocation";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { setRangeOption } from "../actions";
import {
  changeLocation,
  changeStationType,
  startNavigating,
  stopNavigating
} from "../actions/ExploreActions";
import { computeDistanceBetween } from "../common/HelperFunction";
import NavigationRoute from "../components/NavigationRoute";
import showRangeOptions from "../components/RangeOptions";
import StationMarkers from "../components/StationMarkers";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { RANGE_OPTIONS, RANGE_VALUES } from "../constants/RangeOptions";
import { ATM, GAS, NONE } from "../constants/StationTypes";
import { propTypes as LocationProps } from "../model/Location";
import { newTS } from "uuid-js";

class MainExploreScreen extends Component {
  static propTypes = {
    location: PropTypes.shape(LocationProps),
    rangeOption: PropTypes.number.isRequired,
    setRangeOption: PropTypes.func.isRequired,
    stopNavigating: PropTypes.func.isRequired,
    startNavigating: PropTypes.func.isRequired,
    isNavigating: PropTypes.bool,
    changeLocation: PropTypes.func.isRequired,
    soundID: PropTypes.number.isRequired,
    vibrate: PropTypes.bool.isRequired,
    stationType: PropTypes.oneOf([ATM, GAS, NONE]).isRequired
  };

  constructor() {
    super();
    
    this.state = {
      /**
       * The current location of the device.
       */
      currentLocation: {
        latitude: 10.8703,
        longitude: 106.8034513
      },
      /**
       * If the notifying process is running.
       */
      isNotifying: false,
      ModalVisibleStatus: false,
    };

    this.mapView = null;
    this.configBackgroundGeolocation();
    this.selectStation=null;

    this.onSearchPress = this.onSearchPress.bind(this);
    this.onPickPress = this.onPickPress.bind(this);
    this.onLocatePress = this.onLocatePress.bind(this);
    this.onRangePress = this.onRangePress.bind(this);
    this.onNavigationRouteReady = this.onNavigationRouteReady.bind(this);
    this.startNavigating = this.startNavigating.bind(this);
    this.stopNavigating = this.stopNavigating.bind(this);
    this.onToggleNavigation = this.onToggleNavigation.bind(this);
    this.onStationPress = this.onStationPress.bind(this);
    this.onQrPress = this.onQrPress.bind(this);
  }
  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  onQrPress(){
    this.props.navigation.navigate("ScanQR");
  }

  render() {
    return (
      <Container>
        <View style={styles.addressBar}>
          <Button
            delayPressIn={0}
            rounded
            transparent
            full
            androidRippleColor="lightgray"
            onPress={this.onSearchPress}
            style={{ flex: 1 }}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              uppercase={false}
              style={{ color: Colors.darkGrayBackground }}
            >
              {this.props.location
                ? `${this.props.location.address}`
                : "Search here"}
            </Text>
          </Button>
          <Button
            delayPressIn={0}
            rounded
            icon
            transparent
            style={styles.pickButton}
            androidRippleColor="lightgray"
            onPress={this.onPickPress}
          >
            <Icon name="location" type="Entypo" style={{ color: "gray" }} />
          </Button>
        </View>
        <Fab
          delayPressIn={0}
          active={false}
          style={styles.qrButton}
          position="bottomRight"
          onPress={this.onQrPress}
        >
          <Icon
            name="qrcode-scan"
            type="MaterialCommunityIcons"
            style={{ color: "gray" }}
          />
        </Fab>
        <Fab
          delayPressIn={0}
          active={false}
          style={styles.rangeButton}
          position="bottomRight"
          onPress={this.onRangePress}
        >
          <Icon
            name="street-view"
            type="FontAwesome"
            style={{ color: "gray" }}
          />
        </Fab>
        <Fab
          delayPressIn={0}
          style={styles.myLocationButton}
          position="bottomRight"
          onPress={this.onLocatePress}
        >
          <Icon
            name="my-location"
            type="MaterialIcons"
            style={{ color: "gray" }}
          />
        </Fab>
        <Fab
          delayPressIn={0}
          style={styles.startButton}
          position="bottomRight"
          onPress={this.onToggleNavigation}
        >
          <Icon name={this.props.isNavigating ? "pause" : "play"} />
        </Fab>
        <MapView
          style={{ flex: 1, alignSelf: "stretch" }}
          initialRegion={{
            latitude: this.state.currentLocation.latitude,
            longitude: this.state.currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          ref={c => (this.mapView = c)}
          showsUserLocation
        >
          {this.props.location && (
            <NavigationRoute
              currentLocation={this.state.currentLocation}
              destination={{
                latitude: this.props.location.latitude,
                longitude: this.props.location.longitude
              }}
              onReady={this.onNavigationRouteReady}
              radius={RANGE_VALUES[this.props.rangeOption]}
            />
          )}
          {this.props.stationType !== NONE && (
            <StationMarkers
              type={this.props.stationType}
              onStationPress={this.onStationPress}
            />
          )}
        </MapView>
        <Modal
          transparent={true}
          animationType={"slide"}
          visible={this.state.ModalVisibleStatus}
          onRequestClose={() => {
            this.ShowModalFunction(!this.state.ModalVisibleStatus);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <View style={styles.ModalInsideView}>
              <Text
                style={{
                  fontSize: 23,
                  marginBottom: 20,
                  color: "#707171",
                  padding: 20,
                  textAlign: "center"
                }}
              >
                {this.getLocationString()}
                {"\n"}
                {"\n"}
                <Text
                  style={{
                    fontSize: 16,
                    color: "#848380"
                  }}
                >
                  Parking this place with 5000vnd/ 1 hour
                </Text>
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 40,
                    marginRight: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "#9ed4f3",
                    borderRadius: 5
                  }}
                  onPress={() => {
                    this.ShowModalFunction(!this.state.ModalVisibleStatus);
                    this.props.changeLocation(this.selectStation);
                    this.props.changeStationType(NONE);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff"
                    }}
                  >
                    GO NOW
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 120,
                    height: 40,
                    marginLeft: 10,
                    flexDirection: "column",
                    justifyContent: "center",
                    backgroundColor: "#ff886c",
                    borderRadius: 5
                  }}
                  onPress={() => {
                    this.ShowModalFunction(!this.state.ModalVisibleStatus);
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff"
                    }}
                  >
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }

  componentDidMount() {
    //Reset destination location
    this.props.changeLocation(null);
    //this.props.changeStationType(NONE);
    this.props.changeStationType(GAS);
    this.props.stopNavigating();
    this.stopBackgroundGeolocation();
    this.updateCurrentLocation();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isNavigating != this.props.isNavigating) {
      if (!this.props.isNavigating) {
        this.stopNavigating();
      }
    }

    // if is navigating
    if (this.props.isNavigating) {
      // if current location is updated
      // or destination (this.props.location) is updated
      if (
        JSON.stringify(prevState.currentLocation) !==
          JSON.stringify(this.state.currentLocation) ||
        JSON.stringify(prevProps.location) !==
          JSON.stringify(this.props.location)
      ) {
        // check if in range
        if (this.isInRange()) {
          if (!this.state.isNotifying) {
            this.raiseAlarm();
            this.setState({ isNotifying: true });
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.stopBackgroundGeolocation();

    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event)
    );
  }

  getLocationString() {
    const location = this.props.location;
    if (location) {
      if (location.address.includes(location.name)) {
        return location.address;
      }
      return `${location.name}, ${location.address}`;
    }
    return "Search here";
  }

  onStationPress(marker) {
    const newState = this.state;
    newState.ModalVisibleStatus=true;
    this.setState(newState);

    const newstation = {
      name: marker.title,
      address: marker.title,
      latitude: marker.lat,
      longitude: marker.lng
    };
    this.selectStation = newstation;
    //this.props.changeLocation(station);
    // this.props.changeStationType(NONE);
  }

  onNavigationRouteReady(result) {
    this.mapView.fitToCoordinates(result.coordinates);
  }

  onSearchPress() {
    this.props.navigation.navigate("DetailExplore");
  }

  async onPickPress() {
    let location = null;
    await RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        location = place;
        console.info("[INFO]", "[onPickPress]", "[SUCCESS]", location.address);
      })
      .catch(error => console.warn("[ERROR]", "[onPickPress]", error));

    if (location == null) {
      console.info(
        "[INFO]",
        "[onPickPress]",
        "Unable to find location from result item."
      );
      Toast.show({
        text: "Unable to pick destination.",
        buttonText: "Okay",
        type: "danger",
        duration: 3000
      });
      return;
    }

    this.props.changeLocation(location);
  }

  onLocatePress() {
    this.callWithLocationServices(() => {
      BackgroundGeolocation.getCurrentLocation(location => {
        const currentLocation = {
          longitude: location.longitude,
          latitude: location.latitude
        };
        this.setState({
          ...currentLocation
        });
        this.mapView.fitToCoordinates([currentLocation]);
      });
    });
  }

  onRangePress() {
    showRangeOptions(this.props.rangeOption, selectedIndex => {
      if (selectedIndex !== undefined && selectedIndex !== null) {
        this.props.setRangeOption(selectedIndex);
      }
    });
  }

  onToggleNavigation() {
    // if true then stops
    if (this.props.isNavigating) {
      if (!this.props.isNavigating) {
        Toast.show({
          text: "Alarm has already stopped!",
          buttonText: "Okay",
          duration: 3000
        });
      } else if (!this.props.location) {
        console.warn(
          "[WARN]",
          "[onToggleNavigation]",
          "There is no location but [isNavigating] is true. Turning off..."
        );
        this.props.stopNavigating();
      } else {
        this.stopNavigating();
        Toast.show({
          text: "Alarm stopped!",
          buttonText: "Okay",
          duration: 3000
        });
      }
    }
    // if false then starts
    else {
      if (this.props.isNavigating) {
        Toast.show({
          text: "Alarm has already been set!",
          buttonText: "Okay",
          duration: 3000
        });
      } else if (!this.props.location) {
        Toast.show({
          text: "Please select a destination",
          buttonText: "Okay",
          type: "danger",
          duration: 3000
        });
      } else {
        this.callWithLocationServices(() => {
          this.startNavigating();
          Toast.show({
            text: "Alarm set!",
            buttonText: "Okay",
            type: "success",
            duration: 3000
          });
        });
      }
    }
  }

  startNavigating() {
    this.updateCurrentLocation();
    this.startBackgroundGeolocation();
    this.props.startNavigating();
  }

  stopNavigating() {
    //immediately stop sound alarm
    ReactNativeAN.stopAlarm();
    ReactNativeAN.removeFiredNotification("1997");
    Vibration.cancel();
    this.setState({ isNotifying: false });
    this.stopBackgroundGeolocation();
    this.props.stopNavigating();
  }

  isInRange() {
    if (!this.props.location) {
      console.warn("[ERROR]", "[isInRange]", "No location.");
      return;
    }

    const current = this.state.currentLocation;
    const destination = this.props.location;
    const distance = computeDistanceBetween(
      current.latitude,
      current.longitude,
      destination.latitude,
      destination.longitude
    );

    return distance <= RANGE_VALUES[this.props.rangeOption];
  }

  configBackgroundGeolocation() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 50,
      notificationsEnabled: true,
      notificationTitle: "Location Notifier",
      notificationText: "Location Notifier is tracking your location.",
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 4000,
      fastestInterval: 4000,
      activitiesInterval: 10000,
      stopOnStillActivity: true
    });

    BackgroundGeolocation.on("location", location => {
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task

      //get current location
      this.setState({
        currentLocation: {
          longitude: location.longitude,
          latitude: location.latitude
        }
      });
    });

    BackgroundGeolocation.on("stationary", stationaryLocation => {
      // handle stationary locations here
      console.info(
        "[INFO]",
        "[BackgroundGeolocation]",
        "[stationary]",
        stationaryLocation
      );
    });

    BackgroundGeolocation.on("error", error => {
      console.warn("[ERROR]", "[BackgroundGeolocation]", error);
    });

    BackgroundGeolocation.on("start", () => {
      console.info("[INFO]", "[BackgroundGeolocation]", "Started.");
    });

    BackgroundGeolocation.on("stop", () => {
      console.info("[INFO]", "[BackgroundGeolocation]", "Stopped.");
    });

    BackgroundGeolocation.on("authorization", status => {
      console.info(
        "[INFO]",
        "[BackgroundGeolocation]",
        "authorization status: ",
        status
      );
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        this.requestLocationPermission();
      }
    });

    BackgroundGeolocation.on("background", () => {
      console.info("[INFO]", "[BackgroundGeolocation]", "is in background");
    });

    BackgroundGeolocation.on("foreground", () => {
      console.info("[INFO]", "[BackgroundGeolocation]", "is on foreground");
    });
  }

  isLocationPermitted(callback) {
    if (callback == null) {
      console.log("[ERROR]", "[isLocationPermitted]", "callback is null.");
      return;
    }

    BackgroundGeolocation.checkStatus(status => {
      callback(status.authorization == BackgroundGeolocation.AUTHORIZED);
    });
  }

  isLocationServicesEnabled(callback) {
    if (callback == null) {
      console.log(
        "[ERROR]",
        "[isLocationServicesEnabled]",
        "callback is null."
      );
      return;
    }

    BackgroundGeolocation.checkStatus(status => {
      callback(status.locationServicesEnabled);
    });
  }

  requestLocationPermission() {
    Alert.alert(
      "Location permission is required",
      "Would you like to open app settings?",
      [
        {
          text: "Yes",
          onPress: () => BackgroundGeolocation.showAppSettings(),
          style: "default"
        },
        {
          text: "No",
          onPress: () => {
            console.warn("[WARN]", "[BackgroundGeolocation]", "No Pressed.");
            Toast.show({
              text: "Location permission is required.",
              buttonText: "Okay",
              type: "danger",
              duration: 3000
            });
          },
          style: "cancel"
        }
      ]
    );
  }

  requestLocationServices() {
    if (Platform.OS === "android") {
      Alert.alert(
        "Location services are disabled",
        "Would you like to open location settings?",
        [
          {
            text: "Yes",
            onPress: () => BackgroundGeolocation.showLocationSettings(),
            style: "default"
          },
          {
            text: "No",
            onPress: () => {
              console.warn(
                "[WARN]",
                "[requestLocationServices]",
                "No Pressed."
              );
              Toast.show({
                text: "Location services are disabled.",
                buttonText: "Okay",
                type: "danger",
                duration: 3000
              });
            },
            style: "cancel"
          }
        ]
      );
    } else {
      Toast.show({
        text: "Location services are disabled.",
        buttonText: "Okay",
        type: "danger",
        duration: 3000
      });
    }
  }

  callWithLocationServices(callback) {
    if (callback == null) {
      console.log("[ERROR]", "[callWithLocationServices]", "callback is null.");
      return;
    }

    this.isLocationPermitted(permitted => {
      if (permitted) {
        this.isLocationServicesEnabled(enabled => {
          if (enabled) {
            callback();
          } else {
            this.requestLocationServices();
          }
        });
      } else {
        this.requestLocationPermission();
      }
    });
  }

  updateCurrentLocation() {
    BackgroundGeolocation.getCurrentLocation(location => {
      this.setState({
        currentLocation: {
          longitude: location.longitude,
          latitude: location.latitude
        }
      });
    });
  }

  startBackgroundGeolocation() {
    console.info("[INFO]", "[startBackgroundGeolocation]", "begin");
    BackgroundGeolocation.checkStatus(status => {
      console.info(
        "[INFO]",
        "[BackgroundGeolocation]",
        "status:",
        JSON.stringify(status)
      );

      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
  }

  stopBackgroundGeolocation() {
    console.info("[INFO]", "[stopBackgroundGeolocation]", "begin");
    BackgroundGeolocation.checkStatus(status => {
      console.info(
        "[INFO]",
        "[BackgroundGeolocation]",
        "status:",
        JSON.stringify(status)
      );

      if (status.isRunning) {
        BackgroundGeolocation.stop();
      }
    });
  }

  configAlarmNotification() {
    const soundName = `alarm${this.props.soundID}.mp3`;
    const alarmNotifData = {
      id: "1997", // Required.
      title: "Location Notifier",
      message: `You are within ${
        RANGE_OPTIONS[this.props.rangeOption]
      } from your destination.`,
      channel: "1997", // Same id as specified in MainApplication's onCreate method
      ticker: "Location Notifier ticker",
      vibrate: false,
      small_icon: "ic_launcher",
      large_icon: "ic_launcher",
      play_sound: true,
      sound_name: soundName, // Plays custom notification ringtone if sound_name: null
      color: Colors.primary
    };

    return alarmNotifData;
  }

  raiseAlarm() {
    const alarmNotifData = this.configAlarmNotification();
    ReactNativeAN.sendNotification(alarmNotifData);
    if (this.props.vibrate) {
      Vibration.vibrate([1000, 2000], true);
    }
    this.props.navigation.navigate("Alarm");
    console.info("[INFO]", "[raiseAlarm]", "successfully");
  }
}

const styles = StyleSheet.create({
  shrink: {
    flex: 0
  },
  addressBar: {
    zIndex: 1,
    position: "absolute",
    top: 10 + Layout.statusBarHeight,
    left: 10,
    right: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "white",
    borderColor: "lightgray",
    flexDirection: "row"
  },
  pickButton: {
    alignSelf: "center",
    marginLeft: -5
  },
  startButton: {
    zIndex: 1,
    backgroundColor: Colors.tintColor
  },
  myLocationButton: {
    zIndex: 1,
    backgroundColor: "white",
    bottom: 75
  },
  rangeButton: {
    zIndex: 1,
    backgroundColor: "white",
    bottom: 150
  },
  qrButton: {
    zIndex: 1,
    backgroundColor: "#f6db2f",
    bottom: 225
  },
  ModalInsideView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 300,
    width: "90%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cccccc"
  },
});

const mapStateToProps = state => ({
  location: state.exploreReducer.location,
  rangeOption: state.settingsReducer.rangeOption,
  soundID: state.settingsReducer.soundID,
  isNavigating: state.exploreReducer.isNavigating,
  vibrate: state.settingsReducer.vibrate,
  stationType: state.exploreReducer.stationType
});

const mapDispatchToProps = dispatch => ({
  setRangeOption: optionID => dispatch(setRangeOption(optionID)),
  stopNavigating: () => dispatch(stopNavigating()),
  startNavigating: () => dispatch(startNavigating()),
  changeLocation: location => dispatch(changeLocation(location)),
  changeStationType: type => dispatch(changeStationType(type))
});

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MainExploreScreen)
);
