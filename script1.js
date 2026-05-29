
  /* ---- NAV ---- */
  function toggleNav() {
    document.getElementById('navLinks').classList.toggle('open');
  }
  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navAs.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  /* ---- TABS ---- */
  function showTab(id) {
    document.querySelectorAll('.exito-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    event.currentTarget.classList.add('active');
  }

  /* ---- RADIO SELECTION STYLE ---- */
  function selectRadio(el, name) {
    document.querySelectorAll(`[onclick*="selectRadio(this,'${name}')"]`).forEach(l => l.classList.remove('selected'));
    el.classList.add('selected');
    // Show/hide integrantes 3&4 based on category
    if (name === 'cat') {
      const val = el.querySelector('input').value;
      const block34 = document.getElementById('block34');
      if (['cat1','cat2','cat3','cat4','cat5'].includes(val)) {
        block34.classList.remove('hidden');
      } else {
        block34.classList.add('hidden');
      }
    }
    // Hide "otro" inputs if they switch away
    if (name === 'depto') {
      const val = el.querySelector('input').value;
      toggleOtroDepto(val === 'otro');
    }
  }

  function toggleOtroDepto(show) {
    const el = document.getElementById('otroDepto');
    if (show) el.classList.add('visible');
    else el.classList.remove('visible');
  }

  function showOtro(id) {
    document.getElementById(id).classList.add('visible');
  }

  /* ---- FILE NAMES ---- */
  function updateFileName(inputId, spanId) {
    const f = document.getElementById(inputId).files[0];
    if (f) document.getElementById(spanId).textContent = f.name;
  }

  /* ---- STEP PROGRESS ---- */
  let currentStep = 1;
  const totalSteps = 4;

  function updateProgress(step) {
    for (let i = 1; i <= totalSteps; i++) {
      const dot = document.getElementById('dot' + i);
      dot.classList.remove('active','done');
      if (i < step) dot.classList.add('done');
      else if (i === step) dot.classList.add('active');
      if (i < totalSteps) {
        const line = document.getElementById('line' + i);
        line.classList.toggle('done', i < step);
      }
    }
  }

  function showStep(n) {
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('step' + n);
    if (el) el.classList.add('active');
    updateProgress(n);
    currentStep = n;
    document.getElementById('inscripcion').scrollIntoView({behavior:'smooth', block:'start'});
  }

  /* ---- VALIDATION ---- */
  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('visible'));
    document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));
  }

  function showErr(id, inputId) {
    const msg = document.getElementById(id);
    if (msg) msg.classList.add('visible');
    if (inputId) {
      const inp = document.getElementById(inputId);
      if (inp) inp.classList.add('error');
    }
  }

  function validateStep(n) {
    clearErrors();
    let ok = true;

    if (n === 1) {
      const cat = document.querySelector('input[name="categoria"]:checked');
      if (!cat) { showErr('err-cat'); ok = false; }
    }

    if (n === 2) {
      if (!document.getElementById('institucion').value.trim()) { showErr('err-inst','institucion'); ok = false; }
      if (!document.querySelector('input[name="departamento"]:checked')) { showErr('err-depto'); ok = false; }
      const correo = document.getElementById('correo').value.trim();
      if (!correo || !/^[^@]+@[^@]+\.[^@]+$/.test(correo)) { showErr('err-correo','correo'); ok = false; }
      if (!document.getElementById('telefono').value.trim()) { showErr('err-tel','telefono'); ok = false; }
      if (!document.getElementById('docente').value.trim()) { showErr('err-doc','docente'); ok = false; }
      if (!document.getElementById('docDocente').value.trim()) { showErr('err-dDoc','docDocente'); ok = false; }
      if (!document.getElementById('int1nombre').value.trim()) { showErr('err-i1n','int1nombre'); ok = false; }
      if (!document.querySelector('input[name="tdoc1"]:checked')) { showErr('err-i1td'); ok = false; }
      if (!document.getElementById('int1doc').value.trim()) { showErr('err-i1d','int1doc'); ok = false; }
      if (!document.getElementById('nombreEquipo').value.trim()) { showErr('err-equipo','nombreEquipo'); ok = false; }
    }

    if (n === 3) {
      if (!document.getElementById('descripcion').value.trim()) { showErr('err-desc','descripcion'); ok = false; }
      const vid = document.getElementById('videoUrl').value.trim();
      if (!vid || !/^https?:\/\/.+/.test(vid)) { showErr('err-vid','videoUrl'); ok = false; }
    }

    if (n === 4) {
      if (!document.querySelector('input[name="autorizacion"]:checked')) { showErr('err-auth'); ok = false; }
    }

    return ok;
  }

  function goTo(n) {
    if (n > currentStep && !validateStep(currentStep)) return;
    showStep(n);
  }

  function submitForm() {
    if (!validateStep(4)) return;
    // Hide form, show success
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById('formProgress').style.display = 'none';
    document.getElementById('success-screen').style.display = 'block';
    document.getElementById('inscripcion').scrollIntoView({behavior:'smooth', block:'start'});
  }

  function resetForm() {
    document.getElementById('formProgress').style.display = 'flex';
    document.getElementById('success-screen').style.display = 'none';
    // Reset all inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea').forEach(i => i.value = '');
    document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
    document.querySelectorAll('.radio-item').forEach(i => i.classList.remove('selected'));
    document.querySelectorAll('.otro-input').forEach(i => i.classList.remove('visible'));
    document.getElementById('block34').classList.add('hidden');
    clearErrors();
    showStep(1);
  }
