export function initTutorial() {
    const screen = document.getElementById('tutorial-screen');
    const btnOpen = document.getElementById('btn-tutorial');
    const btnClose = document.getElementById('btn-tutorial-close');
    if (!screen || !btnOpen || !btnClose) return;

    function open() {
        screen.classList.remove('hidden');
        document.addEventListener('keydown', onKeyDown);
    }

    function close() {
        screen.classList.add('hidden');
        document.addEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') close();
    }

    btnOpen.addEventListener('click', open);
    btnClose.addEventListener('click', close);
    screen.addEventListener('click', (e) => {
        if (e.target === screen) close();
    });
}