package ricardo.estudio.medicore.service;

import org.springframework.stereotype.Service;
import ricardo.estudio.medicore.model.Patient;
import ricardo.estudio.medicore.repository.PatientRepository;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public List<Patient> getAllPatients(){
        return patientRepository.findAll();
    }

    public Patient findPatientById(Integer patientId){
        return patientRepository.findById(patientId).orElseThrow(()-> new IllegalStateException("Patient does not exist"));
    }

    public Patient addPatient(Patient patient){
        return patientRepository.save(patient);
    }
}
