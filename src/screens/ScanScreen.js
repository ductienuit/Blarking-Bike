import { Button, Container, H1, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { stopNavigating } from '../actions/ExploreActions';
import StatusBarOverlay from '../components/StatusBarOverlay';
import Colors from '../constants/Colors';

class ScanScreen extends Component {
  static propTypes = {
    stopNavigating: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onDismissPress = this.onDismissPress.bind(this);
  }

  render() {
    return (
      <Container>
        <StatusBarOverlay />
        <View style={styles.page}>
          <Button
            rounded
            style={styles.dismissButton}
            onPress={this.onDismissPress}
            delayPressIn={0}>
            <Text>Dismiss</Text>
          </Button>
        </View>
      </Container>
    );
  }

  onDismissPress() {
    this.props.stopNavigating();
    this.props.navigation.navigate('MainExplore');
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  arriveImage: {
    height: 128,
    width: 128,
    marginBottom: 20,
  },
  dismissButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
  },
});

const mapStateToProps = (state) => ({
  rangeOption: state.settingsReducer.rangeOption,
});

const mapDispatchToProps = (dispatch) => ({
  stopNavigating: () => dispatch(stopNavigating()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScanScreen);
