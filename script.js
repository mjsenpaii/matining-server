document.addEventListener("DOMContentLoaded", () => {
    const flower = document.getElementById("flower");

    // Add a subtle rotation effect for the flower
    let rotation = 0;
    setInterval(() => {
        rotation += 1;
        flower.style.transform += ` rotate(${rotation}deg)`;
    }, 50);
});
