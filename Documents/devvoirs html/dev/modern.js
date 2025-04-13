document.addEventListener("DOMContentLoaded", function() {
    const heroTitle = document.querySelector(".hero h2");
    heroTitle.classList.add("animate-bounce");

    // Effet de défilement fluide pour les liens de navigation
    document.querySelectorAll("nav ul li a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: "smooth"
                });
            }
        });
    });

    // Animation au scroll
    const sections = document.querySelectorAll("section");
    window.addEventListener("scroll", function() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.classList.add("fade-in");
            }
        });
    });
});
