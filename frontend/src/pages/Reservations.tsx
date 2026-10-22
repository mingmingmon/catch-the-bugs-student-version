import { useEffect, useState, type FormEvent } from "react";
import type { Api, Reservation } from "../types";
import { dateLabel, errorMessage, timeLabel, won } from "../api";
import { Arrow, Asterisk, SmallIcon } from "../components/Icon";
import Dialog from "../components/Dialog";

const ROOM_NAMES: Record<number, string> = {
  1: "포커스룸",
  2: "팀룸",
  3: "라운지",
};
export default function Reservations({
  api,
  revision,
  onChanged,
  notify,
}: {
  api: Api;
  revision: number;
  onChanged: () => void;
  notify: (message: string) => void;
}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [date, setDate] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [detailLoading, setDetailLoading] = useState<number | null>(null);
  const [cancel, setCancel] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api<Reservation[]>(
      `/reservations?page=${page}&size=${size}${filter ? `&date=${filter}` : ""}`,
      { signal: controller.signal },
    )
      .then(setReservations)
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(e));
          setReservations([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [api, page, size, filter, revision]);
  function search(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setFilter(date);
    onChanged();
  }
  async function showDetail(id: number) {
    setDetailLoading(id);
    try {
      setDetail(await api<Reservation>(`/reservations/${id}`));
    } catch (error) {
      notify(errorMessage(error));
    } finally {
      setDetailLoading(null);
    }
  }
  async function confirmCancel() {
    if (!cancel) return;
    setCancelling(true);
    setCancelError("");
    try {
      const result = await api<Reservation>(
        `/reservations/${cancel.id}/cancel`,
        { method: "POST" },
      );
      notify(`예약 #${result.id} 취소 요청이 처리됐습니다.`);
      setCancel(null);
    } catch (error) {
      setCancelError(errorMessage(error));
    } finally {
      setCancelling(false);
      onChanged();
    }
  }
  return (
    <section className="inner-page container">
      <div className="page-heading">
        <span className="eyebrow">02 / YOUR RESERVATIONS</span>
        <h1>다음 몰입의 시간.</h1>
        <p>예약한 공간과 이용 내역을 확인하세요.</p>
        <Asterisk />
      </div>
      <form className="history-filter" onSubmit={search}>
        <label>
          이용 날짜
          <input
            aria-label="예약 내역 날짜"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button className="button dark" type="submit">
          조회하기 <Arrow />
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setDate("");
            setFilter("");
            setPage(1);
            onChanged();
          }}
        >
          전체 내역
        </button>
        <label className="page-size">
          페이지당
          <select
            aria-label="페이지당 예약 수"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value="1">1개</option>
            <option value="3">3개</option>
            <option value="10">10개</option>
          </select>
        </label>
      </form>
      <div className="reservation-list" aria-busy={loading}>
        {loading ? (
          <div className="empty-state">예약을 불러오고 있어요…</div>
        ) : error ? (
          <div className="empty-state">
            <p role="alert">{error}</p>
            <button className="button outline" onClick={onChanged}>
              다시 불러오기
            </button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <Asterisk />
            <h2>표시할 예약이 없어요.</h2>
            <p>날짜를 바꾸거나 새로운 공간을 예약해 보세요.</p>
            <a className="button dark" href="#spaces">
              공간 둘러보기 <Arrow />
            </a>
          </div>
        ) : (
          reservations.map((reservation) => (
            <article className="reservation-card" key={reservation.id}>
              <div
                className={`reservation-number ${reservation.roomId === 1 ? "pink" : reservation.roomId === 2 ? "green" : "orange"}`}
              >
                <span>ROOM</span>
                <strong>0{reservation.roomId}</strong>
                <Asterisk />
              </div>
              <div className="reservation-main">
                <div className="reservation-status">
                  <span
                    className={`status-badge ${reservation.status === "CANCELLED" ? "cancelled" : ""}`}
                  >
                    {reservation.status === "CONFIRMED"
                      ? "예약 확정"
                      : "취소 완료"}
                  </span>
                  <span>NO. {String(reservation.id).padStart(4, "0")}</span>
                </div>
                <h2>
                  {ROOM_NAMES[reservation.roomId] ||
                    `공간 ${reservation.roomId}`}
                </h2>
                <p>
                  {dateLabel(reservation.startAt)}{" "}
                  <span className="divider">/</span>{" "}
                  {timeLabel(reservation.startAt)} —{" "}
                  {timeLabel(reservation.endAt)}
                </p>
                <p className="reservation-total">
                  전체 금액 {won(reservation.totalPrice)}원{" "}
                  <span className="divider">·</span> 사용 포인트{" "}
                  {won(reservation.pointsUsed)} P
                </p>
              </div>
              <div className="reservation-actions">
                <button
                  className="button outline"
                  onClick={() => showDetail(reservation.id)}
                  disabled={detailLoading !== null}
                >
                  {detailLoading === reservation.id
                    ? "불러오는 중…"
                    : "예약 상세"}
                  <Arrow diagonal />
                </button>
                {reservation.status === "CONFIRMED" && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setCancel(reservation);
                      setCancelError("");
                    }}
                  >
                    예약 취소
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
      <nav className="pagination" aria-label="예약 페이지">
        <button
          className="icon-button"
          aria-label="이전 페이지"
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          <span className="rotate">
            <SmallIcon name="chevron" />
          </span>
        </button>
        <span>
          <strong>{page}</strong> 페이지
        </span>
        <button
          className="icon-button"
          aria-label="다음 페이지"
          disabled={loading || reservations.length < size || !!error}
          onClick={() => setPage((p) => p + 1)}
        >
          <SmallIcon name="chevron" />
        </button>
      </nav>
      <p className="timezone-note">
        <SmallIcon name="clock" /> 모든 이용 시간은 한국 시간(Asia/Seoul)
        기준입니다.
      </p>
      {detail && (
        <Dialog title="예약 상세" onClose={() => setDetail(null)}>
          <div className="detail-content">
            <span className="eyebrow">
              RESERVATION / {String(detail.id).padStart(4, "0")}
            </span>
            <h2>{ROOM_NAMES[detail.roomId] || `공간 ${detail.roomId}`}</h2>
            <dl>
              <div>
                <dt>예약 상태</dt>
                <dd>
                  {detail.status === "CONFIRMED" ? "예약 확정" : "취소 완료"}
                </dd>
              </div>
              <div>
                <dt>이용 날짜</dt>
                <dd>{dateLabel(detail.startAt)}</dd>
              </div>
              <div>
                <dt>이용 시간</dt>
                <dd>
                  {timeLabel(detail.startAt)} — {timeLabel(detail.endAt)}
                </dd>
              </div>
              <div>
                <dt>전체 금액</dt>
                <dd>{won(detail.totalPrice)}원</dd>
              </div>
              <div>
                <dt>사용 포인트</dt>
                <dd>{won(detail.pointsUsed)} P</dd>
              </div>
              <div>
                <dt>결제 금액</dt>
                <dd>{won(detail.totalPrice - detail.pointsUsed)}원</dd>
              </div>
            </dl>
            <button
              className="button dark full"
              onClick={() => setDetail(null)}
            >
              확인 <SmallIcon name="check" />
            </button>
          </div>
        </Dialog>
      )}
      {cancel && (
        <Dialog
          title="예약 취소 확인"
          onClose={() => {
            if (!cancelling) setCancel(null);
          }}
        >
          <div className="detail-content">
            <span className="eyebrow">CHANGE OF PLANS?</span>
            <h2>예약을 취소할까요?</h2>
            <p>
              {ROOM_NAMES[cancel.roomId]} · {dateLabel(cancel.startAt)}
              <br />
              {timeLabel(cancel.startAt)} — {timeLabel(cancel.endAt)}
            </p>
            <p className="cancel-note">
              취소하면 사용한 {won(cancel.pointsUsed)} P가 환급됩니다.
            </p>
            {cancelError && (
              <p role="alert" className="error-message">
                {cancelError}
              </p>
            )}
            <div className="form-row">
              <button
                className="button outline"
                disabled={cancelling}
                onClick={() => setCancel(null)}
              >
                예약 유지
              </button>
              <button
                className="button dark"
                disabled={cancelling}
                onClick={confirmCancel}
              >
                {cancelling ? "취소 중…" : "취소하기"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}
