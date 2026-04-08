package ricardo.estudio.medicore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ricardo.estudio.medicore.model.Appointment;
import ricardo.estudio.medicore.model.Doctor;
import ricardo.estudio.medicore.model.Patient;
import ricardo.estudio.medicore.model.Status;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    boolean existsByDoctorAndAppointmentDate(Doctor doctor, LocalDateTime appointmentDate);
    boolean existsByDoctorAndPatientAndStatus(Doctor doctor, Patient patient, Status status);
    List<Appointment> findByDoctor(Doctor doctor);
}
