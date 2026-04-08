package ricardo.estudio.medicore.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import ricardo.estudio.medicore.dto.ApiResponse;
import ricardo.estudio.medicore.model.Appointment;
import ricardo.estudio.medicore.service.AppointmentService;

import java.util.List;
@Validated
@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Appointment>>> getAllAppointments(){
        List<Appointment>getAllAppointments = appointmentService.getAllAppointment();
        return new ResponseEntity<>(new ApiResponse<>("List found", getAllAppointments), HttpStatus.OK);
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<Appointment>> findAppointmentById(@PathVariable Integer appointmentId){
        Appointment findAppointmentById = appointmentService.findAppointmentById(appointmentId);
        return new ResponseEntity<>(new ApiResponse<>("Appointment found",findAppointmentById), HttpStatus.OK);
    }

    @PostMapping("/doctor/{doctorId}/patient/{patientId}/create")
    public ResponseEntity<ApiResponse<Appointment>> createAppointment(@Valid @RequestBody Appointment appointment, @PathVariable Integer doctorId, @PathVariable Integer patientId){
        Appointment createAppointment = appointmentService.createAppointment(appointment, doctorId, patientId);
        return new ResponseEntity<>(new ApiResponse<>("Appointment created", createAppointment), HttpStatus.CREATED);
    }

    @PutMapping("/{appointmentId}")
    public  ResponseEntity<ApiResponse<Appointment>> cancelAppointment(@PathVariable Integer appointmentId){
        Appointment cancelAppointment = appointmentService.cancelAppointment(appointmentId);
        return new ResponseEntity<>(new ApiResponse<>("Appointment cancelled", cancelAppointment), HttpStatus.OK);
    }
}
