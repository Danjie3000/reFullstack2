<script>
  import { Router, Route } from 'svelte-routing';

  import Nav from './components/Nav.svelte';
  import Register from './pages/Register.svelte';
  import LandingPageLogin from './pages/LandingPageLogin.svelte';
  import Home from './pages/Home.svelte';
  import Chat from './pages/Chat.svelte';
  import Todo from './pages/Todo.svelte';
</script>

<Nav />

<Router>
  <Route path='/' component='{LandingPageLogin}' />
  <Route path='/home' component='{Home}' />
  <Route path='/register' component='{Register}' />
  <Route path='/chat' component='{Chat}' />
  <Route path='/api/todo' component='{Todo}' />
</Router>

