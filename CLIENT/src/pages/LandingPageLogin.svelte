<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { BASE_URL } from '../store/globalStore.js';

  const loggedIn = writable(false);

  // Function to handle login
  async function login() {
    const response = await fetch($BASE_URL + '/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await response.json();

    localStorage.setItem('token', data.token); // Store the token in localStorage.

    // Redirect to home page after successful login.
    if (response.ok) {
      loggedIn.set(true); // Update the login status to true.
      window.location.href = '/home';
    } else (
      alert("Login mislykkedes! Email eller Password er forkert.")
    );
  };

  let email = '';
  let password = '';

  onMount(() => {
    const token = localStorage.getItem('token'); // Gets the token from localStorage.
    loggedIn.set(!!token); // Update the login status based on the presence of the token.
  });
</script>

  <!-- Login form -->
  <h1>Log venligst ind.</h1>
  <form on:submit|preventDefault='{login}'>
    <label>
      Email:
      <input type='email' bind:value='{email}' />
    </label>
  
    <label>
      Password:
      <input type='password' bind:value='{password}' />
    </label>
  
    <button type='submit'>Log ind</button>
  </form>