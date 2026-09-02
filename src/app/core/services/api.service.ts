import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// --- Tipos de respuesta del backend ---

export interface PerfilDto {
  id: number;
  keycloakId: string;
  correoInstitucional: string;
  nombre: string;
  rol: 'Estudiante' | 'Empresa' | 'Administrador';
  verificado: boolean;
  fechaRegistro: string;
  perfilEstudiante: PerfilEstudianteDto | null;
  perfilEmpresa: PerfilEmpresaDto | null;
}

export interface PerfilEstudianteDto {
  stackTecnologico?: string | null;
  conocimientos?: string | null;
  cualidadesBlandas?: string | null;
  repositorioUrl?: string | null;
  videoUrl?: string | null;
  scoreTecnico?: number | null;
}

export interface PerfilEmpresaDto {
  nombreEmpresa: string;
  sector?: string | null;
}

export interface ProyectoDto {
  id: number;
  titulo: string;
  descripcion: string;
  evidenciaUrl?: string | null;
  fechaPublicacion: string;
}

export interface PortafolioDto {
  usuarioId: number;
  nombreEstudiante: string;
  proyectos: ProyectoDto[];
  portafolioVacio: boolean;
}

export interface PrototipoDto {
  id: number;
  usuarioId: number;
  nombreEstudiante: string;
  titulo: string;
  descripcion: string;
  url?: string | null;
  fechaPublicacion: string;
}

export interface OfertaDto {
  id: number;
  usuarioEmpresaId: number;
  nombreEmpresa: string;
  titulo: string;
  tecnologiasRequeridas: string;
  aprendizajesEsperados: string;
  salarioMin: number;
  salarioMax: number;
  estado: 'Activa' | 'Cerrada';
  fechaPublicacion: string;
}

export interface PostulacionDto {
  id: number;
  ofertaId: number;
  tituloOferta: string;
  nombreEmpresa: string;
  nombreEstudiante: string;
  estado: 'Pendiente' | 'Aceptada' | 'Rechazada';
  fechaPostulacion: string;
}

export interface CandidatoDto {
  usuarioId: number;
  nombre: string;
  correoInstitucional: string;
  stackTecnologico?: string | null;
  scoreTecnico?: number | null;
}

export interface ReporteDto {
  desde?: string | null;
  hasta?: string | null;
  totalPerfilesVerificados: number;
  totalOfertasActivas: number;
  totalPostulaciones: number;
  totalEstudiantes: number;
  totalEmpresas: number;
  totalPrototiposPublicados: number;
}

export interface CompletarPerfilRequest {
  correoInstitucional?: string;
  nombre?: string;
  rol?: 'estudiante' | 'empresa' | 'administrador';
  verificado?: boolean;
  stackTecnologico?: string;
  conocimientos?: string;
  cualidadesBlandas?: string;
  repositorioUrl?: string;
  videoUrl?: string;
  nombreEmpresa?: string;
  sector?: string;
}

export interface CrearProyectoRequest {
  titulo: string;
  descripcion: string;
  evidenciaUrl?: string;
}

export interface CrearPrototipoRequest {
  titulo: string;
  descripcion: string;
  url?: string;
}

export interface CrearOfertaRequest {
  titulo: string;
  tecnologiasRequeridas: string;
  aprendizajesEsperados: string;
  salarioMin?: number;
  salarioMax?: number;
}

/**
 * Servicio único por recurso: agrupa las llamadas HTTP a la API .NET.
 * El HttpClient lo usa el authInterceptor para adjuntar el Bearer token.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  // Perfil / auth
  obtenerPerfil(): Observable<PerfilDto> {
    return this.http.get<PerfilDto>(`${this.base}/auth/perfil`);
  }

  completarPerfil(body: CompletarPerfilRequest): Observable<PerfilDto> {
    return this.http.put<PerfilDto>(`${this.base}/auth/perfil`, body);
  }

  // Proyectos / portafolio
  publicarProyecto(body: CrearProyectoRequest): Observable<ProyectoDto> {
    return this.http.post<ProyectoDto>(`${this.base}/estudiantes/portafolio/proyectos`, body);
  }

  obtenerPortafolio(usuarioId: number): Observable<PortafolioDto> {
    return this.http.get<PortafolioDto>(`${this.base}/estudiantes/${usuarioId}/portafolio`);
  }

  // Prototipos / vitrina
  publicarPrototipo(body: CrearPrototipoRequest): Observable<PrototipoDto> {
    return this.http.post<PrototipoDto>(`${this.base}/estudiantes/prototipos`, body);
  }

  listarVitrina(): Observable<PrototipoDto[]> {
    return this.http.get<PrototipoDto[]>(`${this.base}/empresas/vitrina/prototipos`);
  }

  registrarInteresPrototipo(prototipoId: number): Observable<void> {
    return this.http.post<void>(`${this.base}/empresas/prototipos/${prototipoId}/interes`, null);
  }

  // Ofertas
  publicarOferta(body: CrearOfertaRequest): Observable<OfertaDto> {
    return this.http.post<OfertaDto>(`${this.base}/ofertas`, body);
  }

  listarOfertas(tecnologia?: string): Observable<OfertaDto[]> {
    const params = tecnologia ? { tecnologia } : undefined;
    return this.http.get<OfertaDto[]>(`${this.base}/ofertas`, { params });
  }

  // Postulaciones
  postularse(ofertaId: number): Observable<PostulacionDto> {
    return this.http.post<PostulacionDto>(`${this.base}/estudiantes/ofertas/${ofertaId}/postulacion`, null);
  }

  listarMisPostulaciones(): Observable<PostulacionDto[]> {
    return this.http.get<PostulacionDto[]>(`${this.base}/estudiantes/postulaciones`);
  }

  listarPostulantes(ofertaId: number): Observable<PostulacionDto[]> {
    return this.http.get<PostulacionDto[]>(`${this.base}/empresas/ofertas/${ofertaId}/postulantes`);
  }

  // Score técnico
  registrarScoreTecnico(score: number): Observable<void> {
    return this.http.put<void>(`${this.base}/estudiantes/score-tecnico`, { score });
  }

  filtrarCandidatos(scoreMinimo: number): Observable<CandidatoDto[]> {
    return this.http.get<CandidatoDto[]>(`${this.base}/empresas/candidatos`, { params: { scoreMinimo } });
  }

  // Reportes (administrador)
  generarReporte(desde?: string, hasta?: string): Observable<ReporteDto> {
    const params: Record<string, string> = {};
    if (desde) params['desde'] = desde;
    if (hasta) params['hasta'] = hasta;
    return this.http.get<ReporteDto>(`${this.base}/reportes`, { params });
  }
}
