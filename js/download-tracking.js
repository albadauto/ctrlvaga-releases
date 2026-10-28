// Clique em Baixar (todos os botões com data-download-event):
// 1) conversão do Google Ads; 2) registro da origem da visita no CRM.
// Nenhum dos dois segura a navegação: o download/Store abre normalmente.
document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[data-download-event]');
    if (!link) return;

    // Google Ads · conversão "Download ctrlvaga". Beacon: o envio sobrevive à saída da página.
    try {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', {
                send_to: 'AW-18541259345/rTJpCNLIlKwdENHUlIlF',
                value: 1.0,
                currency: 'BRL',
                transport_type: 'beacon'
            });
        }
    } catch { /* Bloqueador de anúncios não pode impedir o download. */ }

    if (!link.dataset.trackingUrl) return;
    try {
        const query = new URLSearchParams(window.location.search);
        const value = (key, fallback) => (query.get(key)?.trim() || fallback).slice(0, 128);
        const body = JSON.stringify({
            eventId: crypto.randomUUID(), source: value('utm_source', 'site-ctrlvaga'),
            medium: value('utm_medium', 'referral'), campaign: value('utm_campaign', 'site-plataforma'),
            content: value('utm_content', link.dataset.placement || 'download'),
            language: link.dataset.language || 'pt', destination: link.dataset.destination || 'store'
        });
        const payload = new Blob([body], {type: 'text/plain'});
        if (!navigator.sendBeacon || !navigator.sendBeacon(link.dataset.trackingUrl, payload)) {
            fetch(link.dataset.trackingUrl, {method:'POST', body:payload, mode:'no-cors', keepalive:true, credentials:'omit'}).catch(() => {});
        }
    } catch { /* A navegação continua mesmo se a medição for bloqueada. */ }
}, {capture:true});
