/* USER */

const user =
JSON.parse(localStorage.getItem('loggedUser'));

if(!user){

  window.location.href='index.html';

}

document.getElementById('welcomeText')
.innerText = `Bem-vindo, ${user.name} 👋`;

/* HORÁRIOS */

const availableTimes = [

  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'

];

/* CALENDAR */

const calendar =
document.getElementById('calendar');

for(let i=1;i<=31;i++){

  const day =
  document.createElement('div');

  day.classList.add('day');

  day.innerText = i;

  if(i===12 || i===21){

    day.classList.add('active-day');

  }

  calendar.appendChild(day);

}

/* LOAD TIMES */

function loadAvailableTimes(){

  const select =
  document.getElementById('time');

  const selectedDate =
  document.getElementById('date').value;

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  select.innerHTML = '';

  availableTimes.forEach(time => {

    const occupied =
    consultations.some(c =>

      c.date === selectedDate &&
      c.time === time

    );

    if(!occupied){

      select.innerHTML += `

        <option value="${time}">
          ${time}
        </option>

      `;

    }

  });

}

document
.getElementById('date')
.addEventListener('change', loadAvailableTimes);

/* MODAL */

function openModal(){

  document.getElementById('modal')
  .style.display='flex';

}

function closeModal(){

  document.getElementById('modal')
  .style.display='none';

}

/* AGENDAR */

function scheduleConsultation(){

  const speciality =
  document.getElementById('speciality').value;

  const doctor =
  document.getElementById('doctor').value;

  const type =
  document.getElementById('type').value;

  const date =
  document.getElementById('date').value;

  const time =
  document.getElementById('time').value;

  if(!date || !time){

    showToast('Preencha todos os campos');

    return;

  }

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  consultations.push({

    patient:user.name,
    speciality,
    doctor,
    type,
    date,
    time,
    status:'Agendada'

  });

  localStorage.setItem(

    'consultations',

    JSON.stringify(consultations)

  );

  showToast('Consulta agendada');

  loadConsultations();

  closeModal();

}

/* LOAD CONSULTATIONS */

function loadConsultations(){

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const userConsultations =
  consultations.filter(c =>

    c.patient === user.name

  );

  const container =
  document.getElementById('consultasContainer');

  if(userConsultations.length === 0){

    container.innerHTML = `

      <p style="color:rgba(255,255,255,0.65)">
        Nenhuma consulta marcada
      </p>

    `;

    return;

  }

  container.innerHTML='';

  userConsultations.forEach((c,index)=>{

    container.innerHTML += `

      <div class="consulta-item">

        <div>

          <strong>${c.speciality}</strong>

          <p>👨‍⚕️ ${c.doctor}</p>

          <p>
            📅 ${formatDate(c.date)} • ⏰ ${c.time}
          </p>

        </div>

        <div class="consult-right">

          <div class="status">
            ${c.status}
          </div>

          <button
            class="cancel-btn"
            onclick="cancelConsultation(${index})"
          >
            Cancelar
          </button>

        </div>

      </div>

    `;

  });

  document.getElementById('monthConsults')
  .innerText = userConsultations.length;

  document.getElementById('doneConsults')
  .innerText = userConsultations.length;

  document.getElementById('nextConsult')
  .innerText =
  formatDate(userConsultations[0].date);

}

/* CANCELAR */

function cancelConsultation(index){

  let consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const userConsultations =
  consultations.filter(c =>

    c.patient === user.name

  );

  const consultation =
  userConsultations[index];

  consultations =
  consultations.filter(c =>

    !(
      c.patient === consultation.patient &&
      c.date === consultation.date &&
      c.time === consultation.time
    )

  );

  localStorage.setItem(

    'consultations',

    JSON.stringify(consultations)

  );

  showToast('Consulta cancelada');

  loadConsultations();

}

/* HISTÓRICO */

function openHistorico(){

  document.getElementById('historicoModal')
  .style.display='flex';

  loadHistorico();

}

function closeHistorico(){

  document.getElementById('historicoModal')
  .style.display='none';

}

function loadHistorico(){

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const userConsultations =
  consultations.filter(c =>

    c.patient === user.name

  );

  const container =
  document.getElementById('historicoContainer');

  if(userConsultations.length===0){

    container.innerHTML=`
      <p>Nenhum histórico encontrado</p>
    `;

    return;

  }

  container.innerHTML='';

  userConsultations.forEach(c=>{

    container.innerHTML += `

      <div class="historico-item">

        <h3>${c.speciality}</h3>

        <p>👨‍⚕️ ${c.doctor}</p>

        <p>
          📅 ${formatDate(c.date)}
        </p>

        <p>
          ⏰ ${c.time}
        </p>

        <div class="historico-status">
          ${c.status}
        </div>

      </div>

    `;

  });

}

/* EXAMES */

function openExames(){

  document.getElementById('examesModal')
  .style.display='flex';

}

function closeExames(){

  document.getElementById('examesModal')
  .style.display='none';

}

/* CONSULTAS */

function openMinhasConsultas(){

  document.getElementById('consultasModal')
  .style.display='flex';

  loadMinhasConsultas();

}

function closeMinhasConsultas(){

  document.getElementById('consultasModal')
  .style.display='none';

}

function loadMinhasConsultas(){

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const userConsultations =
  consultations.filter(c =>

    c.patient === user.name

  );

  const container =
  document.getElementById('minhasConsultasContainer');

  container.innerHTML='';

  userConsultations.forEach(c=>{

    container.innerHTML += `

      <div class="historico-item">

        <h3>${c.speciality}</h3>

        <p>👨‍⚕️ ${c.doctor}</p>

        <p>
          📅 ${formatDate(c.date)}
        </p>

        <p>
          ⏰ ${c.time}
        </p>

        <div class="historico-status">
          ${c.type}
        </div>

      </div>

    `;

  });

}

/* TOAST */

function showToast(message){

  const toast =
  document.getElementById('toast');

  toast.innerText = message;

  toast.classList.add('show');

  setTimeout(()=>{

    toast.classList.remove('show');

  },3000);

}

/* FORMAT DATE */

function formatDate(date){

  return new Date(date)
  .toLocaleDateString('pt-BR');

}

/* LOGOUT */

function logout(){

  localStorage.removeItem('loggedUser');

  window.location.href='index.html';

}

/* INIT */

loadConsultations();