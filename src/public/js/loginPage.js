const loginForm = document.querySelector('.loginForm');
loginForm.addEventListener('submit', async e => {
    e.preventDefault();


    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    console.log(username);
    console.log(password);

    const response = await fetch('/login', {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    });

    const data = await response.json();
    
    if (data.status) {
        localStorage.setItem("user", data.data);
        console.log(data.data);

        if (data.role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/employee'
        }
        
    } else {
        console.log(data);
        document.querySelector('.message').innerHTML = data.message;
    }
})