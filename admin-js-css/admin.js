function showPage(page){

  const pages=
  document.querySelectorAll('.page');

  pages.forEach(p=>{

    p.classList.add('hidden');

  });

  document
  .getElementById(page+'Page')
  .classList.remove('hidden');

}

function logout(){

  localStorage.removeItem('loggedUser');

  window.location.href='index.html';

}