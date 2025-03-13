import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Header from '../Component/Header';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ENDPOINTS} from '../CommonFiles/Constant';
import colors from '../CommonFiles/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [StaffList, setStaffList] = useState([]);
  const [StaffLoading, setStaffLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [InfoModal, SetInfoModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [ConfrimationModal, setConfrimationModal] = useState(false);

  const OpenModal = staff => {
    setSelectedStaff(staff);
    setIsModalVisible(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
  };

  const closeModal = () => {
    SetInfoModal(false); // Hide the modal
  };

  const closeconfirmodal = () => {
    setConfrimationModal(false); // Hide the modal
  };

  const handleEdit = () => {
    navigation.navigate('AddStaffScreen', {
      staff_id: selectedStaff.staff_id,
      staff_name: selectedStaff.staff_name,
      staff_email: selectedStaff.staff_email,
      staff_mobile: selectedStaff.staff_mobile,
      staff_address: selectedStaff.staff_address,
      staff_password: selectedStaff.staff_password,
      staff_type: selectedStaff.staff_type,
    });
    handleCloseModal(); // Close the modal after action
  };

  // const handleDelete = () => {
  //   DeleteStaffApi(selectedStaff.staff_id); // Call Delete API with the selected staff ID
  //   handleCloseModal(); // Close the modal after action
  // };

  const handleDelete = () => {
    setConfrimationModal(true);
    handleCloseModal();
    // Call Delete API with the selected staff ID
  };

  const DeleteStaffApi = async staffId => {
    console.log('staffId', staffId);
    try {
      const response = await fetch(ENDPOINTS.Delete_Staff, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: staffId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          ToastAndroid.show('Staff Deleted Successfully', ToastAndroid.SHORT);
          fetchData();
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
    }
  };

  const fetchData = async () => {
    setStaffLoading(true);
    try {
      const response = await fetch(ENDPOINTS.List_Staff, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // trainer_id: trainerId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.code === 200) {
          setStaffList(result.payload); // Successfully received data
        } else {
          console.log('Error:', 'Failed to load staff data');
        }
      } else {
        console.log('HTTP Error:', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('Error fetching data:', error.message);
    } finally {
      setStaffLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []), // Empty array ensures this is called only when the screen is focused
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Header
        title="Rajputana Agency"
        // onMenuPress={() => navigation.openDrawer()}
      /> */}
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
          Staff List
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
        {/* <View
          style={{
            height: 60,
            justifyContent: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.Brown,
              borderRadius: 10,
              marginRight: 15,
              width: '30%',
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              gap: 7,
            }}
            onPress={() => {
              navigation.navigate('AddStaffScreen');
            }}>
            <AntDesign name="plus" color="white" size={18} />
            <Text style={{color: 'white', fontFamily: 'Inter-Regular'}}>
              Add New
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Table Header */}
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
              width: '25%',
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
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'left',
                fontSize: 14,
                color: 'black',
              }}>
              Type
            </Text>
          </View>
          <View
            style={{
              width: '25%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'left',
                fontSize: 14,
                color: 'black',
              }}>
              Date
            </Text>
          </View>
          <View
            style={{
              width: '10%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 2,
                fontWeight: 'bold',
                marginLeft: 5,
                fontFamily: 'Inter-Regular',
                textAlign: 'right',
                fontSize: 14,
                color: 'black',
              }}></Text>
          </View>
        </View>

        {/* Loading Indicator */}
        {StaffLoading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.Brown} />
          </View>
        ) : StaffList.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Inter-Regular', color: 'red'}}>
              No Data Found
            </Text>
          </View>
        ) : (
          StaffList.map((item, index) => (
            <View
              key={item.staff_id}
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
              {/* Index Column */}
              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {index + 1 || '----'}
                </Text>
              </View>

              {/* Name Column */}
              <View
                style={{
                  width: '25%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.staff_name || '----'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.staff_mobile || '----'}
                </Text>
              </View>

              {/* Mobile Column */}
              <View
                style={{
                  width: '25%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  {item.staff_type || '----'}
                </Text>
              </View>

              {/* Staff Type Column */}
              <View
                style={{
                  width: '25%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    textAlign: 'center',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    textTransform: 'uppercase',
                  }}>
                  {item.staff_entry_date || '----'}
                </Text>
              </View>

              {/* Actions Column */}
              <View
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}>
                <TouchableOpacity
                  onPress={() => OpenModal(item)}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Entypo name="dots-three-vertical" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        <View
          style={{
            paddingBottom: 85,
            backgroundColor: 'white',
          }}
        />
      </ScrollView>

      {/* Sticky Add New Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 10,
          left: 120,
          width: '40%',
          zIndex: 1,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.Brown,
            borderRadius: 10,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: 7,
          }}
          onPress={() => {
            navigation.navigate('AddStaffScreen');
          }}>
          <AntDesign name="plus" color="white" size={18} />
          <Text style={{color: 'white', fontFamily: 'Inter-Regular'}}>
            Staff
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          activeOpacity={1}
          onPress={handleCloseModal}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 15,
              width: '80%',
              alignItems: 'center',
              elevation: 5, // Adds shadow for Android
              shadowColor: '#000', // Shadow for iOS
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.1,
              shadowRadius: 5,
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginBottom: 20,
                  color: 'black',
                  fontFamily: 'Inter-Regular',
                }}>
                Select Action
              </Text>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                  top: -8,
                  width: '15%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
                onPress={handleCloseModal}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                  }}>
                  ×
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{gap: 3, width: '80%'}}>
              {/* Delete Leave Button */}
              <TouchableOpacity
                style={{
                  borderColor: 'red',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={handleDelete}>
                <AntDesign name="delete" size={24} color="red" />
                <Text
                  style={{
                    color: 'red',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Delete Staff
                </Text>
              </TouchableOpacity>
              {/* Update Leave Button */}
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  marginTop: 10,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={handleEdit}>
                <AntDesign name="edit" size={24} color="Black" />
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Update Staff
                </Text>
              </TouchableOpacity>

              {/* Info Staff Button */}
              <TouchableOpacity
                style={{
                  borderColor: colors.Brown,
                  borderWidth: 1,
                  borderRadius: 10,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 12,
                  marginTop: 10,
                  flexDirection: 'row',
                  gap: 15,
                }}
                onPress={() => {
                  SetInfoModal(true);
                  setIsModalVisible(false);
                }}>
                <AntDesign name="infocirlceo" size={20} color="black" />

                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Inter-Regular',
                    fontSize: 16,
                  }}>
                  Information Staff
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={InfoModal} transparent={true} animationType="slide">
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
            {selectedStaff && (
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
                    Staff information
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
                    {selectedStaff.staff_name || '-----'}
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
                      Mobile No:{' '}
                    </Text>
                    {selectedStaff.staff_mobile || '-----'}
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
                      Email:{' '}
                    </Text>
                    {selectedStaff.staff_email || '-----'}
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
                    {selectedStaff.staff_entry_date || '-----'}
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
                      Staff Type:{' '}
                    </Text>
                    {selectedStaff.staff_type || '-----'}
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
                      Staff Status:{' '}
                    </Text>
                    <Text
                      style={{
                        color: selectedStaff.staff_status ? 'green' : 'red',
                        fontFamily: 'Inter-Regular',
                      }}>
                      {selectedStaff.staff_status || '-----'}
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={ConfrimationModal}
        onRequestClose={closeconfirmodal}>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
          onPress={closeconfirmodal}
          activeOpacity={1}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 8,
              width: '80%',
              alignItems: 'center',
            }}
            onStartShouldSetResponder={() => true} // Prevent modal from closing on content click
            onTouchEnd={e => e.stopPropagation()}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
              Confirm Delete
            </Text>
            <Text style={{fontSize: 14, marginBottom: 20, textAlign: 'center'}}>
              Are you sure you want to delete the staff ?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ddd',
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={closeconfirmodal}>
                <Text
                  style={{
                    color: 'Black',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.Brown,
                  padding: 10,
                  borderRadius: 5,
                  width: '45%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  DeleteStaffApi(selectedStaff.staff_id);
                  closeconfirmodal();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'Inter-Regular',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomeScreen;
