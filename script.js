/* ADMIN FIXO */

const adminUser = {

  email:'adm@medflux.com',
  password:'123456',
  role:'admin',
  name:'Administrador'

};

/* LOGIN */

function showRegister(){

  document.getElementById('loginBox')
  .style.display='none';

  document.getElementById('registerBox')
  .style.display='block';

}

function showLogin(){

  document.getElementById('loginBox')
  .style.display='block';

  document.getElementById('registerBox')
  .style.display='none';

}

/* REGISTER */

function register(){

  const name =
  document.getElementById('registerName').value;

  const email =
  document.getElementById('registerEmail').value;

  const password =
  document.getElementById('registerPassword').value;

  const role =
  document.getElementById('registerRole').value;

  if(!name || !email || !password){

    alert('Preencha todos os campos');
    return;

  }

  const users =
  JSON.parse(localStorage.getItem('users')) || [];

  users.push({
    name,
    email,
    password,
    role
  });

  localStorage.setItem(
    'users',
    JSON.stringify(users)
  );

  alert('Conta criada');

  showLogin();

}

/* LOGIN */

function login(){

  const email =
  document.getElementById('loginEmail').value;

  const password =
  document.getElementById('loginPassword').value;

  /* ADMIN */

  if(
    email === adminUser.email &&
    password === adminUser.password
  ){

    localStorage.setItem(
      'loggedUser',
      JSON.stringify(adminUser)
    );

    window.location.href='admin.html';

    return;

  }

  /* USERS */

  const users =
  JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find(u=>

    u.email === email &&
    u.password === password

  );

  if(!user){

    alert('Usuário não encontrado');
    return;

  }

  localStorage.setItem(
    'loggedUser',
    JSON.stringify(user)
  );

  /* REDIRECT */

  if(user.role === 'patient'){

    window.location.href='patient.html';

  }

  if(user.role === 'doctor'){

    window.location.href='doctor.html';

  }

}

/* FORGOT */

function forgotPassword(){

  const email =
  prompt('Digite seu e-mail');

  const users =
  JSON.parse(localStorage.getItem('users')) || [];

  const user =
  users.find(u=>u.email===email);

  if(!user){

    alert('Usuário não encontrado');
    return;

  }

  const newPassword =
  prompt('Digite a nova senha');

  user.password = newPassword;

  localStorage.setItem(
    'users',
    JSON.stringify(users)
  );

  alert('Senha alterada');

}