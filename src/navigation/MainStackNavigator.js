import { createStackNavigator } from 'react-navigation';
import AlarmScreen from '../screens/AlarmScreen';
import DetailExploreScreen from '../screens/DetailExploreScreen';
import EditFavoriteScreen from '../screens/EditFavoriteScreen';
import RingtoneScreen from '../screens/RingtoneScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ScanScreen from '../screens/ScanScreen';

export default createStackNavigator(
  {
    EditFavorite: {
      screen: EditFavoriteScreen,
      navigationOptions: {
        title: 'Edit Favorite',
      },
    },
    MainScreen: {
      screen: BottomTabNavigator,
      navigationOptions: {
        title: 'Main Screen',
      },
    },
    DetailExplore: {
      screen: DetailExploreScreen,
      navigationOptions: {
        title: 'Explore Screen',
      },
    },
    Ringtone: {
      screen: RingtoneScreen,
      navigationOptions: {
        title: 'Ringtone Screen',
      },
    },
    Alarm: {
      screen: AlarmScreen,
      navigationOptions: {
        title: 'Alarm Screen',
      },
    },
    ScanQR:{
      screen:ScanScreen,
      navigationOptions:{
        title:'Scan Screen',
      }
    },
  },
  {
    initialRouteName: 'MainScreen',
    headerMode: 'none',
  }
);
