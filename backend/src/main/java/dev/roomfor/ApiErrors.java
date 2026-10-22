package dev.roomfor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import java.util.Map;

@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(ApiException.class)
    ResponseEntity<?> domain(ApiException e) {
        return ResponseEntity.status(e.status()).body(Map.of("error",e.getMessage()));
    }
    @ExceptionHandler({MethodArgumentNotValidException.class, HandlerMethodValidationException.class,
        MethodArgumentTypeMismatchException.class, HttpMessageNotReadableException.class})
    ResponseEntity<?> invalid(Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error","요청 형식과 입력 범위를 확인하세요."));
    }
}
