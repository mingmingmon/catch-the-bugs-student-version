import { Arrow, Asterisk } from "../components/Icon";

const FAQS = [
  [
    "예약은 어떻게 하나요?",
    "공간 둘러보기에서 인원을 선택해 검색하고, 마음에 드는 공간을 선택하세요. 이용 날짜와 시작·종료 시간, 사용할 포인트를 입력하면 예약할 수 있어요.",
  ],
  [
    "이용 금액은 어떻게 계산되나요?",
    "공간별 시간당 요금에 이용 시간을 곱해 계산해요. 1시간 단위로 예약하며 별도 할인이나 수수료는 없어요. 전체 금액에서 사용한 포인트를 제외한 금액이 결제 금액이에요.",
  ],
  [
    "포인트는 어떻게 사용하나요?",
    "예약할 때 보유한 포인트를 1P = 1원으로 사용할 수 있어요. 전체 이용 금액을 넘겨 사용할 수는 없어요. 예약을 취소하면 사용한 포인트가 환급돼요.",
  ],
  [
    "예약을 변경하거나 취소할 수 있나요?",
    "내 예약에서 예약 상세를 확인하고 취소할 수 있어요. 시간이나 공간을 변경하려면 기존 예약을 취소한 다음 다시 예약해 주세요.",
  ],
  [
    "예약 시간은 어떤 기준인가요?",
    "모든 시간과 날짜는 한국 시간(Asia/Seoul) 기준이에요. 앞 예약의 종료 시간에 바로 이어서 이용할 수 있지만, 같은 공간의 예약 시간이 겹칠 수는 없어요.",
  ],
];
export default function Guide() {
  return (
    <section className="inner-page container guide-page">
      <div className="page-heading">
        <span className="eyebrow">03 / GOOD TO KNOW</span>
        <h1>
          공간은 가볍게,
          <br />
          몰입은 깊게.
        </h1>
        <p>처음 방문하는 당신을 위한 작은 안내.</p>
        <Asterisk />
      </div>
      <div className="steps">
        {[
          [
            "01",
            "나에게 맞는 공간 찾기",
            "몇 명이 함께할지 정하고, 우리의 목적에 맞는 공간을 골라보세요.",
          ],
          [
            "02",
            "몰입할 시간 예약하기",
            "원하는 날짜와 시간을 선택하고 포인트로 더 가볍게 시작하세요.",
          ],
          [
            "03",
            "우리의 가능성 넓히기",
            "예약 내역을 확인하고, 정해진 시간에 공간을 자유롭게 이용하세요.",
          ],
        ].map(([number, title, description]) => (
          <article key={number}>
            <span>{number}</span>
            <Asterisk />
            <h2>{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <div className="faq-heading">
        <span className="eyebrow">A FEW ANSWERS</span>
        <h2>궁금할 수 있으니까.</h2>
      </div>
      <div className="faq-list">
        {FAQS.map(([question, answer], i) => (
          <details key={question}>
            <summary>
              <span>0{i + 1}</span>
              {question}
              <b>+</b>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <div className="guide-cta">
        <h2>이제, 당신의 공간을 만나보세요.</h2>
        <a className="button dark" href="#spaces">
          공간 둘러보기 <Arrow diagonal />
        </a>
      </div>
    </section>
  );
}
