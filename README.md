# MediCore – Sistema de Gestión Médica / Medical Management System

> **Español** | [English below](#english)

---

## 🇪🇸 Español

### Descripción

**MediCore** es una API REST para la gestión de un sistema médico. Permite administrar pacientes, doctores, especialidades y citas médicas con operaciones CRUD completas y reglas de negocio adicionales (como cambiar el estado de todas las citas de un doctor).

> ⚠️ **Nota importante:**
> - El **backend** fue creado **completamente de forma manual** por el desarrollador, incluyendo toda la arquitectura, lógica de negocio, endpoints y capa de persistencia.
> - El **frontend** (HTML/CSS/JS) fue generado con **IA (GitHub Copilot)** únicamente para visualizar y demostrar el funcionamiento del backend. No representa código de producción.

---

### Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Backend | Java 21, Spring Boot 4.x |
| Persistencia | Spring Data JPA, Hibernate |
| Base de datos | PostgreSQL |
| Validación | Jakarta Bean Validation |
| Frontend (demo) | HTML5, CSS3, JavaScript (Vanilla) – generado con IA |

---

### Arquitectura del sistema

```
MediCore
├── controller/       # Endpoints REST (PatientController, DoctorController, AppointmentController, SpecialityController)
├── service/          # Lógica de negocio
├── repository/       # Acceso a datos (Spring Data JPA + queries JPQL)
├── model/            # Entidades JPA (Patient, Doctor, Speciality, Appointment, Status)
├── dto/              # ApiResponse<T> – envoltorio genérico de respuesta
├── exception/        # GlobalExceptionHandler
└── resources/
    ├── application.properties
    └── static/       # Frontend demo (index.html, css/, js/)
```

---

### Requisitos previos

- Java 21+
- Maven 3.9+
- PostgreSQL 15+

---

### Instalación y ejecución

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/Ricardorogramador/MediCore.git
   cd MediCore
   ```

2. **Crea la base de datos en PostgreSQL**
   ```sql
   CREATE DATABASE medicore;
   ```

3. **Configura las variables de entorno** (o edita `src/main/resources/application.properties`)
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/medicore
   export DB_USERNAME=postgres
   export DB_PASSWORD=tu_contraseña
   ```

4. **Ejecuta el proyecto**
   ```bash
   ./mvnw spring-boot:run
   ```

5. **Accede al frontend demo**  
   Abre `http://localhost:8080` en tu navegador.

---

### Endpoints disponibles

#### Pacientes — `/api/patient`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/patient` | Listar todos los pacientes |
| GET | `/api/patient/{id}` | Obtener paciente por ID |
| POST | `/api/patient` | Crear paciente |

#### Doctores — `/api/doctor`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/doctor` | Listar todos los doctores |
| GET | `/api/doctor/{id}` | Obtener doctor por ID |
| POST | `/api/doctor/{specialityId}` | Crear doctor con especialidad |
| PUT | `/api/doctor/{id}` | Actualizar doctor |
| DELETE | `/api/doctor/{id}` | Eliminar doctor (cancela sus citas) |
| **PUT** | **`/api/doctor/{doctorId}/appointments/status?status={status}`** | **Actualizar estado de todas las citas del doctor** |

#### Especialidades — `/api/speciality`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/speciality` | Listar especialidades |
| GET | `/api/speciality/{id}` | Obtener especialidad por ID |
| POST | `/api/speciality` | Crear especialidad |

#### Citas — `/api/appointment`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/appointment` | Listar todas las citas |
| GET | `/api/appointment/{id}` | Obtener cita por ID |
| POST | `/api/appointment/doctor/{doctorId}/patient/{patientId}/create` | Crear cita |
| PUT | `/api/appointment/{id}` | Cancelar cita |
| PUT | `/api/appointment/{id}/updateStatus` | Marcar cita como completada |
| GET | `/api/appointment/{id}/find?appointmentDate={datetime}` | Buscar por doctor y fecha |
| GET | `/api/appointment/patient/{patientId}/status/{status}` | Buscar por paciente y estado |

**Valores de `status`:** `SCHEDULED` · `COMPLETED` · `CANCELLED`

---

### Estructura del proyecto

```
src/
├── main/
│   ├── java/ricardo/estudio/medicore/
│   │   ├── MediCoreApplication.java
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── resources/
│       ├── application.properties
│       └── static/
│           ├── index.html
│           ├── css/style.css
│           └── js/
│               ├── api.js
│               └── app.js
└── test/
```

---

---

## 🇺🇸 English <a name="english"></a>

### Description

**MediCore** is a REST API for managing a medical system. It allows you to manage patients, doctors, specialities, and appointments with full CRUD operations and additional business rules (such as bulk-updating the status of all appointments for a given doctor).

> ⚠️ **Important note:**
> - The **backend** was built **entirely by hand** by the developer, including the full architecture, business logic, endpoints, and persistence layer.
> - The **frontend** (HTML/CSS/JS) was generated with **AI (GitHub Copilot)** solely to visualize and demonstrate the backend functionality. It is not intended as production-grade UI code.

---

### Technologies

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 4.x |
| Persistence | Spring Data JPA, Hibernate |
| Database | PostgreSQL |
| Validation | Jakarta Bean Validation |
| Frontend (demo) | HTML5, CSS3, Vanilla JavaScript – AI-generated |

---

### System Architecture

```
MediCore
├── controller/       # REST endpoints
├── service/          # Business logic
├── repository/       # Data access (Spring Data JPA + JPQL queries)
├── model/            # JPA entities (Patient, Doctor, Speciality, Appointment, Status)
├── dto/              # ApiResponse<T> – generic response wrapper
├── exception/        # GlobalExceptionHandler
└── resources/
    ├── application.properties
    └── static/       # Demo frontend (index.html, css/, js/)
```

---

### Prerequisites

- Java 21+
- Maven 3.9+
- PostgreSQL 15+

---

### Setup & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ricardorogramador/MediCore.git
   cd MediCore
   ```

2. **Create the PostgreSQL database**
   ```sql
   CREATE DATABASE medicore;
   ```

3. **Set environment variables** (or edit `src/main/resources/application.properties`)
   ```bash
   export DB_URL=jdbc:postgresql://localhost:5432/medicore
   export DB_USERNAME=postgres
   export DB_PASSWORD=your_password
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

5. **Open the demo frontend**  
   Navigate to `http://localhost:8080` in your browser.

---

### Available Endpoints

#### Patients — `/api/patient`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/patient` | List all patients |
| GET | `/api/patient/{id}` | Get patient by ID |
| POST | `/api/patient` | Create patient |

#### Doctors — `/api/doctor`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/doctor` | List all doctors |
| GET | `/api/doctor/{id}` | Get doctor by ID |
| POST | `/api/doctor/{specialityId}` | Create doctor with speciality |
| PUT | `/api/doctor/{id}` | Update doctor |
| DELETE | `/api/doctor/{id}` | Delete doctor (cancels their appointments) |
| **PUT** | **`/api/doctor/{doctorId}/appointments/status?status={status}`** | **Bulk-update status of all appointments for a doctor** |

#### Specialities — `/api/speciality`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/speciality` | List specialities |
| GET | `/api/speciality/{id}` | Get speciality by ID |
| POST | `/api/speciality` | Create speciality |

#### Appointments — `/api/appointment`
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/appointment` | List all appointments |
| GET | `/api/appointment/{id}` | Get appointment by ID |
| POST | `/api/appointment/doctor/{doctorId}/patient/{patientId}/create` | Create appointment |
| PUT | `/api/appointment/{id}` | Cancel appointment |
| PUT | `/api/appointment/{id}/updateStatus` | Mark appointment as completed |
| GET | `/api/appointment/{id}/find?appointmentDate={datetime}` | Find by doctor and date |
| GET | `/api/appointment/patient/{patientId}/status/{status}` | Find by patient and status |

**`status` values:** `SCHEDULED` · `COMPLETED` · `CANCELLED`

---

### Project Structure

```
src/
├── main/
│   ├── java/ricardo/estudio/medicore/
│   │   ├── MediCoreApplication.java
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── exception/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── resources/
│       ├── application.properties
│       └── static/
│           ├── index.html
│           ├── css/style.css
│           └── js/
│               ├── api.js
│               └── app.js
└── test/
```
