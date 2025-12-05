/**
 * Draws the start screen overlay.
 * Pauses the game, renders background + start image,
 * and sets the clickable start button area.
 */
function drawStartScreen(world) {
  world.ctx.save();
  world.isPaused = true;
  drawOverlayBackground(world, 1);
  if (world.startImg.complete) {
    const rect = drawCenteredImage(world, world.startImg, 0.6);
    world.startButton = rect;
  }
  world.canvas.style.cursor = "pointer";
  world.ctx.restore();
}

/**
 * Draws the end screen overlay.
 * Pauses game, stops background sound, shows result image,
 * and renders a “try again” button below it.
 */
function drawEndScreen(world, mainImg) {
  world.ctx.save();
  world.isPaused = true;
  world.stopBackgroundSound();
  drawOverlayBackground(world, 0.6);
  if (!mainImg.complete) {
    world.ctx.restore();
    return;
  }
  const rect = drawCenteredImage(world, mainImg, 0.7, -40);
  drawTryAgainBelow(world, world.tryAgainImg, rect, 0.4, 20);
  world.canvas.style.cursor = "pointer";
  world.ctx.restore();
}

/**
 * Draws a dark overlay background with adjustable transparency.
 * @param {object} world - Game world containing canvas and context.
 * @param {number} alpha - Overlay opacity (default 1).
 */
function drawOverlayBackground(world, alpha = 1) {
  const ctx = world.ctx;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
}

/**
 * Draws an image centered on the canvas with scaling.
 * @returns {object} Bounding rectangle of the drawn image.
 */
function drawCenteredImage(world, img, relativeWidth = 0.7, yOffset = 0) {
  const width = world.canvas.width * relativeWidth;
  const scale = width / img.width;
  const height = img.height * scale;
  const x = (world.canvas.width - width) / 2;
  const y = (world.canvas.height - height) / 2 + yOffset;
  world.ctx.drawImage(img, x, y, width, height);
  return { x, y, width, height };
}

/**
 * Draws the “try again” button below another element.
 * Scales image, positions it under the given rect, and stores button bounds.
 */
function drawTryAgainBelow(world, img, aboveRect, relativeWidth = 0.4, margin = 20) {
    if (!isImageReady(img)) {
      world.tryAgainButton = null;
      return;
    }
    const { width, height } = computeScaledSize(img, aboveRect.width, relativeWidth);
    const { x, y } = computeTryAgainPosition(world.canvas, aboveRect, width, height, margin);
    drawButtonImage(world.ctx, img, x, y, width, height);
    world.tryAgainButton = createButtonBounds(x, y, width, height);
  }
  
  /**
 * Checks whether an image has finished loading.
 * @returns {boolean} True if the image is ready to be drawn.
 */
  function isImageReady(img) {
    return img.complete && img.naturalWidth > 0;
  }
  
/**
 * Computes scaled width and height for an image.
 * @returns {object} Scaled width and height.
 */
  function computeScaledSize(img, baseWidth, relativeWidth) {
    const width = baseWidth * relativeWidth;
    const scale = width / img.width;
    return { width, height: img.height * scale };
  }
  
  /**
 * Calculates centered position below another element.
 * @returns {object} X/Y coordinates for placement.
 */
  function computeTryAgainPosition(canvas, aboveRect, width, height, margin) {
    const x = (canvas.width - width) / 2;
    const y = aboveRect.y + aboveRect.height + margin;
    return { x, y };
  }
  
  /**
 * Draws a button image at the given position and size.
 */
  function drawButtonImage(ctx, img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
  }
  
  /**
 * Creates a rectangle object representing clickable button bounds.
 */

  function createButtonBounds(x, y, width, height) {
    return { x, y, width, height };
  }
  