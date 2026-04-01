# Eu fiz um vídeo de 10 minutos com 11 pessoas. Nunca abri um editor de vídeo.

Essa é uma história sobre como um Engineering Manager que nunca editou um vídeo na vida construiu um sistema de produção audiovisual inteiro — usando IA e teimosia.

---

## O contexto

Nosso Head de Engenharia de Multicategorias no iFood estava mudando de área. É o tipo de líder que marca a trajetória de todo mundo que trabalha com ele. Eu queria fazer algo que fosse além do card no Slack com emoji de coração.

A ideia: um vídeo de homenagem. Pedi pra 11 pessoas do time gravarem depoimentos pelo celular — cada um falando o que quisesse, sem roteiro. Recebi 11 vídeos crus, de qualidades e durações completamente diferentes. Gravações de 30 segundos a 5 minutos. Vertical, horizontal, com eco, sem eco, em ambientes diferentes.

E aí pensei: "beleza, agora é só editar."

Spoiler: **não era só editar.**

---

## O problema real

Eu sei usar iMovie. Já mexi no Windows Movie Maker (será que ainda existe?). Esse é o meu nível. Eu não conheço nem o nome dos softwares profissionais de edição — Premiere, Final Cut, DaVinci são nomes que eu ouço mas nunca abri.

Mas o ponto é: eu não queria resolver com software empacotado. Eu queria resolver com **IA**. Queria construir minha própria skill — entender o processo, ter controle total, e no caminho criar algo reutilizável.

Sou programador de formação, mas depois de anos gerindo pessoas que programam, tô bem enferrujado. A IA era justamente o que me permitia voltar a construir sem precisar lembrar de tudo.

Comecei com MoviePy, uma biblioteca Python pra edição de vídeo. A IA escrevia o código, eu direcionava as decisões. Funcionou pro básico — concatenar vídeos, colocar fade. Mas o ciclo de debug era brutal: cada render levava uns 10 minutos, e só assistindo o resultado eu percebia que tinha algo errado. Um corte fora de lugar, um fade que pegava voz, um silêncio estranho. Aí voltava, ajustava, renderizava de novo. 10 minutos. De novo errado. 10 minutos.

Além disso, o MoviePy introduz um deslocamento de áudio de 50 a 150 milissegundos no render. Parece pouco? Num vídeo de 10 minutos com 31 cortes, é desastroso. A voz cortava no meio da frase. Era sutil o suficiente pra incomodar e difícil o suficiente pra diagnosticar.

Foi aí que migrei pro **Remotion** — e não foi pelos componentes bonitos. Foi pelo **player interativo**.

---

## Remotion: o player que mudou tudo

Remotion é um framework que transforma React em vídeo. Mas o que me ganhou não foi a parte do React — foi o **Remotion Studio**. Você roda o servidor, abre o browser, e tem um player com timeline, preview frame-a-frame, e hot reload. Mudo o código, o vídeo atualiza instantaneamente. Sem esperar 10 minutos pra ver se o corte ficou bom.

Isso transformou o ciclo de debug. Em vez de "renderiza, assiste, torce, volta", virou "ajusta, vê na hora, ajusta de novo". O feedback loop caiu de minutos pra segundos.

O projeto final ficou assim: 1280×720, 30fps, 4 atos narrativos, 31 segmentos intercalados entre 11 pessoas, lower-thirds dinâmicos (aquelas legendas com nome e cargo), transições dip-to-black, e uma trilha sonora de fundo.

---

## A descoberta: Triad Analysis

Aqui é onde a coisa fica interessante.

Cortar vídeo parece simples: "acha um silêncio e corta." Não é. Depois de 3 versões com cortes que soavam errados, eu precisava entender *por que* ficavam ruins — sistematicamente, não no achismo.

Desenvolvi uma metodologia que chamei de **Triad Analysis**: validação de ponto de corte por três timelines simultâneas.

**Waveform (áudio).** Extraio o áudio e analiso a energia sonora em janelas de milissegundos. Se no ponto onde eu quero cortar tem energia alta, significa que tem voz ali. Não pode cortar.

