"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { LINKS } from "@/lib/config";

export function Footer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(LINKS.EMAIL);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }, []);

  // Game canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dinoY = useRef(0);
  const dinoVelocity = useRef(0);
  const isDucking = useRef(false);
  const cactusX = useRef(906);
  const cactusSpeed = useRef(5.5);
  const animationFrameId = useRef<number | null>(null);
  const gameOverRef = useRef(false);

  const handleJumpOrRestart = useCallback(() => {
    if (gameOverRef.current) {
      dinoY.current = 0;
      dinoVelocity.current = -8.8; // jump immediately upon restart
      cactusX.current = 906;
      cactusSpeed.current = 5.2;
      setScore(0);
      gameOverRef.current = false;
      setGameOver(false);
      return;
    }
    if (dinoY.current === 0) {
      dinoVelocity.current = -8.8; // calibrated so peak jump is ~62px, leaving generous ceiling in 110px canvas
    }
  }, []);

  // Keyboard shortcut listener: 'g' / 'G' to start, Space / ArrowUp to jump/restart, ArrowDown to duck, Esc to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if ((e.key === "g" || e.key === "G") && !isPlaying) {
        setIsPlaying(true);
      }
      if (e.key === "Escape" && isPlaying) {
        setIsPlaying(false);
      }
      if (isPlaying) {
        if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
          e.preventDefault();
          handleJumpOrRestart();
        }
        if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
          e.preventDefault();
          isDucking.current = true;
          // Faster drop if in air
          if (dinoY.current < 0) {
            dinoVelocity.current += 4.5;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        isDucking.current = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPlaying, handleJumpOrRestart]);

  // Game loop (runs when isPlaying is true)
  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dinoImg = new window.Image();
    dinoImg.src = "/assets/game/dino.png";

    const dinoDuckImg = new window.Image();
    dinoDuckImg.src = "/assets/game/dino_duck.png";

    const cactusImg = new window.Image();
    cactusImg.src = "/assets/game/cactus.png";

    let currentScore = 0;
    dinoY.current = 0;
    dinoVelocity.current = 0;
    cactusX.current = canvas.width;
    cactusSpeed.current = 5.2;
    gameOverRef.current = false;
    setGameOver(false);

    let isRunning = true;
    let frameCount = 0;

    const loop = () => {
      if (!isRunning) return;
      frameCount++;

      if (gameOverRef.current) {
        // Keep frame loop active so restart on Space is immediate
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      // Update dino physics
      dinoY.current += dinoVelocity.current;
      dinoVelocity.current += 0.62; // gravity

      if (dinoY.current > 0) {
        dinoY.current = 0;
        dinoVelocity.current = 0;
      }

      // Update cactus
      cactusX.current -= cactusSpeed.current;
      if (cactusX.current < -35) {
        cactusX.current = canvas.width + Math.random() * 220;
        cactusSpeed.current = Math.min(10.5, cactusSpeed.current + 0.15);
        currentScore += 1;
        setScore(currentScore);
        setHighScore((prev) => Math.max(prev, currentScore));
      }

      // Clear canvas with transparent background (seamless with page #F2F2F2)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const groundY = canvas.height - 8;

      // Draw baseline dashed track
      ctx.strokeStyle = "rgba(141, 141, 141, 0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Dino Sprite Dimensions (matching actual sprite natural ratio)
      const ducking = isDucking.current;
      const dinoW = ducking ? 38 : 30;
      const dinoH = ducking ? 22 : 32;
      const dinoScreenY = groundY - dinoH + dinoY.current;
      const dinoScreenX = 40;

      const activeDinoSprite = ducking ? dinoDuckImg : dinoImg;
      ctx.drawImage(activeDinoSprite, dinoScreenX, dinoScreenY, dinoW, dinoH);

      // Cactus (22x26)
      const cactusW = 22;
      const cactusH = 26;
      const cactusScreenY = groundY - cactusH;

      ctx.drawImage(cactusImg, cactusX.current, cactusScreenY, cactusW, cactusH);

      // Collision Detection
      if (
        cactusX.current < dinoScreenX + dinoW - 8 &&
        cactusX.current + cactusW > dinoScreenX + 8 &&
        dinoScreenY + dinoH - 4 > cactusScreenY
      ) {
        gameOverRef.current = true;
        setGameOver(true);
        animationFrameId.current = requestAnimationFrame(loop);
        return;
      }

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  return (
    <footer id="footer" className="mt-[30px] pb-[60px]">
      {isPlaying ? (
        /* Active Chrome Dinosaur Game Canvas Bar */
        <div
          onClick={handleJumpOrRestart}
          className="relative w-full h-[110px] rounded-[16px] bg-[#E8E8E8] border border-[#8D8D8D]/20 overflow-hidden select-none cursor-pointer flex flex-col justify-between p-3"
          aria-label="Chrome Dinosaur Game. Space/Up to jump, Down to duck, Esc to exit."
        >
          <canvas
            ref={canvasRef}
            width={906}
            height={70}
            className="w-full h-[70px] block"
          />

          {/* Game Bar Bottom Row: Controls & Score */}
          <div className="flex items-center justify-between text-[13px] text-muted font-sans pt-1 border-t border-[#8D8D8D]/15">
            {gameOver ? (
              <span className="text-accent font-medium inline-flex items-center gap-1.5">
                <Image
                  src="/assets/game/dino-dead.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
                <span>Hit space to retry</span>
              </span>
            ) : (
              <span className="inline-flex items-center">
                <span>Space to jump</span>
                <span className="mx-2">•</span>
                <span>↓ Duck</span>
                <span className="mx-2">•</span>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="cursor-pointer hover:opacity-75"
                >
                  Esc exit
                </button>
              </span>
            )}
            <span className="tabular-nums font-mono text-primary">
              {String(score).padStart(5, "0")} / HI {String(highScore).padStart(5, "0")}
            </span>
          </div>
        </div>
      ) : (
        /* Resting State: 100% exact Figma Frame 25 & Frame 27 layout */
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 h-[40px]">
          {/* Left: Copyright (Figma: y=2064, Duplet 400 14px/22px #232323) */}
          <p className="font-sans text-[14px] leading-[22px] text-primary m-0 font-normal">
            © 2026 Sajidur Rahman
          </p>

          {/* Center: "Click to Play" Pill Button (Frame 25: 137x40px, rounded 12px, #232323, padding 10px 14px) */}
          <div className="hidden md:flex items-center justify-center">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label="Play dinosaur game (or press G)"
              className="w-[137px] h-[40px] rounded-[12px] bg-primary flex items-center justify-center px-[14px] py-[10px] cursor-pointer hover:opacity-90 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <Image
                src="/assets/game/controller.svg"
                alt="Click to Play"
                width={109}
                height={20}
                className="pointer-events-none select-none"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Right: Social Links (Frame 27: y=2064, gap 20px, Duplet 400 14px/22px, underline, #232323) */}
          <div className="flex items-center gap-[20px] font-sans text-[14px] leading-[22px] text-primary">
            <a
              href={LINKS.LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              LinkedIn
            </a>
            <a
              href={LINKS.X}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              X
            </a>
            <a
              href={LINKS.DRIBBBLE}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Dribbble
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email address"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity cursor-pointer inline-flex items-center gap-1"
              title="Click to copy heysajidur@gmail.com"
            >
              <span>{emailCopied ? "Copied!" : "Email"}</span>
            </button>
            <a
              href={LINKS.CV}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-75 transition-opacity"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </footer>
  );
}
