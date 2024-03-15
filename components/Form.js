import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { addStudent, deleteStudent, getAllStudents, updateStudent} from '../Redux/Api/Api';
import { setData, setSelectedStudentId } from '../Redux/Action/Action';

const Form = ({ data, setData, selectedStudentId, setSelectedStudentId }) => {
    const [name, setName] = useState('');
    const [updatebtn, setupdatebtn] = useState(false)
    const handleNameChange = (text) => {
        setName(text);
    };

    const handleSubmit = () => {
        console.log('i am clicked')
        if (name === "") {
            Alert.alert("name should not be empty")
        } else {
            addStudent({ name });
            getUser();
            setName("")
        }
    };

    const handleCancel = () => {
        console.log('Cancel button clicked');
        setName('');
        setupdatebtn(false)
        console.log('Setting selected student id to null');
        setSelectedStudentId(null)
    };

    const handleEdit = (id) => {
        setupdatebtn(true)
        const selectedStudent = data.find((student) => student.id === id);
        setSelectedStudentId(selectedStudent.id);
        setName(selectedStudent.name)
    }

    const hadleupdate = async () => {
        if (name === "") {
            Alert.alert("name should not be empty")
        }
        try {
            await updateStudent(selectedStudentId, { name });
            getUser();
            setSelectedStudentId(null);
            setupdatebtn(false)
            setName('');
        } catch (error) {
            console.error('Error updating student:', error);
        }
    }
    const handleDelete = async (id) => {
        console.log('deleted button clicked from the test case')
        try {
            await deleteStudent(id);
            console.log('student with particular id is deleted')
            getUser();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        try {
            const students = await getAllStudents();
            setData(students);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    return (
        <View>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={name}
                    onChangeText={handleNameChange}
                />
                <View style={styles.buttonContainer} >
                    {updatebtn ?
                        <Button testID="update-button"  title="Update" color={'green'} onPress={hadleupdate} />
                        :
                        <Button title="Submit" onPress={handleSubmit} />
                    }
                   <Button title="Cancel" onPress={handleCancel} color="red" /> 
                </View>
            </View>
            <View style={styles.container1}>
                {data && data.map((infor) => (
                    <View style={styles.row} key={infor.id}>
                        <View style={{ flex: 1, justifyContent: "center", borderRightColor: "black", borderRightWidth: 1 }}>
                            <Text style={styles.name}>{infor.name}</Text>
                            <Text style={styles.name}>{infor.id}</Text>
                        </View>
                        <View style={{ marginHorizontal: 8, paddingVertical: 8 }} accessibilityRole='button' accessible={true}>
                            <Button title="Edit" onPress={() => handleEdit(infor.id)}  />
                        </View>
                        <View style={{ marginHorizontal: 8, paddingVertical: 8 }}>
                            <Button title="Delete" onPress={() => handleDelete(infor.id)} color="red"/>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    container1: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1
    },
    name: {
        flex: 1,
        fontSize: 16,
        marginVertical: 12,
        marginHorizontal: 2

    },
});

const mapStateToProps = (state) => ({
    data: state.data,
    selectedStudentId: state.selectedStudentId,
});

const mapDispatchToProps = {
    setData,
    setSelectedStudentId,
};


export default connect(mapStateToProps, mapDispatchToProps)(Form);
