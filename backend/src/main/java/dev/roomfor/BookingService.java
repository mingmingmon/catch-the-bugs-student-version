package dev.roomfor;

import org.springframework.stereotype.Service;
import static dev.roomfor.Models.*;

@Service
public class BookingService {
    private final BookingRepository repository;
    public BookingService(BookingRepository repository) { this.repository = repository; }

    public Reservation create(User user, CreateReservation request) {
        repository.room(request.roomId());
        if (request.startAt().getMinute()!=0 || request.endAt().getMinute()!=0
            || request.startAt().getSecond()!=0 || request.endAt().getSecond()!=0
            || request.startAt().getNano()!=0 || request.endAt().getNano()!=0) {
            throw new ApiException(400,"예약은 정각 기준 1시간 단위로 요청하세요.");
        }
        if (request.pointsUsed() > request.totalPrice()) throw new ApiException(400,"사용 포인트는 결제 금액을 초과할 수 없습니다.");
        if (request.pointsUsed() > repository.user(user.id()).points()) throw new ApiException(400,"포인트가 부족합니다.");
        if (repository.overlaps(request)) throw new ApiException(409,"이미 예약된 시간입니다.");
        repository.changePoints(user.id(), -request.pointsUsed());
        return repository.insert(user.id(), request);
    }
    public Reservation cancel(User user, long id) {
        Reservation reservation = repository.reservation(id);
        repository.changePoints(reservation.userId(), reservation.pointsUsed());
        return repository.cancel(id);
    }
}
