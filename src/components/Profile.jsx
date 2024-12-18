import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icons from './Icons';

const { height } = Dimensions.get('screen');

const Profile = () => {
    const [profilePressed, setProfilePressed] = useState(false);
    const [imageURI, setImageURI] = useState(null);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [profile, setProfile] = useState({});
    const [desires, setDesires] = useState(null);
    const [projects, setProjects] = useState(null);

    const [nameError, setNameError] = useState('');
    const [surnameError, setSurnameError] = useState('');
    const [birthDateError, setBirthDateError] = useState('');

    const loadProfile = useCallback(async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('profile');
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                setProfile(parsedProfile);
    
                setName(parsedProfile.name || '');
                setSurname(parsedProfile.surname || '');
                setBirthDate(parsedProfile.birthDate || '');
                setImageURI(parsedProfile.imageURI || null);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        }
    }, []);    

    const loadProjects = useCallback(async () => {
        try {
            const savedProjects = await AsyncStorage.getItem('projects');
            if (savedProjects) {
                setProjects(JSON.parse(savedProjects).length);
            }
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    }, []);

    const loadDesires = useCallback(async () => {
        try {
            const savedDesires = await AsyncStorage.getItem('desires');
            if (savedDesires) {
                setDesires(JSON.parse(savedDesires).length);
            }
        } catch (error) {
            console.error("Error loading desires:", error);
        }
    }, []);

    useEffect(() => {
        loadProjects();
        loadDesires();
    }, [])

    useEffect(() => {
        loadProfile()
    }, [!profilePressed])

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );


    const handleProfilePress = () => {
        if(profilePressed) {
            setProfilePressed(false);
        } else {
            setProfilePressed(true);
        }
    };

    const handleImageUpload = () => {
        launchImageLibrary(
            { mediaType: 'photo', quality: 1 },
            (response) => {
                if (response.didCancel) {
                    console.log('Image picker cancelled');
                } else if (response.errorCode) {
                    console.error('Image picker error: ', response.errorMessage);
                } else {
                    const uri = response.assets[0]?.uri;
                    if (uri) setImageURI(uri);
                }
            }
        );
    };   
    
    const formatDateWithDots = (input) => {
        const numericInput = input.replace(/[^0-9]/g, '');
    
        if (numericInput.length <= 6) {
            return `${numericInput.slice(0, 2)}.${numericInput.slice(2)}`;
        } else {
            return `${numericInput.slice(0, 2)}.${numericInput.slice(2, 4)}.${numericInput.slice(4, 8)}`;
        }
    };
    
    const validation = () => {
        let valid = true;

        setNameError('');
        setSurnameError('');
        setBirthDateError('');

        if (!name) {
            setNameError('Name cannot be empty.');
            valid = false;
        }

        if (!surname) {
            setSurnameError('Surname cannot be empty.');
            valid = false;
        }

        if (!birthDate) {
            setBirthDateError('Please select a start date.');
            valid = false;
        }
        
        if(valid) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }

        setIsValid(valid);
        return valid;

    };

    const editProfile = async () => {
        if (!validation()) {
            return;
        }

        const updatedProfile = {
            name,
            surname,
            birthDate,
            imageURI,
        };
    
        try {
            await AsyncStorage.setItem('profile', JSON.stringify(updatedProfile));
            setProfile(updatedProfile);
            Alert.alert("Success", "Profile updated successfully!");
    
            setProfilePressed(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    return (
        <View style={styles.container}>

            {
                profilePressed ? (
                    <View style={{width: '100%', height: '100%'}}>

                        <Text style={styles.title}>Edit Profile</Text>

                        <TouchableOpacity style={styles.imageUploadBtn} onPress={handleImageUpload}>
                            {imageURI ? (
                                <Image source={{ uri: imageURI }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: '100%' }} />
                            ) : (
                                <Image source={require('../assets/decor/image.png')} style={{width: 78, height: 78}} />
                            )}
                        </TouchableOpacity>

                        <TextInput
                                value={name}
                                placeholder='Name'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(w) => setName(w)}
                                style={styles.input}
                            />
                            {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

                            <TextInput
                                value={surname}
                                placeholder='Surname'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(w) => setSurname(w)}
                                style={styles.input}
                            />
                            {surnameError ? <Text style={styles.error}>{surnameError}</Text> : null}

                            <TextInput
                                value={birthDate}
                                placeholder='Date of birth YYYY.MM.DD'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(w) => setBirthDate(formatDateWithDots(w))}
                                maxLength={10}
                                style={styles.input}
                            />
                            {birthDateError ? <Text style={styles.error}>{birthDateError}</Text> : null}

                            <TouchableOpacity style={[styles.doneBtn, !isValid && {backgroundColor: '#2b2b2b'}]} onPress={editProfile}>
                                <View style={styles.doneIcon}>
                                    <Icons type={'done'} />
                                </View>
                                <Text style={styles.doneBtnText}>Done</Text>
                            </TouchableOpacity>

                    </View>
                ) : (
                    <View style={{width: '100%', height: '100%'}}>

                        <Text style={styles.title}>Profile</Text>

                        <View style={styles.image}>
                            {imageURI ? (
                                <Image source={{ uri: imageURI }} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: '100%' }} />
                            ) : (
                                <Image source={require('../assets/decor/image.png')} style={{width: 78, height: 78}} />
                            )}
                        </View>

                        <Text style={styles.name}>{name} {surname}</Text>

                        <View style={styles.dateContainer}>
                            <View style={styles.dateIcon}>
                                <Icons type={'calendar'} grey />
                            </View>
                            <Text style={styles.date}>{birthDate}</Text>
                        </View>

                        <ScrollView style={{width: '100%'}}>
                            <View style={styles.btnsContainer}>
                                <View style={styles.btn}>
                                    <Text style={styles.btnText}>Edit profile</Text>
                                    <TouchableOpacity style={styles.btnIcon} onPress={handleProfilePress}>
                                        <Icons type={'profile-arrow'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.btn, {borderBottomWidth: 0}]}>
                                    <Text style={styles.btnText}>Privacy policy</Text>
                                    <TouchableOpacity style={styles.btnIcon}>
                                        <Icons type={'profile-arrow'} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.subTitle}>Statistics</Text>

                            <View style={styles.statisticContainer}>
                                <View style={styles.statisticBox}>
                                    <Text style={styles.statisticText}>Total garden desires</Text>
                                    <Text style={styles.statisticNumber}>{desires}</Text>
                                </View>
                                <View style={styles.statisticBox}>
                                    <Text style={styles.statisticText}>The number of virtual gardens created</Text>
                                    <Text style={styles.statisticNumber}>{projects}</Text>
                                </View>
                            </View>

                        </ScrollView>

                    </View>
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
        paddingBottom: height * 0.15,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#000'
    },

    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    back: {
        width: 23,
        height: 33,
        position: 'absolute',
        top: height * 0.065,
        left: 20
    },

    image: {
        width: 173,
        height: 173,
        borderRadius: '100%',
        resizeMode: 'cover',
        marginBottom: 10,
        alignSelf: 'center'
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 9,
        lineHeight: 22,
        textAlign: 'center'
    },

    dateContainer: {
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexDirection: 'row', 
        marginBottom: 24
    },

    dateIcon: {
        width: 20,
        height: 20,
        marginRight: 11
    },

    date: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '700'
    },

    btnsContainer: {
        width: '100%',
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        marginBottom: 32
    },

    btn: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 17.5,
        paddingHorizontal: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    btnText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        lineHeight: 17
    },

    btnIcon: {
        width: 17,
        height: 22,
        padding: 5,
        marginRight: -5
    },

    subTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '900',
        marginBottom: 10,
        lineHeight: 21.94
    },

    statisticContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    statisticBox: {
        width: '49%',
        height: 128,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 21,
        paddingHorizontal: 15,
    },

    statisticText: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '500',
        marginBottom: 13,
        lineHeight: 14.63,
        textAlign: 'center'
    },

    statisticNumber: {
        fontSize: 35,
        color: '#fff',
        fontWeight: '800',
        lineHeight: 42.67
    },

    input: {
        width: '100%',
        paddingVertical: 17,
        paddingHorizontal: 10,
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 10,
        textAlignVertical: 'top'
    },

    doneBtn: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    doneIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    doneBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    imageUploadBtn: {
        width: 173,
        height: 173,
        borderRadius: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        backgroundColor: '#2b2b2b',
        alignSelf: 'center'
    },

    error: {
        color: '#ff0004',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    },

});

export default Profile;