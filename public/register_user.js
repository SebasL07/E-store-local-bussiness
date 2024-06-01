document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Se obtienen los valores del formulario de registro
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Se realiza una solicitud POST a '/api/users' para registrar un nuevo usuario
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,

        })
    });

    const user = await response.json();
    console.log(user);

    // Se redirige al usuario a la página de inicio
    window.location.href = '/';

});