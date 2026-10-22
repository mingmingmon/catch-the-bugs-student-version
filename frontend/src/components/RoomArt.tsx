export const ROOM_META: Record<
  number,
  {
    en: string;
    description: string;
    tag: string;
    color: string;
    features: string[];
  }
> = {
  1: {
    en: "FOCUS ROOM",
    description: "작은 팀의 큰 생각을 위한 공간.",
    tag: "집중이 필요할 때",
    color: "pink",
    features: ["화이트보드", "개별 냉난방"],
  },
  2: {
    en: "TEAM ROOM",
    description: "함께할수록 더 커지는 아이디어.",
    tag: "함께 몰입할 때",
    color: "green",
    features: ["대형 모니터", "화이트보드"],
  },
  3: {
    en: "THE LOUNGE",
    description: "가능성을 넓히는 느슨한 만남.",
    tag: "새롭게 연결될 때",
    color: "orange",
    features: ["라운지 좌석", "프레젠테이션"],
  },
};

export default function RoomArt({
  id,
  large = false,
}: {
  id: number;
  large?: boolean;
}) {
  const tone = ROOM_META[id]?.color || "pink";
  return (
    <div
      className={`room-art ${tone} ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      <span className="art-label">ROOM / 0{id}</span>
      <svg viewBox="0 0 480 300" fill="none">
        <defs>
          <pattern
            id={`grid-${id}-${large}`}
            width="36"
            height="22"
            patternUnits="userSpaceOnUse"
            patternTransform="skewY(-15)"
          >
            <path
              d="M36 0H0V22"
              stroke="currentColor"
              strokeWidth=".6"
              opacity=".14"
            />
          </pattern>
        </defs>
        <path
          d="M25 227 240 285 455 227 240 168Z"
          fill={`url(#grid-${id}-${large})`}
        />
        <path
          d="M85 205V85l145-44v122L85 205Z"
          fill="white"
          fillOpacity=".24"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m230 41 164 55v120l-164-53V41Z"
          fill="white"
          fillOpacity=".1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m85 205 145-42 164 53-145 43L85 205Z"
          fill="white"
          fillOpacity=".25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m106 111 99-30v59l-99 30v-59Z"
          fill="currentColor"
          fillOpacity=".08"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="m155 97 1 59m-50-16 98-30"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        {id === 3 ? (
          <>
            <path
              d="m143 196 56-17 81 25-56 18-81-26Z"
              fill="#fff9ed"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M151 199v21m121-14v21m-47-5v20"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="m252 155 49-14 65 22v46l-49 15-65-23v-46Z"
              fill="currentColor"
            />
            <path
              d="m252 177 65 23 49-15m-49 15v24"
              stroke="white"
              strokeOpacity=".5"
            />
            <path
              d="M330 147v-36m-16-1 16-24 16 34-32-10Z"
              fill="#fff9ed"
              stroke="currentColor"
              strokeWidth="2"
            />
          </>
        ) : (
          <>
            <path
              d="m153 167 90-27 101 33-90 27-101-33Z"
              fill="#fff9ed"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M163 172v43m171-38v43m-80-20v46"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              d="m211 146 26-8 21 7-27 8-20-7Zm20 7 1 18 28-9-2-17"
              fill="currentColor"
            />
            <path
              d="m164 179-19-6-23 7v29l19 6 23-7v-29Z"
              fill="currentColor"
            />
            <path
              d="m145 188-23-8m23 8 19-9m-19 9v27"
              stroke="white"
              strokeOpacity=".4"
            />
            <path
              d="m293 204 19-6 23 7v29l-19 6-23-7v-29Z"
              fill="currentColor"
            />
            <path
              d="m312 213 23-8m-23 8-19-9m19 9v27"
              stroke="white"
              strokeOpacity=".4"
            />
            {id === 2 && (
              <>
                <path
                  d="m196 214-18-6-21 7v24l18 6 21-7v-24Z"
                  fill="currentColor"
                />
                <path
                  d="m311 146 18-6 21 7v24l-18 6-21-7v-24Z"
                  fill="currentColor"
                />
              </>
            )}
          </>
        )}
        <path
          d="M365 132v21m0-20c-26 0-30-26-18-28 9-2 18 15 18 28Zm0 0c26 0 30-26 18-28-9-2-18 15-18 28Z"
          fill="currentColor"
        />
        <path
          d="m353 150 24 8-4 24-16-5-4-27Z"
          fill="#fff9ed"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      <span className="art-corner">RF®</span>
    </div>
  );
}
