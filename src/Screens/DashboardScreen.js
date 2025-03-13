import React, {useState} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Use FontAwesome for the icons
import colors from '../CommonFiles/Colors';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = () => {
  const logout = require('../assets/images/logout.png');
  const sports = require('../assets/images/sportbike.png');

  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            console.log('User logged out');
            await AsyncStorage.removeItem('id');

            navigation.reset({
              index: 0,
              routes: [{name: 'LoginScreen'}],
            });
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      <View
        style={{
          backgroundColor: colors.Brown,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Inter-Bold',
          }}>
          Rajputana Agency
        </Text>
        <TouchableOpacity
          style={{position: 'absolute', right: 10, top: 18}}
          onPress={handleLogout}>
          <Image
            source={logout}
            style={{width: 25, height: 25, tintColor: 'white'}}
          />
        </TouchableOpacity>
      </View>
      {/* Row container */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 30,
          paddingHorizontal: 15,
        }}>
        {/* First Box (Staff) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('HomeScreen');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <FontAwesome name="user" size={25} color="#fff" />
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Staff
          </Text>
        </TouchableOpacity>

        {/* Second Box (Schedule) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('StaffSchedule');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <FontAwesome name="calendar" size={25} color="#fff" />
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Schedule
          </Text>
        </TouchableOpacity>
        {/* Third Box (Search History) */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('SearchVehicle');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <Image
              source={sports}
              style={{width: 25, height: 25, tintColor: 'white'}}
            />
          </View>
          <Text
            style={{
              color: '#000', // Change text color to make it more visible on white
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Intimation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Row container */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 30,
          paddingHorizontal: 15,
        }}>
        {/* Four Box (Search History) */}

        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            width: 100,
            height: 120,
            padding: 10,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8, // For Android
          }}
          onPress={() => {
            navigation.navigate('SearchHistory');
          }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.Brown,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <FontAwesome name="search" size={25} color="#fff" />
          </View>
          <Text
            style={{
              color: 'black',
              fontSize: 14,
              textAlign: 'center',
              fontFamily: 'Inter-Medium',
            }}>
            Search History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;
