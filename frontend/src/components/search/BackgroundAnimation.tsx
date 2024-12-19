import React, { useEffect, useRef } from "react";

const ChristmasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current || new HTMLCanvasElement();
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Snowflake {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      spin: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speed = Math.random() * 1 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.1 - 0.05;
      }

      update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 0.3;
        this.angle += this.spin;

        if (this.y > canvas.height) {
          this.y = 0;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx!.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const snowflakes: Snowflake[] = [];
    const numberOfSnowflakes = 100;

    for (let i = 0; i < numberOfSnowflakes; i++) {
      snowflakes.push(new Snowflake());
    }

    function drawSnowman(x: number, y: number) {
      // Body
      ctx!.fillStyle = "white";
      ctx!.beginPath();
      ctx!.arc(x, y + 60, 30, 0, Math.PI * 2);
      ctx!.arc(x, y + 20, 20, 0, Math.PI * 2);
      ctx!.fill();

      // Eyes
      ctx!.fillStyle = "black";
      ctx!.beginPath();
      ctx!.arc(x - 7, y + 15, 2, 0, Math.PI * 2);
      ctx!.arc(x + 7, y + 15, 2, 0, Math.PI * 2);
      ctx!.fill();

      // Carrot nose
      ctx!.fillStyle = "orange";
      ctx!.beginPath();
      ctx!.moveTo(x, y + 20);
      ctx!.lineTo(x + 15, y + 22);
      ctx!.lineTo(x, y + 24);
      ctx!.fill();

      // Hat
      ctx!.fillStyle = "black";
      ctx!.fillRect(x - 15, y, 30, 5);
      ctx!.fillRect(x - 10, y - 15, 20, 15);
    }

    function drawSnowHill() {
      ctx!.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx!.beginPath();
      ctx!.moveTo(-500, canvas.height);
      ctx!.quadraticCurveTo(
        canvas.width / 2,
        canvas.height - 100,
        canvas.width,
        canvas.height
      );
      ctx!.fill();
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      // Draw gradient background
      const gradient = ctx!.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a237e"); // Deep blue
      gradient.addColorStop(1, "#4a148c"); // Deep purple
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      drawSnowHill();

      // Draw snowflakes
      snowflakes.forEach((snowflake) => {
        snowflake.update();
        snowflake.draw();
      });

      // Draw snowmen
      drawSnowman(100, canvas.height - 100);
      // drawSnowman(canvas.width - 100, canvas.height - 150);

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 " />;
};

export default ChristmasBackground;
