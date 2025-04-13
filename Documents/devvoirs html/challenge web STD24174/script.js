//STD24174
document.getElementById('loginForm').addEventListener('submit', function(event) {
     event.preventDefault();
 

     const email = document.querySelector('input[type="email"]').value;
     const password = document.querySelector('input[type="password"]').value;
 

     if (email === 'hei.loic.2@gmail.com' && password === 'psswd123') {
         alert('Login successful!');
         window.location.href = 'dashboard.html';
     } else {
         alert('Invalid credentials. Please try again.');
     }
 });
 