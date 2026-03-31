# Valeu, Paga! — Video Homenagem

Video de homenagem ao Paga, produzido com [Remotion](https://remotion.dev/) (React + TypeScript).

## Estrutura do Video

O video segue uma narrativa em **4 atos**, com 31 depoimentos de 11 pessoas do time iFood Multicategorias:

| Ato | Titulo | Descricao |
|-----|--------|-----------|
| 1 | A Chegada | Primeiras impressoes e onboarding |
| 2 | O Cara | Personalidade e relacoes |
| 3 | O Impacto | Contribuicoes profissionais |
| 4 | Valeu, Paga! | Despedida e desejos |

**Specs:** 1280x720 @ 30fps | Transicoes dip-to-black | Lower thirds animados | Musica no outro

## Setup

```bash
# 1. Instalar dependencias
bash setup.sh

# 2. Colocar os arquivos de video (.mp4) na raiz do projeto
# 3. Colocar Voa-Paga.mp3 na raiz ou em public/

# Preview
npm start

# Render final
npm run build
```

## Arquivos de Video Necessarios

Os seguintes arquivos `.mp4` devem estar na raiz do projeto:

- `Gian-Paga-cfr.mp4`
- `Marcelo-Paga-cfr.mp4`
- `Lucas Pessoa-Paga-cfr.mp4`
- `Eli-Paga-cfr.mp4`
- `Aline_Paga-cfr.mp4`
- `Debora-Paga-cfr.mp4`
- `Marta-Paga-cfr.mp4`
- `giu-paga-cfr.mp4`
- `Edu-Paga-cfr.mp4`
- `Natalia-Paga-cfr.mp4`
- `Renan-Paga-cfr.mp4`
- `Voa-Paga.mp3` (musica do outro)

## Estrutura do Projeto

```
src/
  compositions/
    HomenagemPaga.tsx    # Composicao principal (timeline)
  components/
    TitleCard.tsx         # Cards de intro/outro
    ActTitleCard.tsx      # Cards de transicao entre atos
    TestimonialSegment.tsx # Segmento de depoimento
    LowerThird.tsx        # Overlay com nome/cargo
  data/
    segments.ts           # Dados dos segmentos (cortes, nomes, atos)
```

## Como Editar

- **Reordenar/adicionar segmentos:** Edite `src/data/segments.ts`
- **Ajustar cortes:** Altere `start`/`end` em cada segmento
- **Mudar atos:** Altere o campo `act` (1-4) — os title cards sao inseridos automaticamente
- **Estilo:** Componentes em `src/components/`