**Transcrição.** Rodo um modelo de transcrição automática no vídeo e mapeio cada frase com seus tempos. Isso resolve um problema que a waveform sozinha não pega: um silêncio entre "que você" e "deixou" **não** é um bom corte. A waveform mostra silêncio, mas o contexto semântico diz que a frase não terminou. Precisa dos dois: silêncio no áudio *e* fim de frase no texto.

**Output renderizado.** Depois de renderizar o vídeo, extraio o áudio de novo e verifico se os pontos de corte estão onde deviam. O pipeline de render pode introduzir deslocamentos. Um corte que parecia limpo no material original pode estar cortando voz no arquivo final.

Um corte só é válido quando **as três concordam**. Parece overkill? Depois de 5 versões do vídeo, eu garanto que não é.

---

## O que eu aprendi (e documentei)

Cada problema virou uma lição documentada. Algumas que me custaram horas:

**Celulares gravam em frame rate variável.** E editores de vídeo esperam frame rate constante. Se você não converter antes de importar, o áudio vai desincronizar progressivamente. Um vídeo de 10 minutos pode ter um descompasso de vários segundos no final. Sempre converta antes de qualquer coisa.

**Transcrição automática erra.** Os tempos marcados pela IA podem estar errados em 200 a 500 milissegundos. Nunca confie nos tempos da transcrição como verdade absoluta — sempre cruze com a análise do áudio.

**Fades são assimétricos perceptualmente.** Cortar a voz de alguém no fade de saída (a pessoa é silenciada no meio da fala) é muito pior do que pegar um pouco de voz no fade de entrada (a próxima pessoa entra com volume subindo). Quando não tem ponto de corte perfeito, erre pro lado do fade de entrada.

**Lower-thirds durante movimento ficam amadores.** Aquela legenda com nome e cargo que aparece quando a pessoa está rindo ou se mexendo? Fica horrível. Espere um momento parado, bem iluminado — geralmente os primeiros 4 segundos do segmento.

---

## De projeto pessoal a open-source

Depois de resolver tudo isso, percebi que tinha construído algo que podia ser reutilizado. Não só por mim — por qualquer pessoa usando assistentes de código AI pra trabalhar com vídeo.

Empacotei tudo como uma **skill**: um conjunto de instruções estruturadas que um assistente AI carrega automaticamente quando detecta que você está num projeto de vídeo. Funciona com Claude Code, Cursor, VS Code Copilot, e outras ferramentas.

A skill não é código executável. É conhecimento estruturado. O assistente passa a saber como fazer intake de footage, como estruturar um vídeo em atos narrativos, como validar cada ponto de corte com a tríade, como detectar deslocamentos de áudio, e o que verificar antes de renderizar a versão final.

O repo é público: [video-production-skills](https://github.com/GianCdM/video-production-skills)

---

## O que isso diz sobre IA e criação

Eu não sou videomaker. Nunca vou ser. Mas produzi um vídeo de homenagem que fez meu time se emocionar.

Acho que a gente subestima o que acontece quando alguém com contexto profundo sobre um problema ganha ferramentas que eliminam a barreira técnica. Eu conheço essas 11 pessoas. Sei o que cada fala significa, qual anedota complementa qual, que ordem cria a melhor narrativa. O que eu *não* sabia era como transformar isso em vídeo.

A IA me devolveu a capacidade de construir. Depois de anos gerindo pessoas que programam, eu não precisei reaprender tudo — precisei de um copiloto que escrevesse o código enquanto eu tomava as decisões editoriais. E a metodologia da tríade nasceu da necessidade de entender "por que ficou ruim", sistematicamente.

O resultado não é só um vídeo. É um workflow documentado que qualquer pessoa pode usar pra produzir vídeo com IA.

---

## TL;DR

- Fiz um vídeo de homenagem com 11 depoimentos, 4 atos, 31 cortes, 10 minutos
- Usei Remotion + Claude Code, zero software de edição profissional
- Desenvolvi "Triad Analysis" — validação de corte por análise de áudio, transcrição e output renderizado
- Documentei todas as armadilhas como regras reutilizáveis
- Publiquei como skill open-source pra qualquer assistente AI de código
