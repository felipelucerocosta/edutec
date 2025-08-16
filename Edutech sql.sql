
-- Edutech SQL schema (corrected)
-- File: Edutech.sql
-- Notes:
--  * Preserves original tables and relationships but fixes design, constraints, indexes and best-practices.
--  * Passwords (column `contrasena`) must store hashed passwords (bcrypt/argon2) at application level.
--  * alumno.correo is kept for compatibility but is automatically kept in sync with usuarios.correo via trigger.

-- ---------- Types ----------
CREATE TYPE usuario_tipo AS ENUM ('alumno','profesor','admin');
CREATE TYPE visibilidad_tipo AS ENUM ('publico','privado');

-- ---------- Helper: updated_at trigger ----------
CREATE OR REPLACE FUNCTION _edutech_update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- Core tables ----------

-- Curso
CREATE TABLE IF NOT EXISTS public.curso (
  id_curso integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre_curso text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS curso_nombre_curso_key ON public.curso (lower(nombre_curso));

CREATE TRIGGER trg_curso_updated_at
BEFORE UPDATE ON public.curso
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- Materia
CREATE TABLE IF NOT EXISTS public.materia (
  id_materia integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre_materia text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS materia_nombre_materia_key ON public.materia (lower(nombre_materia));

CREATE TRIGGER trg_materia_updated_at
BEFORE UPDATE ON public.materia
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- Usuarios
CREATE TABLE IF NOT EXISTS public.usuarios (
  id_usuario integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  contrasena text NOT NULL, -- debe contener hash seguro (bcrypt/argon2) manejado por la aplicación
  usuario text NOT NULL,
  nombre_completo text NOT NULL,
  correo text NOT NULL,
  dni text NOT NULL,
  tipo_usuario usuario_tipo NOT NULL DEFAULT 'alumno',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unicidades y índices útiles (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_usuario_lower_key ON public.usuarios (lower(usuario));
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_correo_lower_key ON public.usuarios (lower(correo));
CREATE UNIQUE INDEX IF NOT EXISTS usuarios_dni_key ON public.usuarios (dni);

CREATE TRIGGER trg_usuarios_updated_at
BEFORE UPDATE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- Profesor (vinculado a usuarios)
CREATE TABLE IF NOT EXISTS public.profesor (
  id_profesor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profesor_id_usuario ON public.profesor (id_usuario);

CREATE TRIGGER trg_profesor_updated_at
BEFORE UPDATE ON public.profesor
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- Alumno (vinculado a usuarios and curso). Keep alumno.correo but keep in sync via trigger.
CREATE TABLE IF NOT EXISTS public.alumno (
  id_alumno integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_usuario integer NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
  id_curso integer REFERENCES public.curso(id_curso) ON DELETE SET NULL,
  correo text, -- se sincronizará con usuarios.correo por trigger
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger for alumno updated_at
CREATE TRIGGER trg_alumno_updated_at
BEFORE UPDATE ON public.alumno
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Classes / Enrollment ----------
CREATE TABLE IF NOT EXISTS public.clases (
  id_clase integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre text NOT NULL,
  seccion text,
  id_materia integer NOT NULL REFERENCES public.materia(id_materia) ON DELETE RESTRICT,
  aula text,
  id_creador integer NOT NULL REFERENCES public.profesor(id_profesor) ON DELETE RESTRICT,
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  codigo text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS clases_codigo_key ON public.clases (codigo);
CREATE INDEX IF NOT EXISTS idx_clases_id_materia ON public.clases (id_materia);
CREATE INDEX IF NOT EXISTS idx_clases_id_creador ON public.clases (id_creador);
CREATE TRIGGER trg_clases_updated_at
BEFORE UPDATE ON public.clases
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- Inscripciones: alumnos_clases
CREATE TABLE IF NOT EXISTS public.alumnos_clases (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_alumno integer NOT NULL REFERENCES public.alumno(id_alumno) ON DELETE CASCADE,
  id_clase integer NOT NULL REFERENCES public.clases(id_clase) ON DELETE CASCADE,
  fecha_union timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- Prevent duplicate enrollments
ALTER TABLE IF EXISTS public.alumnos_clases
  ADD CONSTRAINT IF NOT EXISTS uq_alumno_clase UNIQUE (id_alumno, id_clase);

CREATE INDEX IF NOT EXISTS idx_alumnos_clases_id_alumno ON public.alumnos_clases (id_alumno);
CREATE INDEX IF NOT EXISTS idx_alumnos_clases_id_clase ON public.alumnos_clases (id_clase);

CREATE TRIGGER trg_alumnos_clases_updated_at
BEFORE UPDATE ON public.alumnos_clases
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Materials ----------
CREATE TABLE IF NOT EXISTS public.material_clase (
  id_material integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_profesor integer REFERENCES public.profesor(id_profesor) ON DELETE SET NULL,
  id_clase integer REFERENCES public.clases(id_clase) ON DELETE CASCADE,
  visibilidad visibilidad_tipo NOT NULL DEFAULT 'publico',
  titulo text NOT NULL,
  descripcion text,
  url_material text,
  tipo_material text,
  fecha_subida timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT material_clase_visibilidad_check CHECK (visibilidad IN ('publico'::visibilidad_tipo, 'privado'::visibilidad_tipo))
);
CREATE INDEX IF NOT EXISTS idx_material_clase_id_profesor ON public.material_clase (id_profesor);
CREATE INDEX IF NOT EXISTS idx_material_clase_id_clase ON public.material_clase (id_clase);
CREATE TRIGGER trg_material_clase_updated_at
BEFORE UPDATE ON public.material_clase
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Tareas (assignments) ----------
CREATE TABLE IF NOT EXISTS public.tareas (
  id_tarea integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo text NOT NULL,
  descripcion text,
  fecha_publicacion timestamptz NOT NULL DEFAULT now(),
  fecha_entrega timestamptz,
  id_materia integer REFERENCES public.materia(id_materia) ON DELETE SET NULL,
  id_profesor integer REFERENCES public.profesor(id_profesor) ON DELETE SET NULL,
  archivo_adjunto text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tareas_id_profesor ON public.tareas (id_profesor);
CREATE INDEX IF NOT EXISTS idx_tareas_id_materia ON public.tareas (id_materia);
CREATE TRIGGER trg_tareas_updated_at
BEFORE UPDATE ON public.tareas
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Notas (grades) ----------
CREATE TABLE IF NOT EXISTS public.notas (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_alumno integer NOT NULL REFERENCES public.alumno(id_alumno) ON DELETE CASCADE,
  id_tarea integer REFERENCES public.tareas(id_tarea) ON DELETE SET NULL,
  nota numeric NOT NULL,
  fecha_registro timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notas_id_alumno ON public.notas (id_alumno);
CREATE INDEX IF NOT EXISTS idx_notas_id_tarea ON public.notas (id_tarea);
CREATE TRIGGER trg_notas_updated_at
BEFORE UPDATE ON public.notas
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Repositorio ----------
CREATE TABLE IF NOT EXISTS public.repositorio (
  id_repositorio integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo text NOT NULL,
  descripcion text,
  url_repositorio text,
  fecha_creacion timestamptz NOT NULL DEFAULT now(),
  tipo_archivo text,
  id_curso integer REFERENCES public.curso(id_curso) ON DELETE SET NULL,
  id_materia integer REFERENCES public.materia(id_materia) ON DELETE SET NULL,
  id_usuario integer REFERENCES public.usuarios(id_usuario) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_repositorio_id_curso ON public.repositorio (id_curso);
CREATE INDEX IF NOT EXISTS idx_repositorio_id_materia ON public.repositorio (id_materia);
CREATE INDEX IF NOT EXISTS idx_repositorio_id_usuario ON public.repositorio (id_usuario);
CREATE TRIGGER trg_repositorio_updated_at
BEFORE UPDATE ON public.repositorio
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Tablon Mensajes ----------
CREATE TABLE IF NOT EXISTS public.tablon_mensajes (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  mensaje text NOT NULL,
  fecha timestamptz NOT NULL DEFAULT now(),
  id_usuario integer REFERENCES public.usuarios(id_usuario) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tablon_mensajes_id_usuario ON public.tablon_mensajes (id_usuario);
CREATE TRIGGER trg_tablon_mensajes_updated_at
BEFORE UPDATE ON public.tablon_mensajes
FOR EACH ROW EXECUTE FUNCTION _edutech_update_updated_at();

-- ---------- Data synchronization triggers ----------

-- Sync alumno.correo from usuarios.correo on insert/update of alumno or usuarios
CREATE OR REPLACE FUNCTION _edutech_sync_alumno_correo()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    -- ensure referenced usuario exists; if not, leave correo NULL
    IF NEW.id_usuario IS NOT NULL THEN
      NEW.correo := (SELECT correo FROM public.usuarios WHERE id_usuario = NEW.id_usuario);
    ELSE
      NEW.correo := NULL;
    END IF;
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on alumno to sync on insert/update
DROP TRIGGER IF EXISTS trg_alumno_sync_correo ON public.alumno;
CREATE TRIGGER trg_alumno_sync_correo
BEFORE INSERT OR UPDATE ON public.alumno
FOR EACH ROW EXECUTE FUNCTION _edutech_sync_alumno_correo();

-- Trigger on usuarios to propagate correo changes to alumno rows
CREATE OR REPLACE FUNCTION _edutech_propagate_usuario_correo()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.correo IS DISTINCT FROM OLD.correo THEN
    UPDATE public.alumno SET correo = NEW.correo WHERE id_usuario = NEW.id_usuario;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_propagate_correo ON public.usuarios;
CREATE TRIGGER trg_usuarios_propagate_correo
AFTER UPDATE OF correo ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION _edutech_propagate_usuario_correo();

-- ---------- Additional maintenance helpers ----------

-- Example: ensure notas values are within expected range (optional)
-- ALTER TABLE public.notas ADD CONSTRAINT notas_nota_positive CHECK (nota >= 0);

-- ---------- Final cleanup: indexes and constraints ----------

-- alumno correo unique index (keeps same uniqueness behavior as original dump)
DROP INDEX IF EXISTS alumno_correo_key;
CREATE UNIQUE INDEX IF NOT EXISTS alumno_correo_key ON public.alumno (lower(coalesce(correo, '')));

-- ---------- End of schema ----------
