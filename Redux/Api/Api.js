import axios from 'axios';
import { baseURL } from './Commonapi';

export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${baseURL}/user.json`);
    const jsonData = response.data;
    if (jsonData === null) {
      return [];
    } else {
      return Object.keys(jsonData).map((key) => ({ id: key, ...jsonData[key] }));
    }
  } catch (error) {
    console.log('error occured')
  }
};

export const addStudent = async (formData) => {
  try {
    await axios.post(`${baseURL}/user.json`, formData);
  } catch (error) {
    console.log('error occured')
  }
};

export const updateStudent = async (id, formData) => {
  try {
    await axios.put(`${baseURL}/user/${id}.json`, formData);
  } catch (error) {
    console.log('error occured', error.message)
  }
};

export const deleteStudent = async (id) => {
  try {
    await axios.delete(`${baseURL}/user/${id}.json`);
  } catch (error) {
    console.log('error occured')
  }
};