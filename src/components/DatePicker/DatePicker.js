import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";
import { CalendarIcon, ArrowLeft, ArrowRight } from "../../UIKit/UIKit";
import "./DatePicker.scss";

const RangeDatePicker = ({ dateRange, setDateRange, isCalendarOp, setIsCalendarOp, count, setCount }) => {
  const [startDate, endDate] = dateRange;
  const today = new Date();
  const calendarRef = useRef(null);

  const inc = () => setCount(typeof count !== "number" ? 0 : (prev) => prev + 1);
  const dec = () => setCount(typeof count !== "number" ? 0 : (prev) => (prev === 0 ? 0 : prev - 1));

  useEffect(() => {
    const newDay = subDays(today, Number(count) || 0);
    if (count === 0) setDateRange([today, today]);
    if (typeof count === "number" && count !== 0) setDateRange([newDay, today]);
  }, [count]);

  const setPreset = (type, label) => {
    const map = { week: subWeeks, month: subMonths, year: subYears };
    const fn = map[type];
    const start = fn ? fn(today, 1) : today;
    setDateRange([start, today]);
    setCount(label);
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    setDateRange([start, end]);
    setCount("Календарь");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOp(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsCalendarOp]);

  return (
    <div style={{ position: "relative" }}>
      <div>
        <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }} ref={calendarRef}>
          <div style={{ display: "flex", gap: "22px" }}>
            <span onClick={dec}><ArrowLeft /></span>
            <span style={{ color: count ? "rgba(0, 95, 248, 1)" : "rgba(94, 119, 147, 1)", cursor: "default" }}>
              <span onClick={() => setIsCalendarOp(!isCalendarOp)}><CalendarIcon /></span>
              {typeof count === "number" ? `${count + 1}  дня` : count}
            </span>
            <span onClick={inc}><ArrowRight /></span>
          </div>

          {isCalendarOp && (
            <div className="selectdatawraper">
              <span
                onClick={() => setCount(2)}
                style={{ color: count === 2 ? "rgba(31, 70, 251, 1)" : "rgb(94, 119, 147)" }}
              >
                3 дня
              </span>
              <span
                onClick={() => setPreset("week", "Неделя")}
                style={{ color: count === "Неделя" ? "rgba(31, 70, 251, 1)" : "rgb(94, 119, 147)" }}
              >
                Неделя
              </span>
              <span
                onClick={() => setPreset("month", "Месяц")}
                style={{ color: count === "Месяц" ? "rgba(31, 70, 251, 1)" : "rgb(94, 119, 147)" }}
              >
                Месяц
              </span>
              <span onClick={() => setPreset("year", "Год")}>Год</span>

              <div className="datepickerwraper">
                <span>Указать даты</span>
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={onChange}
                  placeholderText="__.__.__-__.__.__"
                  dateFormat="dd.MM.yy"
                  monthsShown={2}
                  dropdownMode="select"
                  withPortal
                />
                <CalendarIcon />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RangeDatePicker;
