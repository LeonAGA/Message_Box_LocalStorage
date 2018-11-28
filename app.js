// GLOBAL DATA=================================================================

const messageList = document.querySelector('#messageList');
const typeForm = document.querySelector('#typeForm');

// EVENT LISTENERS==================================================================

eventListeners();

function eventListeners(){

  // When A submit has been made.
  typeForm.addEventListener('submit',addMessage);

  // When the mouse is over a message.
  document.body.addEventListener('mouseover',showDeleteButton);

  // Click on the "x" in a message.
  messageList.addEventListener('click', deleteMessage);

  // When all the DOM is charged.
  document.addEventListener('DOMContentLoaded', localStorageReady);
  document.addEventListener('DOMContentLoaded', sumbitStatus(true));
  document.addEventListener('DOMContentLoaded', typing);
}

// FUNCTIONS========================================================================

// Analyze that the message is shorter than 281 characters.
function typing(){

  let character = resetCounter();
  // Reads the text area value.
  let message = document.getElementById('messageBox').value;
  
    if((character.length <= 0 || !(/[^\s]/.test(message))) && character.length <= 280){
     // Disables submit button.
     sumbitStatus(true);
     // Sets invisible the message of more than 280 characters.(In case the user select and delete the whole message in one move).
     document.querySelector('.advertisement').style.display =  "none";
     // returns counter to blue color.(In case the user select and delete the whole message in one move).
     document.querySelector('.character').style.color = '#1EAEDB';
    } else if(character.length >= 281){
       // Disables submit button and changes counter to red.
       sumbitStatus(true); 
       document.querySelector('.character').style.color = 'red';
       // Set visible the message of more than 280 characters.
       document.querySelector('.advertisement').style.display = 'block';
      } else{
         // Enables Submit button and returns counter to blue color.
         sumbitStatus(false); 
         if(character.length >= 250){
         document.querySelector('.character').style.color = 'orange';
         // Sets invisible the message of more than 280 characters.
         document.querySelector('.advertisement').style.display = "none";
         }
         else{
         document.querySelector('.character').style.color = '#1EAEDB';
         // Sets invisible the message of more than 280 characters.
         document.querySelector('.advertisement').style.display = "none";
         }
        }  
  setTimeout(typing,0);      
}

// Add a message when the submit button is pressed.
function addMessage(e){
  e.preventDefault();
 // Reads the text area value and trim the message to prevent extense void messages.
 const message = (document.getElementById('messageBox').value).trim();
  
 // Creates a deleting button.
 const deleteButton = document.createElement('a');
 deleteButton.className = 'delete-message';
 deleteButton.innerText = 'X';

 // Creates a li element and add the message to it. 
 const li = document.createElement('li');
 const br = document.createElement('br');
 li.className = 'message';
 li.innerText = message;
 li.style.listStyleType = "none";

 // Appends the delete button to the li element.
 li.appendChild(deleteButton);

 // Appends the li element to the message list.
 messageList.appendChild(li);
 messageList.appendChild(br);

 // Deletes the message from the text area value.
 document.getElementById('messageBox').value = '';

 // Reset the counter.
 resetCounter();

 // Disables the submit botton because the counter will return to 0 after post.
 sumbitStatus(true); 

 // Calls to the saveMessageLocalStorage sending to it the current message.
 saveMessageLocalStorage(message);

 // Shows the last li in the Scroll of showSection
 document.querySelector('#showSection').scrollTop = document.querySelector('#showSection').scrollHeight;
}

// Shows Delete Button.
function showDeleteButton(e){
 e.preventDefault();
 let token;
 if(e.target.className=='message'){
  if(token === e.target){
   e.target.children[e.target.children.length-1].style.display = 'block';
  } else{   
    token = e.target;
    document.querySelectorAll('.delete-message').forEach(function(message){
    message.style.display = 'none';
    });
    e.target.children[e.target.children.length-1].style.display = 'block';
  }
 } else if((!(e.target.className=='message' || e.target.className =='delete-message')) && messageList.getElementsByClassName('message').length>=1){
    document.querySelectorAll('.delete-message').forEach(function(message){
    message.style.display = 'none';
    });
   }
}

// Deletes the message from the DOM
function deleteMessage(e){
 e.preventDefault();
 let jump, messages, deletedMessage;
 if(e.target.className === 'delete-message') {
  jump = document.querySelectorAll('#messageList > br');  
  messages = document.querySelectorAll('#messageList > li');
  deletedMessage = e.target.parentElement;
  messages.forEach(function(message, index){
   if(deletedMessage === message){
   jump[index].remove();
   }
  });
 e.target.parentElement.remove();
 deleteMessageLocalStorage(e.target.parentElement.innerText);
 }
}

// Resets the counter of characters.
function resetCounter(){
 let message = document.getElementById('messageBox').value;
 document.querySelector('.character').innerText= `${message.length}/280.`;
 return message;
}

// Enables, disables submit button.
function sumbitStatus(status){
document.querySelector("#addButton").disabled = status;
 if (status){
  document.querySelector("#addButton").setAttribute("color", "gris");
 }
 else{
  document.querySelector("#addButton").setAttribute("color", "azul");
 }
}

// Shows the messages contented in the Local Storage
function localStorageReady(){ 
 let messages;
 messages = obtainMessageLocalStorage();
 messages.forEach(function(message){

 // Creates a deleting button.
 const deleteButton = document.createElement('a');
 deleteButton.className = 'delete-message';
 deleteButton.innerText = 'X';

 // Creates a li element and add the message to it. 
 const li = document.createElement('li');
 const br = document.createElement('br');
 li.className = 'message';
 li.innerText = message;
 li.style.listStyleType = "none";

 // Appends the delete button to the li element.
 li.appendChild(deleteButton);

 // Appends the li element to the message list.
 messageList.appendChild(li);
 messageList.appendChild(br);

 });
}

// Save a message to the local Storage
function saveMessageLocalStorage(message){
  let messages;
  messages = obtainMessageLocalStorage();

  // Add the new message to the array.
  messages.push(message);

  // Convert to String the array of JSON to can use it with setItem method.
  localStorage.setItem('messages', JSON.stringify(messages));
}

// Checks if there are elements in the Local Storage, returns an array in JSON.
function obtainMessageLocalStorage(){
  let messages;
  // Checking values of the Local Storage.
  if(localStorage.getItem('messages') === null){
    messages = [];
  }else{
    messages = JSON.parse(localStorage.getItem('messages'));
  }
  return messages;
}

// Deletes Message of local Storage.
function deleteMessageLocalStorage(message){
 let messages, delXMessage;
 // Deletes the X button from the message.
 delXMessage = message.substring(0, message.length - 1);
 messages = obtainMessageLocalStorage();
 messages.forEach(function(message, index){
  if(delXMessage === message){
    messages.splice(index, 1);
  }
 });
 localStorage.setItem('messages', JSON.stringify(messages));
}

