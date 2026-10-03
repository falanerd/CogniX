let tipoAtual = null;
let faixaAtual = null;
let questoes = [];
let indice = 0;
let selecionada = null;
let acertos = 0;
let stats = {};

const $ = id => document.getElementById(id);

const nomesNiveis = {
  "5-10": "Iniciante — Nível 1",
  "11-15": "Médio — Nível 2",
  "16-22": "Avançado — Nível 3",
  "23+": "Expert — Nível 4"
};

const configuracaoTestes = {
  cognitivo: { nome:"Cognitivo", tag:"TESTE COGNITIVO", descricao:"Desafios de lógica, sequências, padrões, raciocínio numérico, visual e espacial." },
  matematica: { nome:"Matemática", tag:"MATEMÁTICA", descricao:"Desafios de aritmética, álgebra, geometria, porcentagem, estatística e resolução de problemas." },
  linguagens: { nome:"Linguagens", tag:"LINGUAGENS", descricao:"Português, interpretação, gramática, vocabulário, coesão e recursos de linguagem." },
  ingles: { nome:"Inglês", tag:"ENGLISH", descricao:"Vocabulary, grammar, reading, expressions, verbs e uso do inglês em contexto." },
  semiotica: { nome:"Semiótica", tag:"SEMIÓTICA", descricao:"Signos, ícones, índices, símbolos, códigos visuais, contexto e construção de sentido." },
  civil: { nome:"Engenharia Civil", tag:"ENGENHARIA CIVIL", descricao:"Estruturas, materiais, geotecnia, hidráulica, construção, projetos e gestão." },
  eletrica: { nome:"Engenharia Elétrica", tag:"ENGENHARIA ELÉTRICA", descricao:"Circuitos, eletrônica, máquinas elétricas, potência, proteção, energia e controle." },
  mecanica: { nome:"Engenharia Mecânica", tag:"ENGENHARIA MECÂNICA", descricao:"Mecânica, termodinâmica, fluidos, materiais, máquinas, vibrações e transferência de calor." },
  aeronautica: { nome:"Engenharia Aeronáutica", tag:"ENGENHARIA AERONÁUTICA", descricao:"Aerodinâmica, estruturas, propulsão, estabilidade, desempenho, controles e sistemas de aeronaves." },
  aeroespacial: { nome:"Engenharia Aeroespacial", tag:"ENGENHARIA AEROESPACIAL", descricao:"Dinâmica orbital, lançadores, propulsão, satélites, controle de atitude e ambiente espacial." }
};

