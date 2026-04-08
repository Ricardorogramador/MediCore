package ricardo.estudio.medicore.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ricardo.estudio.medicore.dto.ApiResponse;
import ricardo.estudio.medicore.model.Patient;
import ricardo.estudio.medicore.service.PatientService;

import java.util.List;
@Validated
@RestController
@RequestMapping("/api/patient")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients(){
        List<Patient> getAllPatients = patientService.getAllPatients();
        return new ResponseEntity<>(new ApiResponse<>("List found", getAllPatients), HttpStatus.OK);
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<ApiResponse<Patient>> findPatientById(@PathVariable Integer patientId){
        Patient findPatientId = patientService.findPatientById(patientId);
        return new ResponseEntity<>(new ApiResponse<>("Patient found", findPatientId), HttpStatus.OK);
    }

    @PostMapping
    public  ResponseEntity<ApiResponse<Patient>> addPatient(@Valid @RequestBody Patient patient){
        Patient newPatient = patientService.addPatient(patient);
        return new ResponseEntity<>(new ApiResponse<>("Patient added", newPatient), HttpStatus.OK);
    }
}
