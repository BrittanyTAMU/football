import './style.css'

import { Client, Databases, ID, Storage, Account } from "appwrite";


const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67b0c914000506f200ee')// // Replace with your project ID
    

const databases = new Databases(client);//from AW Docs
const storage = new Storage(client);//from AW Docs
const account = new Account(client);//from AW Docs



// Handle signup form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const name = document.getElementById('name').value;
  
    try {
      // Create a new user
      const response = await account.create('unique()', email, password, name);
      document.getElementById('signupMessage').textContent = 'Signup successful!';
      console.log('Signup response:', response);
      window.location.href = 'index.html';
    } catch (error) {
      document.getElementById('signupMessage').textContent = 'Signup failed. Please try again.';
      console.error('Error:', error);
    }
  });
  