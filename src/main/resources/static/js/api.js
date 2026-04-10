/**
 * api.js – MediCore API client
 * All calls go to http://localhost:8080
 */

const BASE_URL = 'http://localhost:8080';

/**
 * Generic fetch wrapper that throws on non-2xx responses.
 * Returns the parsed JSON body.
 */
async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch (_) { /* ignore */ }
    throw new Error(message);
  }
  return res.json();
}

/* ── Patients ─────────────────────────────────────────────── */

const PatientApi = {
  getAll() {
    return apiFetch('/api/patient');
  },
  getById(id) {
    return apiFetch(`/api/patient/${id}`);
  },
  create(data) {
    return apiFetch('/api/patient', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/* ── Doctors ──────────────────────────────────────────────── */

const DoctorApi = {
  getAll() {
    return apiFetch('/api/doctor');
  },
  getById(id) {
    return apiFetch(`/api/doctor/${id}`);
  },
  /**
   * POST /api/doctor/{specialityId}
   * specialityId is required to link the doctor to a speciality.
   */
  create(data, specialityId) {
    return apiFetch(`/api/doctor/${specialityId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  update(id, data) {
    return apiFetch(`/api/doctor/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  delete(id) {
    return apiFetch(`/api/doctor/${id}`, { method: 'DELETE' });
  },
};

/* ── Specialities ─────────────────────────────────────────── */

const SpecialityApi = {
  getAll() {
    return apiFetch('/api/speciality');
  },
  getById(id) {
    return apiFetch(`/api/speciality/${id}`);
  },
  create(data) {
    return apiFetch('/api/speciality', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/* ── Appointments ─────────────────────────────────────────── */

const AppointmentApi = {
  getAll() {
    return apiFetch('/api/appointment');
  },
  getById(id) {
    return apiFetch(`/api/appointment/${id}`);
  },
  /**
   * POST /api/appointment/doctor/{doctorId}/patient/{patientId}/create
   */
  create(data, doctorId, patientId) {
    return apiFetch(`/api/appointment/doctor/${doctorId}/patient/${patientId}/create`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  /**
   * PUT /api/appointment/{id}  → cancel
   */
  cancel(id) {
    return apiFetch(`/api/appointment/${id}`, { method: 'PUT' });
  },
  /**
   * PUT /api/appointment/{id}/updateStatus  → mark as completed
   */
  updateStatus(id) {
    return apiFetch(`/api/appointment/${id}/updateStatus`, { method: 'PUT' });
  },
  findByDoctorAndDate(doctorId, appointmentDate) {
    const encoded = encodeURIComponent(appointmentDate);
    return apiFetch(`/api/appointment/${doctorId}/find?appointmentDate=${encoded}`);
  },
  findByPatientAndStatus(patientId, status) {
    return apiFetch(`/api/appointment/patient/${patientId}/status/${status}`);
  },
};
