const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    console.log(username);
    console.log(password);

    const response = await fetch('/login', {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password}),
    });

    const data = await response.json();
    console.log(data.data);
    
    if (data.status) {
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("fullname", data.data.fullname);
        localStorage.setItem("role", data.data.role);
        console.log(localStorage.getItem("username"));

        if (data.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/employee'
        }
        
    } else {
        console.log(data);
        document.querySelector('.message').innerHTML = data.message;
        $('.alert').show();

    }
})