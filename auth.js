/* ============================================
   AGRI-CHAIN — auth.js
   Login & Register form logic, validation
   ============================================ */

// ===== STATE =====
let currentRole = 'farmer';

// ===== TAB SWITCHING =====
function switchTab(tab) {
  const isLogin = tab === 'login';

  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', isLogin ? i === 0 : i === 1);
  });

  document.getElementById('loginForm').classList.toggle('active', isLogin);
  document.getElementById('registerForm').classList.toggle('active', !isLogin);
}

// ===== ROLE SELECTION =====
function selectRole(el, role) {
  document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  currentRole = role;

  document.getElementById('farmerFields').style.display = role === 'farmer' ? 'block' : 'none';
  document.getElementById('traderFields').style.display = role === 'trader'  ? 'block' : 'none';
}

// ===== VALIDATION HELPERS =====
function setFieldError(fieldId, hasError) {
  const el = document.getElementById(fieldId);
  if (el) el.classList.toggle('error', hasError);
  return hasError;
}

function clearErrors() {
  document.querySelectorAll('.field.error').forEach(f => f.classList.remove('error'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^01[0125]\d{8}$/.test(phone);
}

// ===== LOGIN =====
function doLogin() {
  clearErrors();
  const email = document.getElementById('lEmail').value.trim();
  const pass  = document.getElementById('lPass').value;

  let hasError = false;
  if (!email)        hasError = setFieldError('lEmailField', true) || hasError;
  else               setFieldError('lEmailField', false);
  if (pass.length < 6) hasError = setFieldError('lPassField', true) || hasError;
  else               setFieldError('lPassField', false);

  if (hasError) return;

  setLoginLoading(true);

  fetch('php/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: pass })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, 3000);
      setTimeout(() => {
        window.location.href = data.redirect;
      }, 1000);
    } else {
      showToast('خطأ: ' + data.message, 5000);
    }
  })
  .catch(error => {
    console.error('Login error:', error);
    showToast('حدث خطأ في تسجيل الدخول. حاول مرة أخرى.', 5000);
  })
  .finally(() => {
    setLoginLoading(false);
  });
}

function setLoginLoading(on) {
  const btn = document.querySelector('#loginForm .submit-btn');
  if (!btn) return;
  btn.querySelector('.btn-text').style.display  = on ? 'none'   : 'inline';
  btn.querySelector('.loading').style.display   = on ? 'inline' : 'none';
  btn.disabled = on;
}

// ===== REGISTER =====
function doRegister() {
  clearErrors();

  const first  = document.getElementById('rFirst').value.trim();
  const last   = document.getElementById('rLast').value.trim();
  const phone  = document.getElementById('rPhone').value.trim();
  const email  = document.getElementById('rEmail').value.trim();
  const pass   = document.getElementById('rPass').value;
  const pass2  = document.getElementById('rPass2').value;

  let hasError = false;
  hasError = setFieldError('rFirstField', !first)                 || hasError;
  hasError = setFieldError('rLastField',  !last)                  || hasError;
  hasError = setFieldError('rPhoneField', !isValidPhone(phone))   || hasError;
  hasError = setFieldError('rEmailField', !isValidEmail(email))   || hasError;
  hasError = setFieldError('rPassField',  pass.length < 8)        || hasError;
  hasError = setFieldError('rPass2Field', pass !== pass2)         || hasError;

  if (currentRole === 'farmer') {
    hasError = setFieldError('rGovField',  !document.getElementById('rGov').value)         || hasError;
    hasError = setFieldError('rCityField', !document.getElementById('rCity').value.trim()) || hasError;
    hasError = setFieldError('rCropField', !document.getElementById('rCrop').value)        || hasError;
    hasError = setFieldError('rAreaField', !document.getElementById('rArea').value)        || hasError;
    hasError = setFieldError('rQtyField',  !document.getElementById('rQty').value)         || hasError;
  }

  if (hasError) return;

  setRegisterLoading(true);

  // Collect form data
  const userData = {
    first, last, phone, email,
    password: pass,
    role: currentRole,
  };

  // Add farmer-specific fields if role is farmer
  if (currentRole === 'farmer') {
    userData.governorate = document.getElementById('rGov').value;
    userData.city = document.getElementById('rCity').value.trim();
    userData.cropType = document.getElementById('rCrop').value;
    userData.landArea = document.getElementById('rArea').value;
    userData.quantity = document.getElementById('rQty').value;
  }

  // Add trader-specific fields if role is trader
  if (currentRole === 'trader') {
    const companyName = document.getElementById('rCompanyName');
    if (companyName && companyName.value.trim()) {
      userData.companyName = companyName.value.trim();
    }
    const goodsType = document.getElementById('rGoodsType');
    if (goodsType && goodsType.value.trim()) {
      userData.goodsType = goodsType.value.trim();
    }
  }

  fetch('php/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showToast(data.message, 3000);
      setTimeout(() => {
        window.location.href = data.redirect;
      }, 1000);
    } else {
      showToast('خطأ: ' + data.message, 5000);
    }
  })
  .catch(error => {
    console.error('Register error:', error);
    showToast('حدث خطأ في إنشاء الحساب. حاول مرة أخرى.', 5000);
  })
  .finally(() => {
    setRegisterLoading(false);
  });
}

function setRegisterLoading(on) {
  const btn = document.querySelector('#registerForm .submit-btn');
  if (!btn) return;
  btn.querySelector('.btn-text').style.display = on ? 'none'   : 'inline';
  btn.querySelector('.loading').style.display  = on ? 'inline' : 'none';
  btn.disabled = on;
}

// ===== REDIRECT TO DASHBOARD =====
function goDashboard() {
  window.location.href = 'dashboard.html';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Show farmer fields by default
  const farmerFields = document.getElementById('farmerFields');
  const traderFields = document.getElementById('traderFields');
  if (farmerFields) farmerFields.style.display = 'block';
  if (traderFields) traderFields.style.display = 'none';

  // Allow Enter key to submit
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    if (document.getElementById('loginForm')?.classList.contains('active'))    doLogin();
    if (document.getElementById('registerForm')?.classList.contains('active')) doRegister();
  });
});
