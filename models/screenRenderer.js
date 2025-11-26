function drawStartScreen(world) {
    world.ctx.save();
    world.isPaused = true;
    drawOverlayBackground(world, 1);
    if (world.startImg.complete) {
        const rect = drawCenteredImage(world, world.startImg, 0.6);
        world.startButton = rect;
    }
    world.canvas.style.cursor = 'pointer';
    world.ctx.restore();
}

  
function drawEndScreen(world, mainImg) {
    world.ctx.save();
    world.isPaused = true;
    world.stopBackgroundSound();
    drawOverlayBackground(world, 0.6);
    if (!mainImg.complete) {
        world.ctx.restore();
        return; }
    const rect = drawCenteredImage(world, mainImg, 0.7, -40);
    drawTryAgainBelow(world, world.tryAgainImg, rect, 0.4, 20);
    world.canvas.style.cursor = 'pointer';
    world.ctx.restore();
}


  function drawOverlayBackground(world, alpha = 1) {
    const ctx = world.ctx;
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
}

function drawCenteredImage(world, img, relativeWidth = 0.7, yOffset = 0) {
    const width = world.canvas.width * relativeWidth;
    const scale = width / img.width;
    const height = img.height * scale;
    const x = (world.canvas.width - width) / 2;
    const y = (world.canvas.height - height) / 2 + yOffset;
    world.ctx.drawImage(img, x, y, width, height);
    return { x, y, width, height };
}

function drawTryAgainBelow(world, img, aboveRect, relativeWidth = 0.4, margin = 20) {
    if (!img.complete) {
        world.tryAgainButton = null;
        return;
    }
    const width  = aboveRect.width * relativeWidth;
    const scale  = width / img.width;
    const height = img.height * scale;
    const x = (world.canvas.width - width) / 2;
    const y = aboveRect.y + aboveRect.height + margin;
    world.ctx.drawImage(img, x, y, width, height);
    world.tryAgainButton = { x, y, width, height };
}
