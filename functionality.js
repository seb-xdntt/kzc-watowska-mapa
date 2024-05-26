document.addEventListener('DOMContentLoaded', () => {
    const mapContainer = document.getElementById('okno_mapki');
    const map = document.getElementById('mapa');

    let isPanning = false;
    let startX, startY, transformMatrix;
    const MIN_SCALE = 1;
    const MAX_SCALE = 3;
    const SCALE_STEP = 0.1;

    const DEFAULT_TRANSFORMATION = {
        originX: 0,
        originY: 0,
        translateX: 0,
        translateY: 0,
        scale: 1
    };

    let state = {
        container: mapContainer,
        element: map,
        minScale: MIN_SCALE,
        maxScale: MAX_SCALE,
        scaleSensitivity: 20,
        transform: { ...DEFAULT_TRANSFORMATION }
    };

    function getTransformMatrix() {
        const transformValue = window.getComputedStyle(map).getPropertyValue('transform');
        if (transformValue === 'none') {
            return [1, 0, 0, 1, 0, 0];
        }
        return transformValue.split('(')[1].split(')')[0].split(',').map(parseFloat);
    }

    function setTransformMatrix(matrix) {
        map.style.transform = `matrix(${matrix.join(', ')})`;
    }

    function zoomMap(deltaY, offsetX, offsetY) {
        const [a, b, c, d, e, f] = transformMatrix;
        const scale = a;

        let newScale = scale + (deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
        newScale = Math.min(Math.max(newScale, MIN_SCALE), MAX_SCALE);

        const scaleRatio = newScale / scale;
        const newMatrix = [
            newScale, b, c, newScale,
            e + (1 - scaleRatio) * offsetX,
            f + (1 - scaleRatio) * offsetY
        ];

        setTransformMatrix(newMatrix);
        transformMatrix = newMatrix;
    }

    function panMap(deltaX, deltaY) {
        const [a, b, c, d, e, f] = transformMatrix;
        const newMatrix = [a, b, c, d, e + deltaX, f + deltaY];
        setTransformMatrix(newMatrix);
        transformMatrix = newMatrix;
    }

    function clampedTranslate({ axis, translate }) {
        const { scale, originX, originY } = state.transform;
        const axisIsX = axis === 'x';
        const origin = axisIsX ? originX : originY;
        const axisKey = axisIsX ? 'offsetWidth' : 'offsetHeight';

        const containerSize = state.container[axisKey];
        const imageSize = state.element[axisKey];
        const bounds = state.element.getBoundingClientRect();

        const imageScaledSize = axisIsX ? bounds.width : bounds.height;

        const defaultOrigin = imageSize / 2;
        const originOffset = (origin - defaultOrigin) * (scale - 1);

        const range = Math.max(0, Math.round(imageScaledSize) - containerSize);

        const max = Math.round(range / 2);
        const min = 0 - max;

        return Math.max(Math.min(translate, max + originOffset), min + originOffset);
    }

    function renderClamped({ translateX, translateY }) {
        const { originX, originY, scale } = state.transform;
        state.transform.translateX = clampedTranslate({ axis: 'x', translate: translateX });
        state.transform.translateY = clampedTranslate({ axis: 'y', translate: translateY });

        requestAnimationFrame(() => {
            map.style.transformOrigin = `${originX}px ${originY}px`;
            map.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${state.transform.translateX}, ${state.transform.translateY})`;
        });
    }

    function handleTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            isPanning = true;
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }
    }

    function handleTouchMove(event) {
        if (!isPanning || event.touches.length !== 1) return;
        event.preventDefault();
        const deltaX = event.touches[0].clientX - startX;
        const deltaY = event.touches[0].clientY - startY;
        panMap(deltaX, deltaY);
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    }

    function handleTouchEnd() {
        isPanning = false;
    }

    mapContainer.addEventListener('mousedown', (event) => {
        event.preventDefault();
        isPanning = true;
        startX = event.clientX;
        startY = event.clientY;
        mapContainer.style.cursor = 'grabbing';
    });

    mapContainer.addEventListener('mousemove', (event) => {
        if (!isPanning) return;
        event.preventDefault();
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        panMap(deltaX, deltaY);
        startX = event.clientX;
        startY = event.clientY;
    });

    mapContainer.addEventListener('mouseup', () => {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('mouseleave', () => {
        isPanning = false;
        mapContainer.style.cursor = 'grab';
    });

    mapContainer.addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = map.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        zoomMap(event.deltaY, offsetX, offsetY);
    });

    mapContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    mapContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    mapContainer.addEventListener('touchend', handleTouchEnd);
    mapContainer.addEventListener('touchcancel', handleTouchEnd);

    transformMatrix = getTransformMatrix();
    mapContainer.style.cursor = 'grab';
});