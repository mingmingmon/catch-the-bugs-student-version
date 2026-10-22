package dev.roomfor;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import static dev.roomfor.Models.*;

@RestController
@RequestMapping("/api")
public class BookingController {
    private final BookingRepository repository;
    private final BookingService service;
    public BookingController(BookingRepository repository, BookingService service) {
        this.repository=repository; this.service=service;
    }
    private User authenticate(String header) {
        if (header == null || !header.startsWith("Bearer ")) throw new ApiException(401,"Bearer 토큰이 필요합니다.");
        return repository.userByToken(header.substring(7));
    }
    @GetMapping("/health") public Map<String,String> health() { return Map.of("status","UP"); }
    @GetMapping("/rooms") public List<Room> rooms(@RequestParam(defaultValue="1") @Min(1) @Max(100) int people) {
        return repository.rooms(people);
    }
    @GetMapping("/me") public User me(@RequestHeader(value="Authorization",required=false) String auth) {
        return authenticate(auth);
    }
    @GetMapping("/reservations") public List<Reservation> history(
        @RequestHeader(value="Authorization",required=false) String auth,
        @RequestParam(defaultValue="1") @Min(1) int page,
        @RequestParam(defaultValue="20") @Min(1) @Max(100) int size,
        @RequestParam(required=false) LocalDate date) {
        return repository.history(authenticate(auth).id(),page,size,date);
    }
    @GetMapping("/reservations/{id}") public Reservation detail(
        @RequestHeader(value="Authorization",required=false) String auth, @PathVariable long id) {
        User user=authenticate(auth);
        Reservation reservation=repository.reservation(id);
        if (reservation.userId()!=user.id()) throw new ApiException(403,"본인의 예약만 조회할 수 있습니다.");
        return reservation;
    }
    @PostMapping("/reservations") @ResponseStatus(HttpStatus.CREATED)
    public Reservation create(@RequestHeader(value="Authorization",required=false) String auth,
        @Valid @RequestBody CreateReservation request) {
        return service.create(authenticate(auth),request);
    }
    @PostMapping("/reservations/{id}/cancel") public Reservation cancel(
        @RequestHeader(value="Authorization",required=false) String auth, @PathVariable long id) {
        return service.cancel(authenticate(auth),id);
    }
}
