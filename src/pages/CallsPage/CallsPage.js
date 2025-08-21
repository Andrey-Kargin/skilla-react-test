import React, { useState, useEffect, useCallback } from "react";
import { getCallsList } from "../../utils/api";
import DatePicker from "../../components/DatePicker/DatePicker";
import Filter from "../../components/Filter/Filter";
import CallItem from "../../components/CallItem/CallItem";
import { ArrowUpIcon, ArrowDownIcon } from "../../UIKit/UIKit";
import './CallsPage.scss';

const CallsPage = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([undefined, undefined]);
  const [callType, setCallType] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  const [isPlayingId, setIsPlayingId] = useState(null);
  const [isCalendarOp, setIsCalendarOp] = useState(false);
  const [count, setCount] = useState(0);

  const formatDate = useCallback((date) => date.toISOString().split("T")[0], []);

  const fetchData = useCallback(async (range, type, sort) => {
    setLoading(true);
    try {
      const payload = {
        dateStart: range[0] && range[1] && formatDate(range[0]),
        dateEnd: range[0] && range[1] && formatDate(range[1]),
        callType: type,
        sortBy: sort,
      };
      const data = await getCallsList(payload);
      setCalls(data);
    } catch (error) {
      console.error("Ошибка в fetchDataCalls", error);
    } finally {
      setLoading(false);
    }
  }, [formatDate]);

  useEffect(() => {
    fetchData(dateRange, callType, sortBy);
  }, [callType, sortBy, fetchData, dateRange]);

  useEffect(() => {
    if (!dateRange[0] || !dateRange[1]) return;
    if (isCalendarOp) setIsCalendarOp(false);
    fetchData(dateRange, callType, sortBy);
  }, [dateRange]);

  return (
    <div className="calls-page">
      <div className="controls" style={{ display: "flex", justifyContent: "space-between" }}>
        <Filter
          callType={callType}
          setCallType={setCallType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setCount={setCount}
        />

        <DatePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOp={isCalendarOp}
          setIsCalendarOp={setIsCalendarOp}
          count={count}
          setCount={setCount}
        />
      </div>

      {loading ? (
        <div
          className="loading"
          style={{ height: "90vh", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Загрузка...
        </div>
      ) : (
        <div style={{ width: "100%", background: "rgba(255, 255, 255, 1)", padding: "24px 40px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }} id="callitemstable">
            <thead>
              <tr>
                <th style={{ width: "54px" }}>Тип</th>
                <th style={{ width: "88px" }}>
                  <span
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      color: sortBy === "date" ? "rgba(31, 70, 251, 1)" : "rgb(94, 119, 147)",
                    }}
                    onClick={() => setSortBy("date")}
                  >
                    {`Время `}
                    {sortBy === "date" ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  </span>
                </th>
                <th style={{ width: "129px" }}>Сотрудник</th>
                <th>Звонок</th>
                <th>Источник</th>
                <th>Оценка</th>
                <th>
                  <span
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      color: sortBy === "duration" ? "rgba(31, 70, 251, 1)" : "rgb(94, 119, 147)",
                    }}
                    onClick={() => setSortBy("duration")}
                  >
                    {`Длительность `}
                    {sortBy === "duration" ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {calls?.map((call) => (
                <CallItem
                  key={call.id}
                  call={call}
                  isPlayingId={isPlayingId}
                  setIsPlayingId={setIsPlayingId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CallsPage;
