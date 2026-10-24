// Modalidade Concurseiro: fluxo independente dos testes tradicionais.
(() => {
  const $ = id => document.getElementById(id);
  const nomes = {"direitocivil": "Direito Civil", "direitotrabalhista": "Direito Trabalhista", "direitoadministrativo": "Direito Administrativo", "direitoconstitucional": "Direito Constitucional", "tribunais": "Tribunais", "portugues": "Português", "engenhariacivil": "Engenharia Civil", "logica": "Raciocínio Lógico", "informatica": "Informática"};
  let disciplina = null, fila = [], indice = 0, escolha = null, corrigida = false, acertos = 0;
  const embaralhar = lista => {
    const a = [...lista];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function iniciar(id) {
    const banco = window.COGNIX_CONCURSEIRO?.[id];
    if (!Array.isArray(banco) || banco.length === 0) {
      alert('Ainda não há questões nesta disciplina.'); return;
    }
    disciplina = id; fila = embaralhar(banco); indice = 0; acertos = 0;
    $('concursoTitulo').textContent = nomes[id];
    tela('concursoQuestao'); mostrar();
  }
  function mostrar() {
    const q = fila[indice]; escolha = null; corrigida = false;
    $('concursoContador').textContent = `Questão ${indice + 1} de ${fila.length}`;
    $('concursoProgresso').style.width = `${((indice + 1) / fila.length) * 100}%`;
    $('concursoCategoria').textContent = q.categoria;
    $('concursoPergunta').textContent = q.enunciado;
    $('concursoAlternativas').replaceChildren();
    $('concursoFeedback').hidden = true;
    $('concursoFeedback').className = 'concurso-feedback';
    $('concursoResponder').hidden = false; $('concursoResponder').disabled = true;
    $('concursoProxima').hidden = true;
    q.alternativas.forEach((texto, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'alternativa';
      b.textContent = `${String.fromCharCode(65 + i)}. ${texto}`;
      b.onclick = () => {
        if (corrigida) return;
        escolha = i;
        [...$('concursoAlternativas').children].forEach(el => el.classList.remove('selecionada'));
        b.classList.add('selecionada'); $('concursoResponder').disabled = false;
      };
      $('concursoAlternativas').appendChild(b);
    });
    $('concursoProxima').textContent = indice === fila.length - 1 ? 'Ver resultado →' : 'Próxima questão →';
  }
  $('concursoResponder').onclick = () => {
    if (corrigida || escolha === null) return;
    corrigida = true;
    const q = fila[indice], acertou = escolha === q.correta;
    if (acertou) acertos++;
    [...$('concursoAlternativas').children].forEach((b, i) => {
      b.disabled = true; b.classList.remove('selecionada');
      if (i === q.correta) b.classList.add('concurso-correta');
      else if (i === escolha) b.classList.add('concurso-incorreta');
    });
    $('concursoStatus').textContent = acertou ? '✓ Resposta correta!' : '✗ Resposta incorreta.';
    $('concursoCorreta').textContent = `Resposta correta: ${String.fromCharCode(65 + q.correta)}. ${q.alternativas[q.correta]}`;
    $('concursoExplicacao').textContent = `Explicação: ${q.explicacao}`;
    $('concursoFeedback').className = 'concurso-feedback ' + (acertou ? 'correto' : 'incorreto');
    $('concursoFeedback').hidden = false;
    $('concursoResponder').hidden = true; $('concursoProxima').hidden = false;
  };
  $('concursoProxima').onclick = () => {
    if (!corrigida) return;
    indice++;
    if (indice < fila.length) { mostrar(); window.scrollTo({top:0,behavior:'smooth'}); }
    else {
      $('concursoResultadoDisciplina').textContent = nomes[disciplina];
      $('concursoPercentual').textContent = `${Math.round(100 * acertos / fila.length)}%`;
      $('concursoAcertos').textContent = `${acertos} de ${fila.length} acertos`;
      $('concursoErros').textContent = `${fila.length - acertos} erro(s)`;
      tela('concursoResultado');
    }
  };
  document.querySelector('[data-grupo="concurseiro"]').onclick = () => tela('concurseiro');
  document.querySelectorAll('.tipo-concurseiro').forEach(b => b.onclick = () => iniciar(b.dataset.disciplina));
  $('voltarConcurseiro').onclick = () => tela('home');
  $('sairConcurso').onclick = () => {
    if (confirm('Deseja sair do estudo? O progresso atual será perdido.')) tela('concurseiro');
  };
  $('concursoRefazer').onclick = () => iniciar(disciplina);
  $('concursoOutras').onclick = () => tela('concurseiro');
})();
