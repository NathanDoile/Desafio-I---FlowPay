package br.com.ubots.flowpay.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import static java.time.LocalDate.now;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;

@ControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex,
                                                                             HttpServletRequest request) {

        HttpStatusCode statusCode = ex.getStatusCode();

        String errorPhrase = "Error";
        if (statusCode instanceof HttpStatus status) {
            errorPhrase = status.getReasonPhrase();
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", now());
        body.put("status", statusCode.value());
        body.put("error", errorPhrase);
        body.put("message", ex.getReason());
        body.put("path", request.getServletPath());

        return new ResponseEntity<>(body, statusCode);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex,
                                                                                     HttpServletRequest request) {

        HttpStatus status = BAD_REQUEST;
        String message = extrairErro(ex);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getServletPath());

        return new ResponseEntity<>(body, status);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<Map<String, Object>> handleObjectOptimisticLockingFailureException(ObjectOptimisticLockingFailureException ex,
                                                                                HttpServletRequest request) {
        // Você pode colocar um log.warn() aqui para monitorar no Datadog/Grafana

        HttpStatus status = CONFLICT;
        String message = "Os dados foram alterados por outro usuário simultaneamente. Recarregue a página ou tente novamente mais tarde.";

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        body.put("path", request.getServletPath());

        return new ResponseEntity<>(body, status);
    }

    private String extrairErro(MethodArgumentNotValidException ex) {
        Optional<ObjectError> erroOpt = ex.getBindingResult().getAllErrors()
                .stream()
                .findFirst();

        if (erroOpt.isPresent()) {
            FieldError erro = (FieldError) erroOpt.get();
            return "Campo " + erro.getField() + " " + erro.getDefaultMessage();
        } else {
            return "Erro de validação.";
        }
    }
}
