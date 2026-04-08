package ricardo.estudio.medicore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ricardo.estudio.medicore.model.Speciality;

public interface SpecialityRepository extends JpaRepository<Speciality, Integer> {
}
