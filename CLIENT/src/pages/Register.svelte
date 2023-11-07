<script>
  import { BASE_URL } from '../store/globalStore.js';
  import { onMount } from "svelte";

  let name = '';
  let email = '';
  let password = '';

  let username = '';

  onMount(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64)); // Decode and parse the username. TODO: Find another way than atob.
      username = payload.username;
    } else {
          window.location.href = '/';
      }
  });
  
  async function register() {
    const response = await fetch($BASE_URL + '/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Gets token value.
        },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });
  
    const data = await response.json();
    if (response.ok) {
      const jwtToken = data.token;
      window.location.href = '/home';
    } else {
      console.error("Registration failed: ", data.error); // Handles registration error.
  }
  };
</script>
  <h1>Registrer ny bruger.</h1>
  
  <form on:submit|preventDefault='{register}'>
    <label>
      Navn:<input type='text' bind:value='{name}' />
    </label>
  
    <label>
      Email:<input type='email' bind:value='{email}' />
    </label>
  
    <label>
      Password:<input type='password' bind:value='{password}' />
    </label>
    <button type='submit'>Tilmeld</button>
  </form>