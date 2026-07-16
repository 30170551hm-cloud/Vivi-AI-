// ViviUniversity — Internal University of Vivi AI.
// A structured knowledge system organized into 10 faculties.

import { ModuleBase } from '../core/ModuleBase';
import { EVENTS } from '../events';
import { backend } from '@/lib/backendClient';

export const FACULTIES = {
  ciencias: {
    name: 'Facultad de Ciencias', icon: '📘',
    areas: ['Matemáticas', 'Física', 'Química', 'Biología', 'Astronomía', 'Medicina', 'Ingeniería'],
    keywords: /matem[aá]tica|f[ií]sica|qu[ií]mica|biolog[ií]a|astronom[ií]a|medicina|ingenier[ií]a|c[eé]lula|[aá]tomo|mol[eé]cula|energ[ií]a|fuerza|velocidad|aceleraci[oó]n|ec[uo]aci[oó]n|c[aá]lculo|geometr[ií]a|[aá]lgebra|estad[ií]stica|probabilidad|planeta|estrella|galaxia|universo|genes|adn|arn|prote[ií]na|virus|bacteria|enfermedad|s[ií]ntoma|diagn[oó]stico|tratamiento|f[aá]rmaco|reactivo|compuesto|elemento|tabla peri[oó]dica|termodin[aá]mica|gravedad|relatividad|cu[aá]ntica/i,
  },
  tecnologia: {
    name: 'Facultad de Tecnología', icon: '💻',
    areas: ['Inteligencia Artificial', 'Programación', 'Robótica', 'Ciberseguridad', 'Redes', 'Bases de datos', 'Cloud Computing'],
    keywords: /inteligencia artificial|\bia\b|machine learning|programaci[oó]n|c[oó]digo|algoritmo|rob[oó]tica|ciberseguridad|hacker|malware|redes|protocolo|base de datos|\bsql\b|nosql|cloud|nube|servidor|\bapi\b|javascript|python|react|node|docker|kubernetes|blockchain|criptograf[ií]a|desarrollo|software|hardware|cpu|gpu|ram|backend|frontend|fullstack|devops/i,
  },
  humanidades: {
    name: 'Facultad de Humanidades', icon: '📜',
    areas: ['Historia', 'Filosofía', 'Psicología', 'Sociología', 'Economía', 'Política', 'Antropología'],
    keywords: /historia|filosof[ií]a|sociolog[ií]a|econom[ií]a|pol[ií]tica|antropolog[ií]a|guerra|revoluci[oó]n|imperio|civilizaci[oó]n|pensamiento|[eé]tica|moral|sociedad|cultura|gobierno|democracia|capitalismo|socialismo|inflaci[oó]n|mercado|\bpib\b|fil[oó]sofo|pensador|ilustraci[oó]n|renacimiento|edad media|prehistoria|arqueolog[ií]a/i,
  },
  idiomas: {
    name: 'Facultad de Idiomas', icon: '🌍',
    areas: ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano', 'Alemán', 'Japonés', 'Chino', 'Árabe'],
    keywords: /idioma|espa[ñn]ol|ingl[eé]s|portugu[eé]s|franc[eé]s|italiano|alem[aá]n|japon[eé]s|chino|[aá]rabe|traduc|gram[aá]tica|vocabulario|pronunciaci[oó]n|conjugaci[oó]n|verbo|sustantivo|adjetivo|adverbio|frase|oraci[oó]n|sem[aá]ntica|sintaxis|fon[eé]tica|ling[uü][ií]stica/i,
  },
  psicologia: {
    name: 'Facultad de Psicología', icon: '🧠',
    areas: ['Emociones', 'Personalidad', 'Comportamiento', 'Motivación', 'Empatía', 'Inteligencia Emocional', 'Resolución de Conflictos'],
    keywords: /emoci[oó]n|personalidad|comportamiento|motivaci[oó]n|empat[ií]a|ansiedad|depresi[oó]n|estr[eé]s|trauma|terapia|psicoan[aá]lisis|consciente|inconsciente|sentimiento|percepci[oó]n|cognitivo|conducta|fobia|trastorno|psicolog/i,
  },
  comunicacion: {
    name: 'Facultad de Comunicación Humana', icon: '🎙️',
    areas: ['Lenguaje Verbal', 'Lenguaje Corporal', 'Tono de Voz', 'Pausas', 'Prosodia', 'Sarcasmo', 'Humor', 'Ironía', 'Cultura'],
    keywords: /comunicaci[oó]n|lenguaje corporal|tono de voz|prosodia|sarcasmo|humor|iron[ií]a|gesto|expresi[oó]n|discurso|ret[oó]rica|oratoria|di[aá]logo|escucha activa|negociaci[oó]n|persuasi[oó]n|ling[uü][ií]stica pragm[aá]tica/i,
  },
  derecho: {
    name: 'Facultad de Derecho', icon: '⚖️',
    areas: ['Derecho Civil', 'Derecho Penal', 'Derecho Internacional', 'Derechos Humanos', 'Contratos', 'Impuestos'],
    keywords: /derecho|legal|jur[ií]dico|constituci[oó]n|contrato|impuesto|penal|civil|internacional|derechos humanos|juicio|tribunal|abogado|notario|sentencia|delito|crimen|multa|ley|reglamento|normativa|arbitraje/i,
  },
  negocios: {
    name: 'Facultad de Negocios', icon: '💼',
    areas: ['Emprendimiento', 'Marketing', 'Ventas', 'Finanzas', 'Management', 'Innovación'],
    keywords: /negocio|empresa|emprendimiento|marketing|ventas|finanzas|management|innovaci[oó]n|startup|inversi[oó]n|rentabilidad|ingreso|egreso|presupuesto|estrategia|marca|cliente|consumidor|publicidad|\bseo\b|funnel|conversion/i,
  },
  arte: {
    name: 'Facultad de Arte y Diseño', icon: '🎨',
    areas: ['Música', 'Literatura', 'Pintura', 'Diseño', 'Cine', 'Fotografía'],
    keywords: /arte|m[uú]sica|literatura|pintura|dise[ñn]o|cine|fotograf[ií]a|poes[ií]a|novela|escultura|arquitectura|canci[oó]n|melod[ií]a|ritmo|color|composici[oó]n|est[eé]tica|pintor|escritor|director|fot[oó]grafo/i,
  },
  inteligencia_emocional: {
    name: 'Facultad de Inteligencia Emocional', icon: '❤️',
    areas: ['Autoconocimiento', 'Autocontrol', 'Empatía', 'Relaciones', 'Disciplina'],
    keywords: /inteligencia emocional|autoconocimiento|autocontrol|autoestima|confianza|resiliencia|mindfulness|meditaci[oó]n|bienestar|felicidad|prop[oó]sito|valores|autodisciplina|h[aá]bito|motivaci[oó]n personal/i,
  },
};

