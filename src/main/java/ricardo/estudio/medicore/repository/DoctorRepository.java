package ricardo.estudio.medicore.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ricardo.estudio.medicore.model.Doctor;
import ricardo.estudio.medicore.model.Status;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    boolean existsByLicenseNumber(String licenseNumber);
    @Modifying @Transactional @Query("UPDATE Appointment a SET a.status = :newStatus WHERE a.doctor = :doctor")
    int updateStatusByDoctor(@Param("doctor") Doctor doctor, @Param("newStatus")Status newStatus);
}
