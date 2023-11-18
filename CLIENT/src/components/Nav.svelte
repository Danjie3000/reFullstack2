<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const loggedIn = writable(false);

  let localDateTime = '';

  // Log out handler function.
  async function logout() {
    localStorage.removeItem('token'); // Clear the token from local storage.
    loggedIn.set(false); // Update the login status to false.
    window.location.href = '/';
  }

  onMount(() => {
    const token = localStorage.getItem('token');
    loggedIn.set(!!token); // Updates the login status based on the presence of a valid token.

    const updateLocalDateTime = () => {
      const now = new Date();
      localDateTime = now.toLocaleString();
    };

    updateLocalDateTime();
    const interval = setInterval(updateLocalDateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<nav class='navbar'>
  <div class='container'>
    <ul class='nav-links'>
      <li class='local-date-time'>{localDateTime}</li> <!-- Display local date and time -->
      {#if $loggedIn} <!-- Show the logged-in navigation links -->
        <a href='/home' class='cta-btn'>| Hjem |</a>
        <a href='/register' class='cta-btn'>| Registrer |</a>
        <a href='/api/todo' class='cta-btn'>| Todo |</a>
        <a on:click='{logout}' class='cta-btn'>| Log ud |</a>
      {:else} <!-- Show the not logged-in navigation links -->
        <a href='/' class='cta-btn'>| Log ind |</a>
        <a href='/chat' class='cta-btn'>| Live Chat |</a>
      {/if}
      
    </ul>
  </div>
</nav>

<style>
  .navbar {
    background-color: #333;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .nav-links li {
    display: inline-block;
    margin-right: 20px;
  }

  .nav-links a {
    color: firebrick;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s;
    line-height: 1;
    margin-right: 20px;
    display: inline-block;
    width: 100px;
  }

  .local-date-time {
    line-height: 1;
    width: 100px;
  }

  .nav-links a:hover {
    color: tomato;
    font-size: 110%;
  }
</style>
