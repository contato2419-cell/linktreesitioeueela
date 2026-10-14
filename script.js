/**
 * SÍTIO EU & ELA — INTERACTIVE LINKTREE SCRIPT
 * Hero Photo Slider (Touch + Auto + Navigation) & Share Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------
  // 1. HERO PHOTO CAROUSEL / SLIDER
  // ---------------------------------------------------------
  const track = document.getElementById('sliderTrack');
  const slides = document.querySelectorAll('.slider-slide');
  const dots = document.querySelectorAll('.dot-btn');
  const sliderCard = document.querySelector('.hero-slider-card');

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideInterval = null;
  const AUTO_DELAY = 3200; // 3.2 seconds automatic rotation

  const updateSlider = (index) => {
    currentIndex = (index + totalSlides) % totalSlides;
    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(() => {
      updateSlider(currentIndex + 1);
    }, AUTO_DELAY);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  };

  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIndex = parseInt(dot.getAttribute('data-index') || '0', 10);
      updateSlider(targetIndex);
      startAutoSlide();
    });
  });

  // Touch Swipe Support for Mobile
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  if (sliderCard) {
    sliderCard.addEventListener('mouseenter', stopAutoSlide);
    sliderCard.addEventListener('mouseleave', startAutoSlide);

    sliderCard.addEventListener('touchstart', (e) => {
      stopAutoSlide();
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    sliderCard.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    sliderCard.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          updateSlider(currentIndex + 1);
        } else {
          updateSlider(currentIndex - 1);
        }
      }
      startAutoSlide();
    });
  }

  // Initial kick-off
  updateSlider(0);
  startAutoSlide();

  // ---------------------------------------------------------
  // 2. SHARE & TOAST
  // ---------------------------------------------------------
  const toast = document.getElementById('toastBox');
  const toastMsg = document.getElementById('toastMsg');
  const btnShare = document.getElementById('btnShare');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  const copyPageLink = async () => {
    const url = window.location.href.includes('http')
      ? window.location.href
      : 'https://linktreesitioeueela.vercel.app/';
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast('Link copiado com sucesso!');
    } catch {
      showToast('Link: ' + url);
    }
  };

  if (btnShare) {
    btnShare.addEventListener('click', async (e) => {
      e.preventDefault();
      const url = window.location.href.includes('http')
        ? window.location.href
        : 'https://linktreesitioeueela.vercel.app/';

      const shareData = {
        title: 'Sítio Eu & Ela | Espaço para Festas e Eventos',
        text: 'Conheça o Sítio Eu & Ela em Santa Cruz - RJ! Orçamentos rápidos e estrutura completa:',
        url: url
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyPageLink();
          }
        }
      } else {
        copyPageLink();
      }
    });
  }
});
