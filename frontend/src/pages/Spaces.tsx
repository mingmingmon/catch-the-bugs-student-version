import { useEffect, useState, type FormEvent } from "react";
import type { Api, Room } from "../types";
import { errorMessage, won } from "../api";
import { Arrow, Asterisk, SmallIcon } from "../components/Icon";
import RoomArt, { ROOM_META } from "../components/RoomArt";

export default function Spaces({
  api,
  onBook,
}: {
  api: Api;
  onBook: (room: Room, date: string) => void;
}) {
  const [people, setPeople] = useState("1");
  const [date, setDate] = useState("2030-06-15");
  const [query, setQuery] = useState({ people: 1, revision: 0 });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api<Room[]>(`/rooms?people=${query.people}`, { signal: controller.signal })
      .then(setRooms)
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(e));
          setRooms([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [api, query]);
  function search(event: FormEvent) {
    event.preventDefault();
    setQuery((previous) => ({
      people: Number(people),
      revision: previous.revision + 1,
    }));
  }
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-content container">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="live-dot" /> SPACE FOR YOUR NEXT CHAPTER
            </div>
            <h1 id="hero-title">
              MAKE ROOM.
              <br />
              FOR <span>IDEAS.</span>
            </h1>
            <div className="hero-bottom">
              <p>
                생각이 모이고, 가능성이 열리는 곳.
                <br />
                우리의 다음을 위한 공간을 만나보세요.
              </p>
              <a href="#space-list" className="hero-link">
                나에게 맞는 공간 찾기 <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-index">
              EST. 2030
              <br />
              SEOUL, KR
            </span>
            <div className="hero-spark">
              <Asterisk />
              <div className="spark-center">
                RF<span>®</span>
              </div>
            </div>
            <div className="round-sticker">
              <span>
                GOOD SPACE,
                <br />
                GREAT THINGS.
              </span>
              <Arrow diagonal />
            </div>
            <span className="art-coordinate">37°33′ N &nbsp; 126°58′ E</span>
          </div>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <div>
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              LESS DISTRACTION <Asterisk /> MORE CONNECTION <Asterisk /> ROOM
              FOR YOU <Asterisk />
            </span>
          ))}
        </div>
      </div>
      <section
        id="space-list"
        className="spaces-section container"
        aria-labelledby="spaces-title"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / FIND YOUR SPACE</span>
            <h2 id="spaces-title">
              좋은 생각에는,
              <br className="mobile-only" /> 좋은 공간이 필요하니까.
            </h2>
          </div>
          <span className="section-aside">
            혼자여도, 함께여도.
            <br />
            우리에겐 딱 맞는 공간이 있어요.
          </span>
        </div>
        <form className="search-bar" onSubmit={search}>
          <label>
            <span>
              WHEN <i>이용 날짜</i>
            </span>
            <input
              type="date"
              aria-label="공간 이용 날짜"
              value={date}
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="people-filter">
            <span>
              WHO <i>이용 인원</i>
            </span>
            <select
              aria-label="이용 인원"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}명
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="button dark" disabled={loading}>
            공간 찾기 <Arrow diagonal />
          </button>
        </form>
        <div className="list-heading">
          <span>
            {loading ? (
              "공간을 불러오고 있어요"
            ) : (
              <>
                우리에게 맞는 공간{" "}
                <strong>{rooms.length.toString().padStart(2, "0")}</strong>
              </>
            )}
          </span>
          <span>날짜·시간별 예약 가능 여부는 예약 시 확인됩니다.</span>
        </div>
        {error ? (
          <div className="empty-state">
            <p role="alert">{error}</p>
            <button
              className="button outline"
              onClick={() =>
                setQuery((q) => ({ ...q, revision: q.revision + 1 }))
              }
            >
              다시 불러오기 <SmallIcon name="refresh" />
            </button>
          </div>
        ) : loading ? (
          <div className="room-grid" aria-busy="true">
            {[1, 2, 3].map((id) => (
              <div key={id} className="skeleton-card">
                <div />
                <span />
                <span />
              </div>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <Asterisk />
            <h3>조건에 맞는 공간이 없어요.</h3>
            <p>이용 인원을 변경해서 다시 찾아보세요.</p>
          </div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <article className="room-card" key={room.id}>
                <button
                  className="room-art-button"
                  onClick={() => onBook(room, date)}
                  aria-label={`${room.name} 예약하기`}
                >
                  <RoomArt id={room.id} />
                  <span className="room-tag">
                    {ROOM_META[room.id]?.tag || "나를 위한 공간"}
                  </span>
                  <span className="room-art-arrow">
                    <Arrow diagonal />
                  </span>
                </button>
                <div className="room-info">
                  <span className="eyebrow">
                    {ROOM_META[room.id]?.en || "STUDY ROOM"}
                  </span>
                  <div className="room-name">
                    <h3>{room.name}</h3>
                    <span>
                      <SmallIcon name="users" /> 최대 {room.capacity}명
                    </span>
                  </div>
                  <p>
                    {ROOM_META[room.id]?.description ||
                      "다음 아이디어를 위한 공간."}
                  </p>
                  <div className="room-amenities">
                    <span>
                      <SmallIcon name="wifi" /> Wi-Fi
                    </span>
                    {ROOM_META[room.id]?.features.map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>
                  <div className="room-price">
                    <span>
                      <strong>{won(room.hourlyPrice)}</strong>원{" "}
                      <small>/ 시간</small>
                    </span>
                    <button
                      onClick={() => onBook(room, date)}
                      aria-label={`${room.name} 선택`}
                    >
                      예약하기 <Arrow />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="manifesto">
        <div className="container manifesto-inner">
          <Asterisk />
          <div>
            <span className="eyebrow">
              A LITTLE SPACE. A LOT OF POSSIBILITIES.
            </span>
            <h2>
              당신의 다음 아이디어,
              <br />
              여기서 시작해도 좋아요.
            </h2>
          </div>
          <a href="#guide" className="circle-link" aria-label="이용 안내 보기">
            <Arrow diagonal />
            <span>이용 안내</span>
          </a>
        </div>
      </section>
    </>
  );
}
