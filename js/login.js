function login(event) {

    event.preventDefault();
  
   
    const form = document.getElementById('login-form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
  
    const { cpf, senha } = data;
    const sessionData = JSON.parse(sessionStorage.getItem('userData'));
  

  
    if (sessionData && sessionData.cpf === cpf && sessionData.senha=== senha) {
      console.log('Login bem-sucedido');
    
      sessionStorage.setItem('userData', JSON.stringify(data));
    
      window.location.href = 'info-usuarios.html';
    } else {
      console.log('CPF ou Senha inválidos');
      alert('CPF ou senha inválidos');
    }
  
  }