#!/usr/bin/env python3
"""
Script temático v6 — Homenagem ao Paga
11 pessoas + música final.
Cortes calibrados por waveform. Lower-third via PIL.

Dependências: pip3 install moviepy Pillow
Requer: ffmpeg
Uso: python3 render_thematic.py
"""

import os
from moviepy import (
    VideoFileClip,
    ColorClip,
    CompositeVideoClip,
    concatenate_videoclips,
    ImageClip,
    vfx,
    afx,
)
from moviepy.audio.AudioClip import AudioClip
from moviepy.audio.io.AudioFileClip import AudioFileClip
from PIL import Image, ImageDraw, ImageFont

# === CONFIGURAÇÃO ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WORK_DIR = os.path.join(BASE_DIR, "_work")
OUTPUT = os.path.join(BASE_DIR, "Homenagem_Paga_v7.mp4")
MUSIC_FILE = os.path.join(BASE_DIR, "musica_final.mp3")
os.makedirs(WORK_DIR, exist_ok=True)

WIDTH, HEIGHT = 1280, 720
FPS = 30
FADE_IN = 0.4    # entrada suave
FADE_OUT = 0.2   # saída precisa no silêncio

# Cores
IFOOD_RED = (234, 29, 44)
DARK_BG = (18, 18, 18)
WHITE = (255, 255, 255)
LIGHT_GRAY = (180, 180, 180)

# Fontes (macOS)
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"


