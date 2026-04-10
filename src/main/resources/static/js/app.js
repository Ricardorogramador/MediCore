/**
 * app.js – MediCore UI logic
 */

/* ============================================================
   Utility helpers
   ============================================================ */

function showToast(message, type = 'default') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast--${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function formatDate(str) {
  if (!str) return '–';
  const d = new Date(str.includes('T') ? str : str + 'T00:00:00');
  return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: '2-digit' });
}

function formatDateTime(str) {
  if (!str) return '–';
  const d = new Date(str.replace(' ', 'T'));
  return d.toLocaleString('es-MX', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function statusBadge(status) {
  const labels = { SCHEDULED: 'Programada', COMPLETED: 'Completada', CANCELLED: 'Cancelada' };
  const cls    = { SCHEDULED: 'scheduled', COMPLETED: 'completed', CANCELLED: 'cancelled' };
  return `<span class="badge badge--${(cls[status] || 'scheduled')}">${labels[status] || status}</span>`;
}

/* ============================================================
   Navigation
   ============================================================ */

const sections = {
  dashboard:    { el: document.getElementById('section-dashboard'),    title: 'Dashboard' },
  patients:     { el: document.getElementById('section-patients'),     title: 'Pacientes' },
  doctors:      { el: document.getElementById('section-doctors'),      title: 'Doctores' },
  specialities: { el: document.getElementById('section-specialities'), title: 'Especialidades' },
  appointments: { el: document.getElementById('section-appointments'), title: 'Citas Médicas' },
};

function navigateTo(name) {
  Object.entries(sections).forEach(([key, sec]) => {
    sec.el.classList.toggle('active', key === name);
  });
  document.getElementById('pageTitle').textContent = sections[name].title;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === name);
  });
  loaders[name]();
}

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(link.dataset.section);
    // Close sidebar on mobile
    document.querySelector('.sidebar').classList.remove('open');
  });
});

// Mobile sidebar toggle
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});

// Close sidebar when clicking backdrop on mobile
document.querySelector('.sidebar').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('open');
  }
});

/* ============================================================
   Modal helpers – close buttons
   ============================================================ */

document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.modal));
});

document.querySelectorAll('.modal__backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', () => {
    const modal = backdrop.closest('.modal');
    if (modal) modal.classList.remove('open');
  });
});

/* ============================================================
   API health check
   ============================================================ */

async function checkApiStatus() {
  const dot     = document.querySelector('#apiStatus .status-dot');
  const textEl  = document.getElementById('apiStatusText');
  try {
    await PatientApi.getAll();
    dot.classList.add('online');
    dot.classList.remove('offline');
    textEl.textContent = ' Backend conectado';
  } catch (_) {
    dot.classList.add('offline');
    dot.classList.remove('online');
    textEl.textContent = ' Backend desconectado';
  }
}

/* ============================================================
   DASHBOARD
   ============================================================ */

