(() => {
    const startTime = Date.now();
    window.addEventListener("load", () => {
        const endTime = Date.now();
        const timeElement = document.getElementById("page-load-time")
        timeElement.innerText = `${
            endTime - startTime
        } ms`;
        timeElement.style.color = '#FFFFFF'
        document.getElementById("load-time").style.textAlign = 'center'
    });
})();