# =====================================================================
# SEGMENTOS — cortes calibrados por análise de waveform (precisão ms)
# (arquivo, nome, cargo_curto, start, end, show_lower_third)
# =====================================================================
SEGMENTS = [
    # ══════════════════════════════════════════════════════════════
    # v7: FADE=0.3s + cortes em finais de frase + tríade validada
    # ══════════════════════════════════════════════════════════════

    # ── ATO 1: A CHEGADA (liderados → pares) ─────────────────────

    # Gian 1: "Fala Paga!...multiverso...mudar o rumo das coisas."
    # Corte 19.875s ✅ (RMS=2, FO=973, FI=81)
    ("Gian-Paga-cfr.mp4", "Gian Moraes",
     "Engineering Manager · Parceiros | Multicategorias", 0.0, 19.875, True),

    # Marcelo 1: "Como imaginar Multi sem o Paga?...marca gigante que você deixou."
    # Corte 13.600s — fade 13.3s (silêncio RMS=8, após "deixou" terminar)
    ("Marcelo-Paga-cfr.mp4", "Marcelo Nascimento",
     "Engineering Manager · Parceiros | Multicategorias", 0.0, 13.600, True),

    # Lucas 1: MERGED — "Fala Paga!...confusão...agradecer...onboarding...primeiras etapas."
    # Corte 23.725s ✅ (RMS=31, FO=266, FI=4553🔴 — próxima frase começa rápido, ok com 0.3s)
    ("Lucas Pessoa-Paga-cfr.mp4", "Lucas Pessoa",
     "Head de Produto · Parceiros | Multicategorias", 0.0, 23.725, True),

    # Eliel 1: "Fala paga...me recebeu muito bem...manda muito bem."
    # Corte 31.609s ✅ (RMS=31, FO=139, FI=2243🟡)
    ("Eli-Paga-cfr.mp4", "Eliel Miller",
     "Head de Engenharia · Parceiros | Cross", 0.0, 31.609, True),

    # Aline 1: "Oi Paga...parceria...construir junto com seu time."
    ("Aline_Paga-cfr.mp4", "Aline Maria",
     "Business Partner · Parceiros", 0.0, 16.0, True),

    # ── ATO 2: O CARA ─────────────────────────────────────────────

    # Débora 1: "Oi querido...não gosta de mim...gosto um pouquinho mais."
    # Corte 25.925s (RMS=91, FO=1778🟡, FI=4665 — "Estou" começa rápido)
    ("Debora-Paga-cfr.mp4", "Débora Melges",
     "Group Product Manager · Parceiros | Multicategorias", 0.0, 25.925, True),

    # Marta 1: "Oi Paga!...ouvindo as suas histórias."
    # Corte 11.525s ✅ (RMS=11, FO=118, FI=4425🔴 — "Te acho" começa rápido)
    ("Marta-Paga-cfr.mp4", "Marta Teixeira",
     "Head de Produto · Parceiros | Restaurantes", 0.0, 11.525, True),

    # Giuliana 1: "Fala Paga!...senso de negócios...iFood, filhos, Tennis...vida pessoal e profissional."
    # Corte 37.200s — exato fim Sub5 "profissional." (não inclui início Sub6 "Você foi")
    ("giu-paga-cfr.mp4", "Giuliana Xavier",
     "Design Manager · Parceiros", 0.0, 37.200, True),

    # Gian 2: "Além disso, a gente teve muito tempo para concordar...vale a uns cinco."
    # Início 35.200s (silêncio RMS=1, antes de "Além disso" em 35.3s) | Fim 50.175s ✅
    ("Gian-Paga-cfr.mp4", "Gian Moraes",
     "Engineering Manager · Parceiros | Multicategorias", 35.200, 50.175, False),

    # Marcelo 2: "Sendo sempre firme, direto...acolhendo...desenvolvimento e de todos aqui."
    # Início 40.250s ✅ | Fim 54.825s (RMS=8, FO=2043🟡, FI=2747🟡)
    ("Marcelo-Paga-cfr.mp4", "Marcelo Nascimento",
     "Engineering Manager · Parceiros | Multicategorias", 40.250, 54.825, False),

    # ── ATO 3: O IMPACTO ──────────────────────────────────────────

    # Edu 1: "Falar do Paga é um desafio...parceria...entregar coisas muito legais."
    # Fim 36.525s ✅ (RMS=65, FO=1546🟡, FI=148)
    ("Edu-Paga-cfr.mp4", "Edu Olímpio",
     "Diretor de Tech · Parceiros", 0.0, 36.525, True),

    # Eliel 2: "As nossas trocas...paciência em explicar...obrigado...te admiro muito."
    # Início 31.609s | Fim 46.075s (RMS=49, FO=190, FI=4543🔴)
    ("Eli-Paga-cfr.mp4", "Eliel Miller",
     "Head de Engenharia · Parceiros | Cross", 31.609, 46.075, False),

    # Débora 2: "Estou muito grata...mudanças na cultura...peça fundamental...aqui em Parceiros."
    # Fim 47.050s (RMS=58, silêncio puro). FadeOut 0.2s começa em 46.85 (RMS=91 ✅)
    ("Debora-Paga-cfr.mp4", "Débora Melges",
     "Group Product Manager · Parceiros | Multicategorias", 25.925, 47.050, False),

    # Marcelo 3: "Saindo de caos→estabilidade...matando legado...liderança aqui com a gente."
    # Início 13.600s (alinhado Marc1) | Fim 40.250s ✅
    ("Marcelo-Paga-cfr.mp4", "Marcelo Nascimento",
     "Engineering Manager · Parceiros | Multicategorias", 13.600, 40.250, False),

    # Lucas 2: "E todo esse ano...discussões...peça super fundamental...multi-categoria."
    # Início 23.725s | Fim 40.025s ✅ (RMS=21, FO=325, FI=235)
    ("Lucas Pessoa-Paga-cfr.mp4", "Lucas Pessoa",
     "Head de Produto · Parceiros | Multicategorias", 23.725, 40.025, False),

    # Gian 3: "Suas provocações...zona de conforto...sistema confiável para os parceiros."
    # Início 19.875s | Fim 34.750s (após "parceiros." — RMS=1)
    ("Gian-Paga-cfr.mp4", "Gian Moraes",
     "Engineering Manager · Parceiros | Multicategorias", 19.875, 34.750, False),

    # Natália 1: "Paga...convívio...Multicategorias...mudar a maturidade...todo mundo."
    # Fim 22.875s ✅ (RMS=15, FO=112, FI=5019🔴)
    ("Natalia-Paga-cfr.mp4", "Natália Miranda",
     "Group Product Manager · Parceiros | Multicategorias", 0.0, 22.875, True),

    # Edu 2: "Mudou da água pro vinho...Marvels...legado sensacional...brilhar no iFood."
    # Início 36.525s | Fim 68.550s ✅ (RMS=83, FO=857, FI=145)
    ("Edu-Paga-cfr.mp4", "Edu Olímpio",
     "Diretor de Tech · Parceiros", 36.525, 68.550, False),

    # ── ATO 4: VALEU, PAGA! ───────────────────────────────────────

    # Eliel 3: "O cara é um profissional excepcional...sucesso...Valeu demais. Valeu."
    # Início 46.075s
    ("Eli-Paga-cfr.mp4", "Eliel Miller",
     "Head de Engenharia · Parceiros | Cross", 46.075, 64.0, False),

    # Aline 2: "Aprendi muito...sucesso...mandar um Slack...Um grande abraço."
    ("Aline_Paga-cfr.mp4", "Aline Maria",
     "Business Partner · Parceiros", 16.0, 36.0, False),

    # Marta 2: "Te acho engraçada...prazer trocar...sucesso...paz de espírito...Beijos!"
    # Início 11.525s
    ("Marta-Paga-cfr.mp4", "Marta Teixeira",
     "Head de Produto · Parceiros | Restaurantes", 11.525, 38.0, False),

    # Giuliana 2: "Você foi um baita parceiro...brilhar...voar alto...iFood tem sorte...Valeu!"
    # Início 37.200s (alinhado fim Giu1)
    ("giu-paga-cfr.mp4", "Giuliana Xavier",
     "Design Manager · Parceiros", 37.200, 62.0, False),

    # Natália 2: "Você fez muita diferença...sucesso...brilhe onde for. Muito obrigada."
    # Início 22.875s | Fim 29.400s (inclui "Muito obrigada" completo)
    ("Natalia-Paga-cfr.mp4", "Natália Miranda",
     "Group Product Manager · Parceiros | Multicategorias", 22.875, 29.400, False),

    # Renan: inteiro — "agradecer...bom profissional...Vegas no final do ano."
    ("Renan-Paga-cfr.mp4", "Renan Degrandi",
     "Nomad Engineer · Parceiros | Multicategorias", 0.0, 17.0, True),

    # Marcelo 4: "Muito obrigado...vai arrebentar...grande abraço."
    # Início 54.825s
    ("Marcelo-Paga-cfr.mp4", "Marcelo Nascimento",
     "Engineering Manager · Parceiros | Multicategorias", 54.825, 68.900, False),

    # Débora 3: "E tenho certeza que você vai brilhar no seu novo desafio. Beijos."
    # Início 47.050s (alinhado fim Déb2). FadeIn 0.4s: "E tenho certeza" a partir de 47.15s
    ("Debora-Paga-cfr.mp4", "Débora Melges",
     "Group Product Manager · Parceiros | Multicategorias", 47.050, 51.0, False),

    # Gian 4: "Você me deu oportunidades...feedbacks...vai continuar fazendo...Valeu Paga!"
    # Início 50.175s
    ("Gian-Paga-cfr.mp4", "Gian Moraes",
     "Engineering Manager · Parceiros | Multicategorias", 50.175, 71.500, False),

    # Lucas 3: "Tenho certeza vai ser bom demais...brilhar...resolver problemas complexos."
    # Início 40.025s | Fim 54.350s
    ("Lucas Pessoa-Paga-cfr.mp4", "Lucas Pessoa",
     "Head de Produto · Parceiros | Multicategorias", 40.025, 54.350, False),

    # Lucas 4: "E só tenho uma certeza...vai trabalhar junto de novo. Até mais!"
    ("Lucas Pessoa-Paga-cfr.mp4", "Lucas Pessoa",
     "Head de Produto · Parceiros | Multicategorias", 54.0, 62.540, False),

    # Edu 3 fecha: "A gente tem muito espaço, vai crescer e vai ser meu chefe logo logo."
    # Início 68.550s
    ("Edu-Paga-cfr.mp4", "Edu Olímpio",
     "Diretor de Tech · Parceiros", 68.550, 74.0, False),
]