export default class ViviUniversity extends ModuleBase {
  constructor(bus) {
    super('university', bus);
    this._cache = [];
  }

  async init(registry) {
    await super.init(registry);
    this.subscribe(EVENTS.UNIVERSITY_CONSULT, ({ query, requestId }) => {
      this.consult(query).then((result) => {
        this.emit(EVENTS.UNIVERSITY_RESULT, { query, result, requestId });
      });
    });
  }

  routeQuestion(text) {
    if (!text) return null;
    for (const [key, faculty] of Object.entries(FACULTIES)) {
      if (faculty.keywords.test(text)) {
        const area = this._detectArea(text, faculty.areas);
        return { faculty: key, facultyName: faculty.name, icon: faculty.icon, area };
      }
    }
    return null;
  }

  _detectArea(text, areas) {
    const lower = text.toLowerCase();
    for (const area of areas) {
      if (lower.includes(area.toLowerCase())) return area;
    }
    return areas[0];
  }

  async consult(text) {
    const route = this.routeQuestion(text);
    if (!route) return { faculty: null, entries: [] };
    try {
      const entries = await backend.entities.KnowledgeEntry.filter({ faculty: route.faculty }, '-updated_date', 5);
      return { ...route, entries: entries || [] };
    } catch {
      return { ...route, entries: [] };
    }
  }

