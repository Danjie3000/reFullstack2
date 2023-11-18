<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';
  import { BASE_URL } from '../store/globalStore.js';

  let messageContainer;
  let messageInput;

  const socket = io($BASE_URL);
  let name = prompt("Hvad er dit navn?") || 'Anonym'; // If no name is added, user can be anonymous.

  onMount(() => {
    socket.emit('new-user', name);

    socket.on('chat-message', data => {
      appendMessage(`${data.name}: ${data.message}`);
    });

    socket.on('user-connected', name => {
      appendMessage(`${name} connected`);
    });

    socket.on('user-disconnected', name => {
      appendMessage(`${name} disconnected`);
    });
  });

  function sendMessage(event) {
    event.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
  }

  function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.appendChild(messageElement);
  }
</script>

<div id='message-container' bind:this={messageContainer}></div>
<form on:submit={sendMessage} id='send-container'>
  <label>
    Skriv din besked her: <input type='text' bind:this={messageInput} id='message-input'>
  </label>
  <button type='submit' id='send-button'>Send</button>
</form>