const mensagensCategorias = {
  "Numérico":"Você se destacou em relações numéricas e cálculos.", "Lógica":"Você se destacou na análise de premissas e conclusões lógicas.", "Sequências":"Você se destacou na identificação de regularidades e progressões.", "Espacial":"Você se destacou na visualização de posições e transformações espaciais.", "Analogias":"Você se destacou na identificação de relações entre conceitos.", "Classificação":"Você se destacou em agrupar e distinguir elementos.", "Padrões":"Você se destacou no reconhecimento de padrões.", "Visual":"Você se destacou na interpretação de formas e informações visuais.",
  "Aritmética":"Você se destacou em operações e raciocínio com números.", "Álgebra":"Você se destacou na manipulação de expressões e incógnitas.", "Geometria":"Você se destacou em formas, medidas e relações geométricas.", "Problemas":"Você se destacou em transformar situações em estratégias de resolução.", "Porcentagem":"Você se destacou em proporções e variações percentuais.", "Frações":"Você se destacou em relações fracionárias.", "Estatística":"Você se destacou na leitura e síntese de dados.", "Probabilidade":"Você se destacou em raciocínio probabilístico.", "Funções":"Você se destacou em relações funcionais.", "Comparação":"Você se destacou em comparar grandezas e valores.",
  "Gramática":"Você se destacou no funcionamento e na estrutura da língua.", "Vocabulário":"Você se destacou no significado e uso de palavras.", "Interpretação":"Você se destacou na compreensão de informações e inferências.", "Ortografia":"Você se destacou na escrita convencional das palavras.", "Pontuação":"Você se destacou no uso de sinais de pontuação.", "Coesão":"Você se destacou nas relações que conectam as partes de um texto.", "Semântica":"Você se destacou na análise de sentidos.", "Argumentação":"Você se destacou na estrutura e avaliação de argumentos.", "Figuras de linguagem":"Você se destacou no reconhecimento de recursos expressivos.", "Gêneros textuais":"Você se destacou no reconhecimento de finalidades e estruturas textuais.",
  "Vocabulary":"Você se destacou no vocabulário em inglês.", "Grammar":"Você se destacou nas estruturas gramaticais do inglês.", "Reading":"Você se destacou na compreensão de textos em inglês.", "Expressions":"Você se destacou no uso de expressões comuns em inglês.", "Verbs":"Você se destacou no uso de verbos em inglês.", "Phrasal verbs":"Você se destacou na compreensão de phrasal verbs.", "Collocations":"Você se destacou em combinações naturais de palavras em inglês.", "Academic English":"Você se destacou em usos acadêmicos do inglês.", "False cognates":"Você se destacou na distinção de falsos cognatos.",
  "Teoria dos signos":"Você se destacou na compreensão das relações entre signo, objeto e interpretação.", "Ícones":"Você se destacou na identificação de signos baseados em semelhança.", "Índices":"Você se destacou na leitura de sinais ligados por conexão ou evidência.", "Símbolos":"Você se destacou na interpretação de convenções simbólicas.", "Códigos visuais":"Você se destacou na leitura de sistemas gráficos e visuais.", "Contexto":"Você se destacou em perceber como o contexto altera o sentido.", "Conotação":"Você se destacou na leitura de sentidos associados e não literais.", "Multimodalidade":"Você se destacou na integração de texto, imagem e outros modos de comunicação.", "Interface":"Você se destacou na interpretação de signos usados em interfaces.", "Design da informação":"Você se destacou na leitura de hierarquia e organização visual.", "Intertextualidade":"Você se destacou no reconhecimento de relações entre mensagens e referências.", "Identidade visual":"Você se destacou na leitura de elementos que constroem identidade visual.",
  "Materiais":"Você se destacou em propriedades e aplicações de materiais de engenharia.", "Estruturas":"Você se destacou na análise do comportamento estrutural.", "Geotecnia":"Você se destacou em solos, fundações e comportamento geotécnico.", "Construção":"Você se destacou em processos e práticas construtivas.", "Projetos":"Você se destacou em representação, concepção e integração de projetos.", "Hidráulica":"Você se destacou em conceitos de hidráulica e escoamentos.", "Topografia":"Você se destacou em medições e representação do terreno.", "Gestão":"Você se destacou em planejamento e gestão de engenharia.",
  "Circuitos":"Você se destacou na análise de circuitos elétricos.", "Materiais elétricos":"Você se destacou em propriedades elétricas dos materiais.", "Máquinas":"Você se destacou em máquinas e conversão de energia.", "Proteção":"Você se destacou em proteção e segurança de sistemas.", "Energia":"Você se destacou em energia e potência.", "Eletrônica":"Você se destacou em componentes e sistemas eletrônicos.", "Sistemas elétricos":"Você se destacou em sistemas de energia elétrica.", "Controle":"Você se destacou em modelagem e controle de sistemas.", "Eletrônica de potência":"Você se destacou em conversão eletrônica de potência.", "Qualidade de energia":"Você se destacou em fenômenos de qualidade da energia elétrica.",
  "Mecânica":"Você se destacou em forças, movimento e equilíbrio.", "Termodinâmica":"Você se destacou em energia, calor e processos termodinâmicos.", "Fluidos":"Você se destacou em mecânica dos fluidos.", "Resistência dos materiais":"Você se destacou em tensões, deformações e resistência estrutural.", "Transferência de calor":"Você se destacou em condução, convecção e radiação.", "Vibrações":"Você se destacou em dinâmica e vibrações mecânicas.", "Análise numérica":"Você se destacou em métodos computacionais aplicados à engenharia.",
  "Aerodinâmica":"Você se destacou no comportamento do escoamento ao redor de aeronaves e veículos.", "Propulsão":"Você se destacou em geração de empuxo e sistemas propulsivos.", "Controles de voo":"Você se destacou nas superfícies e comandos de controle de aeronaves.", "Instrumentação":"Você se destacou em instrumentos e sistemas de medição.", "Mecânica de voo":"Você se destacou no equilíbrio e movimento das aeronaves.", "Estabilidade":"Você se destacou em estabilidade e resposta dinâmica de aeronaves.", "Desempenho":"Você se destacou em desempenho e eficiência de voo.", "Aeroelasticidade":"Você se destacou na interação entre forças aerodinâmicas e estruturas flexíveis.",
  "Órbitas":"Você se destacou em mecânica e geometria orbital.", "Lançadores":"Você se destacou em veículos lançadores e arquitetura de foguetes.", "Espaço":"Você se destacou em conceitos fundamentais do ambiente espacial.", "Ambiente espacial":"Você se destacou nos efeitos do ambiente espacial e da reentrada.", "Sistemas espaciais":"Você se destacou em subsistemas e operação de veículos espaciais.", "Controle de atitude":"Você se destacou na orientação e estabilização de veículos espaciais.", "Dinâmica orbital":"Você se destacou em perturbações e dinâmica avançada de órbitas."
};

function mensagemResultado(p) {
  if (p >= 90) return "Excelente desempenho! Você demonstrou muita facilidade nos desafios deste nível.";
  if (p >= 75) return "Ótimo desempenho! Você resolveu com facilidade a maior parte dos desafios deste nível.";
  if (p >= 60) return "Bom desempenho! Você apresentou um bom resultado e resolveu boa parte dos desafios.";
  if (p >= 40) return "Desempenho intermediário. Você superou vários desafios e ainda tem espaço para evoluir.";
  return "Este nível apresentou desafios importantes. Continue praticando e tente novamente!";
}

function tela(id) {
  document.querySelectorAll('.tela').forEach(x => x.classList.remove('ativa'));
  $(id).classList.add('ativa');
  window.scrollTo({top:0, behavior:'smooth'});
}

