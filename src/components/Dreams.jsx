import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput, ScrollView, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars';
import Icons from './Icons';

const { height, width } = Dimensions.get('screen');

const Dreams = () => {
    const navigation = useNavigation(); 
    const [addPressed, setAddPressed] = useState(false);
    const [calendar, setCalendar] = useState(false);
    const [wish, setWish] = useState('');
    const [desc, setDesc] = useState('');
    const [date, setDate] = useState(null);
    const [budget, setBudget] = useState(null);

    const [wishError, setWishError] = useState('');
    const [descError, setDescError] = useState('');
    const [dateError, setDateError] = useState('');
    const [budgetError, setBudgetError] = useState('');

    const handleDayPress = (day) => {
        setDate(day.dateString);
        setCalendar(false);
        setDescError('');
    };

    const submitDream = async () => {
        let valid = true;

        setWishError('');
        setDescError('');
        setDateError('');
        setBudgetError('');

        if (!wish) {
            setWishError('Wish cannot be empty.');
            valid = false;
        }
        if (!desc) {
            setDescError('Description cannot be empty.');
            valid = false;
        }
        if (!date) {
            setDateError('Please select a date.');
            valid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            if (selectedDate <= today) {
                setDateError('Please select a future date.');
                valid = false;
            }
        }
        if (!budget) {
            setBudgetError('Budget cannot be empty.');
            valid = false;
        }

        if (!valid) return;

        const newDream = {
            wish,
            desc,
            date,
            budget,
            id: Date.now(),
        };

        try {
            const existingDreams = await AsyncStorage.getItem('dreams');
            const dreamsArray = existingDreams ? JSON.parse(existingDreams) : [];
            dreamsArray.push(newDream);

            await AsyncStorage.setItem('dreams', JSON.stringify(dreamsArray));
            Alert.alert("Success", "Dream added successfully!");

            setWish('');
            setDesc('');
            setDate(null);
            setBudget('');
            setAddPressed(false);
        } catch (error) {
            console.error("Error saving dream:", error);
            Alert.alert("Error", "Failed to save dream. Please try again.");
        }
    };

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.back} onPress={() => navigation.goBack('')}>
                <Icons type={'back'} />
            </TouchableOpacity>

            <Text style={styles.title}>Garden Dreams</Text>

            {
                addPressed ? (
                    <View style={{width: '100%'}}>
                        <ScrollView style={{width: '100%'}}>

                            <TextInput
                                value={wish}
                                placeholder='Your wish'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(w) => setWish(w)}
                                style={styles.input}
                            />
                            {wishError ? <Text style={styles.error}>{wishError}</Text> : null}

                            <TextInput
                                value={desc}
                                placeholder='Description'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(d) => setDesc(d)}
                                multiline={true}
                                style={[styles.input, {height: 100}]}
                            />
                            {descError ? <Text style={styles.error}>{descError}</Text> : null}

                            <View style={{width: '100%'}}>
                                <TextInput
                                    value={date}
                                    placeholder='Date'
                                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                    style={[styles.input, {paddingLeft: 44}]}
                                    editable={false}
                                />
                                <TouchableOpacity style={styles.calendarIcon} onPress={() => setCalendar(true)}>
                                    <Icons type={'calendar'} />
                                </TouchableOpacity>
                            </View>
                            {dateError ? <Text style={styles.error}>{dateError}</Text> : null}

                            {
                                calendar && (
                                    <Calendar
                                        style={{ width: width * 0.89, borderRadius: 12, marginBottom: 10 }}
                                        onDayPress={handleDayPress}
                                        markedDates={{
                                            [date]: { selected: true, selectedColor: '#ff0004' },
                                        }}
                                        theme={{
                                            selectedDayBackgroundColor: '#ff0004',
                                            todayTextColor: '#ff0004',
                                            arrowColor: '#ff0004',
                                            textDayFontWeight: '500',
                                            textMonthFontWeight: 'bold',
                                            textDayHeaderFontWeight: '500',
                                        }}
                                    />
                                )
                            }
                            <TextInput
                                value={budget}
                                placeholder='Planned budget'
                                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                                onChangeText={(b) => setBudget(b)}
                                style={styles.input}
                            />
                            {budgetError ? <Text style={styles.error}>{budgetError}</Text> : null}

                            <View style={{height: 200}} />
                        </ScrollView>
                    </View>
                ) : (
                    <View style={styles.noContainer}>
                        <Image style={styles.image} source={require('../assets/decor/dreams.png')} />
                        <Text style={styles.noTitle}>Nothing added yet</Text>
                        <Text style={styles.noText}>Click on the button below to add a dream garden</Text>
                    </View>    
                )
            }

            <TouchableOpacity style={styles.addBtn} onPress={() => (addPressed ? submitDream() : setAddPressed(true))}>
                <View style={styles.addIcon}>
                    <Icons type={'add'} />
                </View>
                <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>

        </View>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        paddingTop: height * 0.07,
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

    noContainer: {
        width: '100%',
        paddingVertical: 26,
        paddingHorizontal: 45,
        alignItems: 'center',
        backgroundColor: '#2b2b2b',
        borderRadius: 12,
        marginTop: height * 0.03
    },

    image: {
        width: 112,
        height: 174,
        marginBottom: height * 0.035
    },

    noTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
        marginBottom: height * 0.03
    },

    noText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
        textAlign: 'center',
        opacity: 0.5
    },

    addBtn: {
        position: 'absolute',
        bottom: height * 0.05,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#ff0004',
        padding: 16
    },

    addIcon: {
        width: 24,
        height: 24,
        marginRight: 5
    },

    addBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff'
    },

    calendarIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        top: 14,
        left: 10
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

    error: {
        color: '#ff0004',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 10,
    }

});

export default Dreams;