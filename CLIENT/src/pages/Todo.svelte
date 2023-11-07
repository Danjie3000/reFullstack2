<script>
    import { BASE_URL } from "../store/globalStore.js";
    import { onMount } from "svelte";

    let todos = [];
    let newTodoTitle = "";
    let username = "";
    let editingTodoId = null;

    onMount(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            const [, payloadBase64] = token.split(".");
            const payload = JSON.parse(atob(payloadBase64));
            username = payload.username;
            await fetchTodos();
        } else {
            window.location.href = '/';
        }
    });

    async function fetchTodos() {
        try {
            const response = await fetch(`${$BASE_URL}/gettodos`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.ok) {
                todos = await response.json();
            } else {
                console.error("Failed to fetch todos.");
            }
        } catch (error) {
            console.error("Error fetching todos: ", error.message);
        };
    };

    async function addTodo() {
        try {
            const response = await fetch(`${$BASE_URL}/todo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: newTodoTitle }),
            });
            if (response.ok) {
                await fetchTodos();
                newTodoTitle = "";
            } else {
                console.error("Failed to add todo.");
            }
        } catch (error) {
            console.error("Error adding todo: ", error.message);
        };
    };

    async function toggleComplete(id, completed) {
        try {
            const response = await fetch(`${$BASE_URL}/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ completed })
            });
            if (response.ok) {
                await fetchTodos();
            } else {
                console.error("Failed to toggle todo completion.");
            }
        } catch (error) {
            console.error("Error toggling todo completion: ", error.message);
        };
    };

    async function toggleEditing(todo) {
        editingTodoId = todo.id;
        if (todo.editing) {
            todo.newTitle = todo.title;
        };
    };

    async function saveUpdate(todo, id) {
        try {
            const response = await fetch(`${$BASE_URL}/todo/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ title: todo.newTitle }),
            });

            if (response.ok) {
                todo.title = todo.newTitle;
                todo.editing = false;
                editingTodoId = null;
            } else {
                console.error("Failed to update todo.");
            }
        } catch (error) {
            console.error("Error updating todo: ", error.message);
        };
    };

    async function deleteTodo(id) {
        try {
            const response = await fetch(`${$BASE_URL}/todo/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                await fetchTodos();
            } else {
                console.error("Failed to delete todo.");
            }
        } catch (error) {
            console.error("Error deleting todo: ", error.message);
        };
    };

    async function cancelUpdate(todo) {
        todo.editing = false;
        editingTodoId = null;
    };

    function printList() {
    window.print()
  };

</script>

<h1>Todos for {username}</h1>

<form on:submit|preventDefault={addTodo}>
    <input type="text" bind:value={newTodoTitle} placeholder="Tilføj en ny ToDo her."/>
    <button type="submit">Tilføj</button>
</form>

<ul>
    {#each todos as todo}
        <li class="todo-item">
            <div class="todo-title" class:completed={todo.completed}>
                {#if editingTodoId === todo.id}
                    <input type="text" bind:value={todo.newTitle} />
                    <div class="update-buttons">
                        <button class="save-button" on:click={() => saveUpdate(todo, todo.id)}>Gem</button>
                        <button class="cancel-button" on:click={() => cancelUpdate(todo)}>Afbryd</button>
                    </div>
                {:else}
                    {todo.title}
                {/if}
            </div>
            <div class="todo-buttons">
                <button
                    class="complete-button"
                    on:click={() => toggleComplete(todo.id, !todo.completed)}>
                    {#if todo.completed}
                        Fuldført
                    {:else}
                        Ikke Fuldført
                    {/if}
                </button>
                <button class="update-button" on:click={() => {toggleEditing(todo)}}>Opdater</button>
                <button class="delete-button" on:click={() => deleteTodo(todo.id)}>- Slet -</button>
                {#if editingTodoId === todo.id && todo.editing}
                    <button class="save-button" on:click={() => {saveUpdate(todo, todo.id); 
                    editingTodoId = null;}}>Gem</button
                    >
                {/if}
            </div>
        </li>
    {/each}
</ul>

<button on:click={printList}>Print ToDo siden</button>

<style>
    form {
        margin-bottom: 20px;
    }
    button {
        margin-left: 10px;
    }

    .todo-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .todo-title {
        flex: 1;
        margin-right: 10px;
    }

    .todo-buttons {
        display: flex;
        gap: 10px;
    }

    .update-box {
        display: flex;
        gap: 10px;
    }

    .complete-button {
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        font-size: 12px;
        background-color: darkcyan;
        color: white;
        border-radius: 5px;
    }

    .update-button,
    .delete-button {
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        font-size: 12px;
        background-color: darkgreen;
        color: white;
        border-radius: 5px;
    }

    .delete-button {
        background-color: tomato;
    }
</style>