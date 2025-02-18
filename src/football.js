import './style.css'

import { Client, Databases, ID, Storage, Account } from "appwrite";

import emailjs from 'emailjs-com';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)// // Replace with your project ID
    
// Initialize EmailJS with your User ID
emailjs.init(import.meta.env.VITE_EMAILJS_ID);

const databases = new Databases(client);//from AW Docs
const storage = new Storage(client);//from AW Docs
const account = new Account(client);//from AW Docs


//click event to submit the form
const form = document.getElementById('yearForm')
const imageContainer = document.getElementById('imageContainer')
const videoContainer = document.getElementById('videoContainer')
const textImageFormContainer = document.getElementById('textImageFormContainer')
const textImageForm = document.getElementById('textImageForm')
const emailFormContainer  = document.getElementById('emailFormContainer')
const emailForm = document.getElementById('emailForm')


//track click on submit button count
let clickCount = 0;

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent the form from submitting and refreshing the page
  //once clicked submit, play the addImagestodom function and wait
  clickCount++;

  if (clickCount <= 4) {
    await addImagesToDom();
    alert('Submit Button is broken, select a year and click it 5 times, it should work then...sorry')
  }else if (clickCount === 5) {
    await showVideo()
  }else if (clickCount >= 6 && clickCount <= 9) {
    alert('Submit Button is broken, select a year and click it 5 times, it should work then...sorry')
    await addImagesToDom();
      hideVideo()
  } else if (clickCount === 10) {
    hideImage();
    hideVideo()
    hideYearForm()
    alert("OKKKK ADD THE TEAM YOU WANT ME TO SHOW NEXT")
    showTextImageForm()
  } else if (clickCount === 11) {
    // alert('You hate the Eagles that much huh? Go on..keep picking a year')
    hideTextImageForm()
    showYearForm()
  } else if (clickCount >= 12 && clickCount <= 14) {
    await addImagesToDom()
    alert("You hate the Eagles that much huh? Go on..keep picking a year. Give me 5 more finger curls on that keep clicking button and I'll show another team")
  }else if (clickCount === 15) {
    showEmailForm()
  }else if (clickCount === 16) {
    alert("You know God didnt hate Satan this much...what's going on at home?")
    clickCount = 0 //to reset click count
    hideEmailForm()
    showYearForm()
  }
});

// Event listener for the text and image form
textImageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('textInput').value;
  const imageFile = document.getElementById('imageInput').files[0];
   // Call the submit function
   await submitTextAndImage(text);

  if (text) {
    await submitTextAndImage(text);
    alert('Thanks for adding a name to the loser list!');
    hideTextImageForm(); // Hide the text and image form
    showYearForm(); // Show the year form again
    textImageForm.reset(); // Reset the form fields
  } else {
    alert('Please fill out all fields.');
  }
});

// Event listener for the email form
emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;

  if (email) {
    await subscribeEmail(email);
    alert('Subscribed successfully to the loser list!');
  } else {
    alert('Please enter a valid email.');
  }
});

async function addImagesToDom(){
    const fileId = import.meta.env.VITE_FILEID; // Replace with the actual file ID
    const imageUrl = await getImageFromAW(fileId)
    console.log('Image URL:' , imageUrl)// Debugging: Check the URL

        if (imageUrl){
          const img = document.createElement('img')//create and element tag of img
          img.src = imageUrl //for the image source use the response from the AW storage function
          img.alt = 'Image of the GOATS...'//caption of the img
          imageContainer.innerHTML =''//clear previous content of img 
          imageContainer.appendChild(img)//place the new response from AW storage fuction to the img tag
          } else{
           imageContainer.textContent = 'Failed to load image.'
          }
          console.log('Bucket ID:', import.meta.env.VITE_BUCKET_ID);
console.log('File ID:', import.meta.env.VITE_FILEID);
      }
     

