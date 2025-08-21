import React, { useState, useRef, useEffect } from "react";
import { PlayButton, PauseButton, DownloadIcon, CloseIcon } from "../../UIKit/UIKit";
import "./Player.scss";

const Player = ({ recordId, setIsPlayingId, isPlayingId, callId, audioFile }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime || 0);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsPlayingId(null);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioFile, setIsPlayingId]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      setIsPlayingId(callId);
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseMove = (e) => {
    const bar = progressBarRef.current;
    if (!bar || !duration) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setHoverTime(pos * duration);
    setHoverPosition(pos * 100);
  };

  const handleMouseLeave = () => setHoverTime(null);

  const handleDownload = () => {
    if (!audioFile) return;
    const link = document.createElement("a");
    link.href = audioFile;
    link.download = `record-${recordId}.mp3`;
    link.click();
  };

  const formatTime = (seconds) => {
    const s = Number.isFinite(seconds) ? seconds : 0;
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!audioFile) return <p>Загрузка записи</p>;

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player" style={{ height: "48px" }}>
      <div className="time-display">{formatTime(duration - currentTime)}</div>

      <span onClick={togglePlay} style={{ cursor: "pointer", width: "24px", height: "24px" }}>
        {isPlaying ? <PauseButton /> : <PlayButton />}
      </span>

      <div
        className="progress-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={progressBarRef}
        style={{ display: "flex" }}
      >
        {hoverTime !== null && (
          <div className="time-tooltip" style={{ left: `${hoverPosition}%` }}>
            {formatTime(duration - hoverTime)}
          </div>
        )}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          className="progress-bar"
          disabled={!audioFile}
          style={{ background: `linear-gradient(to right, #1a73e8 ${pct}%, #e0e0e0 ${pct}%)` }}
        />
      </div>

      <span onClick={handleDownload} style={{ cursor: "pointer", width: "24px", height: "24px" }}>
        <DownloadIcon />
      </span>

      <span
        style={{ cursor: "pointer", width: "24px", height: "24px" }}
        onClick={() => {
          const audio = audioRef.current;
          if (audio) {
            audio.pause();
            audio.currentTime = 0;
          }
          setIsPlaying(false);
          if (isPlayingId === callId) setIsPlayingId(null);
        }}
      >
        <CloseIcon />
      </span>

      <audio ref={audioRef} src={audioFile} />
    </div>
  );
};

export default Player;
