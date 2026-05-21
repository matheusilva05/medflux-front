const user =
JSON.parse(localStorage.getItem('loggedUser'));

if(!user){

  window.location.href='index.html';

}

document.getElementById('welcomeText')
.innerText = `Bem-vindo, Dr(a). ${user.name} 👨‍⚕️`;

/* PAGE */

function showPage(page,button){

  const pages =
  document.querySelectorAll('.page');

  pages.forEach(p=>{

    p.classList.add('hidden');

  });

  document
  .getElementById(page+'Page')
  .classList.remove('hidden');

  const buttons =
  document.querySelectorAll('.menu button');

  buttons.forEach(btn=>{

    btn.classList.remove('active-menu');

  });

  if(button){

    button.classList.add('active-menu');

  }

}

/* GET CONSULTATIONS */

function getConsultations(){

  return JSON.parse(
    localStorage.getItem('consultations')
  ) || [];

}

/* DASHBOARD */

function loadDashboard(){

  const consultations =
  getConsultations();

  document.getElementById(
    'todayConsultations'
  ).innerText = consultations.length;

  const uniquePatients =
  [...new Set(

    consultations.map(c=>c.patient)

  )];

  document.getElementById(
    'activePatients'
  ).innerText = uniquePatients.length;

  document.getElementById(
    'recordsCount'
  ).innerText = uniquePatients.length;

  if(consultations.length > 0){

    const next =
    consultations.sort((a,b)=>

      new Date(a.date) -
      new Date(b.date)

    )[0];

    document.getElementById(
      'nextConsultation'
    ).innerText =

      formatDate(next.date);

  }

}

/* CONSULTAS */

function loadConsultations(){

  const consultations =
  getConsultations();

  const container =
  document.getElementById(
    'consultationsContainer'
  );

  const todayContainer =
  document.getElementById(
    'todayConsultationsContainer'
  );

  container.innerHTML='';
  todayContainer.innerHTML='';

  if(consultations.length===0){

    container.innerHTML=`

      <div class="empty-state">
        Nenhuma consulta agendada
      </div>

    `;

    return;

  }

  consultations
  .sort((a,b)=>

    new Date(a.date) -
    new Date(b.date)

  )
  .forEach(c=>{

    const html = `

      <div class="item">

        <div>

          <strong>
            ${c.time} • ${c.patient}
          </strong>

          <p>
            ${c.speciality}
          </p>

          <p>
            👨‍⚕️ ${c.doctor}
          </p>

          <div class="consultation-date">

            📅 ${formatDate(c.date)}

          </div>

        </div>

        <div class="status">
          ${c.type}
        </div>

      </div>

    `;

    container.innerHTML += html;

    todayContainer.innerHTML += html;

  });

}

/* PATIENTS */

function loadPatients(){

  const consultations =
  getConsultations();

  const container =
  document.getElementById(
    'patientsContainer'
  );

  container.innerHTML='';

  const uniquePatients=[];

  consultations.forEach(c=>{

    const exists =
    uniquePatients.find(

      p=>p.patient===c.patient

    );

    if(!exists){

      uniquePatients.push(c);

    }

  });

  if(uniquePatients.length===0){

    container.innerHTML=`

      <div class="empty-state">
        Nenhum paciente encontrado
      </div>

    `;

    return;

  }

  uniquePatients.forEach(c=>{

    container.innerHTML += `

      <div class="item">

        <div>

          <strong>
            ${c.patient}
          </strong>

          <p>
            ${c.speciality}
          </p>

        </div>

        <div class="status">
          Ativo
        </div>

      </div>

    `;

  });

}

/* RECORDS */

function loadRecords(){

  const consultations =
  getConsultations();

  const container =
  document.getElementById(
    'recordsContainer'
  );

  container.innerHTML='';

  const uniquePatients=[];

  consultations.forEach(c=>{

    const exists =
    uniquePatients.find(

      p=>p.patient===c.patient

    );

    if(!exists){

      uniquePatients.push(c);

    }

  });

  if(uniquePatients.length===0){

    container.innerHTML=`

      <div class="empty-state">
        Nenhum prontuário encontrado
      </div>

    `;

    return;

  }

  uniquePatients.forEach((c,index)=>{

    container.innerHTML += `

      <div class="record-box">

        <strong>
          ${c.patient}
        </strong>

        <textarea
          id="record-${index}"
          placeholder="Adicionar observações médicas..."
        >${c.notes || ''}</textarea>

        <button
          class="save-btn"
          onclick="saveRecord(
            ${index},
            '${c.patient}'
          )"
        >
          Salvar Prontuário
        </button>

      </div>

    `;

  });

}

/* SAVE RECORD */

function saveRecord(index,patient){

  const text =
  document.getElementById(
    `record-${index}`
  ).value;

  const consultations =
  getConsultations();

  consultations.forEach(c=>{

    if(c.patient===patient){

      c.notes=text;

    }

  });

  localStorage.setItem(

    'consultations',

    JSON.stringify(consultations)

  );

  alert('Prontuário salvo');

}

/* CALENDAR */

const calendar =
document.getElementById('calendar');

function loadCalendar(){

  const consultations =
  getConsultations();

  calendar.innerHTML='';

  for(let i=1;i<=31;i++){

    const day =
    document.createElement('div');

    day.classList.add('day');

    const dayConsultations =
    consultations.filter(c=>{

      const consultDay =
      new Date(c.date).getDate();

      return consultDay===i;

    });

    if(dayConsultations.length>0){

      day.classList.add('active');

      day.innerHTML=`

        <div class="day-content">

          <strong>${i}</strong>

          ${dayConsultations.map(c=>`

            <small>
              ${c.time}
              •
              ${c.patient}
            </small>

          `).join('')}

        </div>

      `;

    }else{

      day.innerHTML=`<strong>${i}</strong>`;

    }

    calendar.appendChild(day);

  }

}

/* NOTIFICATIONS */

function loadNotifications(){

  const consultations =
  getConsultations();

  const container =
  document.getElementById(
    'notificationsContainer'
  );

  container.innerHTML='';

  if(consultations.length===0){

    container.innerHTML=`

      <div class="empty-state">
        Nenhum lembrete encontrado
      </div>

    `;

    return;

  }

  consultations.forEach(c=>{

    container.innerHTML += `

      <div class="item">

        <div>

          <strong>
            Consulta • ${c.patient}
          </strong>

          <p>
            Lembrete automático agendado
          </p>

        </div>

        <div class="status">
          Enviado
        </div>

      </div>

    `;

  });

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

loadDashboard();

loadConsultations();

loadPatients();

loadRecords();

loadCalendar();

loadNotifications();