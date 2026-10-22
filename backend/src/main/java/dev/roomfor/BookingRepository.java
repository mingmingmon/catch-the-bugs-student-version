package dev.roomfor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.time.*;
import java.util.List;
import static dev.roomfor.Models.*;

@Repository
public class BookingRepository {
    private final JdbcTemplate db;
    public BookingRepository(JdbcTemplate db) { this.db = db; }
    private static final RowMapper<Reservation> RESERVATION = (rs, n) -> new Reservation(
        rs.getLong("id"), rs.getLong("user_id"), rs.getLong("room_id"),
        rs.getObject("start_at", OffsetDateTime.class), rs.getObject("end_at", OffsetDateTime.class),
        rs.getInt("total_price"), rs.getInt("points_used"), rs.getString("status"));

    public User userByToken(String token) {
        return db.query("SELECT id,name,points FROM users WHERE token=?",
            (rs,n) -> new User(rs.getLong(1),rs.getString(2),rs.getInt(3)), token)
            .stream().findFirst().orElseThrow(() -> new ApiException(401,"인증 토큰을 확인하세요."));
    }
    public User user(long id) {
        return db.queryForObject("SELECT id,name,points FROM users WHERE id=?",
            (rs,n) -> new User(rs.getLong(1),rs.getString(2),rs.getInt(3)), id);
    }
    public List<Room> rooms(int people) {
        return db.query("SELECT * FROM rooms WHERE capacity > ? ORDER BY id",
            (rs,n) -> new Room(rs.getLong("id"),rs.getString("name"),rs.getInt("capacity"),rs.getInt("hourly_price")), people);
    }
    public Room room(long id) {
        return db.query("SELECT * FROM rooms WHERE id=?", (rs,n) -> new Room(rs.getLong("id"),
            rs.getString("name"),rs.getInt("capacity"),rs.getInt("hourly_price")), id)
            .stream().findFirst().orElseThrow(() -> new ApiException(404,"방을 찾을 수 없습니다."));
    }
    public Reservation reservation(long id) {
        return db.query("SELECT * FROM reservations WHERE id=?", RESERVATION, id)
            .stream().findFirst().orElseThrow(() -> new ApiException(404,"예약을 찾을 수 없습니다."));
    }
    public List<Reservation> history(long userId, int page, int size, LocalDate date) {
        String sql = "SELECT * FROM reservations WHERE user_id=? AND status='CONFIRMED'";
        if (date != null) {
            return db.query(sql + " AND start_at>=? AND start_at<? ORDER BY id LIMIT ? OFFSET ?", RESERVATION,
                userId, date.atStartOfDay().atOffset(ZoneOffset.UTC),
                date.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC), size, 0);
        }
        return db.query(sql + " ORDER BY id LIMIT ? OFFSET ?", RESERVATION, userId, size, 0);
    }
    public boolean overlaps(CreateReservation request) {
        Integer count = db.queryForObject("SELECT COUNT(*) FROM reservations WHERE room_id=? AND status='CONFIRMED' AND start_at<=? AND end_at>?",
            Integer.class, request.roomId(), request.startAt(), request.startAt());
        return count != null && count > 0;
    }
    public void changePoints(long userId, int delta) {
        db.update("UPDATE users SET points=points+? WHERE id=?", delta,userId);
    }
    public Reservation insert(long userId, CreateReservation request) {
        var key = new org.springframework.jdbc.support.GeneratedKeyHolder();
        db.update(connection -> {
            var statement = connection.prepareStatement("INSERT INTO reservations (user_id,room_id,start_at,end_at,total_price,points_used,status) VALUES (?,?,?,?,?,?,'CONFIRMED')", new String[]{"id"});
            statement.setLong(1,userId);
            statement.setLong(2,request.roomId());
            statement.setObject(3,request.startAt());
            statement.setObject(4,request.endAt());
            statement.setInt(5,request.totalPrice());
            statement.setInt(6,request.pointsUsed());
            return statement;
        }, key);
        return reservation(java.util.Objects.requireNonNull(key.getKey()).longValue());
    }
    public Reservation cancel(long id) {
        db.update("UPDATE reservations SET status='CANCELLED' WHERE id=?", id);
        return reservation(id);
    }
}