async function loadDashboard() {
  try {
    const [patients, doctors, specialities, appointments] = await Promise.allSettled([
      PatientApi.getAll(),
      DoctorApi.getAll(),
      SpecialityApi.getAll(),
      AppointmentApi.getAll(),
    ]);

    const pList  = patients.status     === 'fulfilled' ? (patients.value.data     || []) : [];
    const dList  = doctors.status      === 'fulfilled' ? (doctors.value.data      || []) : [];
    const sList  = specialities.status === 'fulfilled' ? (specialities.value.data || []) : [];
    const aList  = appointments.status === 'fulfilled' ? (appointments.value.data || []) : [];

    document.getElementById('statPatients').textContent     = pList.length;
    document.getElementById('statDoctors').textContent      = dList.length;
    document.getElementById('statSpecialities').textContent = sList.length;
    document.getElementById('statAppointments').textContent = aList.length;

    // Recent appointments (last 5)
    const recent = [...aList].reverse().slice(0, 5);
    const dashEl = document.getElementById('dashboardAppointments');
    if (recent.length === 0) {
      dashEl.innerHTML = '<p style="color:var(--color-text-muted);font-style:italic">No hay citas registradas.</p>';
    } else {
      dashEl.innerHTML = `<div class="appt-list">
        ${recent.map(a => `
          <div class="appt-item">
            <span class="appt-item__icon">📅</span>
            <div class="appt-item__info">
              <div class="appt-item__title">${escHtml(a.reason)}</div>
              <div class="appt-item__sub">${formatDateTime(a.appointmentDate)}</div>
            </div>
            ${statusBadge(a.status)}
          </div>
        `).join('')}
      </div>`;
    }

    // Status chart
    const counts = { SCHEDULED: 0, COMPLETED: 0, CANCELLED: 0 };
    aList.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    const total = aList.length || 1;
    const chartEl = document.getElementById('statusChart');
    chartEl.innerHTML = [
      { key: 'SCHEDULED', label: 'Programadas', cls: 'scheduled' },
      { key: 'COMPLETED', label: 'Completadas', cls: 'completed' },
      { key: 'CANCELLED', label: 'Canceladas',  cls: 'cancelled' },
    ].map(({ key, label, cls }) => `
      <div class="status-bar status-bar--${cls}">
        <div class="status-bar__label">
          <span>${label}</span><span>${counts[key]}</span>
        </div>
        <div class="status-bar__track">
          <div class="status-bar__fill" style="width:${Math.round(counts[key]/total*100)}%"></div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Dashboard error:', err);
  }
}

/* ============================================================
   PATIENTS
   ============================================================ */

async function loadPatients() {
  const tbody = document.getElementById('patientsBody');
  tbody.innerHTML = '<tr><td colspan="5" class="table__empty">Cargando…</td></tr>';
  try {
    const res = await PatientApi.getAll();
    const list = res.data || [];
    if (list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="table__empty">No hay pacientes registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${escHtml(p.name)}</td>
        <td>${escHtml(p.email)}</td>
        <td>${escHtml(p.phone)}</td>
        <td>${formatDate(p.dateOfBirth)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="table__empty">Error al cargar pacientes: ${escHtml(err.message)}</td></tr>`;
  }
}

document.getElementById('btnAddPatient').addEventListener('click', () => {
  document.getElementById('formPatient').reset();
  openModal('modalPatient');
});

document.getElementById('formPatient').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name:        form.querySelector('#patientName').value.trim(),
    email:       form.querySelector('#patientEmail').value.trim(),
    phone:       form.querySelector('#patientPhone').value.trim(),
    dateOfBirth: form.querySelector('#patientDob').value,
  };
  try {
    await PatientApi.create(data);
    closeModal('modalPatient');
    form.reset();
    showToast('Paciente registrado correctamente.', 'success');
    loadPatients();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});

/* ============================================================
   SPECIALITIES
   ============================================================ */

let cachedSpecialities = [];

async function loadSpecialities() {
  const tbody = document.getElementById('specialitiesBody');
  tbody.innerHTML = '<tr><td colspan="3" class="table__empty">Cargando…</td></tr>';
  try {
    const res = await SpecialityApi.getAll();
    cachedSpecialities = res.data || [];
    populateSpecialitySelects();
    if (cachedSpecialities.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="table__empty">No hay especialidades registradas.</td></tr>';
      return;
    }
    tbody.innerHTML = cachedSpecialities.map(s => `
      <tr>
        <td>${s.id}</td>
        <td>${escHtml(s.name)}</td>
        <td>${escHtml(s.description)}</td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="3" class="table__empty">Error: ${escHtml(err.message)}</td></tr>`;
  }
}

function populateSpecialitySelects() {
  const select = document.getElementById('doctorSpeciality');
  const current = select.value;
  select.innerHTML = '<option value="">Seleccionar especialidad…</option>' +
    cachedSpecialities.map(s => `<option value="${s.id}">${escHtml(s.name)}</option>`).join('');
  if (current) select.value = current;
}

document.getElementById('btnAddSpeciality').addEventListener('click', () => {
  document.getElementById('formSpeciality').reset();
  openModal('modalSpeciality');
});

document.getElementById('formSpeciality').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = {
    name:        form.querySelector('#specialityName').value.trim(),
    description: form.querySelector('#specialityDescription').value.trim(),
  };
  try {
    await SpecialityApi.create(data);
    closeModal('modalSpeciality');
    form.reset();
    showToast('Especialidad creada correctamente.', 'success');
    loadSpecialities();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});

/* ============================================================
   DOCTORS
   ============================================================ */

let cachedDoctors = [];

