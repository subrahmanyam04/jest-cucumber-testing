import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import Form from '../../../components/Form';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Assuming you're using Redux
import { loadFeature, defineFeature } from 'jest-cucumber';

import Reducer from "../../../Redux/Reducer/Reducer"
import { legacy_createStore as createStore } from 'redux';
import { addStudent, deleteStudent, getAllStudents, updateStudent } from '../../../Redux/Api/Api';
import { Alert } from 'react-native';
import { Then } from '@cucumber/cucumber';

const feature = loadFeature('test/features/form.feature');

jest.mock('../../../Redux/Api/Api');
jest.mock('../../../Redux/Api/Api', () => ({
    getAllStudents: jest.fn(),
    addStudent: jest.fn(),
    deleteStudent: jest.fn(),
    updateStudent: jest.fn(),
}));

// Mock Alert.alert
const alertMock = jest.fn();
Alert.alert = alertMock;

defineFeature(feature, (test) => {
    const initialState = {
        data: [],
        selectedStudentId: null,
    };
    const mockStore = configureStore();
    // firts test case : checking the textinput field is working or not
    test('Inputting text into the form', ({ given, when, then }) => {
        let component;
        let store;
        beforeEach(() => {
            store = mockStore(initialState);
        });
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when(/^I input "(.*)" into the text input$/, (text) => {
            const textInput = component.getByPlaceholderText('Enter your name');
            fireEvent.changeText(textInput, text);
        });
        then(/^the text input should display "(.*)"$/, (expectedText) => {
            const textInput = component.getByPlaceholderText('Enter your name');
            expect(textInput.props.value).toBe(expectedText);
        });
    });
    // 2 second test case :  checking that table is updating after the api call or not 
    test('Table updates after API call', async ({ given, when, then }) => {
        let textelement
        const studentsData = [
            { id: 'Nh70CcrFZMMe358Yl9d', name: 'John' },
            { id: 'Xz12AbCdEfGh345Ij6k', name: 'Doe' },
        ];
        let store;
        beforeEach(() => {
            store = createStore(Reducer);
        });
        given('the getAllStudents function is mocked', () => {
            getAllStudents.mockResolvedValue(studentsData);
        });
        when('the form component is rendered', async () => {
            // Mock the API response
            getAllStudents.mockResolvedValue(studentsData);
            const { getByText } = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
            // Wait for the component to re-render after data fetching
            await waitFor(() => {
                studentsData.forEach(({ name }) => {
                    textelement = getByText(name)
                });
            })
        });
        then('the table should contain the fetched data', async () => {
            // Assertion is done in the 'when' step, so no need for further assertion here
            await waitFor(() => {
                studentsData.forEach(() => {
                    // Check if the name exists in the rendered component
                    expect(textelement).toBeTruthy();
                });
            })
        });
    });

    // 3 third test case :  checking that cancel button functionality is working or not
    test('Cancel Button in the form', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            store = mockStore(initialState);
        });
        given('I have opened the form', () => {
            store = mockStore(initialState);
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click the Cancel button', () => {
            const cancelButton = component.getByText('Cancel');
            fireEvent.press(cancelButton);
        });
        then('the name field should be empty', () => {
            const nameInput = component.getByPlaceholderText('Enter your name');
            expect(nameInput.props.value).toBe('');
        });
        then('the selected student ID should be null', () => {
            // You may need to access the Redux store to check the selectedStudentId value
            const { selectedStudentId } = store.getState();
            expect(selectedStudentId).toBeNull();
        });
    });

    // 4 fourth test case :  checking that the delete button functionality is working or not
    test('Delete Button in the form', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            store = mockStore({
                data: [{ id: 1, name: 'John Doe' }], // Mock initial data
                selectedStudentId: null,
            });
        });
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click the Delete button for a student', async () => {
            const deleteButton = component.getByText('Delete');
            fireEvent.press(deleteButton);
            // Wait for the component to re-render after data fetching
        });
        then('the student should be deleted from the list', async () => {
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
            expect(deleteStudent).toHaveBeenCalledWith(1);
            // Assertion is done in the 'when' step, so no need for further assertion here
        });
        then('the get API is called', async () => {
            expect(getAllStudents).toHaveBeenCalled();
        });
    });

    // 5 fifth test case : checking the edit button functionality is working or not
    test('Edit Button in the form', ({ given, when, then }) => {
        let store;
        let component;
        beforeEach(() => {
            store = mockStore({
                data: [{ id: 1, name: 'John Doe' }], // Mock initial data
                selectedStudentId: null,
            });
        });
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click the Edit button for a student', () => {
            const editButton = component.getByText('Edit');
            fireEvent.press(editButton);
        });
        then('the selected student id is set to the redux through action', () => {
            const updatedState = store.getActions();
            expect(updatedState).toContainEqual({ type: 'SET_SELECTED_STUDENT_ID', payload: 1 });
        });
        then('the student name should be displayed in the input field', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            expect(inputField.props.value).toBe('John Doe');
        });
    });

    // 6 sixth test case : checking that submit fuinctionality is working or not
    test('Submitting the form with a valid name', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            store = mockStore(initialState);
        });
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I enter a valid name in the input field', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            fireEvent.changeText(inputField, 'John Doe');
        });
        when('I click submit button the form', () => {
            const submitButton = component.getByText('Submit');
            fireEvent.press(submitButton);
        });
        then('the form should send the name to the database through the addstudent', () => {
            expect(addStudent).toHaveBeenCalledWith({ name: 'John Doe' });
            expect(getAllStudents).toHaveBeenCalled();
        });
        then('After the successfull sending the name the get call should take place', () => {
            expect(getAllStudents).toHaveBeenCalled();
        });
        then('the input field should be cleared', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            expect(inputField.props.value).toBe('');
        });
    });

    // 7 seventh test case : checking while before clicking the submit the input field is empty then it should throw an alert message
    test('Checking alert button while before submitting', ({ given, when, then }) => {
        let store;
        let component
        beforeEach(() => {
            store = mockStore(initialState);
        });

        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('the inputfield is empty', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            fireEvent.changeText(inputField, '');
        });
        then('I click submit button in the form', () => {
            const submitButton = component.getByText('Submit');
            fireEvent.press(submitButton);
        });
        then('should get an alert message', async () => {
            expect(Alert.alert).toHaveBeenCalledTimes(1);
            expect(Alert.alert).toHaveBeenCalledWith('name should not be empty');
        });
    });


    // 8 eight test caase: checking that the update functionality is working or not
    test('Updating the form with a valid name', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            // Mock the store
            store = mockStore({
                data: [{ id: "-Nh70CcrFZMMe358Yl9d", name: 'John Doe' }],
                selectedStudentId: "-Nh70CcrFZMMe358Yl9d",
            });
        });
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click on the edit Button', () => {
            const EditButton = component.getByText('Edit');
            fireEvent.press(EditButton);
        });
        then('that editbutton holding the particular name should be set in inputfield', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            fireEvent.changeText(inputField, 'John Doe');
            fireEvent.changeText(inputField, 'Updated Name');
        });
        then('I click on the Update button', () => {
            const UpdateButton = component.getByText('Update');
            fireEvent.press(UpdateButton);
        });
        then('that upadted name along with use of the id the Update API is called', async () => {
            // Assert that updateStudent function is called with correct parameters
            expect(updateStudent).toHaveBeenCalledWith("-Nh70CcrFZMMe358Yl9d", { name: 'Updated Name' });
        });
        then('After the successfull Updating the name the get call should take place', () => {
            expect(getAllStudents).toHaveBeenCalled();
        });
        then('the input field should be cleared', () => {
            const inputField = component.getByPlaceholderText('Enter your name');
            expect(inputField.props.value).toBe('');
        });
    });

    // 9 ninth test case :  checking that alert is happen whrn the textfield is empty after clicking the update button 
    test('Checking alert button while before Updating', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            store = mockStore({
                data: [{ id: 1, name: 'John Doe' }], // Mock initial data
                selectedStudentId: 1, // Mock selected student ID
            });
        });
        // Mock Alert.alert
        const alertMock = jest.fn();
        Alert.alert = alertMock;
        given('I have opened the form', () => {
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click on the edit Button', () => {
            const EditButton = component.getByText('Edit');
            fireEvent.press(EditButton);
        })
        then('the inputfield is empty', () => {
            const input = component.getByPlaceholderText('Enter your name');
            fireEvent.changeText(input, '');
        });
        then('I click upadte button in the form', () => {
            const updateButton = component.getByText('Update');
            fireEvent.press(updateButton);
        });
        then('should get an alert message', async () => {
            expect(alertMock).toHaveBeenCalled();
            expect(alertMock).toHaveBeenCalledWith('name should not be empty');
        });
    });


