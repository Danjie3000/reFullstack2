<script>
  import Nav from '../components/Nav.svelte';
  import { onMount } from 'svelte';

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
</script>
  
<Nav></Nav>

<h1>Velkommen {username}!</h1>