(() => {
  const copy = {
    fr: {
      button: "Installer",
      kicker: "Portfolio Groupe Smart Concept",
      title: "Installer sur cet appareil",
      ios: "Sur iPhone : touchez le bouton <strong>Partager</strong>, puis <strong>Sur l’écran d’accueil</strong> et enfin <strong>Ajouter</strong>.",
      fallback: "Dans le menu de votre navigateur, choisissez <strong>Installer l’application</strong> ou <strong>Ajouter à l’écran d’accueil</strong>.",
      close: "Fermer"
    },
    en: {
      button: "Install",
      kicker: "Groupe Smart Concept portfolio",
      title: "Install on this device",
      ios: "On iPhone, tap <strong>Share</strong>, then <strong>Add to Home Screen</strong> and <strong>Add</strong>.",
      fallback: "Open your browser menu and choose <strong>Install app</strong> or <strong>Add to Home Screen</strong>.",
      close: "Close"
    },
    es: {
      button: "Instalar",
      kicker: "Portfolio Groupe Smart Concept",
      title: "Instalar en este dispositivo",
      ios: "En iPhone, pulse <strong>Compartir</strong>, después <strong>Añadir a pantalla de inicio</strong> y <strong>Añadir</strong>.",
      fallback: "Abra el menú del navegador y elija <strong>Instalar aplicación</strong> o <strong>Añadir a pantalla de inicio</strong>.",
      close: "Cerrar"
    },
    ar: {
      button: "تثبيت",
      kicker: "ملف مجموعة سمارت كونسبت",
      title: "تثبيت على هذا الجهاز",
      ios: "على iPhone اضغط على <strong>مشاركة</strong>، ثم <strong>إضافة إلى الشاشة الرئيسية</strong>، ثم <strong>إضافة</strong>.",
      fallback: "افتح قائمة المتصفح واختر <strong>تثبيت التطبيق</strong> أو <strong>إضافة إلى الشاشة الرئيسية</strong>.",
      close: "إغلاق"
    }
  };

  const language = (document.documentElement.lang || "fr").split("-")[0];
  const words = copy[language] || copy.fr;
  const scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : window.location.href;
  const baseUrl = new URL(".", scriptUrl);
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  let deferredPrompt = null;

  const button = document.createElement("button");
  button.id = "install-app";
  button.className = "install-app";
  button.type = "button";
  button.hidden = true;
  button.setAttribute("aria-label", words.title);
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14"/></svg><span></span>';
  button.querySelector("span").textContent = words.button;

  const dialog = document.createElement("dialog");
  dialog.className = "install-help";
  dialog.setAttribute("aria-labelledby", "install-help-title");
  dialog.innerHTML = `<div class="install-help-card"><button class="install-help-close" type="button" aria-label="${words.close}">×</button><img class="install-help-logo" src="${new URL("pwa-icon-192.png", baseUrl)}" alt=""><small>${words.kicker}</small><h2 id="install-help-title">${words.title}</h2><p>${isIos ? words.ios : words.fallback}</p></div>`;
  const installHost = document.querySelector(".language-switcher");
  if (installHost) installHost.append(button);
  else document.body.append(button);
  document.body.append(dialog);

  const showButton = () => {
    if (!standalone) button.hidden = false;
  };

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    showButton();
  });

  window.addEventListener("appinstalled", () => {
    button.hidden = true;
    deferredPrompt = null;
  });

  button.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (choice.outcome === "accepted") button.hidden = true;
      return;
    }
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });

  dialog.querySelector(".install-help-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  if (!standalone) window.setTimeout(showButton, 700);

  if ("serviceWorker" in navigator && window.location.protocol === "https:") {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register(new URL("service-worker.js", baseUrl), {scope: baseUrl.pathname}).catch(() => {});
    });
  }
})();
