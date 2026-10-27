
/* CogniX — gerenciamento de preferências de cookies.
   Não registra respostas ou resultados dos testes.

   O banner próprio é utilizado quando não há uma CMP europeia
   detectada. A integração com a CMP do Google deve ser validada
   no domínio publicado e nas regiões abrangidas pelo GDPR.
*/
(() => {
  'use strict';

  const KEY = 'cognix_consent_v1';

  const read = () => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));

      return v &&
        v.version === 1 &&
        typeof v.analytics === 'boolean' &&
        typeof v.ads === 'boolean'
          ? v
          : null;
    } catch (_) {
      return null;
    }
  };

  const hasTCF = () =>
    typeof window.__tcfapi === 'function';

  const update = (v) => {
    if (typeof window.gtag !== 'function') return;

    window.gtag('consent', 'update', {
      analytics_storage: v.analytics ? 'granted' : 'denied',
      ad_storage: v.ads ? 'granted' : 'denied',
      ad_user_data: v.ads ? 'granted' : 'denied',
      ad_personalization: v.ads ? 'granted' : 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied'
    });
  };

  // Aplica preferências existentes antes das tags Google.
  const previous = read();

  if (previous) {
    update(previous);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);

    const banner = $('cookiesBanner');
    const panel = $('cookiesPainel');

    if (!banner || !panel) return;

    let current = read();
    let ownBannerAllowed = false;

    const hide = () => {
      banner.hidden = true;
      panel.hidden = true;
    };

    const save = (analytics, ads) => {
      const v = {
        version: 1,
        analytics: !!analytics,
        ads: !!ads
      };

      try {
        localStorage.setItem(KEY, JSON.stringify(v));
      } catch (_) {
        // Armazenamento indisponível.
      }

      current = v;
      update(v);
      hide();
    };

    const edit = () => {
      $('cookiesAnalytics').checked =
        current ? current.analytics : false;

      $('cookiesAds').checked =
        current ? current.ads : false;

      panel.hidden = false;
      banner.hidden = true;
    };

    const openGooglePreferences = () => {
      if (!hasTCF()) return false;

      try {
        window.__tcfapi('displayConsentUi', 2, () => {});
        return true;
      } catch (_) {
        return false;
      }
    };

    const checkCMP = () => {
      if (hasTCF()) {
        ownBannerAllowed = false;
        banner.hidden = true;
        return true;
      }

      return false;
    };

    $('cookiesAceitar').addEventListener('click', () => {
      save(true, true);
    });

    $('cookiesRecusar').addEventListener('click', () => {
      save(false, false);
    });

    $('cookiesPersonalizar').addEventListener('click', edit);

    $('cookiesSalvar').addEventListener('click', () => {
      save(
        $('cookiesAnalytics').checked,
        $('cookiesAds').checked
      );
    });

    $('cookiesCancelar').addEventListener('click', () => {
      panel.hidden = true;

      if (!current && ownBannerAllowed && !hasTCF()) {
        banner.hidden = false;
      }
    });

    $('abrirPreferenciasCookies').addEventListener('click', () => {
      if (!openGooglePreferences()) {
        edit();
      }
    });

    // Detecta a CMP antes de apresentar o banner próprio.
    if (checkCMP()) return;

    // Observa o carregamento tardio da API europeia.
    const observer = new MutationObserver(() => {
      checkCMP();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    // Janela de detecção inicial.
    setTimeout(() => {
      if (!checkCMP()) {
        ownBannerAllowed = true;

        if (!current && panel.hidden) {
          banner.hidden = false;
        }
      }
    }, 5000);

    // Encerra a observação após a inicialização.
    setTimeout(() => {
      checkCMP();
      observer.disconnect();
    }, 15000);
  });
})();
