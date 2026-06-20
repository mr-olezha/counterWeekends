import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const today = new Date();

  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState(0);

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dark, setDark] = useState(true);

  const [hearts, setHearts] = useState([]);
  const [rainHearts, setRainHearts] = useState([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const [year, setYear] = useState(today.getFullYear());
  const baseDate = new Date(2026, 5, 1);

  const isSunday = (date) => date.getDay() === 0;

  const loveQuotesDaily = [
    "Ты — мой самый тихий дом.",
    "С тобой даже молчание имеет смысл.",
    "Я выбираю тебя снова и снова.",
    "Ты делаешь мой день проще.",
    "Всё становится лучше, когда ты рядом.",
    "Ты — моя привычка счастья.",
    "С тобой не нужно ничего лишнего.",
    "Ты — причина моего спокойствия.",
    "Мне достаточно просто знать, что ты есть.",
    "Ты — мой лучший момент дня.",
    "Если бы можно было выбрать чувство — я бы выбрал тебя.",
    "Ты — мой баланс во всём хаосе.",
  ];

  const getDayIndex = (date) => {
    const diff = Math.floor((date - startDate) / 86400000);
    return Math.abs(diff);
  };

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const getDailyQuote = (date) => {
    return loveQuotesDaily[getDayIndex(date) % loveQuotesDaily.length];
  };

  const getWorkDayIndex = (date) => {
    const diff = Math.floor((date - baseDate) / 86400000);

    let sundays = 0;
    for (let i = 0; i <= diff; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      if (d.getDay() === 0) sundays++;
    }

    return diff - sundays;
  };

  const weekA = ["off", "off", "work", "work", "off", "off"];
  const weekB = ["work", "work", "off", "off", "work", "work"];

  const getDayType = (date) => {
    if (isSunday(date)) return "sunday";

    const workIndex = getWorkDayIndex(date);
    const pattern = Math.floor(workIndex / 6) % 2 === 0 ? weekA : weekB;

    return pattern[workIndex % 6];
  };

  // ❤️ клики
  const spawnHeart = (e) => {
    const id = Date.now() + Math.random();

    setHearts((prev) => [
      ...prev,
      { id, x: e.clientX, y: e.clientY },
    ]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 900);
  };

  // 🌧 дождь
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();

      setRainHearts((prev) => [
        ...prev.slice(-25),
        { id, x: Math.random() * window.innerWidth },
      ]);

      setTimeout(() => {
        setRainHearts((prev) => prev.filter((h) => h.id !== id));
      }, 4000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 12,
      y: (e.clientY / window.innerHeight - 0.5) * 12,
    });
  };

  const [stars] = useState(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
    }));
  });

  // ⬅️➡️ ПЕРЕКЛЮЧЕНИЕ МЕСЯЦА
const prevMonth = () => {
  setDirection(-1);
  setAnimKey((k) => k + 1);

  setMonth((m) => {
    if (m === 1) {
      setYear((y) => y - 1);
      return 12;
    }

      return m - 1;
    });
  };

  const nextMonth = () => {
    setDirection(1);
    setAnimKey((k) => k + 1);

    setMonth((m) => {
      if (m === 12) {
        setYear((y) => y + 1);
        return 1;
      }

      return m + 1;
    });
  };

  const offset = (() => {
    const d = new Date(year, month - 1, 1).getDay();
    return (d + 6) % 7;
  })();

  const daysInMonth = new Date(year, month, 0).getDate();

  const days = [
    ...Array.from({ length: offset }, () => ({
      day: "",
      type: "empty",
    })),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month - 1, i + 1);

      return {
        day: i + 1,
        type: getDayType(date),
        isToday: date.toDateString() === today.toDateString(),
      };
    }),
  ];

  return (
    <div
      className={`page ${dark ? "dark" : "light"}`}
      onMouseMove={handleMouseMove}
      onClick={spawnHeart}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          className="star"
          style={{ left: s.x, top: s.y, width: s.size, height: s.size }}
        />
      ))}

      {hearts.map((h) => (
        <div key={h.id} className="floatingHeart" style={{ left: h.x, top: h.y }}>
          ❤
        </div>
      ))}

      {rainHearts.map((h) => (
        <div key={h.id} className="rainHeart" style={{ left: h.x }}>
          ❤
        </div>
      ))}

      <div className="themeToggle" onClick={() => setDark(!dark)}>
        <div className={`themeIcon ${dark ? "dark" : "light"}`}>
          {dark ? "🌙" : "☀️"}
        </div>
      </div>

      <div className="loveQuote">{getDailyQuote(today)}</div>

      <div
        className="card"
        style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}
      >
        <h1>TimeFlow</h1>

        {/* 🔥 МЕСЯЦ + СТРЕЛКИ */}
        <div className="monthRow">
          <button className="arrowBtn" onClick={prevMonth}>◀</button>

          <div
            key={animKey}
            className={`monthText slide-${direction}`}
          >
            {[
              "Січень","Лютий","Березень","Квітень","Травень","Червень",
              "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"
            ][month - 1]} {year}
          </div>

          <button className="arrowBtn" onClick={nextMonth}>▶</button>
        </div>

        <div className="weekdays">
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        <div className="grid">
          {days.map((d, i) => (
            <div key={i} className={`day ${d.type} ${d.isToday ? "today" : ""}`}>
              {d.day}
            </div>
          ))}
        </div>

        <div className="legend">
        <div className="legendItem">
          <span className="legendColor work"></span>
          <span>Робочий день</span>
        </div>

        <div className="legendItem">
          <span className="legendColor off"></span>
          <span>Вихідний</span>
        </div>

        <div className="legendItem">
          <span className="legendColor sunday"></span>
          <span>Неділя</span>
        </div>
      </div>
      </div>
    </div>
  );
}