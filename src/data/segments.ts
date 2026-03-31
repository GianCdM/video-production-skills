import { staticFile } from "remotion";

export interface Segment {
  file: string;
  name: string;
  role: string;
  start: number;
  end: number;
  showLowerThird: boolean;
  act: number;
}

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 720;
export const FADE_DURATION_SEC = 0.4;
export const FADE_FRAMES = Math.round(FADE_DURATION_SEC * FPS); // 12 frames

export const IFOOD_RED = "#EA1D2C";

export const INTRO_DURATION_SEC = 4;
export const OUTRO_DURATION_SEC = 32;
export const ACT_TITLE_DURATION_SEC = 2.5;

/** Get unique act numbers in order of appearance */
export function getActBreaks(): number[] {
  const acts: number[] = [];
  for (const seg of SEGMENTS) {
    if (acts.length === 0 || acts[acts.length - 1] !== seg.act) {
      acts.push(seg.act);
    }
  }
  return acts;
}

/** Number of act title cards inserted (one per act) */
export function actTitleCardCount(): number {
  return getActBreaks().length;
}

export const SEGMENTS: Segment[] = [
  // ATO 1: A CHEGADA
  { file: "Gian-Paga-cfr.mp4", name: "Gian Moraes", role: "Engineering Manager · Parceiros | Multicategorias", start: 0, end: 19.875, showLowerThird: true, act: 1 },
  { file: "Marcelo-Paga-cfr.mp4", name: "Marcelo Nascimento", role: "Engineering Manager · Parceiros | Multicategorias", start: 0, end: 14.455, showLowerThird: true, act: 1 },
  { file: "Lucas Pessoa-Paga-cfr.mp4", name: "Lucas Pessoa", role: "Head de Produto · Parceiros | Multicategorias", start: 0, end: 23.000, showLowerThird: true, act: 1 },
  { file: "Eli-Paga-cfr.mp4", name: "Eliel Miller", role: "Head de Engenharia · Parceiros | Cross", start: 0, end: 31.650, showLowerThird: true, act: 1 },  // após "manda muito bem." + silêncio
  { file: "Aline_Paga-cfr.mp4", name: "Aline Maria", role: "Business Partner · Parceiros", start: 0, end: 16, showLowerThird: true, act: 1 },

  // ATO 2: O CARA
  { file: "Debora-Paga-cfr.mp4", name: "Débora Melges", role: "Sr. Group Product Manager · Parceiros | Multicategorias", start: 0, end: 25.780, showLowerThird: true, act: 2 },  // inclui "Agora eu gosto um pouquinho mais."
  { file: "Marta-Paga-cfr.mp4", name: "Marta Teixeira", role: "Head de Produto · Parceiros | Restaurantes", start: 0, end: 11.485, showLowerThird: true, act: 2 },
  { file: "giu-paga-cfr.mp4", name: "Giuliana Xavier", role: "Sr. Design Manager · Parceiros", start: 0, end: 39.220, showLowerThird: true, act: 2 },
  { file: "Gian-Paga-cfr.mp4", name: "Gian Moraes", role: "Engineering Manager · Parceiros | Multicategorias", start: 35.010, end: 50.175, showLowerThird: false, act: 2 },
  { file: "Marcelo-Paga-cfr.mp4", name: "Marcelo Nascimento", role: "Engineering Manager · Parceiros | Multicategorias", start: 40.355, end: 54.815, showLowerThird: false, act: 2 },

  // ATO 3: O IMPACTO
  { file: "Edu-Paga-cfr.mp4", name: "Edu Olímpio", role: "Diretor de Tech · Parceiros", start: 0, end: 37.165, showLowerThird: true, act: 3 },
  { file: "Eli-Paga-cfr.mp4", name: "Eliel Miller", role: "Head de Engenharia · Parceiros | Cross", start: 31.650, end: 48.400, showLowerThird: false, act: 3 },  // começa com "As nossas trocas..."
  { file: "Debora-Paga-cfr.mp4", name: "Débora Melges", role: "Sr. Group Product Manager · Parceiros | Multicategorias", start: 25.780, end: 46.925, showLowerThird: false, act: 3 },  // começa com "Estou muito grata..."
  { file: "Marcelo-Paga-cfr.mp4", name: "Marcelo Nascimento", role: "Engineering Manager · Parceiros | Multicategorias", start: 14.455, end: 40.355, showLowerThird: false, act: 3 },
  { file: "Lucas Pessoa-Paga-cfr.mp4", name: "Lucas Pessoa", role: "Head de Produto · Parceiros | Multicategorias", start: 23.000, end: 40.025, showLowerThird: false, act: 3 },
  { file: "Gian-Paga-cfr.mp4", name: "Gian Moraes", role: "Engineering Manager · Parceiros | Multicategorias", start: 19.875, end: 35.010, showLowerThird: false, act: 3 },
  { file: "Natalia-Paga-cfr.mp4", name: "Natália Miranda", role: "Group Product Manager · Parceiros | Multicategorias", start: 0, end: 22.760, showLowerThird: true, act: 3 },
  { file: "Edu-Paga-cfr.mp4", name: "Edu Olímpio", role: "Diretor de Tech · Parceiros", start: 37.165, end: 68.55, showLowerThird: false, act: 3 },

  // ATO 4: VALEU, PAGA!
  { file: "Eli-Paga-cfr.mp4", name: "Eliel Miller", role: "Head de Engenharia · Parceiros | Cross", start: 48.400, end: 63.940, showLowerThird: false, act: 4 },
  { file: "Aline_Paga-cfr.mp4", name: "Aline Maria", role: "Business Partner · Parceiros", start: 16, end: 36, showLowerThird: false, act: 4 },
  { file: "Marta-Paga-cfr.mp4", name: "Marta Teixeira", role: "Head de Produto · Parceiros | Restaurantes", start: 11.485, end: 38.165, showLowerThird: false, act: 4 },
  { file: "giu-paga-cfr.mp4", name: "Giuliana Xavier", role: "Sr. Design Manager · Parceiros", start: 39.220, end: 62.310, showLowerThird: false, act: 4 },
  { file: "Natalia-Paga-cfr.mp4", name: "Natália Miranda", role: "Group Product Manager · Parceiros | Multicategorias", start: 22.760, end: 29.4, showLowerThird: false, act: 4 },
  { file: "Renan-Paga-cfr.mp4", name: "Renan Degrandi", role: "Nomad Engineer · Parceiros | Multicategorias", start: 0, end: 16.750, showLowerThird: true, act: 4 },
  { file: "Marcelo-Paga-cfr.mp4", name: "Marcelo Nascimento", role: "Engineering Manager · Parceiros | Multicategorias", start: 54.815, end: 68.995, showLowerThird: false, act: 4 },
  { file: "Debora-Paga-cfr.mp4", name: "Débora Melges", role: "Sr. Group Product Manager · Parceiros | Multicategorias", start: 46.925, end: 51, showLowerThird: false, act: 4 },
  { file: "Gian-Paga-cfr.mp4", name: "Gian Moraes", role: "Engineering Manager · Parceiros | Multicategorias", start: 50.175, end: 71.5, showLowerThird: false, act: 4 },
  { file: "Lucas Pessoa-Paga-cfr.mp4", name: "Lucas Pessoa", role: "Head de Produto · Parceiros | Multicategorias", start: 40.025, end: 62.490, showLowerThird: false, act: 4 },  // merged Lucas 3+4
  { file: "Edu-Paga-cfr.mp4", name: "Edu Olímpio", role: "Diretor de Tech · Parceiros", start: 68.55, end: 74, showLowerThird: false, act: 4 },
];

/** Calculate the duration in frames for a segment */
export function segmentDurationFrames(seg: Segment): number {
  return Math.round((seg.end - seg.start) * FPS);
}

/** Calculate the total duration including intro, act titles, all segments, and outro */
export function totalDurationFrames(): number {
  const introFrames = INTRO_DURATION_SEC * FPS;
  const outroFrames = OUTRO_DURATION_SEC * FPS;
  const actTitleFrames = actTitleCardCount() * Math.round(ACT_TITLE_DURATION_SEC * FPS);

  const segmentFrames = SEGMENTS.reduce(
    (acc, seg) => acc + segmentDurationFrames(seg),
    0
  );

  return introFrames + actTitleFrames + segmentFrames + outroFrames;
}

/** Video source path for a segment file */
export function videoSrc(file: string): string {
  return staticFile(file);
}
