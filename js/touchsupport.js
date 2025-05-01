export function initializeTouchSupport(gameContainerId, onSwipeCallback) {
    const gameContainer = document.getElementById(gameContainerId);
    let startX = 0;
    let startY = 0;

    if (!gameContainer) {
        console.error(`Element with ID "${gameContainerId}" not found.`);
        return;
    }

    gameContainer.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    gameContainer.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling during swipe
    }, { passive: false });

    gameContainer.addEventListener('touchend', (e) => {
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;

        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                onSwipeCallback('right'); // Swipe right
            } else {
                onSwipeCallback('left'); // Swipe left
            }
        } else {
            // Vertical swipe
            if (diffY > 0) {
                onSwipeCallback('down'); // Swipe down
            } else {
                onSwipeCallback('up'); // Swipe up
            }
        }
    });
}