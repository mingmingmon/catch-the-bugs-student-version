import { useState, type FormEvent } from "react";
import type { Api, Reservation, Room, User } from "../types";
import { errorMessage, won } from "../api";
import Dialog from "./Dialog";
import RoomArt, { ROOM_META } from "./RoomArt";
import { Arrow, SmallIcon } from "./Icon";

export default function BookingDialog({
  room,
  date,
  api,
  user,
  onClose,
  onBooked,
}: {
  room: Room;
  date: string;
  api: Api;
  user: User | null;
  onClose: () => void;
  onBooked: (reservation: Reservation) => void;
}) {
  const [bookingDate, setBookingDate] = useState(date);
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("16:00");
  const [points, setPoints] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const duration = Number(end.split(":")[0]) - Number(start.split(":")[0]);
  const price = Math.max(0, duration * room.hourlyPrice);
  const times = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  );
  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const reservation = await api<Reservation>("/reservations", {
        method: "POST",
        body: {
          roomId: room.id,
          startAt: `${bookingDate}T${start}:00+09:00`,
          endAt: `${bookingDate}T${end}:00+09:00`,
          totalPrice: price,
          pointsUsed: points,
        },
      });
      onBooked(reservation);
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog
      title={`${room.name} 예약하기`}
      onClose={onClose}
      className="booking-dialog"
    >
      <div className="booking-art">
        <RoomArt id={room.id} large />
        <div className="booking-art-copy">
          <span className="eyebrow">YOUR NEXT SPACE</span>
          <h2>{ROOM_META[room.id]?.en || room.name}</h2>
          <p>
            {room.name} · 최대 {room.capacity}명
          </p>
        </div>
      </div>
      <form className="booking-form" onSubmit={submit}>
        <span className="eyebrow">MAKE IT YOURS</span>
        <h2>
          몰입할 시간을
          <br />
          예약하세요.
        </h2>
        <label>
          이용 날짜
          <input
            type="date"
            required
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </label>
        <div className="form-row">
          <label>
            시작 시간
            <select value={start} onChange={(e) => setStart(e.target.value)}>
              {times.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
          <label>
            종료 시간
            <select value={end} onChange={(e) => setEnd(e.target.value)}>
              {times.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          사용할 포인트
          <div className="input-suffix">
            <input
              type="number"
              min="0"
              step="1"
              required
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
            />
            <span>P</span>
          </div>
        </label>
        <p className="field-note">
          보유 포인트 {user ? won(user.points) : "—"} P · 1P = 1원
        </p>
        <div className="price-summary">
          <div>
            <span>공간 이용 금액</span>
            <span>{won(price)}원</span>
          </div>
          <div>
            <span>사용 포인트</span>
            <span>− {won(points)} P</span>
          </div>
          <div className="price-total">
            <strong>예상 결제 금액</strong>
            <strong>
              {won(Math.max(0, price - points))}
              <small>원</small>
            </strong>
          </div>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <button className="button dark full" disabled={pending} type="submit">
          {pending ? "예약 요청 중…" : "이 공간 예약하기"}
          <Arrow diagonal />
        </button>
        <p className="secure-note">
          <SmallIcon name="check" /> 예약 확정 후 내 예약에서 확인할 수 있어요.
        </p>
      </form>
    </Dialog>
  );
}
