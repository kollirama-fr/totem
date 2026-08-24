/* Reliable "back" for the kiosk.
   javascript:history.go(-1) silently no-ops whenever the browser history
   is empty (fresh kiosk launch, or after the idle-timeout redirect wipes
   it) or points somewhere outside the site. Instead we keep our own
   visited-pages stack in sessionStorage, independent of browser history,
   and each Back click pops one level off it. */
(function () {
	var KEY = "kiosk_nav_stack";
	var current = location.pathname.split("/").pop() || "index.html";
	var stack = [];

	try {
		stack = JSON.parse(sessionStorage.getItem(KEY)) || [];
	} catch (e) {
		stack = [];
	}

	if (current === "index.html") {
		stack = ["index.html"];
	} else if (stack.length === 0) {
		stack = ["index.html", current];
	} else if (stack[stack.length - 1] !== current) {
		stack.push(current);
	}

	try {
		sessionStorage.setItem(KEY, JSON.stringify(stack));
	} catch (e) {}

	window.kioskGoBack = function () {
		var s = [];
		try {
			s = JSON.parse(sessionStorage.getItem(KEY)) || [];
		} catch (e) {
			s = [];
		}
		if (s.length > 1) {
			s.pop();
		}
		var target = s.length ? s[s.length - 1] : "index.html";
		try {
			sessionStorage.setItem(KEY, JSON.stringify(s));
		} catch (e) {}
		location.href = target;
	};

	document.addEventListener("DOMContentLoaded", function () {
		var btn = document.querySelector(".js-kiosk-back");
		if (btn) btn.addEventListener("click", window.kioskGoBack);
	});
})();
