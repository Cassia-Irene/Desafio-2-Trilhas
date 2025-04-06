document.getElementById('button-docs-identidade').addEventListener('change', function() {
  const arquivoIdentidade = this.files[0]?.name || 'Nenhum arquivo selecionado';
  document.querySelector('.button-docs-identidade-label').innerHTML = arquivoIdentidade;
});

document.getElementById('button-docs-comprovante-residencia').addEventListener('change', function() {
  const arquivoResidencia = this.files[0]?.name || 'Nenhum arquivo selecionado';
  document.querySelector('.button-docs-comprovante-residencia-label').innerHTML = arquivoResidencia;
});

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

      if (campo.name === 'nome' && conteudo) {
        const regexNome = /^[A-Za-zÀ-ÿ\s'-]+$/;
        const partesNome = conteudo.split(' ').filter(p => p.length > 1);

        if (conteudo.length < 3) {
          mensagemErro = 'É necessário que o nome tenha pelo menos 3 letras';
        } else if (!regexNome.test(conteudo)) {
          mensagemErro = 'Insira um nome válido';
        } else if (partesNome.length < 3) {
          mensagemErro = 'Insira o nome completo';
        }
      }

      if (campo.name === 'data-nascimento' && conteudo) {
        const hoje = new Date();
        const dataNascimento = new Date(conteudo);
        
        if (isNaN(dataNascimento.getTime())) {
          mensagemErro = 'Insira uma data de nascimento válida';
        } else if (dataNascimento >= hoje) {
          mensagemErro = 'Insira uma data de nascimento válida';
        } else {
          let idade = hoje.getFullYear() - dataNascimento.getFullYear();
          const mes = hoje.getMonth() - dataNascimento.getMonth();

          if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
            idade--;
          }

          if (idade < 15) {
            mensagemErro = 'É necessário ter pelo menos 15 anos';
          } else if (idade > 100) {
            mensagemErro = 'Insira uma data de nascimento válida';
          }
        }
      }

      if(campo.name === 'cpf' && conteudo && conteudo.length !== 14) {
        mensagemErro = 'Insira um CPF válido';
      }

      if (campo.name === 'email' && conteudo) {
        const dominiosTemporarios = [
          'tempmail.com',
          '10minutemail.com',
          'guerrillamail.com',
          'mailinator.com',
          'dispostable.com',
          'yopmail.com',
          'getnada.com',
          'trashmail.com',
          'fakeinbox.com',
          'emailondeck.com'
        ];
        const regexEmail = /^(?=[^@]*[a-zA-Z])[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(conteudo)) {
          mensagemErro = 'Insira um e-mail válido';
        } else {
          const dominioEmail = conteudo.split('@')[1].toLowerCase();
          if (dominiosTemporarios.includes(dominioEmail)) {
            mensagemErro = 'Emails temporários não são permitidos';
          }
        }
      }

      if (campo.name === 'telefone' && conteudo) {
        const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

        if (!regexTelefone.test(conteudo)) {
          mensagemErro = 'Insira um telefone válido';
        }
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

    const identidadeInput = document.getElementById('button-docs-identidade');
    const residenciaInput = document.getElementById('button-docs-comprovante-residencia');

    if (identidadeInput.files.length === 0) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      erro.innerHTML = `${svgErro} É necessário enviar um documento de identidade`;

      document.querySelector('.docs-identidade').insertAdjacentElement('afterend', erro);
    }

    if (residenciaInput.files.length === 0) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      erro.innerHTML = `${svgErro} É necessário enviar um comprovante de residência`;

      document.querySelector('.docs-comprovante-residencia').insertAdjacentElement('afterend', erro);
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
      .replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    if (edit_campo.name === 'telefone') {
      let numero = edit_campo.value.replace(/\D/g, '');
      
      if (numero.length <= 10) {
        numero = numero.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        numero = numero.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }

      edit_campo.value = numero.replace(/(-\d{4})\d+?$/, '$1');
    }

    if (edit_campo.name === 'cep') {
      edit_campo.value = edit_campo.value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
    }
  });
  
  //loadFormData();