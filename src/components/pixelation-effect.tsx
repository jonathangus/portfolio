'use client';

import type React from 'react';

import { useRef, useState, useEffect } from 'react';

// Configuration variables - easy to adjust
const CONFIG = {
  // Grid settings
  gridSize: 20, // Number of cells in each dimension (higher = more cells)

  // Pixelation settings
  maxPixelSize: 15, // Fully pixelated state (higher = more pixelated)
  minPixelSize: 4, // Less pixelated state (lower = less pixelated)

  // Animation settings
  transitionDuration: 800, // Duration of transition in milliseconds

  // Image settings
  imageUrl: '/face.png',
};

export default function PixelationEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const cellsRef = useRef<{ x: number; y: number; revealed: boolean }[]>([]);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Initialize the image and canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = CONFIG.imageUrl;

    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);

      // Create hit detection canvas
      const hitCanvas = document.createElement('canvas');
      hitCanvas.width = img.width;
      hitCanvas.height = img.height;
      const hitCtx = hitCanvas.getContext('2d', { alpha: true });

      if (hitCtx) {
        // Draw the image to the hit canvas
        hitCtx.drawImage(img, 0, 0);
        hitCanvasRef.current = hitCanvas;
      }

      // Initialize cells grid
      const cells = [];
      for (let y = 0; y < CONFIG.gridSize; y++) {
        for (let x = 0; x < CONFIG.gridSize; x++) {
          cells.push({ x, y, revealed: false });
        }
      }
      // Shuffle cells for random reveal order
      cellsRef.current = cells.sort(() => Math.random() - 0.5);

      drawImage(0); // Draw fully pixelated by default
    };

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate pixel size based on progress
  const getPixelSize = (progress: number) => {
    // Linear interpolation between maxPixelSize and minPixelSize
    return (
      CONFIG.maxPixelSize -
      progress * (CONFIG.maxPixelSize - CONFIG.minPixelSize)
    );
  };

  // Draw the image with varying levels of pixelation
  const drawImage = (progress: number) => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas dimensions to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear canvas (transparent)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sequential pixel-by-pixel transition
    // First draw the fully pixelated version as background
    drawPixelated(ctx, img, canvas.width, canvas.height, CONFIG.maxPixelSize);

    // Calculate how many cells to reveal based on progress
    const totalCells = cellsRef.current.length;
    const cellsToReveal = Math.floor(progress * totalCells);

    if (cellsToReveal > 0) {
      // Create a temporary canvas with the less pixelated version
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d', { alpha: true });

      if (tempCtx) {
        drawPixelated(
          tempCtx,
          img,
          canvas.width,
          canvas.height,
          CONFIG.minPixelSize
        );

        // Draw less pixelated sections for revealed cells
        const cellWidth = canvas.width / CONFIG.gridSize;
        const cellHeight = canvas.height / CONFIG.gridSize;

        for (let i = 0; i < cellsToReveal; i++) {
          const cell = cellsRef.current[i];
          const x = cell.x * cellWidth;
          const y = cell.y * cellHeight;

          // Draw this section from the less pixelated version
          ctx.drawImage(
            tempCanvas,
            x,
            y,
            cellWidth,
            cellHeight, // Source rectangle
            x,
            y,
            cellWidth,
            cellHeight // Destination rectangle
          );
        }
      }
    }
  };

  // Helper function to draw pixelated version while preserving transparency
  const drawPixelated = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    width: number,
    height: number,
    pixelSize: number
  ) => {
    // Create a temporary small canvas
    const smallCanvas = document.createElement('canvas');
    const smallCtx = smallCanvas.getContext('2d', { alpha: true });
    if (!smallCtx) return;

    // Calculate small dimensions
    const smallWidth = Math.floor(width / pixelSize);
    const smallHeight = Math.floor(height / pixelSize);

    smallCanvas.width = smallWidth;
    smallCanvas.height = smallHeight;

    // Clear the small canvas (transparent)
    smallCtx.clearRect(0, 0, smallWidth, smallHeight);

    // Draw small version
    smallCtx.drawImage(img, 0, 0, smallWidth, smallHeight);

    // Draw back to main canvas at original size with pixelated rendering
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      smallCanvas,
      0,
      0,
      smallWidth,
      smallHeight,
      0,
      0,
      width,
      height
    );
  };

  // Check if a point is over non-transparent content
  const isPointOverContent = (x: number, y: number) => {
    if (!hitCanvasRef.current) return false;

    const hitCtx = hitCanvasRef.current.getContext('2d', { alpha: true });
    if (!hitCtx) return false;

    // Get pixel data at the point
    const pixelData = hitCtx.getImageData(x, y, 1, 1).data;

    // Check if the pixel has any opacity (alpha > 0)
    return pixelData[3] > 0;
  };

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !isLoaded) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Calculate mouse position relative to the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setMousePosition({ x, y });

    // Check if the mouse is over content
    const overContent = isPointOverContent(x, y);
    setIsHovering(overContent);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setMousePosition(null);
    setIsHovering(false);
  };

  // Handle touch events
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !isLoaded || e.touches.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];

    // Calculate touch position relative to the canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (touch.clientX - rect.left) * scaleX;
    const y = (touch.clientY - rect.top) * scaleY;

    setMousePosition({ x, y });

    // Check if the touch is over content
    const overContent = isPointOverContent(x, y);
    setIsHovering(overContent);
  };

  // Animate the transition
  useEffect(() => {
    if (!isLoaded) return;

    let startTime: number | null = null;
    const duration = CONFIG.transitionDuration;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate progress (0 to 1)
      const targetProgress = isHovering ? 1 : 0;
      let progress = elapsed / duration;

      // Clamp progress and determine direction
      if (targetProgress === 1) {
        // Transitioning to less pixelated
        progress = Math.min(progress, 1);
      } else {
        // Transitioning to more pixelated
        progress = 1 - Math.min(progress, 1);
      }

      setTransitionProgress(progress);
      drawImage(progress);

      // Continue animation if not complete
      if (
        (targetProgress === 1 && progress < 1) ||
        (targetProgress === 0 && progress > 0)
      ) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Start new animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovering, isLoaded]);

  return (
    <div className="   ">
      <div
        className="relative max-w-md ml-auto w-full rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="w-full h-auto" />
      </div>
    </div>
  );
}