async function loadDoctors() {
  const tbody = document.getElementById('doctorsBody');
  tbody.innerHTML = '<tr><td colspan="6" class="table__empty">Cargando…</td></tr>';
  try {
    const [docRes, spRes] = await Promise.all([DoctorApi.getAll(), SpecialityApi.getAll()]);
    cachedDoctors = docRes.data || [];
    cachedSpecialities = spRes.data || [];
    populateSpecialitySelects();

    if (cachedDoctors.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="table__empty">No hay doctores registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = cachedDoctors.map(d => `
      <tr>
        <td>${d.id}</td>
        <td>${escHtml(d.name)}</td>
        <td>${escHtml(d.email)}</td>
        <td>${escHtml(d.licenseNumber)}</td>
        <td>${d.speciality ? escHtml(d.speciality.name) : '–'}</td>
        <td>
          <div class="action-group">
            <button class="btn btn--icon" title="Editar" data-action="edit-doctor" data-id="${d.id}">✏️</button>
            <button class="btn btn--icon" title="Eliminar" data-action="delete-doctor" data-id="${d.id}">🗑️</button>
            <button class="btn btn--icon" title="Actualizar estado de citas" data-action="update-appt-status" data-id="${d.id}" data-name="${escHtml(d.name)}">📋</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="table__empty">Error: ${escHtml(err.message)}</td></tr>`;
  }
}

document.getElementById('btnAddDoctor').addEventListener('click', () => {
  document.getElementById('doctorId').value = '';
  document.getElementById('formDoctor').reset();
  document.getElementById('modalDoctorTitle').textContent = 'Nuevo Doctor';
  if (cachedSpecialities.length === 0) {
    SpecialityApi.getAll().then(r => {
      cachedSpecialities = r.data || [];
      populateSpecialitySelects();
    });
  }
  openModal('modalDoctor');
});

// Event delegation for doctor table actions (avoids inline onclick handlers)
document.getElementById('doctorsBody').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'edit-doctor')         openEditDoctor(id);
  if (btn.dataset.action === 'delete-doctor')       deleteDoctor(id);
  if (btn.dataset.action === 'update-appt-status')  openUpdateApptStatus(id, btn.dataset.name);
});

