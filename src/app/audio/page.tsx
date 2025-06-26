"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Spectrogram from "wavesurfer.js/dist/plugins/spectrogram.esm.js";
import { Button } from "@mantine/core";

const formatTime = (seconds: number) =>
  [seconds / 60, seconds % 60]
    .map((v) => `0${Math.floor(v)}`.slice(-2))
    .join(":");

export default function Audio() {
  const urlRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 150,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: "http://localhost:8899/此去半生.mp3",
    plugins: useMemo(
      () => [
        Timeline.create(),
        Spectrogram.create({
          labels: true,
          height: 200,
          scale: "mel",
          frequencyMax: 8000,
          frequencyMin: 0,
          fftSamples: 1024,
          labelsBackground: "rgba(0,0,0,0.1)",
        }),
      ],
      []
    ),
  });

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.on("ready", () => {
        console.log("ready");
        // wavesurfer.registerPlugin(Timeline.create());
      });
      wavesurfer.on("decode", (decodedData) => {
        console.log("decode", decodedData);
      });
      wavesurfer.on("click", () => {
        wavesurfer?.play();
      });
    }
  }, [wavesurfer]);

  const onPlayPause = useCallback(() => {
    wavesurfer?.playPause();
  }, [wavesurfer]);

  const onFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
      const url = URL.createObjectURL(e.target.files?.[0]!);
      urlRef.current = url;
      wavesurfer?.load(url);
      // loadBlob has some bugs: https://github.com/katspaugh/wavesurfer.js/blob/f9d7ce08a6e7e6d009d4f8b58f1a3b6e8ea8c266/src/wavesurfer.ts#L463
    },
    [wavesurfer]
  );

  return (
    <div className="p-4">
      <h1>Audio</h1>

      <input type="file" onChange={onFileUpload} />

      <div ref={containerRef} />

      <p>Current time: {formatTime(currentTime)}</p>

      <div className="flex gap-2 my-2">
        <Button w="10em" onClick={onPlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      <Button.Group>
      {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((time) => (
        <Button key={time} w="5em" onClick={() => wavesurfer?.seekTo(time)}>
          {time}
        </Button>
      ))}
      </Button.Group>
    </div>
  );
}
