import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../CommonFiles/Colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ENDPOINTS} from '../CommonFiles/Constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Use FontAwesome for the icons
import Entypo from 'react-native-vector-icons/Entypo';

import AntDesign from 'react-native-vector-icons/AntDesign';

const SearchVehicle = () => {
  const navigation = useNavigation();
  const [SearchVehicle, setSearchVehicle] = useState([]);
  console.log('search vehicleType', SearchVehicle);
  const [SearchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [text, setText] = useState(null);
  console.log('number', text);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const [selectedType, setSelectedType] = useState(null); // Store selected type

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const [typeError, settypeError] = useState('');
  const [SearchError, setSearchError] = useState('');

  // Create a function that handles text change
  const handleTextChange = newText => {
    setText(newText);
    // You can also add any additional logic here if needed, like validation or fetching data
  };

  console.log('selected type', selectedType);
  const [dropdownData] = useState([
    {label: 'Eng No', value: 'Eng No'},
    {label: 'Reg No', value: 'Reg No'},
    {label: 'Agg No', value: 'Agg No'},
    {label: 'Chassis No', value: 'Chassis No'},
  ]);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleSelect = type => {
    setSelectedType(type);
    setIsDropdownVisible(false); // Close the dropdown after selection
  };

  const openModal = item => {
    setSelectedHistory(item); // Set selected item data to show in the modal
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedHistory(null); // Clear the selected item data
  };

  useFocusEffect(
    useCallback(() => {
      setIsDropdownVisible(false);
    }, []), // Empty array ensures this is called only when the screen is focused
  );

  const SearchVehicleApi = async () => {
    let isValid = true;

    // Check if both fields are empty
    if (!text) {
      setSearchError('Search No Is Required');
      isValid = false; // Invalid because Search No is empty
    } else {
      setSearchError(''); // Clear error if Search No is provided
    }

    if (!selectedType) {
      settypeError('Type Is Required');
      isValid = false; // Invalid because Type is empty
    } else {
      settypeError(''); // Clear error if Type is provided
    }

    if (!isValid) return;
    console.log('vehicle and number', selectedType, text);
    setSearchLoading(true);
    try {
      const response = await fetch(ENDPOINTS.Intimation_Vehicle, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          number: text,
        }),
      });

      // Check the status code first
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.code == 200) {
        setSearchVehicle([result.payload]);
        setText('');
        setSelectedType('');
      } else {
        console.log('Error: Failed to load data');
        setSearchVehicle([]); // Set empty array if the result is not correct
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  // useEffect(() => {
  //   SearchVehicleApi();
  // }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setSearchError('');
    settypeError('');
    // await SearchVehicleApi();
    setRefreshing(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f7f7f7'}}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.Brown,
          paddingVertical: 15,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          style={{position: 'absolute', top: 15, left: 15}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons name="arrow-back" color="white" size={26} />
        </TouchableOpacity>

        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Inter-Bold',
          }}>
          Search Vehicle
        </Text>
      </View>
      {/* Type Dropdown */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 10,
        }}>
        {/* Dropdown button */}
        <View style={{position: 'relative', width: '25%'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 13,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderColor: typeError ? 'red' : '#ddd',
              borderWidth: 1,
              width: '100%',
            }}
            onPress={toggleDropdown}>
            <Text
              style={{
                paddingLeft: 8,
                fontSize: 12,
                fontFamily: 'Inter-Regular',
                color: selectedType ? 'black' : '#777',
              }}>
              {selectedType ? selectedType : 'Type'}
            </Text>

            <Ionicons
              name={isDropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="black"
            />
          </TouchableOpacity>

          {/* Dropdown list visibility */}
          {isDropdownVisible && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 8,
                borderColor: '#ddd',
                borderWidth: 1,
                zIndex: 1,
                marginTop: 2,
                width: '100%',
              }}>
              <FlatList
                data={dropdownData}
                keyboardShouldPersistTaps="handled"
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={{
                      padding: 12,
                      borderBottomColor: '#ddd',
                      borderBottomWidth: 1,
                    }}
                    onPress={() => handleSelect(item.value)}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Inter-Regular',
                        color: 'black',
                      }}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.value}
              />
            </View>
          )}
        </View>

        {/* Search Text button */}
        <View
          style={{
            width: '60%',

            borderRadius: 8,
            borderWidth: 1,
            height: 50,
            backgroundColor: 'white',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderColor: SearchError ? 'red' : '#ddd',
          }}>
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: 'Inter-Regular',
              color: 'black',
              height: 50,
            }}
            placeholder="Search No"
            placeholderTextColor="grey"
            value={text}
            onChangeText={handleTextChange}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: colors.Brown,
            padding: 10,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            width: '12.5%',
          }}
          onPress={SearchVehicleApi}>
          <FontAwesome name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      <View style={{width: '100%', flexDirection: 'row'}}>
        <View
          style={{
            width: '30%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {typeError ? (
            <Text
              style={{
                color: 'red',
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
              }}>
              {typeError}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            width: '70%',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
          {SearchError ? (
            <Text
              style={{
                color: 'red',
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                marginLeft: 10,
              }}>
              {SearchError}
            </Text>
          ) : null}
        </View>
      </View>

      <ScrollView
        style={{flex: 1, marginTop: 5}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#9Bd35A', '#689F38']}
          />
        }>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#ddd',
            padding: 7,
            borderRadius: 5,
          }}>
          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              Sr no
            </Text>
          </View>
          <View
            style={{
              width: '35%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              Customer Name
            </Text>
          </View>
          <View
            style={{
              width: '35%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              RCNO
            </Text>
          </View>
          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}></Text>
          </View>
        </View>
        {/* Loading Indicator */}
        {SearchLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 30,
            }}>
            <ActivityIndicator size="large" color={colors.Brown} />
          </View>
        ) : SearchVehicle.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: 'Inter-Regular',
                color: 'red',
                marginTop: 30,
              }}>
              No Data Found
            </Text>
          </View>
        ) : (
          SearchVehicle.map((item, index) => (
            <View
              key={item.full_vehicle_id}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                padding: 10,
                marginBottom: 7,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#ddd',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {index + 1}
                </Text>
              </View>
              <View
                style={{
                  width: '35%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 2,
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.vehicle_customer_name}
                </Text>
              </View>
              <View
                style={{
                  width: '35%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 2,
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.vehicle_registration_no}
                </Text>
              </View>
              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  // onPress={() => openModal(item)}
                  onPress={() => {
                    // Send the `item` to the IntimationScreen
                    navigation.navigate('IntimationScreen', {
                      vehicleDetails: item, // Pass the entire item to the next screen
                    });
                  }}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <AntDesign name="infocirlceo" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
          }}
          activeOpacity={1}
          onPress={closeModal}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 15,
              width: '85%',
              maxHeight: '80%', // Ensure modal does not overflow
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            {selectedHistory && (
              <>
                <View
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Inter-Medium',
                      marginBottom: 20,
                      color: 'black',
                      textAlign: 'center',
                    }}>
                    Search Vehicle Details
                  </Text>
                  {/* <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 12,
                      width: '20%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderWidth: 1,
                      backgroundColor: 'red',
                    }}
                    onPress={closeModal}>
                    <Entypo name="cross" size={30} color="black" />
                  </TouchableOpacity> */}
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled">
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Staff Name:{' '}
                    </Text>
                    {selectedHistory.vehicle_customer_name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Rc No:{' '}
                    </Text>
                    {selectedHistory.vehicle_registration_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Engine No:{' '}
                    </Text>
                    {selectedHistory.vehicle_engine_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Chassis No:{' '}
                    </Text>
                    {selectedHistory.vehicle_chassis_no}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',
                        fontFamily: 'Inter-Medium',
                      }}>
                      Entry Date:{' '}
                    </Text>
                    {selectedHistory.vehicle_entry_date}
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 10,
                      fontFamily: 'Inter-Regular',
                      color: 'black',
                    }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#333',

                        fontFamily: 'Inter-Medium',
                      }}>
                      Vehicle Status:{' '}
                    </Text>
                    <Text
                      style={{
                        color: selectedHistory.vehicle_status ? 'green' : 'red',
                        fontFamily: 'Inter-Regular',
                      }}>
                      {selectedHistory.vehicle_status}
                    </Text>
                  </Text>
                </ScrollView>

                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    backgroundColor: colors.Brown,
                    borderRadius: 10,
                    marginTop: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={closeModal}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Inter-Regular',
                      fontSize: 16,
                    }}>
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SearchVehicle;

const styles = StyleSheet.create({});
