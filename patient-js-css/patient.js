/* USER */

const user =
JSON.parse(localStorage.getItem('loggedUser'));

if (!user) {

  window.location.href = 'index.html';

}

document.getElementById('welcomeText')
.innerText = `Bem-vindo, ${user.name} 👋`;

/* HORÁRIOS DISPONÍVEIS */

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

for (let i = 1; i <= 31; i++) {

  const day = document.createElement('div');

  day.classList.add('day');

  day.innerText = i;

  if (i === 12 || i === 21) {

    day.classList.add('active-day');

  }

  calendar.appendChild(day);

}

/* LOAD AVAILABLE TIMES */

function loadAvailableTimes() {

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

    if (!occupied) {

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

function openModal() {

  document.getElementById('modal')
  .style.display = 'flex';

}

function closeModal() {

  document.getElementById('modal')
  .style.display = 'none';

}

/* HISTÓRICO */

function openHistorico() {

  document.getElementById('historicoModal')
  .style.display = 'flex';

  loadHistorico();

}

function closeHistorico() {

  document.getElementById('historicoModal')
  .style.display = 'none';

}

function loadHistorico() {

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const container =
  document.getElementById('historicoContainer');

  if (consultations.length === 0) {

    container.innerHTML = `

      <p style="color:rgba(255,255,255,0.65)">
        Nenhum histórico encontrado
      </p>

    `;

    return;

  }

  container.innerHTML = '';

  consultations.forEach(c => {

    container.innerHTML += `

      <div class="historico-item">

        <h3>
          ${c.speciality}
        </h3>

        <p>
          👨‍⚕️ ${c.doctor}
        </p>

        <p>
          📅 ${formatDate(c.date)}
        </p>

        <p>
          ⏰ ${c.time}
        </p>

        <p>
          💻 ${c.type}
        </p>

        <div class="historico-status">
          Consulta Registrada
        </div>

      </div>

    `;

  });

}

/* DASHBOARD */

function openDashboard() {

  window.scrollTo({

    top: 0,
    behavior: 'smooth'

  });

  document.querySelector('.cards')
  .classList.add('dashboard-highlight');

  setTimeout(() => {

    document.querySelector('.cards')
    .classList.remove('dashboard-highlight');

  }, 2000);

}

/* MINHAS CONSULTAS */

function openMinhasConsultas() {

  document.getElementById('consultasModal')
  .style.display = 'flex';

  loadMinhasConsultas();

}

function closeMinhasConsultas() {

  document.getElementById('consultasModal')
  .style.display = 'none';

}

function loadMinhasConsultas() {

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const container =
  document.getElementById('minhasConsultasContainer');

  if (consultations.length === 0) {

    container.innerHTML = `

      <p style="color:rgba(255,255,255,0.65)">
        Nenhuma consulta encontrada
      </p>

    `;

    return;

  }

  container.innerHTML = '';

  consultations.forEach(c => {

    container.innerHTML += `

      <div class="historico-item">

        <h3>${c.speciality}</h3>

        <p>
          👨‍⚕️ ${c.doctor}
        </p>

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

/* EXAMES */

function openExames() {

  document.getElementById('examesModal')
  .style.display = 'flex';

}

function closeExames() {

  document.getElementById('examesModal')
  .style.display = 'none';

}

/* AGENDAR CONSULTA */

function scheduleConsultation() {

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

  if (!date || !time) {

    showToast('Preencha todos os campos');

    return;

  }

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  consultations.push({

    speciality,
    doctor,
    type,
    date,
    time

  });

  localStorage.setItem(

    'consultations',

    JSON.stringify(consultations)

  );

  backupConsultations();

  sendReminder({

    date,
    time

  });

  showToast('Consulta agendada com sucesso');

  loadConsultations();

  closeModal();

}

/* LOAD CONSULTATIONS */

function loadConsultations() {

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  consultations.sort((a, b) => {

    return new Date(a.date) - new Date(b.date);

  });

  const container =
  document.getElementById('consultasContainer');

  if (consultations.length === 0) {

    container.innerHTML = `

      <p style="color:rgba(255,255,255,0.65)">
        Nenhuma consulta marcada
      </p>

    `;

    return;

  }

  container.innerHTML = '';

  consultations.forEach((c, index) => {

    container.innerHTML += `

      <div class="consulta-item">

        <div>

          <strong>${c.speciality}</strong>

          <p>${c.doctor}</p>

          <p>
            ${formatDate(c.date)} • ${c.time}
          </p>

        </div>

        <div style="display:flex; gap:10px; align-items:center;">

          <div class="status">
            ${c.type}
          </div>

          <button
            onclick="cancelConsultation(${index})"
            class="cancel-btn"
          >
            Cancelar
          </button>

        </div>

      </div>

    `;

  });

  document.getElementById('monthConsults')
  .innerText = consultations.length;

  document.getElementById('doneConsults')
  .innerText = consultations.length;

  const first = consultations[0];

  document.getElementById('nextConsult')
  .innerText = formatDate(first.date);

}

/* CANCELAR CONSULTA */

function cancelConsultation(index) {

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  const confirmCancel =
  confirm('Deseja cancelar esta consulta?');

  if (!confirmCancel) return;

  consultations.splice(index, 1);

  localStorage.setItem(

    'consultations',

    JSON.stringify(consultations)

  );

  backupConsultations();

  loadConsultations();

  showToast('Consulta cancelada');

}

/* LEMBRETE */

function sendReminder(consultation) {

  setTimeout(() => {

    showToast(

      `Lembrete: consulta às ${consultation.time}`

    );

  }, 5000);

}

/* BACKUP */

function backupConsultations() {

  const consultations =
  JSON.parse(localStorage.getItem('consultations')) || [];

  localStorage.setItem(

    'consultations_backup',

    JSON.stringify({

      backupDate: new Date(),

      data: consultations

    })

  );

}

/* TOAST */

function showToast(message) {

  const toast =
  document.getElementById('toast');

  toast.innerText = message;

  toast.classList.add('show');

  setTimeout(() => {

    toast.classList.remove('show');

  }, 3000);

}

/* FORMAT DATE */

function formatDate(date) {

  return new Date(date)
  .toLocaleDateString('pt-BR');

}

/* LOGOUT */

function logout() {

  localStorage.removeItem('loggedUser');

  window.location.href = 'index.html';

}

/* INIT */

loadConsultations();