// Function to show a video
async function showVideo() {
  const videoId  = import.meta.env.VITE_VIDEO_ID; // Replace with the actual file ID
  const videoUrl = await getImageFromAW(videoId);

  if (videoUrl) {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.autoplay = videoUrl
    video.controls = true; // Add playback controls
    video.width = 640; // Set video width
    video.height = 360; // Set video height
    alert("YOU THOUGHT LOL! Keep clicking though, maybe another team will popup")
    
    videoContainer.innerHTML = ''; // Clear previous content
    videoContainer.appendChild(video);
    imageContainer.innerHTML = ''; // Hide image
  } else {
    videoContainer.textContent = 'Failed to load video.';
  }
}

function hideVideo(){
  videoContainer.innerHTML = ''// Clear video content
}

function hideImage(){
  imageContainer.innerHTML = ''// Clear image content
}
// Function to hide the year form
function hideYearForm() {
  form.style.display = 'none'; // Hide the year form
}

// Function to show the year form
function showYearForm() {
  form.style.display = 'block'; // Show the year form
}

// Function to show the text and image form
function showTextImageForm() {
  textImageFormContainer.style.display = 'block';
}

function hideTextImageForm(){
  textImageFormContainer.style.display = 'none'; // Hide the text form
}


// Function to show the email form
function showEmailForm() {
  emailFormContainer.style.display = 'block';
  // textImageFormContainer.style.display = 'none'; // Hide the previous form
}

function hideEmailForm(){
  emailFormContainer.style.display = 'none'
}

// Function to submit text and image to Appwrite
async function submitTextAndImage(text) {
  try {
    // Upload the image to Appwrite Storage
    const bucketId = import.meta.env.VITE_BUCKET_ID; // Replace with your bucket ID
    // const imageUrl = null;

    // if(imageFile){
    //   const imageResponse = await storage.createFile(bucketId, imageFile);
    //  imageUrl = storage.getFileView(bucketId, imageResponse.$id);

    // }
    
    // Save the text and image URL to Appwrite Database
    await databases.createDocument(
      import.meta.env.VITE_DATABASEID, // Replace with your database ID
      import.meta.env.VITE_COLLECTION_ID_ONE, // Replace with your collection ID
      ID.unique(), // Unique document ID
      {text}
    );
  } catch (error) {
    console.error('Error submitting text and image:', error);
  }
}

// Function to subscribe email using Appwrite
async function subscribeEmail(email) {
  try {
    // Save the email to Appwrite Database
    await databases.createDocument(
      import.meta.env.VITE_DATABASEID, // Replace with your database ID
      import.meta.env.VITE_COLLECTION_ID_TWO, // Replace with your collection ID
      ID.unique(), // Unique document ID
      { email }
    );
    console.log('Email saved to database:', email); // Log success
      // Send a confirmation email using EmailJS
    const formData = {
      to_email: email, // Recipient email
      from_name: 'EAGLES', // Sender name
      subject: 'New message from the SuperBowl Champs', // Email subject
      message: 'Hello Hater, Thank you for signing up to the loser fan club, take your shoes off and get comfortable. Its going to be a long road to SuperBowl 2026. Until then, Ive taken the liberty on sharing your info; good luck with that extended warranty. Best wishes', // Email content
    };

  await emailjs.send(import.meta.env.VITE_EMAILJS__SERVICE_ID, import.meta.env.VITE_EMAILJS__TEMPLATE_ID, formData);
  console.log('Confirmation email sent:', email);
  alert("You've reached the final stop to LoserVille. Goodluck telling them people you don't want an extended warranty, HATER");
} catch (error) {
  console.error('Error:', error);
  alert('Failed to subscribe. Please try again.');
}
}


