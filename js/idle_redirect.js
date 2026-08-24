/* Kiosk idle timeout: any page left untouched returns to the home screen,
   so the totem doesn't get stuck on a product page after a customer leaves. */
(function () {
	var TIMEOUT_MS = 90000;
	var timer;

	function goHome() {
		window.location.href = "index.html";
	}

	function reset() {
		clearTimeout(timer);
		timer = setTimeout(goHome, TIMEOUT_MS);
	}

	["click", "touchstart", "pointerdown", "keydown", "scroll"].forEach(function (evt) {
		document.addEventListener(evt, reset, { passive: true });
	});

	reset();
})();
