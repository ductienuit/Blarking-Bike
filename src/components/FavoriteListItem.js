import React, { Component } from 'react';
import {
  ListItem,
  Left,
  Body,
  Right,
  CheckBox,
  Text,
  Icon,
  Button,
} from 'native-base';
import PropTypes from 'prop-types';

export default class FavoriteListItem extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    locationName: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    onRemovePress: PropTypes.func,
  };

  constructor() {
    super();
    this.onPress = this.onPress.bind(this);
    this.onRemovePress = this.onRemovePress.bind(this);
  }

  render() {
    return (
      <ListItem
        noIndent
        button
        onPress={this.onPress}
        delayLongPress={0}
        delayPressIn={0}
        delayPressOut={0}>
        <Body>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{ fontWeight: 'bold' }}>
            {this.props.title}
          </Text>
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {this.props.locationName}
          </Text>
        </Body>
        <Button transparent onPress={this.onRemovePress}>
          <Icon name="trash" style={{ color: 'gray' }} />
        </Button>
      </ListItem>
    );
  }

  onPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  onRemovePress() {
    if (this.props.onRemovePress) {
      this.props.onRemovePress();
    }
  }
}
