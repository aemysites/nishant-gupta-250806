(() => {
  /* remove the floating "Register your interest" form that appears site-wide */
  document.querySelectorAll('.enquiry, .register-interest, #registerInterest, .enquireNowForm, .stickyFormOtpMain, .getAppMain, .modal').forEach(el => el.remove());
})();