function selecionarTipo(tipo) {
  if (!window.COGNIX_BANCOS || !window.COGNIX_BANCOS[tipo]) return;
  tipoAtual = tipo;
  const cfg = configuracaoTestes[tipo];
  $('tagTipo').textContent = cfg.tag;
  $('tituloTipo').textContent = cfg.nome;
  $('descricaoTipo').textContent = cfg.descricao;
  $('tipoSelecionadoTopo').textContent = cfg.nome;
  tela('niveis');
}

document.querySelectorAll('.tipo-teste[data-teste]').forEach(btn => btn.addEventListener('click', () => selecionarTipo(btn.dataset.teste)));

document.querySelectorAll('.tipo-grupo[data-grupo="engenharias"]').forEach(btn =>
  btn.addEventListener('click', () => tela('engenharias'))
);

document.querySelectorAll('.tipo-engenharia').forEach(btn =>
  btn.addEventListener('click', () => selecionarTipo(btn.dataset.teste))
);
document.querySelectorAll('.idade').forEach(btn => btn.addEventListener('click', () => iniciar(btn.dataset.faixa)));

function iniciar(faixa) {
  faixaAtual = faixa;
  const banco = window.COGNIX_BANCOS?.[tipoAtual]?.[faixa];
  if (!banco || !banco.length) { alert('Ainda não há perguntas cadastradas para este teste e nível.'); return; }
  questoes = [...banco]; indice = 0; selecionada = null; acertos = 0; stats = {};
  $('nomeTesteAtual').textContent = configuracaoTestes[tipoAtual].nome;
  $('nomeNivelAtual').textContent = nomesNiveis[faixaAtual];
  tela('teste'); mostrar();
}

function mostrar() {
  const q = questoes[indice];
  $('contador').textContent = `Questão ${indice + 1} de ${questoes.length}`;
  $('progresso').style.width = `${((indice + 1) / questoes.length) * 100}%`;
  $('categoria').textContent = q[3]; $('pergunta').textContent = q[0]; $('alternativas').innerHTML = '';
  selecionada = null; $('proxima').disabled = true;
  q[1].forEach((texto,i) => {
    const b=document.createElement('button'); b.className='alternativa'; b.textContent=`${String.fromCharCode(65+i)}. ${texto}`;
    b.onclick=()=>{ document.querySelectorAll('.alternativa').forEach(x=>x.classList.remove('selecionada')); b.classList.add('selecionada'); selecionada=i; $('proxima').disabled=false; };
    $('alternativas').appendChild(b);
  });
  $('proxima').textContent = indice === questoes.length - 1 ? 'Ver resultado' : 'Próxima';
}

$('proxima').onclick = () => {
  if (selecionada === null) return;
  const q=questoes[indice], cat=q[3];
  if (!stats[cat]) stats[cat]={ok:0,total:0};
  stats[cat].total++;
  if (selecionada===q[2]) { acertos++; stats[cat].ok++; }
  indice++;
  indice < questoes.length ? mostrar() : resultado();
};

function resultado() {
  const pct=Math.round(acertos/questoes.length*100);
  $('testeResultado').textContent=`Teste: ${configuracaoTestes[tipoAtual].nome}`;
  $('nivelResultado').textContent=`Nível realizado: ${nomesNiveis[faixaAtual]}`;
  $('percentual').textContent=`${pct}%`; $('acertos').textContent=`${acertos} de ${questoes.length} acertos`; $('mensagem').textContent=mensagemResultado(pct);
  const box=$('categoriasResultado'); box.innerHTML='';
  let melhor=-1, melhores=[];
  Object.entries(stats).forEach(([cat,s])=>{
    const p=Math.round(s.ok/s.total*100);
    if(p>melhor){melhor=p;melhores=[cat]} else if(p===melhor){melhores.push(cat)}
    box.innerHTML += `<div class="linha-cat"><span>${cat}</span><span>${p}%</span><div class="mini-barra"><div style="width:${p}%"></div></div></div>`;
  });
  if(melhores.length===1){
    $('destaqueTitulo').textContent=melhores[0];
    $('destaqueTexto').textContent=mensagensCategorias[melhores[0]] || 'Esta foi a categoria em que você apresentou seu melhor desempenho neste conjunto.';
  } else {
    $('destaqueTitulo').textContent=melhores.join(' + ');
    $('destaqueTexto').textContent='Você obteve o mesmo melhor percentual nestas categorias, mostrando um desempenho equilibrado entre elas.';
  }
  tela('resultado');
}

$('voltarHome').onclick=()=>{
  const engenharias = ['civil','eletrica','mecanica','aeronautica','aeroespacial'];
  tela(engenharias.includes(tipoAtual) ? 'engenharias' : 'home');
};
$('voltarEngenharias').onclick=()=>tela('home');
$('reiniciar').onclick=()=>{ tipoAtual=null; faixaAtual=null; tela('home'); };
$('refazer').onclick=()=>iniciar(faixaAtual);
$('voltar').onclick=()=>{ if(confirm('Deseja sair do teste? O progresso atual será perdido.')) tela('niveis'); };