  async buildPromptContext(text) {
    const consultation = await this.safe(() => this.consult(text), null);
    if (!consultation || !consultation.entries || consultation.entries.length === 0) return '';
    const facultyInfo = FACULTIES[consultation.faculty];
    const verified = consultation.entries.filter((e) => e.verified);
    const toUse = verified.length > 0 ? verified : consultation.entries;
    const knowledgeLines = toUse.map((e) => `- [${e.area}] ${e.title}: ${e.content}${e.source ? ` (Fuente: ${e.source})` : ''}`).join('\n');
    return `Universidad Interna de Vivi — ${facultyInfo?.icon || ''} ${facultyInfo?.name || consultation.faculty}\nConocimiento verificado disponible:\n${knowledgeLines}\n\nUsa este conocimiento como base. Si necesitas información más actualizada, búscala en internet.`;
  }

  async learn({ faculty, area, title, content, source, sourceType, verified, tags }) {
    if (!faculty || !area || !title || !content) return null;
    const validFaculty = FACULTIES[faculty] ? faculty : 'humanidades';
    try {
      const entry = await backend.entities.KnowledgeEntry.create({
        faculty: validFaculty, area, title, content,
        source: source || '', source_type: sourceType || 'web_search',
        verified: verified || false,
        last_verified_date: verified ? new Date().toISOString().split('T')[0] : undefined,
        tags: tags || [],
      });
      this.emit(EVENTS.UNIVERSITY_LEARNED, { faculty: validFaculty, area, title });
      return entry;
    } catch (err) {
      this._diag('learn() failed', err?.message);
      return null;
    }
  }

  async fetchFreshInfo(query, { store = false, faculty = null, area = null } = {}) {
    const result = await this.safe(async () => {
      const response = await backend.integrations.Core.InvokeLLM({
        prompt: `Busca información actualizada y verificable sobre: ${query}\n\nPrioriza fuentes oficiales, artículos científicos, estándares internacionales y publicaciones académicas.\nSi hay opiniones diferentes, distingue entre hechos comprobados, hipótesis y opiniones.\nProporciona una respuesta clara, concisa y factual.`,
        response_json_schema: {
          type: 'object',
          properties: {
            answer: { type: 'string', description: 'Respuesta factual y verificada' },
            sources: { type: 'array', items: { type: 'string' }, description: 'Fuentes consultadas' },
            confidence: { type: 'string', enum: ['alta', 'media', 'baja'] },
            is_realtime: { type: 'boolean', description: 'Si la info fue obtenida en tiempo real' },
          },
          required: ['answer', 'confidence', 'is_realtime'],
        },
      });
      return response;
    }, null);
    if (store && result?.answer && faculty) {
      await this.learn({
        faculty, area: area || 'General', title: query.slice(0, 100),
        content: result.answer, source: (result.sources || []).join('; '),
        sourceType: 'web_search', verified: result.confidence === 'alta', tags: [query.slice(0, 50)],
      });
    }
    return result;
  }

  async getKnowledgeGaps() {
    const gaps = [];
    for (const [key, faculty] of Object.entries(FACULTIES)) {
      try {
        const entries = await backend.entities.KnowledgeEntry.filter({ faculty: key }, '-updated_date', 1);
        const count = entries?.length || 0;
        if (count < 3) gaps.push({ faculty: key, facultyName: faculty.name, icon: faculty.icon, currentCount: count, areas: faculty.areas });
      } catch {
        gaps.push({ faculty: key, facultyName: faculty.name, icon: faculty.icon, currentCount: 0, areas: faculty.areas });
      }
    }
    return gaps;
  }

  async getStats() {
    const stats = {};
    for (const [key, faculty] of Object.entries(FACULTIES)) {
      try {
        const entries = await backend.entities.KnowledgeEntry.filter({ faculty: key }, '-updated_date', 50);
        const all = entries || [];
        stats[key] = { name: faculty.name, icon: faculty.icon, areas: faculty.areas, totalEntries: all.length, verifiedEntries: all.filter((e) => e.verified).length };
      } catch {
        stats[key] = { name: faculty.name, icon: faculty.icon, areas: faculty.areas, totalEntries: 0, verifiedEntries: 0 };
      }
    }
    return stats;
  }

  getFaculties() { return FACULTIES; }
  _diag(message, data = null) { console.log(`[ViviUniversity] ${message}`, data || ''); }
  health() { return { name: this.name, healthy: this._initialized, faculties: Object.keys(FACULTIES).length, cacheSize: this._cache.length }; }
}