//get image from AW by using the fileID
  function getImageFromAW(fileId){
    try{
      const bucketId = import.meta.env.VITE_BUCKET_ID; // Replace with your bucket ID
      
      const url= storage.getFileDownload(bucketId, fileId);
      return url
    }catch (error) {
    console.error('Error fetching image URL:', error);
    return null;
  }
}



  //   //from the documents in the appwrite.io
  // let response = await databases.listDocuments(
  //     "67b0e0830016eaae3f68",
  //     "67b0e091002f6408d3a9",
  // );
  // // console.log(response.documents[0])
  // response.documents.forEach((job)=>{
  //   //for every document, create a loop, create a li and add content and then append it to the ul
  //   const li = document.createElement('li')
  //   li.textContent = `${job['company-name']} ${job['date-added']} ${job['role']} ${job['location']} ${job['position-type']} ${job['source']} coffee chat? ${job['chat']}`
  

// function addJob(e){
//   e.preventDefault()//default behavior of the form is to refresh, but we dont want that so this will prevent a refresh

//   const job = databases.createDocument(
//     '67b0e0830016eaae3f68',
//     '67b0e091002f6408d3a9',
//     ID.unique(),
//     { "company-name": e.target.companyName.value,//grabbing the companyName from the form
//       "date-added": e.target.dateAdded.value,
//       "role": e.target.role.value,
//       "location": e.target.location.value,
//       "position-type": e.target.positionType.value,
//       "source": e.target.source.value,
//      }
// );
// job.then(function (response) {
//   addJobsToDom()
// }, function (error) {
//   console.log(error);
// });

//   form.reset()
// }

// async function addJobsToDom(){
//   document.querySelector('ul').innerHTML = ""
//   //from the documents in the appwrite.io
// let response = await databases.listDocuments(
//     "67b0e0830016eaae3f68",
//     "67b0e091002f6408d3a9",
// );
// // console.log(response.documents[0])
// response.documents.forEach((job)=>{
//   //for every document, create a loop, create a li and add content and then append it to the ul
//   const li = document.createElement('li')
//   li.textContent = `${job['company-name']} ${job['date-added']} ${job['role']} ${job['location']} ${job['position-type']} ${job['source']} coffee chat? ${job['chat']}`

//   li.id = job.$id //each li for the detele btn will have the id of the job id so its easier to remove when the user deletes the document from collections
//   //create a delete btn
//   const deleteBtn = document.createElement('button')
//   deleteBtn.textContent = '🧨'
//   //take the delete btn on click, run the remove job function
//   deleteBtn.onclick = () => removeJob(job.$id)
//   //add delete button to dom
 

//   //coffee chat btn
//   const coffeeBtn = document.createElement('button')
//   coffeeBtn.textContent = '🍵'
//   //set up click event
//   coffeeBtn.onclick = () => updateChat(job.$id)
//   //add the btn to li
//   li.appendChild(coffeeBtn)
//   li.appendChild(deleteBtn)

//     document.querySelector('ul').appendChild(li)

// })

// async function updateChat(id) {
//   //go to appwrite docs to delete documents from db
//   const result =  databases.updateDocument(
//     '67b0e0830016eaae3f68', // databaseId
//     '67b0e091002f6408d3a9', // collectionId
//     id, // documentId
//     {'chat': true} // data (optional)
//     // permissions (optional)
// );
// result.then(function() {location.reload()})
// }
// async function removeJob(id){
//   //go to appwrite docs to delete documents from db
//   const result = await databases.deleteDocument(
//     '67b0e0830016eaae3f68', // databaseId
//     '67b0e091002f6408d3a9', // collectionId
//     id // documentId
// );
// document.getElementById(id).remove()
// }
// // promise.then(function (response) {
// //     console.log(response);
// // }, function (error) {
// //     console.log(error);
// // });
// }

// addJobsToDom()

// // const promise = databases.createDocument(
// //     '67b0e0830016eaae3f68',
// //     '67b0e091002f6408d3a9',
// //     ID.unique(),
// //     { "company-name": "100Devs",
// //       "date-added": new Date(),
// //       "role": "software engineer",
// //       "location": "Philly",
// //       "position-type": "full time",
// //       "source": "https://100devs.org"
// //      }
// // );

// // promise.then(function (response) {
// //     console.log(response);
// // }, function (error) {
// //     console.log(error);
// // });

