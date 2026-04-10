package ricardo.estudio.medicore.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ricardo.estudio.medicore.dto.ApiResponse;
import ricardo.estudio.medicore.model.Doctor;
import ricardo.estudio.medicore.model.Status;
import ricardo.estudio.medicore.service.DoctorService;

import java.util.List;
@Validated
@RestController
@RequestMapping("/api/doctor")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors(){
        List<Doctor> getAllDoctors = doctorService.getAllDoctors();
        return new ResponseEntity<>(new ApiResponse<>("List found", getAllDoctors), HttpStatus.OK);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<ApiResponse<Doctor>> findDoctorById(@PathVariable Integer doctorId){
        Doctor searchId = doctorService.findDoctorById(doctorId);
        return new ResponseEntity<>(new ApiResponse<>("Doctor found", searchId), HttpStatus.OK);
    }

    @PostMapping("/{specialityId}")
    public ResponseEntity<ApiResponse<Doctor>> addDoctor(@Valid @RequestBody Doctor doctor, @PathVariable Integer specialityId){
        Doctor newDoctor = doctorService.addDoctor(doctor, specialityId);
        return new ResponseEntity<>(new ApiResponse<>("Doctor added", newDoctor), HttpStatus.CREATED);
    }

    @PutMapping("/{doctorId}")
    public  ResponseEntity<ApiResponse<Doctor>> updateDoctor(@Valid @RequestBody Doctor doctor, @PathVariable Integer doctorId){
        Doctor updatedDoctor = doctorService.updateDoctor(doctor, doctorId);
        return new ResponseEntity<>(new ApiResponse<>("Doctor updated", updatedDoctor), HttpStatus.OK);
    }

    @DeleteMapping("/{doctorId}")
    public ResponseEntity<ApiResponse<Doctor>> deleteDoctor(@PathVariable Integer doctorId){
        Doctor deletedDoctor = doctorService.removeDoctor(doctorId);
        return new ResponseEntity<>(new ApiResponse<>("Doctor deleted", deletedDoctor), HttpStatus.OK);
    }

    @PutMapping("/{doctorId}/appointments/status")
    public ResponseEntity<ApiResponse<Integer>> updateAppointmentStatusByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam Status status) {

        int updatedCount = doctorService.updateAppointmentStatusByDoctor(doctorId, status);
        return new ResponseEntity<>(
                new ApiResponse<>("Appointment updated " + updatedCount, updatedCount),
                HttpStatus.OK
        );
    }
}
