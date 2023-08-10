<script>
  import { Router, Route } from 'svelte-routing';

  let loggedIn = false; // Set the authentication state based on logged in or not.

  import Nav from './components/Nav.svelte';
  import Register from './pages/Register.svelte';
  import LandingPageLogin from './pages/LandingPageLogin.svelte';
  import Home from './pages/Home.svelte';

  import Chat from './pages/Chat.svelte';


  import Todo from './pages/Todo.svelte'; // Not done.
</script>

<Nav />

<Router>
  <Route path='/' component='{LandingPageLogin}' />
  <Route path='/home' component='{Home}' />
  <Route path='/register' component='{Register}' />

  <Route path='/chat' component='{Chat}' />

  <Route path='/todo' component='{Todo}' />
</Router>

