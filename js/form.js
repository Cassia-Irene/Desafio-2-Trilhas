const svgErro = '<img src = "./assets/alert-circle.svg" width="18px" height="18px" alt="Erro" />';

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
    const form = document.querySelector('.form-box');
    const campos = form.querySelectorAll('input, select');
    let isValid = true;

    form.querySelectorAll('.mensagem-erro').forEach(e => e.remove());
    campos.forEach(campo => campo.classList.remove('erro'));

    campos.forEach(campo => {
      const conteudo = campo.value.trim();
      let mensagemErro = '';

      if (campo.required && !conteudo) {
        mensagemErro = 'Este campo é obrigatório';
      }

      if(campo.name === 'cpf' && conteudo && conteudo.length !== 14) {
        mensagemErro = 'Insira um CPF válido';
      }

      if (campo.name === 'email' && conteudo && !conteudo.includes('@')) {
        mensagemErro = 'Insira um e-mail válido';
      }

      if (campo.name === 'telefone' && conteudo && conteudo.length !== 15) {
        mensagemErro = 'Insira um telefone válido';
      }

      if (campo.name === 'cep' && conteudo && conteudo.length !== 9) {
        mensagemErro = 'Insira um CEP válido';
      }

      if (mensagemErro) {
        isValid = false;
        campo.classList.add('erro');
        const erro = document.createElement('div');
        erro.classList.add('mensagem-erro');
        erro.innerHTML = `${svgErro} ${mensagemErro}`;

        campo.insertAdjacentElement('afterend', erro);
      }
    });

    const identidade = document.getElementById('button-docs-identidade');
    const residencia = document.getElementById('button-docs-comprovante-residencia');

      if (identidade.files.length === 0) {
        isValid = false;
        const erro = document.createElement('div');
        erro.classList.add('mensagem-erro');
        erro.innerHTML = `${svgErro} Envie o arquivo de identidade`;
        identidade.insertAdjacentElement('afterend', erro);
      }

      if (residencia.files.length === 0) {
        isValid = false;
        const erro = document.createElement('div');
        erro.classList.add('mensagem-erro');
        erro.innerHTML = `${svgErro} Envie o arquivo de comprovante de residência`;
        residencia.insertAdjacentElement('afterend', erro);
      }

    return isValid;
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

  document.addEventListener('input', (e) =>{
    const edit_campo = e.target;

    if (edit_campo.name === 'cpf') {
      edit_campo.value = edit_campo.value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (edit_campo.name === 'telefone') {
      edit_campo.value = edit_campo.value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
    }

    if (edit_campo.name === 'cep') {
      edit_campo.value = edit_campo.value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
    }
  });

  window.validateForm = validateForm;
  
  //loadFormData();