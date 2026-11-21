// ===============================
// LANDING PAGE LOADER
// ===============================

window.addEventListener('load', function () {

    const loader = document.getElementById('loader');

    setTimeout(function () {

        loader.style.opacity = '0';

        setTimeout(function () {
            loader.style.display = 'none';
        }, 1000);

    }, 500);

});


// ===============================
// EXPLORE BUTTON
// ===============================

const exploreBtn = document.getElementById('exploreBtn');

exploreBtn.addEventListener('click', function () {

    this.textContent = 'ENTERING EXPERIENCE...';

    this.style.pointerEvents = 'none';

    // Open separate 3D experience page

    setTimeout(function () {

        window.location.href = 'experience.html';

    }, 400);

});