// 10 tenth test case : checking the get api is catching error
    test('Catching and logging error if getAllStudents API call fails', ({ given, when, then }) => {
        let store;
        let consoleErrorSpy;

        given('the getAllStudents API call fails', () => {
            getAllStudents.mockRejectedValueOnce(new Error('API call failed'));
        });

        when('the Form component is rendered', async () => {
            store = mockStore(initialState);
            consoleErrorSpy = jest.spyOn(console, 'error');

            render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );

            await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        });

        then('the error should be caught and logged', () => {
            expect(getAllStudents).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('An error occurred:', new Error('API call failed'));
        });
    });

// 11 tenth test case : checking the get api is catching error
    test('Deleting a student fails due to API call failure', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            // Mock the store
            store = mockStore({
                data: [{ id: "-Nh70CcrFZMMe358Yl9d", name: 'John Doe' }],
                selectedStudentId: "-Nh70CcrFZMMe358Yl9d",
            });
        });
        given('I have opened the form', async () => {
            // Render the component with mocked Redux store
            component = render(
                <Provider store={store}>
                    <Form />
                </Provider>
            );
        });
        when('I click the Delete button', async () => {
            // Mock the deleteStudent function to throw an error
            deleteStudent.mockRejectedValueOnce(new Error('API call failed'));
            // Click the delete button
            const deleteButton = component.getByText('Delete');
            fireEvent.press(deleteButton);
        });
        then('an error should be caught and logged', async () => {
            // Wait for a short delay to allow the error to be caught
            await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
            // Assert that deleteStudent function is called with correct parameters
            expect(deleteStudent).toHaveBeenCalledWith(1); // Assuming the student ID is 1
            // Spy on console.error method
            const consoleErrorSpy = jest.spyOn(console, 'error');
            // Assert that console.error method is called with the correct error message
            expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting student:', new Error('API call failed'));
        });
    });

    test('Updating a student fails due to API call failure', ({ given, when, then }) => {
        let store;
        beforeEach(() => {
            // Mock the store
            store = mockStore({
                data: [{ id: "-Nh70CcrFZMMe358Yl9d", name: 'John Doe' }],
                selectedStudentId: "-Nh70CcrFZMMe358Yl9d",
            });
        }); 
        given('I have opened the form', () => {
        component = render(
          <Provider store={store}>
            <Form />
          </Provider>
        );
      });
      
      when('I click the Edit button', () => {
        // Trigger the edit action in the component
        const editButton = component.getByText('Edit');
        fireEvent.press(editButton);
      });
      
      when('I enter name in the input field', () => {
        // Enter the provided name in the input field
        const inputField = component.getByPlaceholderText('Enter your name');
        fireEvent.changeText(inputField, "John Doe");
      });
      
      when('I click the Update button', () => {
        updateStudent.mockRejectedValueOnce(new Error('API call failed'));
        // Trigger the update action in the component
        const updateButton = component.getByText('Update');
        fireEvent.press(updateButton);
      });
      
      then('an error should be caught and logged', async () => {
        // Wait for a short delay to allow the error to be caught
        await waitFor(() => new Promise(resolve => setTimeout(resolve, 100)));
        // Assert that updateStudent function is called with correct parameters
        // expect(updateStudent).toHaveBeenCalledWith(1, { name: 'Updated Name' });
        const consoleErrorSpy = jest.spyOn(console, 'error'); // Assuming the student ID is 1
        // Assert that console.error method is called with the correct error message
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating student:', new Error('API call failed'));
      });
    });

});
