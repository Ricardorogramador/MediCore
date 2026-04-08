package ricardo.estudio.medicore.service;

import org.springframework.stereotype.Service;
import ricardo.estudio.medicore.model.Speciality;
import ricardo.estudio.medicore.repository.SpecialityRepository;

import java.util.List;

@Service
public class SpecialityService {
    private final SpecialityRepository specialityRepository;

    public SpecialityService(SpecialityRepository specialityRepository) {
        this.specialityRepository = specialityRepository;
    }

    public List<Speciality> getAllSpecialities(){
        return specialityRepository.findAll();
    }

    public Speciality findSpecialityBYId(Integer specialityId){
        return specialityRepository.findById(specialityId).orElseThrow(()-> new IllegalStateException("Speciality does not exist"));
    }

    public Speciality addSpeciality(Speciality speciality){
        return specialityRepository.save(speciality);
    }
}
