// Load header into all pages
const headerPath = window.location.pathname.includes('/projects/') ? '../header.html' : 'header.html';
fetch(headerPath)
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-placeholder').innerHTML = data;
    });