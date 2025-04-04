function saveForm() {
    const form = document.getElementsByClassName('form-box')[0];
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    localStorage.setItem('formData', JSON.stringify(data));
  }
  
  function loadFormData() {
    const sessionData = JSON.parse(sessionStorage.getItem('userData'));
    const data = JSON.parse(localStorage.getItem('formData'));
  
    if (!sessionData && !data) {
      console.log('No data found in session or local storage');
      return;
    }
  
    if (!sessionData) {
      console.log('No session data found, using local storage data');
      const form = document.getElementsByClassName('form-box')[0];
      for (const [key, value] of Object.entries(data)) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = value;
        }
      }
    }
  
    const form = document.getElementsByClassName('form-box')[0];
    for (const [key, value] of Object.entries(sessionData)) {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        input.value = value;
      }
    }
  }
  
  function validateForm() {
    return true
  }
  
  function register(event){
  
    event.preventDefault();
  
    const form = document.getElementsByClassName('form-box')[0];
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  
    const isValid = validateForm();
  
    if (!isValid) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
  
    sessionStorage.setItem('userData', JSON.stringify(data));
   
    window.location.href = 'login.html';
  }
  
  loadFormData();