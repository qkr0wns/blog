const signupForm = document.querySelector('#signup-form');

async function signup(e) {
  e.preventDefault();

  const loginCredentials = {
    username: document.querySelector('#signup-name').value.trim(),
    login: document.querySelector('#signup-name').value.trim(),
    password: document.querySelector('#signup-pass').value.trim(),
  };

  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify(loginCredentials),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      alert('signed up!');

      //   Sign in automatically after signing up
      const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(loginCredentials),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        document.location.replace('/');
      } else {
        document.reload();
      }
    } else {
      document.reload();
    }
  } catch (err) {
    console.error(err);
  }
}

signupForm.addEventListener('submit', signup);