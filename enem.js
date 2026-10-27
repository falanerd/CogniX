// CogniX ENEM: módulo independente dos demais testes.
(() => {
  const $ = id => document.getElementById(id);
  const nomes = {portugues:'Português',ingles:'Inglês',matematica:'Matemática',quimica:'Química',fisica:'Física',biologia:'Biologia',historia:'História',geografia:'Geografia',literatura:'Literatura'};
  let disciplina = null, fila = [], indice = 0, escolha = null, corrigida = false, acertos = 0;
  const embaralhar = lista => {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const ir = id => {
    document.querySelectorAll('.tela').forEach(el => el.classList.remove('ativa'));
    $(id).classList.add('ativa');
    window.scrollTo({top:0,behavior:'smooth'});
  };
  function iniciar(id) {
    const banco = window.COGNIX_ENEM?.[id];
    if (!Array.isArray(banco) || banco.length < 20) {
      alert('Ainda não há 20 questões nesta disciplina.'); return;
    }
    disciplina = id; fila = embaralhar(banco).slice(0,20); indice = 0; acertos = 0;
    $('enemTitulo').textContent = nomes[id];
    ir('enemQuestao'); mostrar();
  }
  function mostrar() {
    const q = fila[indice]; escolha = null; corrigida = false;
    $('enemContador').textContent = `Questão ${indice + 1} de ${fila.length}`;
    $('enemProgresso').style.width = `${((indice + 1) / fila.length) * 100}%`;
    $('enemCategoria').textContent = q.categoria;
    $('enemDificuldade').textContent = `Dificuldade: ${q.dificuldade}`;
    $('enemPergunta').textContent = q.enunciado;
    $('enemAlternativas').replaceChildren();
    $('enemFeedback').hidden = true;
    $('enemFeedback').className = 'concurso-feedback';
    $('enemResponder').hidden = false; $('enemResponder').disabled = true;
    $('enemProxima').hidden = true;
    q.alternativas.forEach((texto, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'alternativa';
      b.textContent = `${String.fromCharCode(65+i)}. ${texto}`;
      b.onclick = () => {
        if (corrigida) return;
        escolha = i;
        [...$('enemAlternativas').children].forEach(el => el.classList.remove('selecionada'));
        b.classList.add('selecionada'); $('enemResponder').disabled = false;
      };
      $('enemAlternativas').appendChild(b);
    });
    $('enemProxima').textContent = indice === fila.length - 1 ? 'Ver resultado →' : 'Próxima questão →';
  }
  $('enemResponder').onclick = () => {
    if (corrigida || escolha === null) return;
    corrigida = true;
    const q = fila[indice], acertou = escolha === q.correta;
    if (acertou) acertos++;
    [...$('enemAlternativas').children].forEach((b,i) => {
      b.disabled = true; b.classList.remove('selecionada');
      if (i === q.correta) b.classList.add('concurso-correta');
      else if (i === escolha) b.classList.add('concurso-incorreta');
    });
    $('enemStatus').textContent = acertou ? '✓ Resposta correta!' : '✗ Resposta incorreta.';
    $('enemCorreta').textContent = `Resposta correta: ${String.fromCharCode(65+q.correta)}. ${q.alternativas[q.correta]}`;
    $('enemExplicacao').textContent = `Explicação: ${q.explicacao}`;
    $('enemFeedback').className = 'concurso-feedback ' + (acertou ? 'correto' : 'incorreto');
    $('enemFeedback').hidden = false;
    $('enemResponder').hidden = true; $('enemProxima').hidden = false;
  };
  $('enemProxima').onclick = () => {
    if (!corrigida) return;
    indice++;
    if (indice < fila.length) { mostrar(); window.scrollTo({top:0,behavior:'smooth'}); }
    else {
      $('enemResultadoDisciplina').textContent = nomes[disciplina];
      $('enemPercentual').textContent = `${Math.round(100*acertos/fila.length)}%`;
      $('enemAcertos').textContent = `${acertos} de ${fila.length} acertos`;
      $('enemErros').textContent = `${fila.length-acertos} erro(s)`;
      ir('enemResultado');
    }
  };
  document.querySelector('[data-grupo="enem"]').onclick = () => ir('enem');
  document.querySelectorAll('.tipo-enem').forEach(b => b.onclick = () => iniciar(b.dataset.disciplina));
  $('voltarEnem').onclick = () => ir('home');
  $('sairEnem').onclick = () => {
    if (confirm('Deseja sair do estudo? O progresso atual será perdido.')) ir('enem');
  };
  $('enemRefazer').onclick = () => iniciar(disciplina);
  $('enemOutras').onclick = () => ir('enem');
})();
