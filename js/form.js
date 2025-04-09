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
  
  async function validateForm() {
    const form = document.querySelector('.form-box');
    const campos = form.querySelectorAll('input, select');
    let isValid = true;

    for (const campo of campos) {
      const conteudo = campo.value.trim();
      let mensagemErro = '';

      if (campo.required && !conteudo) {
        mensagemErro = 'Campo obrigatório';
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

      if (mensagemErro) {
        isValid = false;
        campo.classList.add('erro');
        const erro = document.createElement('div');
        erro.classList.add('mensagem-erro');
        erro.innerHTML = `${svgErro}&nbsp;${mensagemErro}`;

        campo.insertAdjacentElement('afterend', erro);
      }
      
    };

    const identidadeInput = document.getElementById('button-docs-identidade');
    const residenciaInput = document.getElementById('button-docs-comprovante-residencia');

    if (identidadeInput.files.length === 0) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      erro.innerHTML = `${svgErro}&nbsp;É necessário enviar um documento de identidade`;

      document.querySelector('.docs-identidade').insertAdjacentElement('afterend', erro);
    }

    if (residenciaInput.files.length === 0) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      erro.innerHTML = `${svgErro}&nbsp;É necessário enviar um comprovante de residência`;

      document.querySelector('.docs-comprovante-residencia').insertAdjacentElement('afterend', erro);
    }

    const radiosTrilhas = document.querySelectorAll('input[name="checkboxs"');
    let trilhaSelecionada = false;

    radiosTrilhas.forEach(radio => {
      if (radio.checked) {
        trilhaSelecionada = true;
      }
    });

    if (!trilhaSelecionada) {
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      mensagemErro = 'É necessário selecionar uma trilha de aprendizagem';
      erro.innerHTML = `${svgErro}&nbsp;${mensagemErro}`;

      document.querySelector('.trilhas-aprendizagem').insertAdjacentElement('afterend', erro);
    }

    const senha = document.querySelector('#senha');
    const confirmarSenha = document.querySelector('#confirmar-senha');
    const senhaValor = senha.value.trim();
    const confirmarSenhaValor = confirmarSenha.value.trim();
    const regexSenha = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

    if (!regexSenha.test(senhaValor)) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      mensagemErro = `A senha precisa ter no mínimo 8 caracteres, uma letra maiúscula, um número e um caractere especial.`;
      erro.innerHTML = `${svgErro}&nbsp;${mensagemErro}`;
      senha.insertAdjacentElement('afterend', erro);
      senha.classList.add('erro');
    }

    if (senhaValor !== confirmarSenhaValor) {
      isValid = false;
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      mensagemErro = `As senhas não coincidem`;
      erro.innerHTML = `${svgErro}&nbsp;${mensagemErro}`;
      confirmarSenha.insertAdjacentElement('afterend', erro);
      confirmarSenha.classList.add('erro');
    }

    const checkboxTermos = document.querySelector('#checkbox_termos');

    if (!checkboxTermos.checked) {
      const erro = document.createElement('div');
      erro.classList.add('mensagem-erro');
      mensagemErro = 'É necessário aceitar os Termos e a Política de Privacidade';
      erro.innerHTML = `${svgErro}&nbsp;${mensagemErro}`;

      document.querySelector('.termos').insertAdjacentElement('afterend', erro);
    }

    return isValid;
  }
  
  async function register(event){
    event.preventDefault();
  
    const isValid = await validateForm();
  
    if (!isValid) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }
  
    const form = document.getElementsByClassName('form-box')[0];
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const checkboxesSelecionados = document.querySelectorAll('input[name="trilhas[]"]:checked');
    const trilhas = Array.from(checkboxesSelecionados).map(cb => cb.value).join(', ');
    data.trilhas = trilhas;
  
    sessionStorage.setItem('userData', JSON.stringify(data));
    window.location.href = 'login.html';
  }

  const inputCpf = document.querySelector('#cpf');
  const inputTelefone = document.querySelector('#telefone');
  const inputCep = document.querySelector('#cep');
  const erroCep = document.createElement('div');
  erroCep.classList.add('mensagem-erro');

  inputCep.addEventListener('input', () => {
    inputCep.value = inputCep.value
    .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  });

  inputCep.addEventListener('blur', () => {
    const conteudo = inputCep.value;

    if (/^\d{5}-?\d{3}$/.test(conteudo)) {
      const cepSemHifen= conteudo.replace(/\D/g, '');
      const form = document.querySelector('.form-box');

      fetch(`https://viacep.com.br/ws/${cepSemHifen}/json/`)
      .then(resposta => resposta.json())
      .then(dados => {
        const cidade = form.querySelector('input[name="cidade"]');
        const estado = form.querySelector('input[name="estado"]');

        if (dados.erro) {
          erroCep.innerHTML = `${svgErro}&nbsp;CEP não encontrado`;
          if (!cidade.nextElementSibling?.classList.contains('mensagem-erro')) {
            cep.insertAdjacentElement('afterend', erroCep);
          }
        } else {
          cidade.value = dados.localidade || '';
          estado.value = dados.uf || '';
          if(erroCep.parentElement) erroCep.remove();
        }
      })

      .catch(err => {
        console.error('Erro ao buscar CEP:', err);
        erroCep.innerHTML = `${svgErro}&nbsp;CEP não encontrado`;
        const cidade = form.querySelector('input[name="cidade"]');
        if (!cidade.nextElementSibling?.classList.contains('mensagem-erro')) {
          cep.insertAdjacentElement('afterend', erroCep);
        }
      })
    }
  });

  inputCpf?.addEventListener('input', () => {
    inputCpf.value = inputCpf.value
      .replace(/\D/g, '').slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  });
    
  inputTelefone?.addEventListener('input', () => {
    
      let numero = inputTelefone.value.replace(/\D/g, '');
      
      if (numero.length <= 10) {
        numero = numero.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        numero = numero.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }

      inputTelefone.value = numero.replace(/(-\d{4})\d+?$/, '$1');
    
  });
    
  //loadFormData();