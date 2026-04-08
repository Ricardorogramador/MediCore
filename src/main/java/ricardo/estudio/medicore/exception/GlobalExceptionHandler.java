package ricardo.estudio.medicore.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import ricardo.estudio.medicore.dto.ApiResponse;


@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> illegalArgumentHandler(IllegalArgumentException ex){
        return new ResponseEntity<>(new ApiResponse<>(ex.getMessage(), null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> illegalStateHandler(IllegalStateException ex){
        return new ResponseEntity<>(new ApiResponse<>(ex.getMessage(), null), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> methodArgumentHandler(MethodArgumentNotValidException ex){
        String errorMessage = ex.getBindingResult().getFieldErrors().get(0).getDefaultMessage();
        return new ResponseEntity<>(new ApiResponse<>(errorMessage,null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>>dataIntegrityHandler(){
        return new ResponseEntity<>(new ApiResponse<>("Duplicated values", null), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<Void>>typeMismatchHandler(MethodArgumentTypeMismatchException ex){
        String message = "Invalid value for parameter: " + ex.getMessage();
        return new ResponseEntity<>(new ApiResponse<>(message, null), HttpStatus.BAD_REQUEST);
    }
}
