package dev.roomfor;

import jakarta.validation.constraints.*;
import java.time.OffsetDateTime;

public final class Models {
    private Models() {}
    public record User(long id, String name, int points) {}
    public record Room(long id, String name, int capacity, int hourlyPrice) {}
    public record Reservation(long id, long userId, long roomId, OffsetDateTime startAt,
                              OffsetDateTime endAt, int totalPrice, int pointsUsed, String status) {}
    public record CreateReservation(@Positive long roomId, @NotNull OffsetDateTime startAt,
                                    @NotNull OffsetDateTime endAt, @Min(0) int totalPrice,
                                    @Min(0) int pointsUsed) {}
}