# =====================================================================
# FUNÇÕES
# =====================================================================

def create_title_card_image(text_main, text_sub, filename):
    """Gera imagem PNG para intro/outro."""
    img = Image.new("RGB", (WIDTH, HEIGHT), DARK_BG)
    draw = ImageDraw.Draw(img)

    font_main = ImageFont.truetype(FONT_BOLD, 64)
    font_sub = ImageFont.truetype(FONT_REGULAR, 28)

    bbox = draw.textbbox((0, 0), text_main, font=font_main)
    w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (WIDTH - w) // 2
    y = HEIGHT // 2 - 60
    draw.text((x, y), text_main, fill=WHITE, font=font_main)

    line_y = y + h + 20
    draw.rectangle(
        [(WIDTH // 2 - 60, line_y), (WIDTH // 2 + 60, line_y + 4)],
        fill=IFOOD_RED,
    )

    bbox_sub = draw.textbbox((0, 0), text_sub, font=font_sub)
    w_sub = bbox_sub[2] - bbox_sub[0]
    x_sub = (WIDTH - w_sub) // 2
    y_sub = line_y + 24
    draw.text((x_sub, y_sub), text_sub, fill=LIGHT_GRAY, font=font_sub)

    path = os.path.join(WORK_DIR, filename)
    img.save(path)
    return path


def create_title_clip(text_main, text_sub, duration=4):
    """Cria clip de intro/outro com fade."""
    img_path = create_title_card_image(
        text_main, text_sub, f"card_{text_main[:8].replace(' ','_')}.png"
    )
    clip = (
        ImageClip(img_path, duration=duration)
        .resized((WIDTH, HEIGHT))
        .with_effects([vfx.FadeIn(FADE_IN), vfx.FadeOut(FADE_OUT)])
    )
    silent = AudioClip(lambda t: [0], duration=duration, fps=48000)
    clip = clip.with_audio(silent)
    return clip


def create_lower_third_overlay(name, role, clip_duration):
    """Lower-third renderizado via PIL — controle pixel a pixel."""
    lt_show = min(4.5, clip_duration - 0.3)
    if lt_show <= 1.0:
        return None

    LT_H = 140
    img = Image.new("RGBA", (WIDTH, LT_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rectangle([(0, 0), (WIDTH - 1, LT_H - 1)], fill=(0, 0, 0, 178))

    font_name = ImageFont.truetype(FONT_BOLD, 30)
    font_role = ImageFont.truetype(FONT_REGULAR, 19)

    bbox_name = draw.textbbox((0, 0), name, font=font_name)
    name_h = bbox_name[3] - bbox_name[1]

    name_y = 22
    draw.text((48, name_y), name, fill=(255, 255, 255, 255), font=font_name)

    role_y = name_y + name_h + 24
    draw.text((48, role_y), role, fill=(200, 200, 200, 255), font=font_role)

    draw.rectangle([(22, name_y - 4), (26, role_y + 22)], fill=(*IFOOD_RED, 255))

    lt_path = os.path.join(WORK_DIR, f"lt_{name[:12].replace(' ', '_')}.png")
    img.save(lt_path)

    lt_clip = (
        ImageClip(lt_path, duration=lt_show)
        .with_position(("left", HEIGHT - LT_H))
        .with_effects([vfx.CrossFadeIn(0.5), vfx.CrossFadeOut(0.5)])
        .with_start(0.3)
    )
    return lt_clip


def build_segment(seg_tuple, idx, total):
    """Monta segmento: corta trecho + lower-third + dip-to-black."""
    filename, name, role, start, end, show_lt = seg_tuple
    filepath = os.path.join(BASE_DIR, filename)

    clip = (
        VideoFileClip(filepath)
        .subclipped(start, end)
        .resized((WIDTH, HEIGHT))
    )
    duration = end - start

    if show_lt:
        lt = create_lower_third_overlay(name, role, duration)
        if lt:
            clip = CompositeVideoClip(
                [clip, lt], size=(WIDTH, HEIGHT)
            ).with_duration(duration)

    video_effects = []
    if idx > 0:
        video_effects.append(vfx.FadeIn(FADE_IN))
    if idx < total - 1:
        video_effects.append(vfx.FadeOut(FADE_OUT))
    if video_effects:
        clip = clip.with_effects(video_effects)

    audio = clip.audio
    if audio is not None:
        audio_effects = []
        if idx > 0:
            audio_effects.append(afx.AudioFadeIn(FADE_IN))
        if idx < total - 1:
            audio_effects.append(afx.AudioFadeOut(FADE_OUT))
        if audio_effects:
            audio = audio.with_effects(audio_effects)
            clip = clip.with_audio(audio)

    return clip


def create_outro_with_music(text_main, text_sub):
    """Cria outro: card com fade-in → 2s silêncio → música toca até o fim."""
    img_path = create_title_card_image(text_main, text_sub, "card_outro.png")

    music = AudioFileClip(MUSIC_FILE)
    music_dur = music.duration

    # Total: fade_in(0.6) + 2s silêncio + música + fade_out(2s)
    total_dur = 2.0 + music_dur + 2.0

    # Vídeo: card estático com fade in e fade out
    video = (
        ImageClip(img_path, duration=total_dur)
        .resized((WIDTH, HEIGHT))
        .with_effects([vfx.FadeIn(FADE_IN), vfx.FadeOut(2.0)])
    )

    # Áudio: 2s silêncio + música + fade out
    silence = AudioClip(lambda t: [0], duration=2.0, fps=48000)
    music_faded = music.with_effects([afx.AudioFadeIn(0.5), afx.AudioFadeOut(2.0)])
    from moviepy import concatenate_audioclips
    full_audio = concatenate_audioclips([silence, music_faded])

    # Pad audio se necessário
    if full_audio.duration < total_dur:
        pad = AudioClip(lambda t: [0], duration=total_dur - full_audio.duration, fps=48000)
        full_audio = concatenate_audioclips([full_audio, pad])

    video = video.with_audio(full_audio)
    return video


def main():
    print("=" * 60)
    print("  Homenagem ao Paga — v7 (fade 0.3s + cortes por frase)")
    print("=" * 60)

    total = len(SEGMENTS) + 2  # +intro +outro

    print("\n[1/5] Gerando intro...")
    intro = create_title_clip(
        "Valeu, Paga!",
        "Multicategorias agradece  ·  iFood",
        duration=4,
    )
    clips = [intro]

    print(f"\n[2/5] Processando {len(SEGMENTS)} segmentos...")
    for i, seg in enumerate(SEGMENTS):
        name = seg[1]
        start, end = seg[3], seg[4]
        lt_flag = " → lower-third" if seg[5] else ""
        print(f"  [{i+1:2d}/{len(SEGMENTS)}] {name} ({start:.3f}s → {end:.3f}s){lt_flag}")
        clip = build_segment(seg, i + 1, total)
        clips.append(clip)

    print("\n[3/5] Gerando outro com música...")
    outro = create_outro_with_music(
        "Voa, Paga!",
        "Boa sorte nos novos desafios!  ·  iFood",
    )
    clips.append(outro)

    print(f"\n[4/5] Concatenando {len(clips)} clips (dip-to-black, fadeIn={FADE_IN}s fadeOut={FADE_OUT}s)...")
    final = concatenate_videoclips(clips, method="compose", padding=0)

    print(f"\n[5/5] Renderizando → {OUTPUT}")
    final.write_videofile(
        OUTPUT,
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        audio_fps=48000,
        preset="fast",
        threads=4,
        logger="bar",
        ffmpeg_params=["-async", "1"],
    )

    dur = final.duration
    print(f"\n{'=' * 60}")
    print(f"  PRONTO!")
    print(f"  Arquivo: {OUTPUT}")
    print(f"  Duração: {int(dur)//60}:{int(dur)%60:02d}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