async function openEditDoctor(id) {
  try {
    const res = await DoctorApi.getById(id);
    const d = res.data;
    document.getElementById('doctorId').value = d.id;
    document.getElementById('doctorName').value = d.name;
    document.getElementById('doctorEmail').value = d.email;
    document.getElementById('doctorLicense').value = d.licenseNumber;
    if (cachedSpecialities.length === 0) {
      const sp = await SpecialityApi.getAll();
      cachedSpecialities = sp.data || [];
      populateSpecialitySelects();
    }
    document.getElementById('doctorSpeciality').value = d.speciality?.id || '';
    document.getElementById('modalDoctorTitle').textContent = 'Editar Doctor';
    openModal('modalDoctor');
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

async function deleteDoctor(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este doctor?')) return;
  try {
    await DoctorApi.delete(id);
    showToast('Doctor eliminado.', 'success');
    loadDoctors();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

function openUpdateApptStatus(doctorId, doctorName) {
  document.getElementById('apptStatusDoctorId').value = doctorId;
  document.getElementById('apptStatusDoctorName').textContent = `Doctor: ${doctorName}`;
  document.getElementById('apptNewStatus').value = '';
  openModal('modalDoctorApptStatus');
}

document.getElementById('formDoctorApptStatus').addEventListener('submit', async e => {
  e.preventDefault();
  const doctorId = document.getElementById('apptStatusDoctorId').value;
  const newStatus = document.getElementById('apptNewStatus').value;
  if (!newStatus) { showToast('Selecciona un estado.', 'error'); return; }
  try {
    const res = await DoctorApi.updateAppointmentStatus(doctorId, newStatus);
    const count = res.data ?? 0;
    closeModal('modalDoctorApptStatus');
    showToast(`Estado actualizado en ${count} cita(s).`, 'success');
    loadDoctors();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});

document.getElementById('formDoctor').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const id = form.querySelector('#doctorId').value;
  const specialityId = form.querySelector('#doctorSpeciality').value;
  const data = {
    name:          form.querySelector('#doctorName').value.trim(),
    email:         form.querySelector('#doctorEmail').value.trim(),
    licenseNumber: form.querySelector('#doctorLicense').value.trim(),
  };

  try {
    if (id) {
      await DoctorApi.update(id, data);
      showToast('Doctor actualizado correctamente.', 'success');
    } else {
      if (!specialityId) { showToast('Selecciona una especialidad.', 'error'); return; }
      await DoctorApi.create(data, specialityId);
      showToast('Doctor registrado correctamente.', 'success');
    }
    closeModal('modalDoctor');
    form.reset();
    loadDoctors();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});

/* ============================================================
   APPOINTMENTS
   ============================================================ */

let allAppointments = [];

async function loadAppointments() {
  const tbody = document.getElementById('appointmentsBody');
  tbody.innerHTML = '<tr><td colspan="7" class="table__empty">Cargando…</td></tr>';
  try {
    const res = await AppointmentApi.getAll();
    allAppointments = res.data || [];
    renderAppointments();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="table__empty">Error: ${escHtml(err.message)}</td></tr>`;
  }
}

function renderAppointments() {
  const tbody = document.getElementById('appointmentsBody');
  const filter = document.getElementById('filterStatus').value;
  const list = filter ? allAppointments.filter(a => a.status === filter) : allAppointments;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="table__empty">No hay citas para mostrar.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map(a => {
    const actions = [];
    if (a.status === 'SCHEDULED') {
      actions.push(`<button class="btn btn--sm btn--primary" data-action="complete-appt" data-id="${a.id}">✔ Completar</button>`);
      actions.push(`<button class="btn btn--sm btn--danger"  data-action="cancel-appt"   data-id="${a.id}">✕ Cancelar</button>`);
    }
    // Ahora mostramos el nombre del doctor y paciente
    const doctorName = a.doctor?.name || '–';
    const patientName = a.patient?.name || '–';

    return `
      <tr>
        <td>${a.id}</td>
        <td>${escHtml(doctorName)}</td>
        <td>${escHtml(patientName)}</td>
        <td>${formatDateTime(a.appointmentDate)}</td>
        <td>${escHtml(a.reason)}</td>
        <td>${statusBadge(a.status)}</td>
        <td><div class="action-group">${actions.join('')}</div></td>
      </tr>
    `;
  }).join('');
}

document.getElementById('filterStatus').addEventListener('change', renderAppointments);

// Event delegation for appointment table actions (avoids inline onclick handlers)
document.getElementById('appointmentsBody').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = btn.dataset.id;
  if (btn.dataset.action === 'complete-appt') completeAppointment(id);
  if (btn.dataset.action === 'cancel-appt')   cancelAppointment(id);
});

document.getElementById('btnAddAppointment').addEventListener('click', async () => {
  document.getElementById('formAppointment').reset();

  // Populate patient select
  try {
    const pRes = await PatientApi.getAll();
    const pSel = document.getElementById('appointmentPatient');
    pSel.innerHTML = '<option value="">Seleccionar paciente…</option>' +
      (pRes.data || []).map(p => `<option value="${p.id}">${escHtml(p.name)}</option>`).join('');
  } catch (_) { /* ignore */ }

  // Populate doctor select
  try {
    const dRes = await DoctorApi.getAll();
    const dSel = document.getElementById('appointmentDoctor');
    dSel.innerHTML = '<option value="">Seleccionar doctor…</option>' +
      (dRes.data || []).map(d => `<option value="${d.id}">${escHtml(d.name)}</option>`).join('');
  } catch (_) { /* ignore */ }

  // Set min datetime 1 minute in the future to guarantee the date is always "future"
  // as required by the backend @Future validation on appointmentDate.
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  document.getElementById('appointmentDate').min = now.toISOString().slice(0, 16);

  openModal('modalAppointment');
});

document.getElementById('formAppointment').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const patientId = form.querySelector('#appointmentPatient').value;
  const doctorId  = form.querySelector('#appointmentDoctor').value;
  const rawDate   = form.querySelector('#appointmentDate').value; // "yyyy-MM-ddTHH:mm"
  const reason    = form.querySelector('#appointmentReason').value.trim();

  if (!patientId || !doctorId) {
    showToast('Selecciona paciente y doctor.', 'error');
    return;
  }

  // Backend expects "yyyy-MM-dd HH:mm:ss"
  const appointmentDate = rawDate.replace('T', ' ') + ':00';

  try {
    await AppointmentApi.create({ appointmentDate, reason }, doctorId, patientId);
    closeModal('modalAppointment');
    form.reset();
    showToast('Cita creada correctamente.', 'success');
    loadAppointments();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
});

async function completeAppointment(id) {
  try {
    await AppointmentApi.updateStatus(id);
    showToast('Cita marcada como completada.', 'success');
    loadAppointments();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

async function cancelAppointment(id) {
  if (!confirm('¿Cancelar esta cita?')) return;
  try {
    await AppointmentApi.cancel(id);
    showToast('Cita cancelada.', 'success');
    loadAppointments();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  }
}

/* ============================================================
   Section loaders map
   ============================================================ */

const loaders = {
  dashboard:    loadDashboard,
  patients:     loadPatients,
  doctors:      loadDoctors,
  specialities: loadSpecialities,
  appointments: loadAppointments,
};

/* ============================================================
   XSS-safe HTML escape
   ============================================================ */

function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   Init
   ============================================================ */

(function init() {
  checkApiStatus();
  loadDashboard();
})();
