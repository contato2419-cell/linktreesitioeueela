/**
 * SÍTIO EU & ELA - LINKTREE SCRIPT
 * Interactivity: Share, QR Code, VCard, Toast, Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  const DEFAULT_SHARE_URL = 'https://linktreesitioeueela.vercel.app/';
  const getPageUrl = () => {
    return (window.location.origin && window.location.origin !== 'null' && !window.location.origin.includes('file:')) 
      ? window.location.href 
      : DEFAULT_SHARE_URL;
  };

  // Elements
  const accordionWrapper = document.getElementById('accordionWrapper');
  const btnToggleEvents = document.getElementById('btnToggleEvents');
  const btnShareTop = document.getElementById('btnShareTop');
  const btnShareBottom = document.getElementById('btnShareBottom');
  const btnCopyPageLink = document.getElementById('btnCopyPageLink');
  const btnQrCodeTop = document.getElementById('btnQrCodeTop');
  const btnSaveContact = document.getElementById('btnSaveContact');
  const qrModal = document.getElementById('qrModal');
  const closeQrModal = document.getElementById('closeQrModal');
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const qrUrlText = document.getElementById('qrUrlText');
  const btnModalCopyLink = document.getElementById('btnModalCopyLink');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  let toastTimeout = null;

  // Show Toast
  const showToast = (message = 'Link copiado com sucesso!') => {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMsg.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  // Copy to clipboard helper
  const copyToClipboard = async (text, successMsg = 'Link copiado para a área de transferência!') => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(successMsg);
    } catch (err) {
      console.warn('Falha ao copiar:', err);
      showToast('Link: ' + text);
    }
  };

  // 1. Accordion Toggle
  if (btnToggleEvents && accordionWrapper) {
    btnToggleEvents.addEventListener('click', () => {
      const isOpen = accordionWrapper.classList.toggle('open');
      btnToggleEvents.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // 2. Share Action (Native or Copy Fallback)
  const handleShare = async () => {
    const url = getPageUrl();
    const shareData = {
      title: 'Sítio Eu & Ela | Festas, Casamentos e Lazer',
      text: 'Conheça o Sítio Eu & Ela em Santa Cruz - RJ! Orçamentos rápidos e estrutura completa:',
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url, 'Link do Sítio copiado!');
        }
      }
    } else {
      copyToClipboard(url, 'Link do Sítio copiado com sucesso!');
    }
  };

  if (btnShareTop) btnShareTop.addEventListener('click', handleShare);
  if (btnShareBottom) btnShareBottom.addEventListener('click', handleShare);

  // 3. Copy Link Action
  if (btnCopyPageLink) {
    btnCopyPageLink.addEventListener('click', () => {
      copyToClipboard(getPageUrl(), 'Link oficial copiado!');
    });
  }

  // 4. QR Code Modal
  const openQrModal = () => {
    const currentUrl = getPageUrl();
    qrUrlText.textContent = currentUrl;
    
    // Inject QR Code Image
    qrCodeContainer.innerHTML = '';
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&color=0c120e&bgcolor=ffffff`;
    qrImg.alt = 'QR Code Sítio Eu & Ela';
    qrImg.loading = 'eager';
    qrCodeContainer.appendChild(qrImg);

    qrModal.classList.add('open');
    qrModal.setAttribute('aria-hidden', 'false');
  };

  const closeQr = () => {
    qrModal.classList.remove('open');
    qrModal.setAttribute('aria-hidden', 'true');
  };

  if (btnQrCodeTop) btnQrCodeTop.addEventListener('click', openQrModal);
  if (closeQrModal) closeQrModal.addEventListener('click', closeQr);
  
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQr();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal.classList.contains('open')) {
      closeQr();
    }
  });

  if (btnModalCopyLink) {
    btnModalCopyLink.addEventListener('click', () => {
      copyToClipboard(getPageUrl(), 'Link copiado!');
      closeQr();
    });
  }

  // 5. Save Contact (.vcf vCard)
  if (btnSaveContact) {
    btnSaveContact.addEventListener('click', () => {
      const vcardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:Sítio Eu & Ela (Sr. Eduardo)',
        'ORG:Sítio Eu & Ela',
        'TITLE:Espaço de Festas e Eventos',
        'TEL;TYPE=CELL,VOICE,PREF:+5521964553218',
        'TEL;TYPE=WHATSAPP:+5521964553218',
        'ADR;TYPE=WORK:;;Tv. do Matadouro, 18;Santa Cruz;RJ;23550-132;Brasil',
        'URL;TYPE=WEBSITE:https://sitioeueela.vercel.app/',
        'NOTE:Espaço de Festas, Casamentos, 15 Anos, Piscina, Camarim e Confraternização em Santa Cruz - RJ',
        'END:VCARD'
      ].join('\r\n');

      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'Sitio-Eu-e-Ela-Contato.vcf';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      showToast('Cartão de contato baixado!');
    });
  }
});
