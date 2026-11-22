function explorePlatform() {
    document.querySelector("#markets").scrollIntoView({
        behavior: "smooth"
    });
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("BLACK AURUM Dashboard loaded.");

    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        card.addEventListener("mouseenter", function() {
            card.style.borderColor = "#D6B56D";
        });

        card.addEventListener("mouseleave", function() {
            card.style.borderColor = "#302A20";
        });
    });
});
