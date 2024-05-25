document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('okno_mapki');
    const map = document.getElementById('mapa');

    let isPanning = false;
    let startX, startY, startScrollLeft, startScrollTop;
    let scale = 1;
    const scaleStep = 0.1;
    const maxScale = 3;
    const minScale = 0.5;

    const startPan = (x, y) => {
        isPanning = true;
        startX = x;
        startY = y;
        startScrollLeft = mapContainer.scrollLeft;
        startScrollTop = mapContainer.scrollTop;
        mapContainer.style.cursor = 'grabbing';
    };

    const endPan = () => {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    };

    const pan = (x, y) => {
        if (!isPanning) return;
        const deltaX = x - startX;
        const deltaY = y - startY;
        mapContainer.scrollLeft = startScrollLeft - deltaX;
        mapContainer.scrollTop = startScrollTop - deltaY;
    };

    // Replace 'mousedown' with 'pointerdown' to capture touch events as well
    mapContainer.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') {
            startPan(e.clientX, e.clientY);
        } else if (e.pointerType === 'touch' && e.touches.length === 1) {
            startPan(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    // Replace 'mouseup' with 'pointerup' to capture touch events as well
    mapContainer.addEventListener('pointerup', endPan);
    mapContainer.addEventListener('mouseleave', endPan);

    // Replace 'mousemove' with 'pointermove' to capture touch events as well
    mapContainer.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'mouse') {
            pan(e.clientX, e.clientY);
        } else if (e.pointerType === 'touch' && e.touches.length === 1) {
            pan(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    const zoom = (e) => {
        e.preventDefault();

        const rect = map.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const offsetXRatio = offsetX / rect.width;
        const offsetYRatio = offsetY / rect.height;

        const previousScale = scale;

        if (e.deltaY < 0 && scale < maxScale) {
            scale = Math.min(scale + scaleStep, maxScale);
        } else if (e.deltaY > 0 && scale > minScale) {
            scale = Math.max(scale - scaleStep, minScale);
        }

        const newWidth = map.clientWidth * scale;
        const newHeight = map.clientHeight * scale;

        const newScrollLeft = ((mapContainer.scrollLeft + offsetX) * scale / previousScale) - offsetX;
        const newScrollTop = ((mapContainer.scrollTop + offsetY) * scale / previousScale) - offsetY;

        map.style.transform = `scale(${scale})`;
        map.style.transformOrigin = `${offsetXRatio * 100}% ${offsetYRatio * 100}%`;

        mapContainer.scrollLeft = newScrollLeft;
        mapContainer.scrollTop = newScrollTop;
    };

    mapContainer.addEventListener('wheel', zoom);

    mapContainer.style.cursor = 'grab';
});