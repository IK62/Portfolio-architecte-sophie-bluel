const login__form = document.getElementsByClassName('login__form')[0]

async function loginUser(target) {
  let email = ''
  let password = ''

  for (let i = 0; i < target.length; i++) {
    const e = target[i]

    if (e.id === 'email') {
      email = e.value
    }

    if (e.id === 'password') {
      password = e.value
    }
  }

  const response = await getData(email, password)
  const data = await response.json()

  if (response.status === 200) {
    window.location.href = '../index.html'
    localStorage.setItem('token', data.token)
  } else {
    alert("E-mail ou mot de passe incorrect")
  }
}

async function getData(email, password) {
  return await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
}

login__form.addEventListener('submit', async (e) => {
  e.preventDefault(), await loginUser(e.target)
})
