import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createApi, errorMessage, won } from "./api";
import {
  ACCOUNTS,
  type Page,
  type Reservation,
  type Room,
  type User,
} from "./types";
import { Asterisk, SmallIcon } from "./components/Icon";
import BookingDialog from "./components/BookingDialog";
import Spaces from "./pages/Spaces";
import Reservations from "./pages/Reservations";
import Guide from "./pages/Guide";

function readPage(): Page {
  const hash = window.location.hash.slice(1);
  return ["spaces", "reservations", "guide"].includes(hash)
    ? (hash as Page)
    : "spaces";
}
function savedAccount() {
  try {
    return localStorage.getItem("roomfor-account") === "bob-demo-token" ? 1 : 0;
  } catch {
    return 0;
  }
}
export default function App() {
  const [page, setPage] = useState<Page>(readPage);
  const [account, setAccount] = useState(savedAccount);
  const [user, setUser] = useState<User | null>(null);
  const [environment, setEnvironment] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const [revision, setRevision] = useState(0);
  const [booking, setBooking] = useState<{ room: Room; date: string } | null>(
    null,
  );
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 6500);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  const api = useMemo(() => createApi(ACCOUNTS[account].token), [account]);
  useEffect(() => {
    const controller = new AbortController();
    api<{ name: string }>("/environment", { signal: controller.signal })
      .then(value => setEnvironment(value.name))
      .catch(() => {});
    return () => controller.abort();
  }, [api]);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash;
      if (hash === "#space-list") {
        setPage("spaces");
        return;
      }
      setPage(readPage());
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    api<User>("/me", { signal: controller.signal })
      .then((value) => {
        setUser(value);
        setConnectionError("");
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setUser(null);
          setConnectionError(errorMessage(error));
        }
      });
    return () => controller.abort();
  }, [api, revision]);
  function switchAccount(value: number) {
    setAccount(value);
    setUser(null);
    setBooking(null);
    try {
      localStorage.setItem("roomfor-account", ACCOUNTS[value].token);
    } catch {
      /* storage may be disabled */
    }
  }
  function booked(reservation: Reservation) {
    setBooking(null);
    refresh();
    window.location.hash = "reservations";
    notify(
      `예약 #${reservation.id} 완료 · 전체 금액 ${won(reservation.totalPrice)}원`,
    );
  }
  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <div className="announcement">
        <Asterisk />
        <span>A LITTLE SPACE. A LOT OF POSSIBILITIES.</span>
        {environment && <span className="environment-badge">{environment}</span>}
        <Asterisk />
      </div>
      <header className="site-header">
        <div className="header-inner container">
          <a href="#spaces" className="wordmark" aria-label="ROOM FOR 홈">
            ROOM FOR<span>®</span>
            <Asterisk />
          </a>
          <nav aria-label="주 메뉴">
            <a
              className={page === "spaces" ? "active" : ""}
              href="#spaces"
              aria-current={page === "spaces" ? "page" : undefined}
            >
              공간 둘러보기
            </a>
            <a
              className={page === "reservations" ? "active" : ""}
              href="#reservations"
              aria-current={page === "reservations" ? "page" : undefined}
            >
              내 예약
            </a>
            <a
              className={page === "guide" ? "active" : ""}
              href="#guide"
              aria-current={page === "guide" ? "page" : undefined}
            >
              이용 안내
            </a>
          </nav>
          <div className="account-area">
            <label className="account-select">
              <span className="avatar">{ACCOUNTS[account].name[0]}</span>
              <select
                aria-label="사용자 계정"
                value={account}
                onChange={(e) => switchAccount(Number(e.target.value))}
              >
                {ACCOUNTS.map((item, index) => (
                  <option key={item.token} value={index}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="points-badge">
              {user ? won(user.points) : "—"} <small>P</small>
            </span>
          </div>
        </div>
      </header>
      {connectionError && (
        <div className="connection-banner" role="alert">
          <span>{connectionError}</span>
          <button onClick={refresh}>
            다시 연결 <SmallIcon name="refresh" />
          </button>
        </div>
      )}
      <main id="main" tabIndex={-1}>
        {page === "spaces" && (
          <Spaces
            api={api}
            onBook={(room, date) => setBooking({ room, date })}
          />
        )}
        {page === "reservations" && (
          <Reservations
            key={account}
            api={api}
            revision={revision}
            onChanged={refresh}
            notify={notify}
          />
        )}
        {page === "guide" && <Guide />}
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <a href="#spaces" className="wordmark">
              ROOM FOR<span>®</span>
              <Asterisk />
            </a>
            <p>모든 좋은 생각에, 머무를 공간을.</p>
          </div>
          <div className="footer-bottom">
            <span>© 2030 ROOM FOR. ALL IDEAS WELCOME.</span>
            <span>SPACE FOR YOUR NEXT CHAPTER</span>
          </div>
        </div>
      </footer>
      {booking && (
        <BookingDialog
          room={booking.room}
          date={booking.date}
          api={api}
          user={user}
          onClose={() => setBooking(null)}
          onBooked={booked}
        />
      )}
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <SmallIcon name="check" />
            <span>{toast}</span>
            <button
              className="icon-button"
              aria-label="알림 닫기"
              onClick={() => setToast("")}
            >
              <SmallIcon name="close" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
