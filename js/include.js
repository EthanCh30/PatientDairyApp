document.addEventListener("DOMContentLoaded", function() {
    const includeNav = document.getElementById('nav-placeholder');
    const includeFooter = document.getElementById('footer-placeholder');

    if (includeNav) {
        fetch('includes/nav.html')
            .then(response => response.text())
            .then(data => includeNav.innerHTML = data);
    }

    if (includeFooter) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => includeFooter.innerHTML = data);
    }

    
});
