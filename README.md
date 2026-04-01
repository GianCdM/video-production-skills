# Video Production Skills

Skills de produção de vídeo para assistentes de código AI. Clone direto na pasta de skills da sua ferramenta.

## Skills incluídas

| Skill | Descrição |
|-------|-----------|
| [video-editing-workflow](./video-editing-workflow/) | Pipeline completo de edição — intake de footage, transcrição, cortes com triad analysis, validação de fades, QA |

## Dependência: remotion-best-practices

Esta skill depende de `remotion-best-practices` (skill oficial do Remotion). Instale primeiro:

```bash
npx skills add remotion-dev/skills
```

## Instalação

### Claude Code

```bash
# Instalar dependência
npx skills add remotion-dev/skills

# Instalar este repo
git clone https://github.com/GianCdM/video-production-skills.git ~/.claude/skills/video-production-skills
```

O Claude Code detecta automaticamente cada `SKILL.md` recursivamente nas subpastas.

### Cursor

```bash
git clone https://github.com/GianCdM/video-production-skills.git /tmp/vps
cp -r /tmp/vps/video-editing-workflow/SKILL.md .cursor/rules/video-editing-workflow.md
cp -r /tmp/vps/video-editing-workflow/rules/ .cursor/rules/video-editing-workflow-rules/
```

### VS Code Copilot

```bash
git clone https://github.com/GianCdM/video-production-skills.git /tmp/vps
mkdir -p .github/instructions
cp -r /tmp/vps/video-editing-workflow/ .github/instructions/video-editing-workflow/
```

### Windsurf / Codex / Outros

Clone e copie a pasta `video-editing-workflow/` para onde a ferramenta espera encontrar instruções. Cada skill é uma pasta com um `SKILL.md` (markdown com frontmatter YAML) e arquivos de referência em `rules/`.

## Estrutura

```
video-production-skills/
├── video-editing-workflow/
│   ├── SKILL.md                  # Router — tipos de vídeo, índice de rules
│   └── rules/
│       ├── video-intake.md       # CFR normalization, Whisper, probing
│       ├── thematic-editing.md   # Atos narrativos, lower-thirds
│       ├── triad-analysis.md     # Waveform × SRT × timeline, cut validation
│       ├── audio-shift.md        # Detecção e compensação de shift
│       ├── coverage-analysis.md  # % de conteúdo usado por pessoa
│       ├── fade-guidelines.md    # Durações de fade + exemplos Remotion
│       ├── pitfalls.md           # Armadilhas comuns
│       └── quality-checklist.md  # Checklist pré-entrega
└── README.md
```
