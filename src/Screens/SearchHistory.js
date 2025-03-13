import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ENDPOINTS} from '../CommonFiles/Constant';
import {useNavigation} from '@react-navigation/native';
import colors from '../CommonFiles/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchHistory = () => {
  const navigation = useNavigation();

  const [SearchHistory, setSearchHistory] = useState([]);
  const [SearchLoading, setSearchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [ModalFilter, setModalFilter] = useState(false);

  const [selectedHistory, setSelectedHistory] = useState(null);

  const filters = ['Today', 'Yesterday', 'Month', 'custom'];

  const [selectedFilter, setSelectedFilter] = useState('Today'); // Selected filter state
  console.log('selected filter ye hai', selectedFilter);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const [Customodal, setCustomodal] = useState(false);
  const [isValidFromDate, setIsValidFromDate] = useState(true);
  const [isValidTillDate, setIsValidTillDate] = useState(true);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showTillDatePicker, setShowTillDatePicker] = useState(false);

  const getFormattedCurrentDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-indexed
    const year = today.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  };

  const [fromDate, setFromDate] = useState(getFormattedCurrentDate());
  const [tillDate, setTillDate] = useState(getFormattedCurrentDate());

  // Get formatted yesterday's date
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Subtract one day
    const day = yesterday.getDate();
    const month = yesterday.getMonth() + 1;
    const year = yesterday.getFullYear();
    return `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
  };

  // Get the first date of the current month
  const getFirstDateOfCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return `${year}-${month < 10 ? `0${month}` : month}-01`;
  };

  const openModal2 = () => {
    setModalFilter(true);
  };

  const closeModal2 = () => {
    setModalFilter(false);
  };

  const handleFilterPress = filter => {
    setSelectedFilter(filter); // Update selected filter
    setIsFilterActive(filter !== '');

    let updatedFromDate = '';
    let updatedTillDate = '';

    // Handle date range based on selected filter
    if (filter === 'Today') {
      updatedFromDate = getFormattedCurrentDate();
      updatedTillDate = getFormattedCurrentDate();
    } else if (filter === 'Yesterday') {
      updatedFromDate = getYesterdayDate();
      updatedTillDate = getYesterdayDate();
    } else if (filter === 'Month') {
      updatedFromDate = getFirstDateOfCurrentMonth();
      updatedTillDate = getFormattedCurrentDate();
    } else if (filter === 'custom') {
      setCustomodal(true);
      setIsValidFromDate(true);
      setIsValidTillDate(true);
      setFromDate('');
      setTillDate('');
    }

    // Log the selected filter and date values for debugging
    console.log('Selected filter xxxx:', filter);
    console.log('From Date: yyyyy', updatedFromDate);
    console.log('Till Date: zzzz', updatedTillDate);

    if (filter !== 'custom') {
      setFromDate(updatedFromDate);
      setTillDate(updatedTillDate);
      SearchHistoryApi(updatedFromDate, updatedTillDate);
    }

    closeModal2();
  };

  useEffect(() => {
    if (fromDate && tillDate) {
      SearchHistoryApi(fromDate, tillDate);
    }
  }, [fromDate, tillDate]);

  const handleSubmit = () => {
    const isFromDateValid = fromDate !== '';
    const isTillDateValid = tillDate !== '';

    // Set validation states
    setIsValidFromDate(isFromDateValid);
    setIsValidTillDate(isTillDateValid);

    // Check if both dates are valid
    if (!isFromDateValid || !isTillDateValid) {
      // If either fromDate or tillDate is invalid, show the validation error
      if (!isFromDateValid) {
      }
      if (!isTillDateValid) {
      }
      return; // Prevent form submission if validation fails
    }

    // If both dates are valid, proceed with the API call
    setCustomodal(false); // Close modal after submitting
    SearchHistoryApi(fromDate, tillDate);
  };

  const openModal = item => {
    setSelectedHistory(item); // Set selected item data to show in the modal
    setModalVisible(true); // Show the modal
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
    setSelectedHistory(null); // Clear the selected item data
  };

  const formattedDate = dateString => {
    const date = new Date(dateString); // Convert the string to a Date object
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and ensure it's 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed, so add 1) and ensure it's 2 digits
    const year = date.getFullYear(); // Get the year

    return `${day}-${month}-${year}`; // Return the formatted date as "DD-MM-YYYY"
  };

  const formatDate = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Adding leading zero
    return `${year}-${month}-${day}`; // New format: "YYYY-MM-DD"
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (event.type === 'dismissed') {
      if (type === 'from') {
        setShowFromDatePicker(false); // Close From Date picker if cancelled
      } else {
        setShowTillDatePicker(false); // Close Till Date picker if cancelled
      }
      return;
    }
    // If selectedDate is null (meaning the user cancelled), don't update the date
    if (!selectedDate) {
      return;
    }

    const currentDate = selectedDate || new Date(); // Default to the selected date or current date
    if (type === 'from') {
      setFromDate(formatDate(currentDate)); // Set formatted 'from' date
    } else {
      setTillDate(formatDate(currentDate)); // Set formatted 'till' date
    }

    // Close the date picker after selecting the date
    if (type === 'from') {
      setShowFromDatePicker(false);
    } else {
      setShowTillDatePicker(false);
    }
  };

  const SearchHistoryApi = async (fromdate, tilldate) => {
    setSearchLoading(true);
    console.log('from date and till date', fromdate, tilldate);
    try {
      const staffId = await AsyncStorage.getItem('staff_id');

      if (!staffId) {
        console.log('Error: Staff ID is not found in AsyncStorage');
        setSearchLoading(false);
        return;
      }
      const response = await fetch(ENDPOINTS.Search_History, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: fromdate && tilldate ? staffId : 'All',
          from_date: fromdate,
          till_date: tilldate,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          setSearchHistory(result.payload); // Successfully received data
        } else {
          console.log('Error:', 'Failed to load staff data');
          setSearchHistory([]);
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    SearchHistoryApi(fromDate,tillDate);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setIsFilterActive(false);
    setSelectedFilter('Today');
    const today = getFormattedCurrentDate();

    // Set both from and till date to today
    setFromDate(today);
    setTillDate(today);

    await SearchHistoryApi(today, today);
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
          Search History
        </Text>
      </View>
      <ScrollView
        style={{flex: 1}}
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
              width: '20%',
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
              Name
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
              Registration No
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isFilterActive && (
              <View
                style={{
                  position: 'absolute',
                  right: 3,
                  top: 0,
                  width: 8,
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: colors.light_brown,
                }}
              />
            )}
            <TouchableOpacity onPress={openModal2}>
              <AntDesign name="filter" size={25} color="black" />
            </TouchableOpacity>
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
        ) : SearchHistory.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
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
          SearchHistory.map((item, index) => (
            <View
              key={item.history_id}
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
                  width: '20%',
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
                  {item.history_staff_name}
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
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => openModal(item)}
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
                {/* <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 12,
                    width: '20%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  onPress={closeModal}>
                  <Entypo name="cross" size={30} color="black" />
                </TouchableOpacity> */}
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
                    Search History Details
                  </Text>
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
                    {selectedHistory.history_staff_name}
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
                      Staff Mobile:{' '}
                    </Text>
                    {selectedHistory.history_staff_mobile}
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
                      Vehicle Agreement No:{' '}
                    </Text>
                    {selectedHistory.vehicle_agreement_no}
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
                      Vehicle Registration No:{' '}
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
                      Entry Date:{' '}
                    </Text>
                    {selectedHistory.entry_date}
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
                      Vehicle Location:{' '}
                    </Text>
                    {selectedHistory.vehicle_location}
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
      {/* filter modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={ModalFilter}
        onRequestClose={closeModal2}>
        <TouchableWithoutFeedback onPress={closeModal2}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                width: '100%',
                paddingVertical: 5,
              }}>
              <TouchableOpacity
                onPress={closeModal2}
                style={{
                  marginRight: 10,
                  backgroundColor: 'white',
                  borderRadius: 50,
                }}>
                <Entypo name="cross" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <View
              onStartShouldSetResponder={e => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                width: '100%',
                paddingBottom: 40,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Inter-Medium',
                  fontSize: 18,
                  marginBottom: 10,
                  textAlign: 'left',
                }}>
                Change Date
              </Text>
              {filters.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor:
                      selectedFilter === filter ? colors.LightGrey : 'white',
                    padding: 10,
                    width: '100%',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    borderRadius: 5,
                  }}
                  onPress={() => handleFilterPress(filter)}>
                  <Text
                    style={{
                      color: selectedFilter === filter ? 'black' : 'black',
                      fontFamily: 'Inter-Regular',
                      fontSize: 16,
                    }}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* custom modal */}

      <Modal visible={Customodal} animationType="slide" transparent={true}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={() => {
            setCustomodal(false);
          }}
          activeOpacity={1}>
          <View
            style={{
              width: '80%',
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <View
              style={{
                justifyContent: 'flex-end',
                flexDirection: 'row',
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setCustomodal(false);
                }}>
                <Entypo name="cross" size={24} color="Black" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 20,
                fontFamily: 'Inter-Medium',
              }}>
              Custom History
            </Text>

            {/* From and Till Date in a row */}
            <View
              style={{
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
              }}>
              {/* From Date */}
              <View style={{flex: 1, marginRight: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 5,
                    color: 'black',
                    fontFamily: 'Inter-Medium',
                  }}>
                  From Date
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#ffffff',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: !isValidFromDate ? 'red' : '#cccccc',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setShowFromDatePicker(true)}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#333',
                      fontFamily: 'Inter-Regular',
                    }}>
                    {fromDate ? formattedDate(fromDate) : 'Select From Date'}
                  </Text>

                  <FontAwesome name="calendar" size={20} />
                </TouchableOpacity>
                {!isValidFromDate && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 12,
                      fontFamily: 'Inter-Regular',
                    }}>
                    From Date is required
                  </Text>
                )}
              </View>

              {/* Till Date */}
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 5,
                    color: 'black',
                    fontFamily: 'Inter-Medium',
                  }}>
                  Till Date
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#ffffff',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: !isValidTillDate ? 'red' : '#cccccc',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => setShowTillDatePicker(true)}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#333',
                      fontFamily: 'Inter-Regular',
                    }}>
                    {tillDate ? formattedDate(tillDate) : 'Select Till Date'}
                  </Text>
                  <TouchableOpacity onPress={() => setShowTillDatePicker(true)}>
                    <FontAwesome name="calendar" size={20} />
                  </TouchableOpacity>
                </TouchableOpacity>
                {!isValidTillDate && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: 12,
                      fontFamily: 'Inter-Regular',
                    }}>
                    Till Date is required
                  </Text>
                )}
              </View>
            </View>

            {/* Show Date Pickers */}
            {showFromDatePicker && (
              <DateTimePicker
                value={
                  fromDate
                    ? new Date(fromDate.split('/').reverse().join('-'))
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, 'from')
                }
                minimumDate={new Date('1900-01-01')} // Allow dates from 1900 or earlier, adjust as per requirement
                maximumDate={new Date()} // Restrict future dates
              />
            )}

            {showTillDatePicker && (
              <DateTimePicker
                value={
                  tillDate
                    ? new Date(tillDate.split('/').reverse().join('-'))
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(event, selectedDate, 'till')
                }
                minimumDate={
                  fromDate
                    ? new Date(fromDate.split('/').reverse().join('-'))
                    : new Date()
                } // Set minimumDate to From Date
                maximumDate={new Date()}
              />
            )}

            {/* Action Buttons */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: colors.Brown,
                  borderRadius: 5,
                }}
                onPress={handleSubmit}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'white',
                    fontFamily: 'Inter-Regular',
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SearchHistory;

const styles = StyleSheet.create({});
