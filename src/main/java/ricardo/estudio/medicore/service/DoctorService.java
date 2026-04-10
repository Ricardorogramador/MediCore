package ricardo.estudio.medicore.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ricardo.estudio.medicore.model.Appointment;
import ricardo.estudio.medicore.model.Doctor;
import ricardo.estudio.medicore.model.Speciality;
import ricardo.estudio.medicore.model.Status;
import ricardo.estudio.medicore.repository.AppointmentRepository;
import ricardo.estudio.medicore.repository.DoctorRepository;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SpecialityService specialityService;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(DoctorRepository doctorRepository, SpecialityService specialityService, AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.specialityService = specialityService;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Doctor> getAllDoctors(){
        List<Doctor>getAllDoctors = doctorRepository.findAll();
        if (getAllDoctors.isEmpty()){
            throw new IllegalArgumentException("Doctor list is empty");
        }
        return getAllDoctors;
    }

    public Doctor findDoctorById(Integer doctorId){
        return doctorRepository.findById(doctorId).orElseThrow(()-> new IllegalStateException("Doctor not exist in the database"));
    }

    @Transactional
    public Doctor addDoctor(Doctor doctor, Integer specialityId){
        if (doctorRepository.existsByLicenseNumber(doctor.getLicenseNumber())){
            throw new IllegalStateException("This doctor already exist");
        }
        Speciality speciality = specialityService.findSpecialityBYId(specialityId);
        doctor.setSpeciality(speciality);
        return doctorRepository.save(doctor);
    }

    @Transactional
    public Doctor updateDoctor(Doctor doctor, Integer doctorId){
        Doctor existingDoctor = findDoctorById(doctorId);
        existingDoctor.setName(doctor.getName());
        existingDoctor.setEmail(doctor.getEmail());
        return doctorRepository.save(existingDoctor);
    }

    @Transactional
    public Doctor removeDoctor(Integer doctorId){
        Doctor doctor = findDoctorById(doctorId);
        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
        appointmentRepository.findByDoctor(doctor).forEach(a -> a.setStatus(Status.CANCELLED));
        appointmentRepository.saveAll(appointments);
        doctorRepository.delete(doctor);
      return doctor;
    }

    @Transactional
    public int updateAppointmentStatusByDoctor(Integer doctorId, Status newStatus) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor no encontrado"));

        return doctorRepository.updateStatusByDoctor(doctor, newStatus);
    }
}
