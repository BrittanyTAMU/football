import './style.css'

import { Client, Databases, ID, Storage, Account } from "appwrite";


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b0c914000506f200ee')// // Replace with your project ID
 

const databases = new Databases(client);//from AW Docs
const storage = new Storage(client);//from AW Docs
const account = new Account(client);//from AW Docs




// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      // Log in the user
      const response = await account.createEmailPasswordSession(email, password);
      document.getElementById('message').textContent = 'Login successful!';
      console.log('Login response:', response);
      window.location.href = 'football.html';
    } catch (error) {
      document.getElementById('message').textContent = 'Login failed. Please check your credentials.';
      console.error('Error:', error);
    }
  });