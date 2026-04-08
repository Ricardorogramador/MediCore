package ricardo.estudio.medicore.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ricardo.estudio.medicore.dto.ApiResponse;
import ricardo.estudio.medicore.model.Speciality;
import ricardo.estudio.medicore.service.SpecialityService;

import java.util.List;
@Validated
@RestController
@RequestMapping("/api/speciality")
public class SpecialityController {

    private final SpecialityService specialityService;

    public SpecialityController(SpecialityService specialityService) {
        this.specialityService = specialityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Speciality>>> getAllSpeciality(){
        List<Speciality> getAllSpecialities = specialityService.getAllSpecialities();
        return new ResponseEntity<>(new ApiResponse<>("List found", getAllSpecialities), HttpStatus.OK);
    }

    @GetMapping("/{specialityId}")
    public ResponseEntity<ApiResponse<Speciality>> findById(@PathVariable Integer specialityId){
        Speciality searchId = specialityService.findSpecialityBYId(specialityId);
        return new ResponseEntity<>(new ApiResponse<>("Speciality found", searchId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Speciality>> createSpeciality(@RequestBody @Valid Speciality speciality){
        Speciality newSpeciality = specialityService.addSpeciality(speciality);
        return new ResponseEntity<>(new ApiResponse<>("Speciality added", newSpeciality), HttpStatus.CREATED);
    }
}
