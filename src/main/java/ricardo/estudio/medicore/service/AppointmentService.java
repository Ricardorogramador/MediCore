package ricardo.estudio.medicore.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ricardo.estudio.medicore.model.Appointment;
import ricardo.estudio.medicore.model.Doctor;
import ricardo.estudio.medicore.model.Patient;
import ricardo.estudio.medicore.model.Status;
import ricardo.estudio.medicore.repository.AppointmentRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorService doctorService, PatientService patientService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public List<Appointment> getAllAppointment(){
        return appointmentRepository.findAll();
    }

    public Appointment findAppointmentById(Integer appointmentId){
        return appointmentRepository.findById(appointmentId).orElseThrow(()-> new IllegalStateException("Appointment does not exist"));
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment, Integer doctorId, Integer patientId){
        Doctor doctor = doctorService.findDoctorById(doctorId);
        Patient patient = patientService.findPatientById(patientId);
        boolean exist = appointmentRepository.existsByDoctorAndAppointmentDate(doctor, appointment.getAppointmentDate());
        if (exist){
            throw new IllegalStateException("Doctor already has an appointment at this date and time");
        }
        boolean exist2 = appointmentRepository.existsByDoctorAndPatientAndStatus(doctor, patient, Status.SCHEDULED);
        if (exist2){
            throw new IllegalStateException("Patient " + patient.getName() + " already has an appointment scheduled with " + doctor.getName());
        }
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment  cancelAppointment(Integer appointmentId){
        Appointment appointment = findAppointmentById(appointmentId);
        if (appointment.getStatus() != Status.SCHEDULED){
            throw new IllegalStateException("cannot cancel appointments with Cancelled or Completed status");
        }
        appointment.setStatus(Status.CANCELLED);
       return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment updateAppointmentState(Integer appointmentId){
        Appointment appointment = findAppointmentById(appointmentId);
        appointment.setStatus(Status.COMPLETED);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment>findByDoctorIdAndAppointmentDate(Integer appointmentId, LocalDateTime AppointmentDate){
        findAppointmentById(appointmentId);
        return appointmentRepository.findAppointmentByDoctor_IdAndAppointmentDate(appointmentId, AppointmentDate);
    }

    public List<Appointment> findByPatientIdAndStatus(Integer patientId, Status status){
        patientService.findPatientById(patientId);
        return appointmentRepository.findAppointmentByPatient_IdAndStatus(patientId, status);
    }

}
