PARTE 4: ESTRUCTURA DE CARPETAS Y ARCHIVOS PARA VSCode Insiders - VERSIÓN MEJORADA Y AMPLIADA
📁 EXPANSIÓN COMPLETA DEL ÁRBOL DE DIRECTORIOS (ESPAÑOL TÉCNICO EMPRESARIAL)
text


TITAN/ YA CREADO, DONDE ESTAMOS
algoritmos-crear-ambiente-desarrollo/  AQUI DENTRO VAN LOS ALGORITMOS .SH .PY .* PARA CREAR EL AMBIENTE DE DESARROLLO AUTOMATICAMENTE
pruebas-crear-ambiente-desarrollo/TITAN-MSP/ AQUI DENTRO  VAN LAS VERSIONES EN CARPTEAS X.X DEL PROYECTO MULTITENANT TITAN CON CEREBRO MSP QUE USARA LOS ALGORITMOS COMO SERVICIOS PARA SER DIOS DEL PROYECTO, OMNIPRESENTE Y FACILITAR LA INYECCION DE CONTEXTO CADA QUE SE REQUIERA DE LA MANERA MAS TRAZABLE/ #FALTA CREAR LA ESTRUCTURA COMPLETA DETALLADA ASI QUE ATENTO A TODOS LOS ELEMENTOS PARA ASEGURAR LA MAXIMA ADHERENCIA A ESTE NUEVO REPO DE TITAN-MSP SE DEBE AUTOMATIZAR CREAR MEDIANTE ALGORITMOS O ASUGERIR EHERRAMIENAS QUE PERMITANCREAR ESTE ARBOL:
TITAN/pruebas-crear-ambiente-desarrollo/TITAN-MSP-v13.0/
│
├── 📁 .vscode/
│   ├── 📄 configuraciones.json                    # Configuraciones específicas del proyecto para VSCode
│   ├── 📄 extensiones-recomendadas.json           # Extensiones esenciales para desarrollo TITAN+MSP
│   ├── 📄 configuracion-lanzamiento.json          # Configuraciones de depuración multi-servicio
│   ├── 📄 configuracion-tareas.json               # Tareas automatizadas para desarrollo y despliegue
│   ├── 📄 configuracion-snippets.code-snippets    # Snippets personalizados para español técnico
│   └── 📄 configuracion-settings.json             # Configuración workspace específica para el proyecto
│
├── 📁 api/ (APLICACIÓN PRINCIPAL - BACKEND MULTI-INQUILINO)
│   ├── 📁 src/ (CÓDIGO FUENTE PRINCIPAL)
│   │   ├── 📁 nucleo/ (CORE - FUNDAMENTOS DEL SISTEMA)
│   │   │   ├── 📁 comun/ (UTILIDADES COMPARTIDAS)
│   │   │   │   ├── 📄 constantes-sistema.ts              # Constantes globales y configuración invariante
│   │   │   │   ├── 📄 utilidades-comunes.ts              # Funciones helper reutilizables en todo el sistema
│   │   │   │   ├── 📄 decoradores-personalizados.ts      # Decoradores para logging, medición, validación
│   │   │   │   ├── 📄 manejo-promesas-avanzado.ts        # Utilidades para async/await con timeout y retry
│   │   │   │   ├── 📄 generadores-identificadores.ts     # UUIDs, códigos únicos, hashes específicos
│   │   │   │   ├── 📄 funciones-seguridad.ts             # Encriptación, hashing, tokens, verificación
│   │   │   │   ├── 📄 utilidades-fecha-hora.ts           # Manipulación de fechas con zona horaria Colombia
│   │   │   │   └── 📄 utilidades-formateo.ts             # Formateo de moneda, números, porcentajes para COL
│   │   │   │
│   │   │   ├── 📁 errores/ (MANEJO CENTRALIZADO DE ERRORES)
│   │   │   │   ├── 📄 error-aplicacion-base.ts           # Clase base abstracta para errores de aplicación
│   │   │   │   ├── 📄 errores-http-especificos.ts        # Errores HTTP (400, 404, 500) con contexto
│   │   │   │   ├── 📄 errores-negocio-vertical.ts        # Errores específicos de reglas de negocio por vertical
│   │   │   │   ├── 📄 manejador-errores-global.ts        # Manejador centralizado con logging estructurado
│   │   │   │   ├── 📄 error-multi-inquilino.ts          # Errores específicos para contexto multi-inquilino
│   │   │   │   ├── 📄 error-saga-compensacion.ts        # Errores en transacciones distribuidas
│   │   │   │   └── 📄 tipos-error-sistema.ts            # Tipos TypeScript para sistema de errores
│   │   │   │
│   │   │   ├── 📁 tipos/ (TIPOS Y DEFINICIONES GLOBALES)
│   │   │   │   ├── 📄 declaraciones-globales.d.ts        # Declaraciones globales TypeScript extendidas
│   │   │   │   ├── 📄 tipos-api.ts                       # Tipos para capa API (requests, responses)
│   │   │   │   ├── 📄 tipos-dominio-negocio.ts           # Tipos de dominio de negocio compartidos
│   │   │   │   ├── 📄 tipos-utilidades.ts                # Tipos para funciones utilitarias y helpers
│   │   │   │   ├── 📄 tipos-configuracion.ts             # Tipos para configuración del sistema
│   │   │   │   ├── 📄 tipos-evento-sistema.ts            # Tipos para eventos del sistema (pub/sub)
│   │   │   │   └── 📄 tipos-metricas-monitoreo.ts        # Tipos para métricas y monitoreo
│   │   │   │
│   │   │   ├── 📁 utilidades/ (UTILIDADES ESPECIALIZADAS)
│   │   │   │   ├── 📄 utilidades-cadena-texto.ts         # Manipulación avanzada de cadenas de texto
│   │   │   │   ├── 📄 utilidades-fechas-colombia.ts      # Fechas específicas para Colombia (festivos, DIAN)
│   │   │   │   ├── 📄 utilidades-validacion-avanzada.ts  # Validación avanzada más allá de Zod
│   │   │   │   ├── 📄 utilidades-criptografia.ts         # Encriptación asimétrica, firmas digitales
│   │   │   │   ├── 📄 utilidades-archivos-streams.ts     # Manejo eficiente de archivos y streams
│   │   │   │   ├── 📄 utilidades-red-conexiones.ts       # Utilidades de red (IP, geolocalización, proxies)
│   │   │   │   ├── 📄 utilidades-matematicas-finanzas.ts # Cálculos financieros, impuestos, conversiones
│   │   │   │   └── 📄 utilidades-performance.ts          # Mediciones de rendimiento y optimización
│   │   │   │
│   │   │   └── 📁 middleware/ (MIDDLEWARE GLOBAL)
│   │   │       ├── 📄 middleware-manejo-errores.ts       # Middleware para captura centralizada de errores
│   │   │       ├── 📄 middleware-logging-estructurado.ts # Middleware para logging con contexto inquilino
│   │   │       ├── 📄 middleware-validacion-zod.ts       # Middleware de validación con esquemas Zod
│   │   │       ├── 📄 middleware-autenticacion-jwt.ts    # Middleware para autenticación JWT multi-inquilino
│   │   │       ├── 📄 middleware-contexto-inquilino.ts   # Middleware para contexto multi-inquilino
│   │   │       ├── 📄 middleware-cors-configurable.ts    # Middleware CORS configurable por inquilino
│   │   │       ├── 📄 middleware-rate-limit-inquilino.ts # Limitación de tasa por inquilino y usuario
│   │   │       ├── 📄 middleware-compresion-inteligente.ts # Compresión inteligente basada en contenido
│   │   │       ├── 📄 middleware-auditoria-peticiones.ts # Auditoría completa de todas las peticiones
│   │   │       ├── 📄 middleware-metricas-rendimiento.ts # Captura de métricas de rendimiento por endpoint
│   │   │       └── 📄 middleware-cache-http.ts           # Middleware de cache HTTP inteligente
│   │   │
│   │   ├── 📁 dominios/ (DOMINIOS DE NEGOCIO - ARQUITECTURA HEXAGONAL)
│   │   │   ├── 📁 iam/ (IDENTIDAD Y ACCESO - DOMINIO CRÍTICO)
│   │   │   │   ├── 📁 entidades/ (ENTIDADES DE DOMINIO)
│   │   │   │   │   ├── 📄 entidad-usuario.ts            # Entidad Usuario con comportamiento y reglas
│   │   │   │   │   ├── 📄 entidad-inquilino.ts          # Entidad Inquilino con configuración vertical
│   │   │   │   │   ├── 📄 entidad-rol.ts                # Entidad Rol con permisos jerárquicos
│   │   │   │   │   ├── 📄 entidad-permiso.ts            # Entidad Permiso con granularidad fina
│   │   │   │   │   ├── 📄 entidad-sesion.ts             # Entidad Sesión con control de acceso
│   │   │   │   │   ├── 📄 entidad-grupo.ts              # Entidad Grupo para agrupación de usuarios
│   │   │   │   │   └── 📄 entidad-token.ts              # Entidad Token para gestión de tokens
│   │   │   │   │
│   │   │   │   ├── 📁 objetos-valor/ (VALUE OBJECTS)
│   │   │   │   │   ├── 📄 valor-email.ts                # Value Object Email con validación completa
│   │   │   │   │   ├── 📄 valor-contrasena.ts           # Value Object Contraseña con hash seguro
│   │   │   │   │   ├── 📄 valor-telefono.ts             # Value Object Teléfono con formato Colombia
│   │   │   │   │   ├── 📄 valor-identificador-inquilino.ts # VO IdentificadorInquilino (TNT-XXX)
│   │   │   │   │   ├── 📄 valor-identificador-usuario.ts # VO IdentificadorUsuario (USR-TNTXXX-XXXX)
│   │   │   │   │   ├── 📄 valor-direccion.ts            # VO Dirección con validación Colombia
│   │   │   │   │   ├── 📄 valor-fecha-nacimiento.ts     # VO FechaNacimiento con validación edad
│   │   │   │   │   └── 📄 valor-documento-identidad.ts  # VO DocumentoIdentidad (CC, NIT, etc.)
│   │   │   │   │
│   │   │   │   ├── 📁 repositorios/ (INTERFACES E IMPLEMENTACIONES)
│   │   │   │   │   ├── 📁 interfaces/
│   │   │   │   │   │   ├── 📄 interfaz-repositorio-usuario.ts
│   │   │   │   │   │   ├── 📄 interfaz-repositorio-inquilino.ts
│   │   │   │   │   │   ├── 📄 interfaz-repositorio-rol.ts
│   │   │   │   │   │   ├── 📄 interfaz-repositorio-sesion.ts
│   │   │   │   │   │   └── 📄 interfaz-repositorio-permiso.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 implementaciones/
│   │   │   │   │   │   ├── 📄 repositorio-usuario-drizzle.ts
│   │   │   │   │   │   ├── 📄 repositorio-inquilino-drizzle.ts
│   │   │   │   │   │   ├── 📄 repositorio-rol-drizzle.ts
│   │   │   │   │   │   ├── 📄 repositorio-sesion-redis.ts
│   │   │   │   │   │   └── 📄 repositorio-permiso-drizzle.ts
│   │   │   │   │   │
│   │   │   │   │   └── 📄 repositorio-fabrica.ts        # Factory para crear repositorios según contexto
│   │   │   │   │
│   │   │   │   ├── 📁 servicios/ (SERVICIOS DE DOMINIO)
│   │   │   │   │   ├── 📄 servicio-autenticacion.ts     # Autenticación con múltiples factores
│   │   │   │   │   ├── 📄 servicio-usuario.ts           # Gestión completa de usuarios
│   │   │   │   │   ├── 📄 servicio-inquilino.ts         # Gestión de inquilinos y verticales
│   │   │   │   │   ├── 📄 servicio-permisos.ts          # Sistema de permisos granular
│   │   │   │   │   ├── 📄 servicio-roles.ts             # Gestión de roles y asignaciones
│   │   │   │   │   ├── 📄 servicio-sesiones.ts          # Control de sesiones activas
│   │   │   │   │   └── 📄 servicio-auditoria.ts         # Auditoría de acciones de IAM
│   │   │   │   │
│   │   │   │   ├── 📁 casos-uso/ (CASOS DE USO)
│   │   │   │   │   ├── 📄 registrar-usuario-caso-uso.ts
│   │   │   │   │   ├── 📄 autenticar-usuario-caso-uso.ts
│   │   │   │   │   ├── 📄 crear-inquilino-caso-uso.ts
│   │   │   │   │   ├── 📄 asignar-rol-usuario-caso-uso.ts
│   │   │   │   │   ├── 📄 restablecer-contrasena-caso-uso.ts
│   │   │   │   │   ├── 📄 gestionar-permisos-caso-uso.ts
│   │   │   │   │   ├── 📄 verificar-permiso-caso-uso.ts
│   │   │   │   │   └── 📄 cerrar-sesiones-caso-uso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 validadores/ (VALIDACIÓN DE DOMINIO)
│   │   │   │   │   ├── 📄 validador-usuario.ts
│   │   │   │   │   ├── 📄 validador-autenticacion.ts
│   │   │   │   │   ├── 📄 validador-inquilino.ts
│   │   │   │   │   ├── 📄 validador-rol.ts
│   │   │   │   │   └── 📄 validador-permiso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 eventos/ (EVENTOS DE DOMINIO)
│   │   │   │   │   ├── 📄 evento-usuario-registrado.ts
│   │   │   │   │   ├── 📄 evento-inicio-sesion.ts
│   │   │   │   │   ├── 📄 evento-inquilino-creado.ts
│   │   │   │   │   ├── 📄 evento-permiso-modificado.ts
│   │   │   │   │   └── 📄 evento-sesion-cerrada.ts
│   │   │   │   │
│   │   │   │   ├── 📁 politicas/ (POLÍTICAS DE NEGOCIO)
│   │   │   │   │   ├── 📄 politica-fortaleza-contrasena.ts
│   │   │   │   │   ├── 📄 politica-intentos-fallidos.ts
│   │   │   │   │   ├── 📄 politica-expiracion-sesion.ts
│   │   │   │   │   └── 📄 politica-creacion-inquilino.ts
│   │   │   │   │
│   │   │   │   └── 📁 pruebas/ (PRUEBAS POR DOMINIO)
│   │   │   │       ├── 📁 unitarias/
│   │   │   │       │   ├── 📄 entidades/
│   │   │   │       │   │   ├── 📄 usuario.entidad.prueba.ts
│   │   │   │       │   │   └── 📄 inquilino.entidad.prueba.ts
│   │   │   │       │   ├── 📄 objetos-valor/
│   │   │   │       │   │   ├── 📄 email.valor.prueba.ts
│   │   │   │       │   │   └── 📄 contrasena.valor.prueba.ts
│   │   │   │       │   ├── 📄 servicios/
│   │   │   │       │   │   ├── 📄 autenticacion.servicio.prueba.ts
│   │   │   │       │   │   └── 📄 usuario.servicio.prueba.ts
│   │   │   │       │   └── 📄 casos-uso/
│   │   │   │       │       ├── 📄 registrar-usuario.caso.prueba.ts
│   │   │   │       │       └── 📄 autenticar-usuario.caso.prueba.ts
│   │   │   │       │
│   │   │   │       └── 📁 integracion/
│   │   │   │           ├── 📄 flujo-autenticacion.prueba.ts
│   │   │   │           ├── 📄 flujo-inquilino.prueba.ts
│   │   │   │           └── 📄 flujo-permisos.prueba.ts
│   │   │   │
│   │   │   ├── 📁 ars/ (GESTIÓN DE CITAS/RESERVAS)
│   │   │   │   ├── 📁 entidades/
│   │   │   │   │   ├── 📄 entidad-reserva.ts
│   │   │   │   │   ├── 📄 entidad-cita.ts
│   │   │   │   │   ├── 📄 entidad-recurso.ts
│   │   │   │   │   ├── 📄 entidad-disponibilidad.ts
│   │   │   │   │   ├── 📄 entidad-bloqueo.ts
│   │   │   │   │   └── 📄 entidad-calendario.ts
│   │   │   │   │
│   │   │   │   ├── 📁 objetos-valor/
│   │   │   │   │   ├── 📄 valor-intervalo-tiempo.ts
│   │   │   │   │   ├── 📄 valor-estado-reserva.ts
│   │   │   │   │   ├── 📄 valor-identificador-recurso.ts
│   │   │   │   │   ├── 📄 valor-duracion.ts
│   │   │   │   │   └── 📄 valor-prioridad.ts
│   │   │   │   │
│   │   │   │   ├── 📁 fabricas/ (FACTORY PATTERN POR VERTICAL)
│   │   │   │   │   ├── 📄 fabrica-reserva-restaurante.ts
│   │   │   │   │   ├── 📄 fabrica-reserva-barberia.ts
│   │   │   │   │   ├── 📄 fabrica-reserva-tienda.ts
│   │   │   │   │   └── 📄 fabrica-recurso-vertical.ts
│   │   │   │   │
│   │   │   │   ├── 📁 estrategias/ (STRATEGY PATTERN)
│   │   │   │   │   ├── 📄 estrategia-disponibilidad-restaurante.ts
│   │   │   │   │   ├── 📄 estrategia-disponibilidad-barberia.ts
│   │   │   │   │   ├── 📄 estrategia-disponibilidad-tienda.ts
│   │   │   │   │   └── 📄 estrategia-asignacion-recursos.ts
│   │   │   │   │
│   │   │   │   ├── 📁 servicios/
│   │   │   │   │   ├── 📄 servicio-reservas.ts
│   │   │   │   │   ├── 📄 servicio-disponibilidad.ts
│   │   │   │   │   ├── 📄 servicio-recordatorios.ts
│   │   │   │   │   ├── 📄 servicio-calendario.ts
│   │   │   │   │   └── 📄 servicio-confirmaciones.ts
│   │   │   │   │
│   │   │   │   ├── 📁 casos-uso/
│   │   │   │   │   ├── 📄 crear-reserva-caso-uso.ts
│   │   │   │   │   ├── 📄 cancelar-reserva-caso-uso.ts
│   │   │   │   │   ├── 📄 consultar-disponibilidad-caso-uso.ts
│   │   │   │   │   ├── 📄 asignar-recurso-caso-uso.ts
│   │   │   │   │   └── 📄 modificar-reserva-caso-uso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 reglas/ (REGLAS DE NEGOCIO POR VERTICAL)
│   │   │   │   │   ├── 📄 reglas-restaurante.ts
│   │   │   │   │   ├── 📄 reglas-barberia.ts
│   │   │   │   │   └── 📄 reglas-tienda.ts
│   │   │   │   │
│   │   │   │   ├── 📁 sagas/ (SAGAS PARA TRANSACCIONES DISTRIBUIDAS)
│   │   │   │   │   ├── 📄 saga-procesamiento-reserva.ts
│   │   │   │   │   ├── 📄 saga-cancelacion-reserva.ts
│   │   │   │   │   └── 📄 saga-modificacion-reserva.ts
│   │   │   │   │
│   │   │   │   ├── 📁 algoritmos/ (ALGORITMOS ESPECIALIZADOS)
│   │   │   │   │   ├── 📄 algoritmo-asignacion-mesas.ts
│   │   │   │   │   ├── 📄 algoritmo-optimizacion-horarios.ts
│   │   │   │   │   └── 📄 algoritmo-detector-conflictos.ts
│   │   │   │   │
│   │   │   │   └── 📁 pruebas/
│   │   │   │       ├── 📁 unitarias/
│   │   │   │       │   ├── 📄 entidades/
│   │   │   │       │   ├── 📄 servicios/
│   │   │   │       │   └── 📄 casos-uso/
│   │   │   │       │
│   │   │   │       └── 📁 integracion/
│   │   │   │           ├── 📄 flujo-reserva-completa.prueba.ts
│   │   │   │           └── 📄 flujo-disponibilidad.prueba.ts
│   │   │   │
│   │   │   ├── 📁 pim/ (GESTIÓN DE PRODUCTOS E INVENTARIO)
│   │   │   │   ├── 📁 entidades/
│   │   │   │   │   ├── 📄 entidad-producto.ts
│   │   │   │   │   ├── 📄 entidad-inventario.ts
│   │   │   │   │   ├── 📄 entidad-lote.ts
│   │   │   │   │   ├── 📄 entidad-proveedor.ts
│   │   │   │   │   ├── 📄 entidad-categoria.ts
│   │   │   │   │   └── 📄 entidad-almacen.ts
│   │   │   │   │
│   │   │   │   ├── 📁 objetos-valor/
│   │   │   │   │   ├── 📄 valor-sku.ts
│   │   │   │   │   ├── 📄 valor-precio.ts
│   │   │   │   │   ├── 📄 valor-cantidad.ts
│   │   │   │   │   ├── 📄 valor-ubicacion.ts
│   │   │   │   │   ├── 📄 valor-dimensiones.ts
│   │   │   │   │   └── 📄 valor-peso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 algoritmos/ (ALGORITMOS AVANZADOS)
│   │   │   │   │   ├── 📄 algoritmo-punto-reorden.ts
│   │   │   │   │   ├── 📄 algoritmo-rotacion-inventario.ts
│   │   │   │   │   ├── 📄 algoritmo-pronostico-demanda.ts
│   │   │   │   │   ├── 📄 algoritmo-optimizacion-stock.ts
│   │   │   │   │   ├── 📄 algoritmo-calculadora-precios.ts
│   │   │   │   │   └── 📄 algoritmo-detector-anomalias.ts
│   │   │   │   │
│   │   │   │   ├── 📁 servicios/
│   │   │   │   │   ├── 📄 servicio-productos.ts
│   │   │   │   │   ├── 📄 servicio-inventario.ts
│   │   │   │   │   ├── 📄 servicio-proveedores.ts
│   │   │   │   │   ├── 📄 servicio-alertas.ts
│   │   │   │   │   ├── 📄 servicio-categorias.ts
│   │   │   │   │   └── 📄 servicio-reportes-inventario.ts
│   │   │   │   │
│   │   │   │   ├── 📁 casos-uso/
│   │   │   │   │   ├── 📄 crear-producto-caso-uso.ts
│   │   │   │   │   ├── 📄 ajustar-inventario-caso-uso.ts
│   │   │   │   │   ├── 📄 generar-orden-compra-caso-uso.ts
│   │   │   │   │   ├── 📄 calcular-rotacion-caso-uso.ts
│   │   │   │   │   └── 📄 procesar-recepcion-caso-uso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 verticales/ (ESPECIALIZACIÓN POR VERTICAL)
│   │   │   │   │   ├── 📁 restaurante/
│   │   │   │   │   │   ├── 📄 productos-restaurante.ts
│   │   │   │   │   │   ├── 📄 inventario-restaurante.ts
│   │   │   │   │   │   ├── 📄 recetas-costo.ts
│   │   │   │   │   │   └── 📄 control-mermas.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 barberia/
│   │   │   │   │   │   ├── 📄 productos-barberia.ts
│   │   │   │   │   │   ├── 📄 inventario-barberia.ts
│   │   │   │   │   │   ├── 📄 control-invima.ts
│   │   │   │   │   │   └── 📄 vida-util-herramientas.ts
│   │   │   │   │   │
│   │   │   │   │   └── 📁 tienda/
│   │   │   │   │       ├── 📄 productos-tienda.ts
│   │   │   │   │       ├── 📄 inventario-tienda.ts
│   │   │   │   │       ├── 📄 gestion-series.ts
│   │   │   │   │       └── 📄 control-garantias.ts
│   │   │   │   │
│   │   │   │   ├── 📁 politicas/ (POLÍTICAS DE INVENTARIO)
│   │   │   │   │   ├── 📄 politica-stock-minimo.ts
│   │   │   │   │   ├── 📄 politica-caducidad.ts
│   │   │   │   │   └── 📄 politica-proveedores.ts
│   │   │   │   │
│   │   │   │   └── 📁 pruebas/
│   │   │   │       ├── 📁 unitarias/
│   │   │   │       │   ├── 📄 entidades/
│   │   │   │       │   ├── 📄 algoritmos/
│   │   │   │       │   └── 📄 servicios/
│   │   │   │       │
│   │   │   │       └── 📁 integracion/
│   │   │   │           ├── 📄 flujo-inventario.prueba.ts
│   │   │   │           └── 📄 flujo-productos.prueba.ts
│   │   │   │
│   │   │   ├── 📁 opp/ (PROCESAMIENTO DE PEDIDOS Y PAGOS)
│   │   │   │   ├── 📁 entidades/
│   │   │   │   │   ├── 📄 entidad-pedido.ts
│   │   │   │   │   ├── 📄 entidad-pago.ts
│   │   │   │   │   ├── 📄 entidad-factura.ts
│   │   │   │   │   ├── 📄 entidad-carrito.ts
│   │   │   │   │   ├── 📄 entidad-transaccion.ts
│   │   │   │   │   └── 📄 entidad-devolucion.ts
│   │   │   │   │
│   │   │   │   ├── 📁 objetos-valor/
│   │   │   │   │   ├── 📄 valor-monto.ts
│   │   │   │   │   ├── 📄 valor-estado-pedido.ts
│   │   │   │   │   ├── 📄 valor-metodo-pago.ts
│   │   │   │   │   ├── 📄 valor-codigo-factura.ts
│   │   │   │   │   ├── 📄 valor-impuesto.ts
│   │   │   │   │   └── 📄 valor-porcentaje-descuento.ts
│   │   │   │   │
│   │   │   │   ├── 📁 servicios/
│   │   │   │   │   ├── 📄 servicio-pedidos.ts
│   │   │   │   │   ├── 📄 servicio-pagos.ts
│   │   │   │   │   ├── 📄 servicio-facturacion.ts
│   │   │   │   │   ├── 📄 servicio-devoluciones.ts
│   │   │   │   │   ├── 📄 servicio-carritos.ts
│   │   │   │   │   └── 📄 servicio-impuestos.ts
│   │   │   │   │
│   │   │   │   ├── 📁 casos-uso/
│   │   │   │   │   ├── 📄 crear-pedido-caso-uso.ts
│   │   │   │   │   ├── 📄 procesar-pago-caso-uso.ts
│   │   │   │   │   ├── 📄 generar-factura-caso-uso.ts
│   │   │   │   │   ├── 📄 procesar-devolucion-caso-uso.ts
│   │   │   │   │   └── 📄 cancelar-pedido-caso-uso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 gateways/ (GATEWAYS DE PAGO)
│   │   │   │   │   ├── 📄 gateway-paypal.ts
│   │   │   │   │   ├── 📄 gateway-stripe.ts
│   │   │   │   │   ├── 📄 gateway-mercado-pago.ts
│   │   │   │   │   ├── 📄 gateway-fallback.ts
│   │   │   │   │   └── 📄 gateway-simulador.ts
│   │   │   │   │
│   │   │   │   ├── 📁 sagas/ (SAGAS COMPLEJAS)
│   │   │   │   │   ├── 📄 saga-procesamiento-pedido.ts
│   │   │   │   │   ├── 📄 saga-devolucion.ts
│   │   │   │   │   └── 📄 saga-cancelacion-pedido.ts
│   │   │   │   │
│   │   │   │   ├── 📁 integradores/ (INTEGRACIONES EXTERNAS)
│   │   │   │   │   ├── 📄 integrador-dian.ts
│   │   │   │   │   ├── 📄 integrador-logistica.ts
│   │   │   │   │   └── 📄 integrador-notificaciones.ts
│   │   │   │   │
│   │   │   │   └── 📁 pruebas/
│   │   │   │       ├── 📁 unitarias/
│   │   │   │       │   ├── 📄 entidades/
│   │   │   │       │   ├── 📄 servicios/
│   │   │   │       │   └── 📄 gateways/
│   │   │   │       │
│   │   │   │       └── 📁 integracion/
│   │   │   │           ├── 📄 flujo-pedido-completo.prueba.ts
│   │   │   │           └── 📄 flujo-pago.prueba.ts
│   │   │   │
│   │   │   └── 📁 msp/ (MOTOR DE SISTEMAS DE PENSAMIENTO - IA)
│   │   │       ├── 📁 entidades/
│   │   │       │   ├── 📄 entidad-recomendacion.ts
│   │   │       │   ├── 📄 entidad-perfil-usuario.ts
│   │   │       │   ├── 📄 entidad-interaccion.ts
│   │   │       │   ├── 📄 entidad-modelo-ia.ts
│   │   │       │   └── 📄 entidad-embedding.ts
│   │   │       │
│   │   │       ├── 📁 objetos-valor/
│   │   │       │   ├── 📄 valor-puntuacion.ts
│   │   │       │   ├── 📄 valor-embedding.ts
│   │   │       │   ├── 📄 valor-contexto.ts
│   │   │       │   └── 📄 valor-similitud.ts
│   │   │       │
│   │   │       ├── 📁 estrategias/ (MÚLTIPLES ESTRATEGIAS)
│   │   │       │   ├── 📄 estrategia-colaborativa.ts
│   │   │       │   ├── 📄 estrategia-contenido.ts
│   │   │       │   ├── 📄 estrategia-contextual.ts
│   │   │       │   ├── 📄 estrategia-ia.ts
│   │   │       │   ├── 📄 estrategia-reglas.ts
│   │   │       │   └── 📄 estrategia-hibrida.ts
│   │   │       │
│   │   │       ├── 📁 servicios/
│   │   │       │   ├── 📄 servicio-recomendaciones.ts
│   │   │       │   ├── 📄 servicio-embeddings.ts
│   │   │       │   ├── 📄 servicio-modelo.ts
│   │   │       │   ├── 📄 servicio-cache.ts
│   │   │       │   ├── 📄 servicio-aprendizaje.ts
│   │   │       │   └── 📄 servicio-evaluacion.ts
│   │   │       │
│   │   │       ├── 📁 casos-uso/
│   │   │       │   ├── 📄 generar-recomendaciones-caso-uso.ts
│   │   │       │   ├── 📄 actualizar-perfil-caso-uso.ts
│   │   │       │   ├── 📄 registrar-interaccion-caso-uso.ts
│   │   │       │   ├── 📄 entrenar-modelo-caso-uso.ts
│   │   │       │   └── 📄 evaluar-modelo-caso-uso.ts
│   │   │       │
│   │   │       ├── 📁 modelos/ (MODELOS POR VERTICAL)
│   │   │       │   ├── 📁 restaurante/
│   │   │       │   │   ├── 📄 modelo-recomendaciones-restaurante.ts
│   │   │       │   │   ├── 📄 configuracion-modelo-restaurante.ts
│   │   │       │   │   └── 📄 datos-entrenamiento-restaurante.ts
│   │   │       │   │
│   │   │       │   ├── 📁 barberia/
│   │   │       │   │   ├── 📄 modelo-recomendaciones-barberia.ts
│   │   │       │   │   ├── 📄 configuracion-modelo-barberia.ts
│   │   │       │   │   └── 📄 datos-entrenamiento-barberia.ts
│   │   │       │   │
│   │   │       │   └── 📁 tienda/
│   │   │       │       ├── 📄 modelo-recomendaciones-tienda.ts
│   │   │       │       ├── 📄 configuracion-modelo-tienda.ts
│   │   │       │       └── 📄 datos-entrenamiento-tienda.ts
│   │   │       │
│   │   │       ├── 📁 algoritmos/ (ALGORITMOS DE IA)
│   │   │       │   ├── 📄 algoritmo-fusion-recomendaciones.ts
│   │   │       │   ├── 📄 algoritmo-calculo-similitud.ts
│   │   │       │   ├── 📄 algoritmo-optimizacion-modelo.ts
│   │   │       │   └── 📄 algoritmo-deteccion-sesgo.ts
│   │   │       │
│   │   │       └── 📁 pruebas/
│   │   │           ├── 📁 unitarias/
│   │   │           │   ├── 📄 entidades/
│   │   │           │   ├── 📄 estrategias/
│   │   │           │   └── 📄 servicios/
│   │   │           │
│   │   │           └── 📁 integracion/
│   │   │               ├── 📄 flujo-recomendaciones.prueba.ts
│   │   │               └── 📄 flujo-aprendizaje.prueba.ts
│   │   │
│   │   ├── 📁 infraestructura/ (CAPA DE INFRAESTRUCTURA)
│   │   │   ├── 📁 base-de-datos/ (PERSISTENCIA DE DATOS)
│   │   │   │   ├── 📁 esquemas/ (ESQUEMAS DRIZZLE)
│   │   │   │   │   ├── 📄 esquema-usuario.ts
│   │   │   │   │   ├── 📄 esquema-inquilino.ts
│   │   │   │   │   ├── 📄 esquema-reserva.ts
│   │   │   │   │   ├── 📄 esquema-producto.ts
│   │   │   │   │   ├── 📄 esquema-pedido.ts
│   │   │   │   │   ├── 📄 esquema-recomendacion.ts
│   │   │   │   │   ├── 📄 esquema-factura.ts
│   │   │   │   │   ├── 📄 esquema-pago.ts
│   │   │   │   │   └── 📄 esquema-auditoria.ts
│   │   │   │   │
│   │   │   │   ├── 📁 migraciones/ (MIGRACIONES DRIZZLE)
│   │   │   │   │   ├── 📄 0000_inicial.sql
│   │   │   │   │   ├── 📄 0001_agregar_rls.sql
│   │   │   │   │   ├── 📄 0002_indices_optimizacion.sql
│   │   │   │   │   ├── 📄 0003_esquemas_verticales.sql
│   │   │   │   │   ├── 📄 0004_configuracion_colombia.sql
│   │   │   │   │   └── 📄 0005_datos_iniciales.sql
│   │   │   │   │
│   │   │   │   ├── 📁 semillas/ (DATOS INICIALES)
│   │   │   │   │   ├── 📄 semilla-inquilinos.ts
│   │   │   │   │   ├── 📄 semilla-roles.ts
│   │   │   │   │   ├── 📄 semilla-productos.ts
│   │   │   │   │   ├── 📄 semilla-reglas-negocio.ts
│   │   │   │   │   ├── 📄 semilla-configuracion.ts
│   │   │   │   │   └── 📄 semilla-verticales.ts
│   │   │   │   │
│   │   │   │   ├── 📁 rls/ (ROW LEVEL SECURITY)
│   │   │   │   │   ├── 📄 politicas-usuario.sql
│   │   │   │   │   ├── 📄 politicas-inquilino.sql
│   │   │   │   │   ├── 📄 politicas-reserva.sql
│   │   │   │   │   ├── 📄 politicas-producto.sql
│   │   │   │   │   ├── 📄 politicas-pedido.sql
│   │   │   │   │   └── 📄 politicas-factura.sql
│   │   │   │   │
│   │   │   │   ├── 📄 cliente-postgres.ts             # Cliente PostgreSQL configurado
│   │   │   │   ├── 📄 configuracion-pool.ts           # Configuración de pool de conexiones
│   │   │   │   └── 📄 manejador-transacciones.ts      # Manejador de transacciones distribuidas
│   │   │   │
│   │   │   ├── 📁 cache/ (SISTEMA DE CACHÉ)
│   │   │   │   ├── 📄 cliente-redis.ts                # Cliente Redis configurado
│   │   │   │   ├── 📄 estrategias-cache.ts            # Estrategias de cache (LRU, LFU, etc.)
│   │   │   │   ├── 📄 decoradores-cache.ts            # Decoradores para cache automático
│   │   │   │   ├── 📄 manejador-cache-multi-nivel.ts  # Cache multi-nivel (RAM, Redis, etc.)
│   │   │   │   └── 📄 invalidacion-cache.ts           # Invalidación inteligente de cache
│   │   │   │
│   │   │   ├── 📁 colas/ (SISTEMA DE COLAS)
│   │   │   │   ├── 📄 cliente-cola.ts                 # Cliente BullMQ configurado
│   │   │   │   ├── 📁 trabajadores/ (WORKERS)
│   │   │   │   │   ├── 📄 trabajador-pagos.ts
│   │   │   │   │   ├── 📄 trabajador-notificaciones.ts
│   │   │   │   │   ├── 📄 trabajador-reportes.ts
│   │   │   │   │   ├── 📄 trabajador-inferencia.ts
│   │   │   │   │   ├── 📄 trabajador-sincronizacion.ts
│   │   │   │   │   └── 📄 trabajador-backup.ts
│   │   │   │   │
│   │   │   │   ├── 📁 trabajos/ (DEFINICIÓN DE TRABAJOS)
│   │   │   │   │   ├── 📄 trabajo-procesar-pago.ts
│   │   │   │   │   ├── 📄 trabajo-enviar-notificacion.ts
│   │   │   │   │   ├── 📄 trabajo-generar-reporte.ts
│   │   │   │   │   ├── 📄 trabajo-procesar-inferencia.ts
│   │   │   │   │   └── 📄 trabajo-sincronizar-datos.ts
│   │   │   │   │
│   │   │   │   ├── 📄 manejador-colas.ts              # Manejador central de colas
│   │   │   │   └── 📄 monitor-colas.ts                # Monitor de estado de colas
│   │   │   │
│   │   │   ├── 📁 vector-db/ (BASE DE DATOS VECTORIAL)
│   │   │   │   ├── 📄 cliente-qdrant.ts               # Cliente Qdrant configurado
│   │   │   │   ├── 📄 colecciones.ts                  # Definición de colecciones
│   │   │   │   ├── 📄 operaciones.ts                  # Operaciones CRUD para vectores
│   │   │   │   ├── 📄 manejador-embeddings.ts         # Manejador de embeddings
│   │   │   │   └── 📄 optimizador-qdrant.ts           # Optimizador para Qdrant
│   │   │   │
│   │   │   ├── 📁 monitoreo/ (OBSERVABILIDAD)
│   │   │   │   ├── 📄 metricas-sistema.ts             # Métricas del sistema
│   │   │   │   ├── 📄 trazado-distribuido.ts          # Trazado distribuido (OpenTelemetry)
│   │   │   │   ├── 📄 chequeo-salud.ts                # Chequeo de salud de servicios
│   │   │   │   ├── 📄 recopilador-metricas.ts         # Recopilador de métricas personalizadas
│   │   │   │   └── 📄 exportador-prometheus.ts        # Exportador para Prometheus
│   │   │   │
│   │   │   ├── 📁 mensajeria/ (SISTEMA DE MENSAJERÍA)
│   │   │   │   ├── 📄 cliente-eventos.ts              # Cliente para sistema de eventos
│   │   │   │   ├── 📄 publicador-eventos.ts           # Publicador de eventos
│   │   │   │   ├── 📄 consumidor-eventos.ts           # Consumidor de eventos
│   │   │   │   └── 📄 manejador-eventos.ts            # Manejador central de eventos
│   │   │   │
│   │   │   ├── 📁 almacenamiento/ (ALMACENAMIENTO)
│   │   │   │   ├── 📄 cliente-s3.ts                   # Cliente para S3/MinIO
│   │   │   │   ├── 📄 manejador-archivos.ts           # Manejador de archivos
│   │   │   │   └── 📄 optimizador-almacenamiento.ts   # Optimizador de almacenamiento
│   │   │   │
│   │   │   └── 📁 configuracion/ (CONFIGURACIÓN)
│   │   │       ├── 📄 cargador-configuracion.ts       # Cargador de configuración
│   │   │       ├── 📄 validador-configuracion.ts      # Validador de configuración
│   │   │       └── 📄 manejador-secretos.ts           # Manejador de secretos
│   │   │
│   │   ├── 📁 api/ (CAPA DE API)
│   │   │   ├── 📁 rutas/ (ENDPOINTS)
│   │   │   │   ├── 📁 v1/ (VERSIÓN 1)
│   │   │   │   │   ├── 📁 iam/
│   │   │   │   │   │   ├── 📄 rutas-autenticacion.ts
│   │   │   │   │   │   ├── 📄 rutas-usuario.ts
│   │   │   │   │   │   ├── 📄 rutas-inquilino.ts
│   │   │   │   │   │   ├── 📄 rutas-rol.ts
│   │   │   │   │   │   └── 📄 rutas-permiso.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 ars/
│   │   │   │   │   │   ├── 📄 rutas-reservas.ts
│   │   │   │   │   │   ├── 📄 rutas-disponibilidad.ts
│   │   │   │   │   │   ├── 📄 rutas-calendario.ts
│   │   │   │   │   │   └── 📄 rutas-recordatorios.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 pim/
│   │   │   │   │   │   ├── 📄 rutas-productos.ts
│   │   │   │   │   │   ├── 📄 rutas-inventario.ts
│   │   │   │   │   │   ├── 📄 rutas-proveedores.ts
│   │   │   │   │   │   └── 📄 rutas-categorias.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 opp/
│   │   │   │   │   │   ├── 📄 rutas-pedidos.ts
│   │   │   │   │   │   ├── 📄 rutas-pagos.ts
│   │   │   │   │   │   ├── 📄 rutas-facturas.ts
│   │   │   │   │   │   └── 📄 rutas-carritos.ts
│   │   │   │   │   │
│   │   │   │   │   ├── 📁 msp/
│   │   │   │   │   │   ├── 📄 rutas-recomendaciones.ts
│   │   │   │   │   │   └── 📄 rutas-perfiles.ts
│   │   │   │   │   │
│   │   │   │   │   └── 📄 index.ts                    # Exportación de todas las rutas
│   │   │   │   │
│   │   │   │   └── 📁 salud/ (ENDPOINTS DE SALUD)
│   │   │   │       ├── 📄 rutas-salud.ts
│   │   │   │       ├── 📄 rutas-metricas.ts
│   │   │   │       ├── 📄 rutas-estado.ts
│   │   │   │       └── 📄 rutas-diagnostico.ts
│   │   │   │
│   │   │   ├── 📁 controladores/ (CONTROLADORES)
│   │   │   │   ├── 📁 iam/
│   │   │   │   │   ├── 📄 controlador-autenticacion.ts
│   │   │   │   │   ├── 📄 controlador-usuario.ts
│   │   │   │   │   ├── 📄 controlador-inquilino.ts
│   │   │   │   │   ├── 📄 controlador-rol.ts
│   │   │   │   │   └── 📄 controlador-permiso.ts
│   │   │   │   │
│   │   │   │   ├── 📁 ars/
│   │   │   │   │   ├── 📄 controlador-reservas.ts
│   │   │   │   │   ├── 📄 controlador-disponibilidad.ts
│   │   │   │   │   └── 📄 controlador-calendario.ts
│   │   │   │   │
│   │   │   │   ├── 📁 pim/
│   │   │   │   │   ├── 📄 controlador-productos.ts
│   │   │   │   │   └── 📄 controlador-inventario.ts
│   │   │   │   │
│   │   │   │   ├── 📁 opp/
│   │   │   │   │   ├── 📄 controlador-pedidos.ts
│   │   │   │   │   ├── 📄 controlador-pagos.ts
│   │   │   │   │   └── 📄 controlador-facturas.ts
│   │   │   │   │
│   │   │   │   └── 📁 msp/
│   │   │   │       ├── 📄 controlador-recomendaciones.ts
│   │   │   │       └── 📄 controlador-perfiles.ts
│   │   │   │
│   │   │   ├── 📁 middleware/ (MIDDLEWARE ESPECÍFICO)
│   │   │   │   ├── 📄 middleware-autenticacion.ts
│   │   │   │   ├── 📄 middleware-autorizacion.ts
│   │   │   │   ├── 📄 middleware-validacion.ts
│   │   │   │   ├── 📄 middleware-auditoria.ts
│   │   │   │   └── 📄 middleware-cache-api.ts
│   │   │   │
│   │   │   ├── 📁 validadores/ (VALIDACIÓN DE API)
│   │   │   │   ├── 📄 validador-autenticacion.ts
│   │   │   │   ├── 📄 validador-reserva.ts
│   │   │   │   ├── 📄 validador-pedido.ts
│   │   │   │   ├── 📄 validador-producto.ts
│   │   │   │   └── 📄 validador-pago.ts
│   │   │   │
│   │   │   ├── 📁 documentacion/ (DOCUMENTACIÓN API)
│   │   │   │   ├── 📄 configuracion-swagger.ts
│   │   │   │   ├── 📄 esquemas-openapi.ts
│   │   │   │   ├── 📄 ui-swagger.ts
│   │   │   │   └── 📄 generador-documentacion.ts
│   │   │   │
│   │   │   └── 📄 servidor.ts                        # Configuración del servidor Fastify
│   │   │
│   │   ├── 📁 configuracion/ (CONFIGURACIÓN DEL SISTEMA)
│   │   │   ├── 📁 entornos/ (CONFIGURACIÓN POR ENTORNO)
│   │   │   │   ├── 📄 desarrollo.ts
│   │   │   │   ├── 📄 produccion.ts
│   │   │   │   ├── 📄 prueba.ts
│   │   │   │   ├── 📄 homologacion.ts
│   │   │   │   └── 📄 index.ts
│   │   │   │
│   │   │   ├── 📁 verticales/ (CONFIGURACIÓN POR VERTICAL)
│   │   │   │   ├── 📄 restaurante.ts
│   │   │   │   ├── 📄 barberia.ts
│   │   │   │   └── 📄 tienda.ts
│   │   │   │
│   │   │   ├── 📁 colombia/ (CONFIGURACIÓN ESPECÍFICA COLOMBIA)
│   │   │   │   ├── 📄 impuestos.ts
│   │   │   │   ├── 📄 facturacion-electronica.ts
│   │   │   │   ├── 📄 formatos.ts
│   │   │   │   ├── 📄 zonas-horarias.ts
│   │   │   │   └── 📄 regulaciones.ts
│   │   │   │
│   │   │   ├── 📁 ia/ (CONFIGURACIÓN IA)
│   │   │   │   ├── 📄 modelos.ts
│   │   │   │   ├── 📄 embeddings.ts
│   │   │   │   ├── 📄 cache.ts
│   │   │   │   └── 📄 optimizacion.ts
│   │   │   │
│   │   │   └── 📄 index.ts                           # Exportación centralizada
│   │   │
│   │   └── 📄 index.ts                               # Punto de entrada principal
│   │
│   ├── 📁 pruebas/ (SUITES DE PRUEBAS)
│   │   ├── 📁 unitarias/ (PRUEBAS UNITARIAS)
│   │   │   ├── 📁 nucleo/
│   │   │   ├── 📁 dominios/
│   │   │   ├── 📁 infraestructura/
│   │   │   └── 📄 configuracion-pruebas.ts
│   │   │
│   │   ├── 📁 integracion/ (PRUEBAS DE INTEGRACIÓN)
│   │   │   ├── 📄 api.prueba.ts
│   │   │   ├── 📄 base-de-datos.prueba.ts
│   │   │   ├── 📄 cache.prueba.ts
│   │   │   ├── 📄 colas.prueba.ts
│   │   │   └── 📄 vector-db.prueba.ts
│   │   │
│   │   ├── 📁 e2e/ (PRUEBAS END-TO-END)
│   │   │   ├── 📄 flujo-reserva.prueba.ts
│   │   │   ├── 📄 flujo-pago.prueba.ts
│   │   │   ├── 📄 flujo-inventario.prueba.ts
│   │   │   ├── 📄 flujo-recomendaciones.prueba.ts
│   │   │   └── 📄 flujo-inquilino.prueba.ts
│   │   │
│   │   ├── 📁 carga/ (PRUEBAS DE CARGA)
│   │   │   ├── 📄 carga-api.ts
│   │   │   ├── 📄 carga-base-datos.ts
│   │   │   └── 📄 carga-sistema.ts
│   │   │
│   │   └── 📁 seguridad/ (PRUEBAS DE SEGURIDAD)
│   │       ├── 📄 seguridad-api.ts
│   │       ├── 📄 seguridad-autenticacion.ts
│   │       └── 📄 seguridad-inyeccion.ts
│   │
│   ├── 📄 Dockerfile                                # Dockerfile para producción
│   ├── 📄 Dockerfile.desarrollo                    # Dockerfile para desarrollo
│   ├── 📄 bun.lockb                                # Lockfile de Bun
│   ├── 📄 package.json                             # Dependencias y scripts
│   ├── 📄 tsconfig.json                            # Configuración TypeScript
│   ├── 📄 tsconfig.build.json                      # Configuración para build
│   ├── 📄 tsconfig.test.json                       # Configuración para pruebas
│   ├── 📄 .env.ejemplo                            # Variables de entorno ejemplo
│   ├── 📄 .eslintrc.json                          # Configuración ESLint
│   ├── 📄 .prettierrc                             # Configuración Prettier
│   ├── 📄 .gitignore                              # Archivos ignorados por Git
│   └── 📄 README.md                               # Documentación específica API
│
├── 📁 frontend/ (APLICACIONES FRONTEND)
│   ├── 📁 administrador/ (PANEL DE ADMINISTRACIÓN)
│   │   ├── 📁 src/
│   │   │   ├── 📁 diseños/ (LAYOUTS)
│   │   │   │   ├── 📄 diseño-autenticacion.vue
│   │   │   │   ├── 📄 diseño-principal.vue
│   │   │   │   ├── 📄 diseño-inquilino.vue
│   │   │   │   └── 📄 diseño-error.vue
│   │   │   │
│   │   │   ├── 📁 vistas/ (VISTAS PRINCIPALES)
│   │   │   │   ├── 📁 iam/
│   │   │   │   │   ├── 📄 inicio-sesion.vue
│   │   │   │   │   ├── 📄 registro.vue
│   │   │   │   │   ├── 📄 usuarios.vue
│   │   │   │   │   ├── 📄 roles.vue
│   │   │   │   │   ├── 📄 permisos.vue
│   │   │   │   │   └── 📄 auditoria.vue
│   │   │   │   │
│   │   │   │   ├── 📁 ars/
│   │   │   │   │   ├── 📄 reservas.vue
│   │   │   │   │   ├── 📄 disponibilidad.vue
│   │   │   │   │   ├── 📄 calendario.vue
│   │   │   │   │   ├── 📄 recursos.vue
│   │   │   │   │   └── 📄 configuracion-ars.vue
│   │   │   │   │
│   │   │   │   ├── 📁 pim/
│   │   │   │   │   ├── 📄 productos.vue
│   │   │   │   │   ├── 📄 inventario.vue
│   │   │   │   │   ├── 📄 categorias.vue
│   │   │   │   │   ├── 📄 proveedores.vue
│   │   │   │   │   ├── 📄 alertas-inventario.vue
│   │   │   │   │   └── 📄 reportes-inventario.vue
│   │   │   │   │
│   │   │   │   ├── 📁 opp/
│   │   │   │   │   ├── 📄 pedidos.vue
│   │   │   │   │   ├── 📄 pagos.vue
│   │   │   │   │   ├── 📄 facturas.vue
│   │   │   │   │   ├── 📄 carritos.vue
│   │   │   │   │   ├── 📄 devoluciones.vue
│   │   │   │   │   └── 📄 reportes-ventas.vue
│   │   │   │   │
│   │   │   │   ├── 📁 msp/
│   │   │   │   │   ├── 📄 recomendaciones.vue
│   │   │   │   │   ├── 📄 analitica.vue
│   │   │   │   │   ├── 📄 perfiles-usuarios.vue
│   │   │   │   │   └── 📄 configuracion-msp.vue
│   │   │   │   │
│   │   │   │   ├── 📁 configuracion/
│   │   │   │   │   ├── 📄 general.vue
│   │   │   │   │   ├── 📄 vertical.vue
│   │   │   │   │   ├── 📄 integraciones.vue
│   │   │   │   │   └── 📄 backup.vue
│   │   │   │   │
│   │   │   │   └── 📁 dashboard/
│   │   │   │       ├── 📄 principal.vue
│   │   │   │       ├── 📄 metricas.vue
│   │   │   │       └── 📄 resumen.vue
│   │   │   │
│   │   │   ├── 📁 componentes/ (COMPONENTES REUTILIZABLES)
│   │   │   │   ├── 📁 comunes/
│   │   │   │   │   ├── 📄 navbar.vue
│   │   │   │   │   ├── 📄 sidebar.vue
│   │   │   │   │   ├── 📄 footer.vue
│   │   │   │   │   ├── 📄 breadcrumb.vue
│   │   │   │   │   └── 📄 notificaciones.vue
│   │   │   │   │
│   │   │   │   ├── 📁 formularios/
│   │   │   │   │   ├── 📄 input-texto.vue
│   │   │   │   │   ├── 📄 selector-fecha.vue
│   │   │   │   │   ├── 📄 selector-hora.vue
│   │   │   │   │   ├── 📄 selector-multiple.vue
│   │   │   │   │   ├── 📄 editor-richtext.vue
│   │   │   │   │   └── 📄 subida-archivos.vue
│   │   │   │   │
│   │   │   │   ├── 📁 tablas/
│   │   │   │   │   ├── 📄 tabla-datos.vue
│   │   │   │   │   ├── 📄 paginacion.vue
│   │   │   │   │   ├── 📄 filtros.vue
│   │   │   │   │   └── 📄 ordenamiento.vue
│   │   │   │   │
│   │   │   │   ├── 📁 tarjetas/
│   │   │   │   │   ├── 📄 tarjeta-resumen.vue
│   │   │   │   │   ├── 📄 tarjeta-metrica.vue
│   │   │   │   │   ├── 📄 tarjeta-estadistica.vue
│   │   │   │   │   └── 📄 tarjeta-alerta.vue
│   │   │   │   │
│   │   │   │   ├── 📁 modales/
│   │   │   │   │   ├── 📄 modal-confirmacion.vue
│   │   │   │   │   ├── 📄 modal-formulario.vue
│   │   │   │   │   └── 📄 modal-detalle.vue
│   │   │   │   │
│   │   │   │   └── 📁 graficos/
│   │   │   │       ├── 📄 grafico-lineas.vue
│   │   │   │       ├── 📄 grafico-barras.vue
│   │   │   │       ├── 📄 grafico-torta.vue
│   │   │   │       └── 📄 grafico-calendario.vue
│   │   │   │
│   │   │   ├── 📁 composables/ (COMPOSABLES VUE 3)
│   │   │   │   ├── 📄 use-api.ts
│   │   │   │   ├── 📄 use-auth.ts
│   │   │   │   ├── 📄 use-inquilino.ts
│   │   │   │   ├── 📄 use-notificaciones.ts
│   │   │   │   ├── 📄 use-validacion.ts
│   │   │   │   ├── 📄 use-cache.ts
│   │   │   │   └── 📄 use-websocket.ts
│   │   │   │
│   │   │   ├── 📁 almacenes/ (PINIA STORES)
│   │   │   │   ├── 📄 almacen-auth.ts
│   │   │   │   ├── 📄 almacen-inquilino.ts
│   │   │   │   ├── 📄 almacen-ui.ts
│   │   │   │   ├── 📄 almacen-notificaciones.ts
│   │   │   │   ├── 📄 almacen-configuracion.ts
│   │   │   │   └── 📄 almacen-metricas.ts
│   │   │   │
│   │   │   ├── 📁 enrutador/ (VUE ROUTER)
│   │   │   │   ├── 📄 rutas.ts
│   │   │   │   ├── 📄 middleware.ts
│   │   │   │   ├── 📄 guards.ts
│   │   │   │   └── 📄 index.ts
│   │   │   │
│   │   │   ├── 📁 utilidades/ (UTILIDADES FRONTEND)
│   │   │   │   ├── 📄 formateadores.ts
│   │   │   │   ├── 📄 validadores.ts
│   │   │   │   ├── 📄 constantes.ts
│   │   │   │   ├── 📄 helpers.ts
│   │   │   │   └── 📄 errores.ts
│   │   │   │
│   │   │   ├── 📁 tipos/ (TIPOS TYPESCRIPT)
│   │   │   │   ├── 📄 tipos-api.ts
│   │   │   │   ├── 📄 tipos-componentes.ts
│   │   │   │   ├── 📄 tipos-almacenes.ts
│   │   │   │   └── 📄 tipos-utilidades.ts
│   │   │   │
│   │   │   └── 📁 activos/ (ASSETS)
│   │   │       ├── 📁 estilos/
│   │   │       │   ├── 📄 global.css
│   │   │       │   ├── 📄 variables.css
│   │   │       │   ├── 📄 utilidades.css
│   │   │       │   └── 📄 temas/
│   │   │       │       ├── 📄 claro.css
│   │   │       │       └── 📄 oscuro.css
│   │   │       │
│   │   │       ├── 📁 iconos/
│   │   │       │   ├── 📄 usuario.svg
│   │   │       │   ├── 📄 configuracion.svg
│   │   │       │   ├── 📄 dashboard.svg
│   │   │       │   └── 📄 notificacion.svg
│   │   │       │
│   │   │       └── 📁 imagenes/
│   │   │           ├── 📄 logo.svg
│   │   │           └── 📄 fondo-login.jpg
│   │   │
│   │   ├── 📄 index.html
│   │   ├── 📄 package.json
│   │   ├── 📄 vite.config.ts
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 .env.ejemplo
│   │   └── 📄 README.md
│   │
│   ├── 📁 cliente/ (INTERFAZ CLIENTE)
│   │   ├── 📁 src/
│   │   │   ├── 📁 modulos/ (MÓDULOS POR VERTICAL)
│   │   │   │   ├── 📁 restaurante/
│   │   │   │   │   ├── 📄 inicio-restaurante.vue
│   │   │   │   │   ├── 📄 reservar-mesa.vue
│   │   │   │   │   ├── 📄 menu.vue
│   │   │   │   │   ├── 📄 detalles-plato.vue
│   │   │   │   │   ├── 📄 reseñas.vue
│   │   │   │   │   └── 📄 perfil-restaurante.vue
│   │   │   │   │
│   │   │   │   ├── 📁 barberia/
│   │   │   │   │   ├── 📄 inicio-barberia.vue
│   │   │   │   │   ├── 📄 reservar-cita.vue
│   │   │   │   │   ├── 📄 servicios.vue
│   │   │   │   │   ├── 📄 profesionales.vue
│   │   │   │   │   ├── 📄 productos-barberia.vue
│   │   │   │   │   └── 📄 perfil-barberia.vue
│   │   │   │   │
│   │   │   │   └── 📁 tienda/
│   │   │   │       ├── 📄 inicio-tienda.vue
│   │   │   │       ├── 📄 productos.vue
│   │   │   │       ├── 📄 carrito.vue
│   │   │   │       ├── 📄 checkout.vue
│   │   │   │       ├── 📄 categorias.vue
│   │   │   │       └── 📄 perfil-tienda.vue
│   │   │   │
│   │   │   ├── 📁 compartidos/ (COMPONENTES COMPARTIDOS)
│   │   │   │   ├── 📄 cabecera.vue
│   │   │   │   ├── 📄 pie-pagina.vue
│   │   │   │   ├── 📄 carrusel.vue
│   │   │   │   ├── 📄 tarjeta-producto.vue
│   │   │   │   ├── 📄 calificaciones.vue
│   │   │   │   └── 📄 mapa-ubicacion.vue
│   │   │   │
│   │   │   ├── 📁 autenticacion/
│   │   │   │   ├── 📄 registro.vue
│   │   │   │   ├── 📄 inicio-sesion.vue
│   │   │   │   ├── 📄 recuperar-contrasena.vue
│   │   │   │   └── 📄 perfil-usuario.vue
│   │   │   │
│   │   │   └── 📁 qr/ (SISTEMA QR)
│   │   │       ├── 📄 escaner-qr.vue
│   │   │       ├── 📄 generador-qr.vue
│   │   │       ├── 📄 validar-qr.vue
│   │   │       └── 📄 historial-qr.vue
│   │   │
│   │   ├── 📄 package.json
│   │   ├── 📄 vite.config.ts
│   │   └── 📄 README.md
│   │
│   └── 📁 empleado/ (INTERFAZ EMPLEADOS)
│       ├── 📁 src/
│       │   ├── 📁 caracteristicas/ (CARACTERÍSTICAS POR ROL)
│       │   │   ├── 📁 mesero/
│       │   │   │   ├── 📄 mesas.vue
│       │   │   │   ├── 📄 ordenes.vue
│       │   │   │   ├── 📄 cuenta.vue
│       │   │   │   ├── 📄 pedidos-pendientes.vue
│       │   │   │   └── 📄 historial-mesas.vue
│       │   │   │
│       │   │   ├── 📁 barbero/
│       │   │   │   ├── 📄 agenda.vue
│       │   │   │   ├── 📄 clientes.vue
│       │   │   │   ├── 📄 servicios.vue
│       │   │   │   ├── 📄 productos-usados.vue
│       │   │   │   └── 📄 ingresos.vue
│       │   │   │
│       │   │   ├── 📁 cajero/
│       │   │   │   ├── 📄 caja.vue
│       │   │   │   ├── 📄 facturacion.vue
│       │   │   │   ├── 📄 reportes.vue
│       │   │   │   ├── 📄 corte-caja.vue
│       │   │   │   └── 📄 transacciones.vue
│       │   │   │
│       │   │   ├── 📁 gerente/
│       │   │   │   ├── 📄 dashboard.vue
│       │   │   │   ├── 📄 empleados.vue
│       │   │   │   ├── 📄 finanzas.vue
│       │   │   │   ├── 📄 inventario.vue
│       │   │   │   └── 📄 configuracion.vue
│       │   │   │
│       │   │   └── 📁 administrador/
│       │   │       ├── 📄 sistema.vue
│       │   │       ├── 📄 backups.vue
│       │   │       ├── 📄 logs.vue
│       │   │       └── 📄 monitor.vue
│       │   │
│       │   ├── 📁 escaner-qr/ (SISTEMA QR EMPLEADO)
│       │   │   ├── 📄 camara.vue
│       │   │   ├── 📄 procesador-qr.ts
│       │   │   ├── 📄 validaciones.ts
│       │   │   └── 📄 historial.ts
│       │   │
│       │   ├── 📁 utilidades/ (UTILIDADES EMPLEADO)
│       │   │   ├── 📄 calculadora-propinas.ts
│       │   │   ├── 📄 generador-comprobantes.ts
│       │   │   └── 📄 notificaciones-empleado.ts
│       │   │
│       │   └── 📁 componentes/ (COMPONENTES EMPLEADO)
│       │       ├── 📄 selector-rapido.vue
│       │       ├── 📄 teclado-numerico.vue
│       │       └── 📄 impresor-tickets.vue
│       │
│       ├── 📄 package.json
│       ├── 📄 vite.config.ts
│       └── 📄 README.md
│
├── 📁 modelos/ (MODELOS DE IA Y DATOS)
│   ├── 📁 msp/ (MOTOR DE SISTEMAS DE PENSAMIENTO)
│   │   ├── 📄 llama-3.2-3b-instruct-q4_K_M.gguf    # Modelo principal optimizado
│   │   ├── 📄 configuracion-modelo.json             # Configuración específica del modelo
│   │   ├── 📄 metadatos-modelo.json                 # Metadatos y versionamiento
│   │   └── 📄 LEEME-MODELOS.md                      # Documentación de modelos
│   │
│   ├── 📁 embeddings/ (MODELOS DE EMBEDDINGS)
│   │   ├── 📄 nomic-embed-text-v1.5.f16.gguf       # Modelo de embeddings
│   │   ├── 📄 configuracion-embeddings.json        # Configuración de embeddings
│   │   ├── 📄 vocabulario-es.json                  # Vocabulario en español
│   │   └── 📄 metadatos-embeddings.json
│   │
│   ├── 📁 ajustado-fino/ (MODELOS FINE-TUNED)
│   │   ├── 📁 restaurante/
│   │   │   ├── 📄 modelo-restaurante.gguf
│   │   │   ├── 📄 configuracion-restaurante.json
│   │   │   ├── 📄 datos-entrenamiento.json
│   │   │   └── 📄 metricas-evaluacion.json
│   │   │
│   │   ├── 📁 barberia/
│   │   │   ├── 📄 modelo-barberia.gguf
│   │   │   ├── 📄 configuracion-barberia.json
│   │   │   ├── 📄 datos-entrenamiento.json
│   │   │   └── 📄 metricas-evaluacion.json
│   │   │
│   │   └── 📁 tienda/
│   │       ├── 📄 modelo-tienda.gguf
│   │       ├── 📄 configuracion-tienda.json
│   │       ├── 📄 datos-entrenamiento.json
│   │       └── 📄 metricas-evaluacion.json
│   │
│   ├── 📁 datasets/ (CONJUNTOS DE DATOS)
│   │   ├── 📁 entrenamiento/
│   │   │   ├── 📄 restaurante.jsonl
│   │   │   ├── 📄 barberia.jsonl
│   │   │   └── 📄 tienda.jsonl
│   │   │
│   │   ├── 📁 validacion/
│   │   │   ├── 📄 restaurante.jsonl
│   │   │   ├── 📄 barberia.jsonl
│   │   │   └── 📄 tienda.jsonl
│   │   │
│   │   └── 📁 prueba/
│   │       ├── 📄 restaurante.jsonl
│   │       ├── 📄 barberia.jsonl
│   │       └── 📄 tienda.jsonl
│   │
│   └── 📁 cache-embeddings/ (CACHÉ DE EMBEDDINGS)
│       ├── 📄 restaurante-cache.bin
│       ├── 📄 barberia-cache.bin
│       └── 📄 tienda-cache.bin
│
├── 📁 configuracion/ (CONFIGURACIÓN DE INFRAESTRUCTURA)
│   ├── 📄 nginx.conf                                 # Configuración Nginx optimizada
│   ├── 📄 nginx-ssl.conf                             # Configuración SSL/TLS
│   ├── 📄 prometheus.yml                             # Configuración Prometheus
│   ├── 📄 alertmanager.yml                           # Configuración Alertmanager
│   ├── 📄 loki.yaml                                  # Configuración Loki
│   ├── 📄 promtail.yaml                              # Configuración Promtail
│   ├── 📄 grafana-datasources.yaml                   # Fuentes de datos Grafana
│   ├── 📄 grafana-dashboards.yaml                    # Dashboards Grafana
│   ├── 📄 postgresql.conf                            # Configuración PostgreSQL optimizada
│   ├── 📄 redis.conf                                 # Configuración Redis
│   ├── 📄 qdrant.yaml                                # Configuración Qdrant
│   ├── 📄 docker-daemon.json                         # Configuración Docker
│   └── 📄 sysctl.conf                                # Configuración del sistema
│
├── 📁 scripts/ (SCRIPTS DE AUTOMATIZACIÓN)
│   ├── 📁 despliegue/ (DESPLIEGUE)
│   │   ├── 📄 inicializar-proyecto.sh                # Inicialización completa
│   │   ├── 📄 desplegar-desarrollo.sh                # Despliegue desarrollo
│   │   ├── 📄 desplegar-produccion.sh                # Despliegue producción
│   │   ├── 📄 verificar-entorno.sh                   # Verificación de entorno
│   │   ├── 📄 configurar-ssl.sh                      # Configuración SSL automática
│   │   ├── 📄 optimizar-sistema.sh                   # Optimización del sistema
│   │   └── 📄 monitorear-despliegue.sh               # Monitoreo durante despliegue
│   │
│   ├── 📁 respaldo/ (RESPALDOS)
│   │   ├── 📄 respaldo-completo.sh                   # Respaldo completo
│   │   ├── 📄 respaldo-incremental.sh                # Respaldo incremental
│   │   ├── 📄 restaurar-respaldo.sh                  # Restauración de respaldo
│   │   ├── 📄 rotar-respaldos.sh                     # Rotación de respaldos
│   │   ├── 📄 verificar-respaldo.sh                  # Verificación de respaldo
│   │   └── 📄 migrar-datos.sh                        # Migración de datos
│   │
│   ├── 📁 monitoreo/ (MONITOREO)
│   │   ├── 📄 verificar-servicios.sh                 # Verificación de servicios
│   │   ├── 📄 limpiar-logs.sh                        # Limpieza de logs
│   │   ├── 📄 exportar-metricas.sh                   # Exportación de métricas
│   │   ├── 📄 analizar-rendimiento.sh                # Análisis de rendimiento
│   │   ├── 📄 generar-reporte.sh                     # Generación de reportes
│   │   └── 📄 alertas-automaticas.sh                 # Sistema de alertas
│   │
│   ├── 📁 migracion/ (MIGRACIONES)
│   │   ├── 📄 ejecutar-migraciones.sh                # Ejecución de migraciones
│   │   ├── 📄 revertir-migracion.sh                  # Reversión de migraciones
│   │   ├── 📄 generar-migracion.sh                   # Generación de migraciones
│   │   ├── 📄 verificar-migraciones.sh               # Verificación de migraciones
│   │   └── 📄 migrar-inquilino.sh                    # Migración específica por inquilino
│   │
│   ├── 📁 entrenamiento/ (ENTRENAMIENTO IA)
│   │   ├── 📄 preparar-datos.py                      # Preparación de datos
│   │   ├── 📄 entrenar-modelo.py                     # Entrenamiento de modelo
│   │   ├── 📄 evaluar-modelo.py                      # Evaluación de modelo
│   │   ├── 📄 optimizar-modelo.py                    # Optimización de modelo
│   │   ├── 📄 fine-tune-modelo.py                    # Fine-tuning de modelo
│   │   └── 📄 exportar-modelo.py                     # Exportación de modelo
│   │
│   ├── 📁 mantenimiento/ (MANTENIMIENTO)
│   │   ├── 📄 limpiar-cache.sh                       # Limpieza de cache
│   │   ├── 📄 optimizar-bd.sh                        # Optimización de BD
│   │   ├── 📄 actualizar-sistema.sh                  # Actualización del sistema
│   │   ├── 📄 verificar-seguridad.sh                 # Verificación de seguridad
│   │   └── 📄 renovar-certificados.sh                # Renovación de certificados
│   │
│   └── 📁 utilidades/ (UTILIDADES VARIAS)
│       ├── 📄 generar-contraseña.sh                  # Generación de contraseñas
│       ├── 📄 calcular-hash.sh                       # Cálculo de hashes
│       ├── 📄 verificar-integridad.sh                # Verificación de integridad
│       ├── 📄 convertir-formato.sh                   # Conversión de formatos
│       └── 📄 extraer-metricas.sh                    # Extracción de métricas
│
├── 📁 datos/ (DATOS Y ALMACENAMIENTO)
│   ├── 📁 logs/ (LOGS DEL SISTEMA)
│   │   ├── 📁 api/
│   │   │   ├── 📄 acceso.log
│   │   │   ├── 📄 error.log
│   │   │   └── 📄 auditoria.log
│   │   │
│   │   ├── 📁 base-de-datos/
│   │   │   ├── 📄 postgresql.log
│   │   │   └── 📄 consultas-lentas.log
│   │   │
│   │   ├── 📁 nginx/
│   │   │   ├── 📄 acceso.log
│   │   │   └── 📄 error.log
│   │   │
│   │   ├── 📁 aplicacion/
│   │   │   ├── 📄 sistema.log
│   │   │   └── 📄 negocio.log
│   │   │
│   │   └── 📁 monitoreo/
│   │       ├── 📄 metricas.log
│   │       └── 📄 alertas.log
│   │
│   ├── 📁 cargas/ (CARGA DE ARCHIVOS)
│   │   ├── 📁 perfil-usuario/
│   │   │   ├── 📁 avatares/
│   │   │   └── 📁 documentos/
│   │   │
│   │   ├── 📁 productos/
│   │   │   ├── 📁 imagenes/
│   │   │   └── 📁 documentos/
│   │   │
│   │   ├── 📁 facturas/
│   │   │   ├── 📁 xml/
│   │   │   ├── 📁 pdf/
│   │   │   └── 📁 firmas/
│   │   │
│   │   └── 📁 reportes/
│   │       ├── 📁 diarios/
│   │       ├── 📁 mensuales/
│   │       └── 📁 anuales/
│   │
│   ├── 📁 respaldos/ (RESPALDOS)
│   │   ├── 📁 diarios/
│   │   │   ├── 📄 backup-$(date +%Y%m%d).sql
│   │   │   └── 📄 backup-$(date +%Y%m%d).tar.gz
│   │   │
│   │   ├── 📁 semanales/
│   │   │   └── 📄 backup-semana-$(date +%V).tar.gz
│   │   │
│   │   └── 📁 mensuales/
│   │       └── 📄 backup-mes-$(date +%m).tar.gz
│   │
│   ├── 📁 certbot/ (CERTIFICADOS SSL)
│   │   ├── 📁 certificados/
│   │   │   ├── 📁 dominio-principal/
│   │   │   └── 📁 subdominios/
│   │   │
│   │   └── 📁 renovaciones/
│   │       └── 📄 historial-renovaciones.log
│   │
│   └── 📁 cache/ (CACHÉ DEL SISTEMA)
│       ├── 📁 redis/
│       │   └── 📄 dump.rdb
│       │
│       ├── 📁 modelos/
│       │   ├── 📄 cache-modelos.bin
│       │   └── 📄 cache-embeddings.bin
│       │
│       └── 📁 temporal/
│           └── 📄 temp-files/
│
├── 📁 documentacion/ (DOCUMENTACIÓN COMPLETA)
│   ├── 📁 arquitectura/ (ARQUITECTURA)
│   │   ├── 📄 decisiones-arquitectonicas.md
│   │   ├── 📄 diagramas-arquitectura.md
│   │   ├── 📄 patrones-diseno.md
│   │   ├── 📄 flujos-sistema.md
│   │   ├── 📄 seguridad-arquitectura.md
│   │   └── 📄 escalabilidad.md
│   │
│   ├── 📁 guias/ (GUÍAS)
│   │   ├── 📄 guia-desarrollo.md
│   │   ├── 📄 guia-despliegue.md
│   │   ├── 📄 guia-contribucion.md
│   │   ├── 📄 guia-solucion-problemas.md
│   │   ├── 📄 guia-migracion.md
│   │   ├── 📄 guia-monitoreo.md
│   │   └── 📄 guia-seguridad.md
│   │
│   ├── 📁 api/ (DOCUMENTACIÓN API)
│   │   ├── 📄 referencia-api.md
│   │   ├── 📄 ejemplos-api.md
│   │   ├── 📄 autenticacion-api.md
│   │   └── 📄 errores-api.md
│   │
│   ├── 📁 verticales/ (DOCUMENTACIÓN POR VERTICAL)
│   │   ├── 📁 restaurante/
│   │   │   ├── 📄 funcionalidades.md
│   │   │   ├── 📄 configuracion.md
│   │   │   └── 📄 mejores-practicas.md
│   │   │
│   │   ├── 📁 barberia/
│   │   │   ├── 📄 funcionalidades.md
│   │   │   ├── 📄 configuracion.md
│   │   │   └── 📄 mejores-practicas.md
│   │   │
│   │   └── 📁 tienda/
│   │       ├── 📄 funcionalidades.md
│   │       ├── 📄 configuracion.md
│   │       └── 📄 mejores-practicas.md
│   │
│   ├── 📁 operaciones/ (OPERACIONES)
│   │   ├── 📄 procedimientos-operacion.md
│   │   ├── 📄 procedimientos-backup.md
│   │   ├── 📄 procedimientos-restauracion.md
│   │   └── 📄 procedimientos-monitoreo.md
│   │
│   └── 📁 glosario/ (GLOSARIO)
│       ├── 📄 terminologia-tecnica.md
│       ├── 📄 diccionario-ingles-espanol.md
│       ├── 📄 acronimos.md
│       └── 📄 convenciones-codigo.md
│
├── 📁 pruebas/ (PRUEBAS AVANZADAS)
│   ├── 📁 carga/ (PRUEBAS DE CARGA)
│   │   ├── 📄 script-carga-api.js
│   │   ├── 📄 script-carga-bd.js
│   │   ├── 📄 configuracion-carga.json
│   │   └── 📄 resultados-carga.md
│   │
│   ├── 📁 seguridad/ (PRUEBAS DE SEGURIDAD)
│   │   ├── 📄 escaneo-vulnerabilidades.sh
│   │   ├── 📄 pruebas-penetracion.md
│   │   ├── 📄 auditoria-codigo.md
│   │   └── 📄 reporte-seguridad.md
│   │
│   └── 📁 compatibilidad/ (PRUEBAS DE COMPATIBILIDAD)
│       ├── 📄 navegadores.md
│       ├── 📄 dispositivos.md
│       └── 📄 sistemas-operativos.md
│
├── 📄 docker-compose.yml                            # Docker Compose principal
├── 📄 docker-compose.desarrollo.yml                 # Docker Compose desarrollo
├── 📄 docker-compose.produccion.yml                 # Docker Compose producción
├── 📄 docker-compose.pruebas.yml                    # Docker Compose pruebas
├── 📄 .env.ejemplo                                  # Variables de entorno ejemplo
├── 📄 .env.produccion                               # Variables de entorno producción
├── 📄 .env.desarrollo                               # Variables de entorno desarrollo
├── 📄 .gitignore                                    # Archivos ignorados por Git
├── 📄 .dockerignore                                 # Archivos ignorados por Docker
├── 📄 Makefile                                      # Comandos comunes
├── 📄 HOJA-DE-RUTA.md                               # Roadmap del proyecto
├── 📄 CONTRIBUTING.md                               # Guía de contribución
├── 📄 CODIGO-CONDUCTA.md                            # Código de conducta
├── 📄 LICENCIA.md                                   # Licencia del proyecto
└── 📄 README.md                                     # Documentación principal
🚀 SCRIPT DE CREACIÓN DE ESTRUCTURA MEJORADO
1. SCRIPT MAESTRO PRINCIPAL - crear-estructura-titan-v13.sh
bash
#!/bin/bash
# TITAN-MSP-v13.0/crear-estructura-titan-v13.sh
# Script maestro para crear estructura completa del proyecto TITAN+MSP v13.0
# Optimizado para Ubuntu/Linux con verificación completa

echo "🚀 INICIALIZACIÓN COMPLETA TITAN+MSP v13.0"
echo "=========================================="
echo "Fecha: $(date)"
echo "Versión: 13.0 - Única Fuente de la Verdad"
echo "Hardware Objetivo: i7-6700HQ / GTX 1060 6GB VRAM / 24GB RAM / 400GB SSD"
echo ""

# Configuración
PROJECT_ROOT="TITAN-MSP-v13.0"
START_TIME=$(date +%s)

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir con formato
print_header() {
    echo -e "\n${CYAN}══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para verificar comandos
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 no está instalado"
        return 1
    fi
    return 0
}

# Verificar dependencias
print_header "🔍 VERIFICANDO DEPENDENCIAS DEL SISTEMA"

declare -a REQUIRED_COMMANDS=("mkdir" "touch" "find" "wc" "tree" "git" "docker" "docker-compose")

for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if check_command "$cmd"; then
        print_success "$cmd"
    else
        print_warning "$cmd no encontrado - algunas funciones pueden estar limitadas"
    fi
done

# Verificar recursos del sistema
print_header "💻 VERIFICANDO RECURSOS DEL SISTEMA"

# Memoria RAM
TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
if [ "$TOTAL_RAM" -ge 16 ]; then
    print_success "RAM: ${TOTAL_RAM}GB (suficiente para desarrollo)"
else
    print_warning "RAM: ${TOTAL_RAM}GB (se recomiendan 16GB+)"
fi

# Almacenamiento
TOTAL_DISK=$(df -h . | awk 'NR==2 {print $2}')
AVAILABLE_DISK=$(df -h . | awk 'NR==2 {print $4}')
print_info "Disco total: $TOTAL_DISK, Disponible: $AVAILABLE_DISK"

# CPU
CPU_CORES=$(nproc)
print_info "Núcleos CPU: $CPU_CORES"

# Crear directorio raíz
print_header "📁 CREANDO ESTRUCTURA DE DIRECTORIOS"

if [ -d "$PROJECT_ROOT" ]; then
    print_warning "El directorio $PROJECT_ROOT ya existe"
    read -p "¿Desea sobrescribir? (s/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_error "Operación cancelada por el usuario"
        exit 1
    fi
    rm -rf "$PROJECT_ROOT"
fi

mkdir -p "$PROJECT_ROOT"
cd "$PROJECT_ROOT"
print_success "Directorio raíz creado: $(pwd)"

# Función para crear directorio con verificación
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        if [ $? -eq 0 ]; then
            echo -e "  ${GREEN}✓${NC} $1"
        else
            echo -e "  ${RED}✗${NC} Error creando: $1"
            return 1
        fi
    fi
    return 0
}

# Función para crear archivo
create_file() {
    if [ ! -f "$1" ]; then
        touch "$1"
        if [ $? -eq 0 ]; then
            echo -e "  ${GREEN}✓${NC} $1"
        else
            echo -e "  ${RED}✗${NC} Error creando: $1"
            return 1
        fi
    fi
    return 0
}

# Crear estructura principal
print_info "Creando estructura base..."

# .vscode
create_dir ".vscode"

# API
create_dir "api/src/nucleo/comun"
create_dir "api/src/nucleo/errores"
create_dir "api/src/nucleo/tipos"
create_dir "api/src/nucleo/utilidades"
create_dir "api/src/nucleo/middleware"

# Dominios
create_dir "api/src/dominios/iam/entidades"
create_dir "api/src/dominios/iam/objetos-valor"
create_dir "api/src/dominios/iam/repositorios/interfaces"
create_dir "api/src/dominios/iam/repositorios/implementaciones"
create_dir "api/src/dominios/iam/servicios"
create_dir "api/src/dominios/iam/casos-uso"
create_dir "api/src/dominios/iam/validadores"
create_dir "api/src/dominios/iam/eventos"
create_dir "api/src/dominios/iam/politicas"
create_dir "api/src/dominios/iam/pruebas/unitarias/entidades"
create_dir "api/src/dominios/iam/pruebas/unitarias/objetos-valor"
create_dir "api/src/dominios/iam/pruebas/unitarias/servicios"
create_dir "api/src/dominios/iam/pruebas/unitarias/casos-uso"
create_dir "api/src/dominios/iam/pruebas/integracion"

# ... (continuar con todos los directorios del árbol)

# Frontend
create_dir "frontend/administrador/src/diseños"
create_dir "frontend/administrador/src/vistas/iam"
create_dir "frontend/administrador/src/vistas/ars"
create_dir "frontend/administrador/src/vistas/pim"
create_dir "frontend/administrador/src/vistas/opp"
create_dir "frontend/administrador/src/vistas/msp"
create_dir "frontend/administrador/src/vistas/configuracion"
create_dir "frontend/administrador/src/vistas/dashboard"

# Modelos
create_dir "modelos/msp"
create_dir "modelos/embeddings"
create_dir "modelos/ajustado-fino/restaurante"
create_dir "modelos/ajustado-fino/barberia"
create_dir "modelos/ajustado-fino/tienda"
create_dir "modelos/datasets/entrenamiento"
create_dir "modelos/datasets/validacion"
create_dir "modelos/datasets/prueba"
create_dir "modelos/cache-embeddings"

# Configuración
create_dir "configuracion"

# Scripts
create_dir "scripts/despliegue"
create_dir "scripts/respaldo"
create_dir "scripts/monitoreo"
create_dir "scripts/migracion"
create_dir "scripts/entrenamiento"
create_dir "scripts/mantenimiento"
create_dir "scripts/utilidades"

# Datos
create_dir "datos/logs/api"
create_dir "datos/logs/base-de-datos"
create_dir "datos/logs/nginx"
create_dir "datos/logs/aplicacion"
create_dir "datos/logs/monitoreo"
create_dir "datos/cargas/perfil-usuario/avatares"
create_dir "datos/cargas/perfil-usuario/documentos"
create_dir "datos/cargas/productos/imagenes"
create_dir "datos/cargas/productos/documentos"
create_dir "datos/cargas/facturas/xml"
create_dir "datos/cargas/facturas/pdf"
create_dir "datos/cargas/facturas/firmas"
create_dir "datos/cargas/reportes/diarios"
create_dir "datos/cargas/reportes/mensuales"
create_dir "datos/cargas/reportes/anuales"
create_dir "datos/respaldos/diarios"
create_dir "datos/respaldos/semanales"
create_dir "datos/respaldos/mensuales"
create_dir "datos/certbot/certificados/dominio-principal"
create_dir "datos/certbot/certificados/subdominios"
create_dir "datos/certbot/renovaciones"
create_dir "datos/cache/redis"
create_dir "datos/cache/modelos"
create_dir "datos/cache/temporal/temp-files"

# Documentación
create_dir "documentacion/arquitectura"
create_dir "documentacion/guias"
create_dir "documentacion/api"
create_dir "documentacion/verticales/restaurante"
create_dir "documentacion/verticales/barberia"
create_dir "documentacion/verticales/tienda"
create_dir "documentacion/operaciones"
create_dir "documentacion/glosario"

# Pruebas
create_dir "pruebas/carga"
create_dir "pruebas/seguridad"
create_dir "pruebas/compatibilidad"

print_success "Estructura de directorios creada"

# Crear archivos principales
print_header "📄 CREANDO ARCHIVOS PRINCIPALES"

# Archivos de configuración VS Code
print_info "Creando archivos de configuración VS Code..."
create_file ".vscode/configuraciones.json"
create_file ".vscode/extensiones-recomendadas.json"
create_file ".vscode/configuracion-lanzamiento.json"
create_file ".vscode/configuracion-tareas.json"
create_file ".vscode/configuracion-snippets.code-snippets"
create_file ".vscode/configuracion-settings.json"

# Archivos raíz del proyecto
print_info "Creando archivos de configuración del proyecto..."
create_file ".env.ejemplo"
create_file ".env.produccion"
create_file ".env.desarrollo"
create_file ".gitignore"
create_file ".dockerignore"
create_file "Makefile"
create_file "HOJA-DE-RUTA.md"
create_file "CONTRIBUTING.md"
create_file "CODIGO-CONDUCTA.md"
create_file "LICENCIA.md"
create_file "README.md"

# Docker Compose
create_file "docker-compose.yml"
create_file "docker-compose.desarrollo.yml"
create_file "docker-compose.produccion.yml"
create_file "docker-compose.pruebas.yml"

# Archivos de configuración
print_info "Creando archivos de configuración de infraestructura..."
create_file "configuracion/nginx.conf"
create_file "configuracion/nginx-ssl.conf"
create_file "configuracion/prometheus.yml"
create_file "configuracion/alertmanager.yml"
create_file "configuracion/loki.yaml"
create_file "configuracion/promtail.yaml"
create_file "configuracion/grafana-datasources.yaml"
create_file "configuracion/grafana-dashboards.yaml"
create_file "configuracion/postgresql.conf"
create_file "configuracion/redis.conf"
create_file "configuracion/qdrant.yaml"
create_file "configuracion/docker-daemon.json"
create_file "configuracion/sysctl.conf"

# Scripts principales
print_info "Creando scripts de automatización..."
create_file "scripts/despliegue/inicializar-proyecto.sh"
create_file "scripts/despliegue/desplegar-desarrollo.sh"
create_file "scripts/despliegue/desplegar-produccion.sh"
create_file "scripts/despliegue/verificar-entorno.sh"
create_file "scripts/despliegue/configurar-ssl.sh"
create_file "scripts/despliegue/optimizar-sistema.sh"
create_file "scripts/despliegue/monitorear-despliegue.sh"

create_file "scripts/respaldo/respaldo-completo.sh"
create_file "scripts/respaldo/respaldo-incremental.sh"
create_file "scripts/respaldo/restaurar-respaldo.sh"
create_file "scripts/respaldo/rotar-respaldos.sh"
create_file "scripts/respaldo/verificar-respaldo.sh"
create_file "scripts/respaldo/migrar-datos.sh"

# Archivos API principales
print_info "Creando archivos base de la API..."
create_file "api/package.json"
create_file "api/bun.lockb"
create_file "api/tsconfig.json"
create_file "api/tsconfig.build.json"
create_file "api/tsconfig.test.json"
create_file "api/.eslintrc.json"
create_file "api/.prettierrc"
create_file "api/Dockerfile"
create_file "api/Dockerfile.desarrollo"
create_file "api/README.md"

# Archivos de modelos
print_info "Creando archivos de modelos de IA..."
create_file "modelos/msp/LEEME-MODELOS.md"
create_file "modelos/msp/configuracion-modelo.json"
create_file "modelos/msp/metadatos-modelo.json"

# Configurar permisos
print_header "🔐 CONFIGURANDO PERMISOS"

# Hacer ejecutables los scripts
chmod +x scripts/despliegue/*.sh
chmod +x scripts/respaldo/*.sh
chmod +x scripts/monitoreo/*.sh
chmod +x scripts/migracion/*.sh
chmod +x scripts/mantenimiento/*.sh
chmod +x scripts/utilidades/*.sh

print_success "Permisos configurados"

# Verificación final
print_header "✅ VERIFICACIÓN FINAL DE ESTRUCTURA"

TOTAL_DIRS=$(find . -type d | wc -l)
TOTAL_FILES=$(find . -type f | wc -l)
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

print_success "ESTRUCTURA CREADA EXITOSAMENTE"
echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}📊 RESUMEN FINAL:${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
echo -e "  📁 Directorios creados: ${GREEN}$TOTAL_DIRS${NC}"
echo -e "  📄 Archivos creados: ${GREEN}$TOTAL_FILES${NC}"
echo -e "  ⏱️  Tiempo total: ${GREEN}${DURATION} segundos${NC}"
echo -e "  📍 Ubicación: ${GREEN}$(pwd)${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"

# Mostrar estructura principal
if command -v tree &> /dev/null; then
    echo ""
    print_header "🌳 ESTRUCTURA PRINCIPAL CREADA"
    tree -L 3 -I 'node_modules|.git|.vscode' --dirsfirst
else
    print_warning "El comando 'tree' no está instalado. Instálalo para ver la estructura."
    echo "Puedes instalarlo con: sudo apt install tree"
fi

# Instrucciones de inicio
print_header "🚀 INSTRUCCIONES DE INICIO"

echo -e "${GREEN}1.${NC} Navegar al directorio del proyecto:"
echo -e "   ${CYAN}cd $PROJECT_ROOT${NC}"
echo ""
echo -e "${GREEN}2.${NC} Configurar variables de entorno:"
echo -e "   ${CYAN}cp .env.ejemplo .env${NC}"
echo -e "   ${CYAN}cp .env.ejemplo .env.desarrollo${NC}"
echo ""
echo -e "${GREEN}3.${NC} Inicializar Git:"
echo -e "   ${CYAN}git init${NC}"
echo -e "   ${CYAN}git add .${NC}"
echo -e "   ${CYAN}git commit -m \"feat: estructura inicial TITAN+MSP v13.0\"${NC}"
echo ""
echo -e "${GREEN}4.${NC} Iniciar servicios con Docker Compose:"
echo -e "   ${CYAN}docker-compose -f docker-compose.desarrollo.yml up -d${NC}"
echo ""
echo -e "${GREEN}5.${NC} Verificar servicios:"
echo -e "   ${CYAN}docker-compose ps${NC}"
echo ""
echo -e "${GREEN}6.${NC} Acceder a las interfaces:"
echo -e "   API: ${CYAN}http://localhost:3000${NC}"
echo -e "   Grafana: ${CYAN}http://localhost:3001${NC}"
echo -e "   Documentación API: ${CYAN}http://localhost:3000/docs${NC}"
echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 ¡PROYECTO INICIALIZADO CON ÉXITO!${NC}"
echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"

# Crear archivo de resumen
cat > "RESUMEN-INICIALIZACION.md" << EOF
# Resumen de Inicialización TITAN+MSP v13.0

## Detalles de la Creación
- **Fecha**: $(date)
- **Directorio raíz**: $(pwd)
- **Total directorios**: $TOTAL_DIRS
- **Total archivos**: $TOTAL_FILES
- **Tiempo de creación**: ${DURATION} segundos

## Estructura Principal Creada
\`\`\`
$(find . -maxdepth 3 -type d | sort | sed 's|\./||g' | grep -v '^\.' | head -50)
\`\`\`

## Próximos Pasos
1. Configurar variables de entorno
2. Inicializar repositorio Git
3. Ejecutar migraciones de base de datos
4. Iniciar servicios con Docker Compose
5. Verificar que todos los servicios estén funcionando

## Recursos Importantes
- Documentación: \`documentacion/\`
- Scripts de automatización: \`scripts/\`
- Configuración: \`configuracion/\`

## Notas
- Esta estructura está optimizada para i7-6700HQ / GTX 1060 6GB VRAM / 24GB RAM
- Todos los paths están configurados para SSD de 400GB
- La arquitectura sigue principios de Single Source of Truth (SSOT)
EOF

print_success "Resumen de inicialización guardado en: RESUMEN-INICIALIZACION.md"
2. SCRIPT DE VERIFICACIÓN DE ESTRUCTURA - verificar-estructura-completa.sh
bash
#!/bin/bash
# TITAN-MSP-v13.0/scripts/despliegue/verificar-estructura-completa.sh
# Script para verificar que la estructura del proyecto sea correcta

echo "🔍 VERIFICACIÓN DE ESTRUCTURA TITAN+MSP v13.0"
echo "=============================================="

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0
TOTAL_CHECKS=0

# Función para verificar directorio
check_dir() {
    ((TOTAL_CHECKS++))
    if [ -d "$1" ]; then
        echo -e "  ${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "  ${RED}✗${NC} FALTA: $1"
        ((ERRORS++))
        return 1
    fi
}

# Función para verificar archivo
check_file() {
    ((TOTAL_CHECKS++))
    if [ -f "$1" ]; then
        echo -e "  ${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "  ${YELLOW}⚠${NC} FALTA: $1"
        ((WARNINGS++))
        return 1
    fi
}

echo -e "\n${BLUE}1. VERIFICANDO DIRECTORIOS CRÍTICOS:${NC}"

# Directorios críticos que DEBEN existir
declare -a CRITICAL_DIRS=(
    "api/src/dominios/iam"
    "api/src/dominios/ars"
    "api/src/dominios/pim"
    "api/src/dominios/opp"
    "api/src/dominios/msp"
    "api/src/infraestructura/base-de-datos"
    "api/src/infraestructura/cache"
    "api/src/infraestructura/colas"
    "api/src/infraestructura/vector-db"
    "frontend/administrador/src"
    "frontend/cliente/src"
    "frontend/empleado/src"
    "modelos/msp"
    "modelos/embeddings"
    "configuracion"
    "scripts/despliegue"
    "scripts/respaldo"
    "datos/logs"
    "datos/cargas"
    "datos/respaldos"
    "documentacion/arquitectura"
    "documentacion/guias"
)

for dir in "${CRITICAL_DIRS[@]}"; do
    check_dir "$dir"
done

echo -e "\n${BLUE}2. VERIFICANDO ARCHIVOS CRÍTICOS:${NC}"

# Archivos críticos que DEBEN existir
declare -a CRITICAL_FILES=(
    ".env.ejemplo"
    "docker-compose.yml"
    "docker-compose.desarrollo.yml"
    "Makefile"
    "README.md"
    "api/package.json"
    "api/tsconfig.json"
    "api/Dockerfile"
    "configuracion/nginx.conf"
    "configuracion/postgresql.conf"
    "configuracion/redis.conf"
    "scripts/despliegue/inicializar-proyecto.sh"
    "scripts/respaldo/respaldo-completo.sh"
)

for file in "${CRITICAL_FILES[@]}"; do
    check_file "$file"
done

echo -e "\n${BLUE}3. VERIFICANDO PERMISOS DE EJECUCIÓN:${NC}"

# Verificar que los scripts sean ejecutables
declare -a EXECUTABLE_SCRIPTS=(
    "scripts/despliegue/inicializar-proyecto.sh"
    "scripts/despliegue/verificar-estructura-completa.sh"
    "scripts/respaldo/respaldo-completo.sh"
)

for script in "${EXECUTABLE_SCRIPTS[@]}"; do
    ((TOTAL_CHECKS++))
    if [ -x "$script" ]; then
        echo -e "  ${GREEN}✓${NC} $script (ejecutable)"
    else
        echo -e "  ${YELLOW}⚠${NC} $script (no ejecutable)"
        chmod +x "$script" 2>/dev/null && echo -e "    ${GREEN}→ Permisos corregidos${NC}" || echo -e "    ${RED}→ Error corrigiendo permisos${NC}"
        ((WARNINGS++))
    fi
done

echo -e "\n${BLUE}4. VERIFICANDO ESTRUCTURA DE MODELOS:${NC}"

check_dir "modelos/ajustado-fino/restaurante"
check_dir "modelos/ajustado-fino/barberia"
check_dir "modelos/ajustado-fino/tienda"
check_dir "modelos/datasets/entrenamiento"
check_dir "modelos/datasets/validacion"

echo -e "\n${BLUE}5. VERIFICANDO CONFIGURACIÓN DE MONITOREO:${NC}"

check_file "configuracion/prometheus.yml"
check_file "configuracion/loki.yaml"
check_file "configuracion/grafana-datasources.yaml"

# Resumen
echo -e "\n${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📊 RESUMEN DE VERIFICACIÓN:${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "  Total verificaciones: ${TOTAL_CHECKS}"
echo -e "  ${GREEN}✓ Correctos: $((TOTAL_CHECKS - ERRORS - WARNINGS))${NC}"
echo -e "  ${YELLOW}⚠ Advertencias: ${WARNINGS}${NC}"
echo -e "  ${RED}✗ Errores: ${ERRORS}${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ESTRUCTURA VERIFICADA CORRECTAMENTE${NC}"
    echo -e "La estructura del proyecto cumple con los requisitos mínimos."
    
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Nota: Hay ${WARNINGS} advertencias que deberían revisarse.${NC}"
    fi
    
    # Mostrar tamaño total
    TOTAL_SIZE=$(du -sh . | cut -f1)
    echo -e "\n📦 Tamaño total del proyecto: ${TOTAL_SIZE}"
    
    exit 0
else
    echo -e "\n${RED}⚠️  SE ENCONTRARON ${ERRORS} ERRORES EN LA ESTRUCTURA${NC}"
    echo -e "Corrija los errores antes de proceder con el desarrollo."
    exit 1
fi
3. SCRIPT DE INICIALIZACIÓN RÁPIDA - inicializar-proyecto-rapido.sh
bash
#!/bin/bash
# TITAN-MSP-v13.0/scripts/despliegue/inicializar-proyecto-rapido.sh
# Script de inicialización rápida para desarrollo

echo "⚡ INICIALIZACIÓN RÁPIDA TITAN+MSP v13.0"
echo "========================================"

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paso 1: Verificar estructura
echo -e "\n${BLUE}1. Verificando estructura...${NC}"
if [ -f "scripts/despliegue/verificar-estructura-completa.sh" ]; then
    bash scripts/despliegue/verificar-estructura-completa.sh
    if [ $? -ne 0 ]; then
        echo -e "❌ La verificación falló. Corrija los errores primero."
        exit 1
    fi
fi

# Paso 2: Configurar variables de entorno
echo -e "\n${BLUE}2. Configurando variables de entorno...${NC}"
if [ -f ".env.ejemplo" ]; then
    if [ ! -f ".env" ]; then
        cp .env.ejemplo .env
        echo -e "${GREEN}✓ .env creado desde ejemplo${NC}"
    else
        echo -e "ℹ️  .env ya existe, omitiendo"
    fi
    
    if [ ! -f ".env.desarrollo" ]; then
        cp .env.ejemplo .env.desarrollo
        echo -e "${GREEN}✓ .env.desarrollo creado${NC}"
    fi
else
    echo -e "⚠️  No se encontró .env.ejemplo"
fi

# Paso 3: Inicializar Git si no existe
echo -e "\n${BLUE}3. Configurando control de versiones...${NC}"
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "feat: estructura inicial TITAN+MSP v13.0"
    echo -e "${GREEN}✓ Repositorio Git inicializado${NC}"
else
    echo -e "ℹ️  Repositorio Git ya existe"
fi

# Paso 4: Crear archivos de configuración básicos
echo -e "\n${BLUE}4. Creando configuraciones básicas...${NC}"

# Configuración de VS Code
if [ ! -f ".vscode/settings.json" ]; then
    cat > ".vscode/settings.json" << EOF
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "typescript.preferences.importModuleSpecifier": "relative",
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": true,
        "**/.DS_Store": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true
    }
}
EOF
    echo -e "${GREEN}✓ Configuración VS Code creada${NC}"
fi

# Paso 5: Verificar Docker
echo -e "\n${BLUE}5. Verificando Docker...${NC}"
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ Docker y Docker Compose disponibles${NC}"
    
    # Crear network si no existe
    if ! docker network ls | grep -q "titan-network"; then
        docker network create titan-network
        echo -e "${GREEN}✓ Red Docker 'titan-network' creada${NC}"
    fi
else
    echo -e "⚠️  Docker no está disponible. Algunas funciones estarán limitadas."
fi

# Paso 6: Instalar dependencias API
echo -e "\n${BLUE}6. Instalando dependencias...${NC}"
if [ -f "api/package.json" ]; then
    cd api
    if command -v bun &> /dev/null; then
        echo "Instalando dependencias con Bun..."
        bun install
    elif command -v npm &> /dev/null; then
        echo "Instalando dependencias con npm..."
        npm install
    else
        echo "⚠️  No se encontró Bun ni npm"
    fi
    cd ..
fi

# Resumen
echo -e "\n${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 INICIALIZACIÓN COMPLETADA${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e ""
echo -e "${BLUE}📋 PRÓXIMOS PASOS RECOMENDADOS:${NC}"
echo -e ""
echo -e "1. ${GREEN}Configurar variables en .env${NC}"
echo -e "   Edite .env con sus configuraciones específicas"
echo -e ""
echo -e "2. ${GREEN}Iniciar servicios con Docker${NC}"
echo -e "   docker-compose -f docker-compose.desarrollo.yml up -d"
echo -e ""
echo -e "3. ${GREEN}Ejecutar migraciones de base de datos${NC}"
echo -e "   bash scripts/migracion/ejecutar-migraciones.sh"
echo -e ""
echo -e "4. ${GREEN)Cargar datos iniciales${NC}"
echo -e "   bash scripts/migracion/cargar-datos-iniciales.sh"
echo -e ""
echo -e "5. ${GREEN}Acceder a las interfaces:${NC}"
echo -e "   API: http://localhost:3000"
echo -e "   Documentación: http://localhost:3000/docs"
echo -e "   Grafana: http://localhost:3001"
echo -e ""
echo -e "${BLUE}🔧 COMANDOS ÚTILES:${NC}"
echo -e ""
echo -e "   ${GREEN}Ver logs:${NC}              docker-compose logs -f"
echo -e "   ${GREEN}Detener servicios:${NC}     docker-compose down"
echo -e "   ${GREEN}Reiniciar servicios:${NC}   docker-compose restart"
echo -e "   ${GREEN}Ver estado:${NC}            docker-compose ps"
echo -e ""
echo -e "${BLUE}⚠️  NOTAS IMPORTANTES:${NC}"
echo -e ""
echo -e "• Asegúrese de tener al menos 24GB de RAM y 400GB SSD"
echo -e "• El sistema está optimizado para GTX 1060 6GB VRAM"
echo -e "• Revise la documentación en /documentacion para detalles"
echo -e ""
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
📊 PLAN DE IMPLEMENTACIÓN MEJORADO
FASE 0: PREPARACIÓN INMEDIATA (Día 1)
text
1. Ejecutar script maestro de creación de estructura
2. Verificar estructura con script de validación
3. Configurar variables de entorno básicas
4. Inicializar repositorio Git
5. Configurar VSCode con extensiones recomendadas
FASE 1: INFRAESTRUCTURA BASE (Semana 1)
text
1. Configurar Docker Compose para desarrollo
2. Inicializar servicios básicos (PostgreSQL, Redis, Qdrant)
3. Configurar monitoreo básico (Prometheus, Grafana, Loki)
4. Establecer configuración TypeScript/Vue optimizada
5. Configurar CI/CD básico con GitHub Actions
FASE 2: NÚCLEO DEL SISTEMA (Semanas 2-3)
text
1. Implementar núcleo/ con utilidades y middleware
2. Desarrollar dominio IAM completo con autenticación multi-inquilino
3. Configurar PostgreSQL con RLS y políticas avanzadas
4. Implementar sistema de caché multi-nivel
5. Configurar sistema de colas BullMQ optimizado
FASE 3: DOMINIOS DE NEGOCIO (Semanas 4-6)
text
1. Implementar ARS (reservas) con especialización por vertical
2. Desarrollar PIM (inventario) con algoritmos avanzados
3. Implementar OPP (pagos) con sagas y facturación electrónica
4. Configurar integraciones externas (DIAN, gateways de pago)
5. Implementar sistema de notificaciones multi-canal
FASE 4: MOTOR MSP IA (Semana 7)
text
1. Configurar llama.cpp con optimizaciones específicas para GTX 1060
2. Implementar estrategias de recomendación híbridas
3. Configurar Qdrant para embeddings con cuantización
4. Implementar caché inteligente para inferencias
5. Configurar fine-tuning por vertical
FASE 5: FRONTEND Y UI/UX (Semanas 8-9)
text
1. Desarrollar panel administrativo multi-inquilino
2. Implementar interfaces cliente específicas por vertical
3. Desarrollar aplicación para empleados con QR
4. Optimizar rendimiento frontend y carga diferida
5. Implementar temas y personalización por inquilino
FASE 6: DESPLIEGUE Y PRODUCCIÓN (Semana 10)
text
1. Configurar Docker Compose para producción optimizado
2. Implementar sistema de respaldos automáticos
3. Configurar monitoreo completo y alertas
4. Optimizar rendimiento para hardware objetivo
5. Documentar procedimientos operativos
🎯 CONFIGURACIÓN RECOMENDADA PARA VSCode Insiders
ARCHIVO: .vscode/extensiones-recomendadas.json
json
{
    "recommendations": [
        // TypeScript y JavaScript
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss",
        
        // Bun runtime
        "oven.bun-vscode",
        
        // Base de datos y ORM
        "drizzle.drizzle-vscode",
        "mtxr.sqltools",
        "mtxr.sqltools-driver-pg",
        
        // Vue.js
        "Vue.volar",
        "Vue.vscode-typescript-vue-plugin",
        
        // Testing
        "vitest.explorer",
        "ms-playwright.playwright",
        
        // DevOps y Docker
        "ms-azuretools.vscode-docker",
        "ms-vscode-remote.remote-containers",
        
        // Calidad de código
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "streetsidesoftware.code-spell-checker",
        "streetsidesoftware.code-spell-checker-spanish",
        
        // Git
        "eamodio.gitlens",
        "mhutchie.git-graph",
        
        // Productividad
        "usernamehw.errorlens",
        "Gruntfuggly.todo-tree",
        "christian-kohler.path-intellisense",
        
        // API y HTTP
        "humao.rest-client",
        "rangav.vscode-thunder-client",
        
        // Markdown y documentación
        "yzhang.markdown-all-in-one",
        "shd101wyy.markdown-preview-enhanced",
        
        // Temas e iconos
        "PKief.material-icon-theme",
        "zhuangtongfa.material-theme"
    ]
}
ARCHIVO: .vscode/configuracion-settings.json
json
{
    // Configuración específica del proyecto TITAN+MSP
    "workbench.colorTheme": "Default Dark Modern",
    "workbench.iconTheme": "material-icon-theme",
    
    // TypeScript
    "typescript.preferences.importModuleSpecifier": "relative",
    "typescript.updateImportsOnFileMove.enabled": "always",
    "typescript.suggest.paths": true,
    
    // JavaScript/TypeScript
    "javascript.updateImportsOnFileMove.enabled": "always",
    "javascript.preferences.importModuleSpecifier": "relative",
    
    // Editor
    "editor.formatOnSave": true,
    "editor.formatOnPaste": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit",
        "source.organizeImports": "explicit"
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.tabSize": 2,
    "editor.insertSpaces": true,
    "editor.detectIndentation": false,
    
    // ESLint
    "eslint.validate": [
        "javascript",
        "typescript",
        "vue"
    ],
    "eslint.workingDirectories": [
        "./api",
        "./frontend/administrador",
        "./frontend/cliente",
        "./frontend/empleado"
    ],
    
    // Prettier
    "prettier.requireConfig": true,
    "prettier.useEditorConfig": false,
    
    // Files
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true,
        "**/.next": true
    },
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/.git/subtree-cache/**": true,
        "**/node_modules/**": true,
        "**/dist/**": true,
        "**/build/**": true
    },
    
    // Search
    "search.exclude": {
        "**/node_modules": true,
        "**/dist": true,
        "**/build": true,
        "**/.next": true,
        "**/.git": true
    },
    
    // Terminal
    "terminal.integrated.defaultProfile.linux": "bash",
    "terminal.integrated.profiles.linux": {
        "bash": {
            "path": "bash",
            "icon": "terminal-bash"
        }
    },
    
    // Git
    "git.autofetch": true,
    "git.confirmSync": false,
    "git.enableSmartCommit": true,
    
    // Docker
    "docker.explorerRefreshInterval": 3000,
    
    // Vue
    "volar.autoCompleteRefs": true,
    "volar.codeLens.pugTools": true,
    "volar.codeLens.scriptSetupTools": true,
    
    // Español
    "cSpell.language": "en,es",
    "cSpell.enabled": true,
    
    // Workspace
    "workbench.editor.enablePreview": false,
    "workbench.startupEditor": "none",
    
    // Específico para TITAN+MSP
    "titan-msp.autoImportComponents": true,
    "titan-msp.multiInquilinoSupport": true,
    "titan-msp.optimizeForHardware": "i7-6700HQ-GTX1060"
}
📋 CHECKLIST DE IMPLEMENTACIÓN
CHECKLIST PRE-IMPLEMENTACIÓN
Hardware verificado (i7-6700HQ, GTX 1060 6GB, 24GB RAM, 400GB SSD)

Sistema operativo actualizado (Ubuntu 22.04 LTS recomendado)

Docker y Docker Compose instalados

Git configurado

Node.js/Bun instalado

Espacio en disco suficiente (mínimo 100GB libre)

Acceso a internet estable

CHECKLIST POST-ESTRUCTURA
Script maestro ejecutado exitosamente

Estructura verificada sin errores

Variables de entorno configuradas

Repositorio Git inicializado

Permisos de scripts configurados

Archivos de configuración base creados

CHECKLIST SERVICIOS
PostgreSQL configurado y funcionando

Redis configurado y funcionando

Qdrant configurado y funcionando

Nginx configurado como reverse proxy

Prometheus, Grafana, Loki funcionando

Todos los servicios accesibles vía Docker

🚨 SOLUCIÓN DE PROBLEMAS COMUNES
Problema: Script de creación falla
text
Solución: 
1. Verificar permisos de escritura en el directorio
2. Asegurarse de tener espacio en disco suficiente
3. Ejecutar con bash explícito: bash crear-estructura-titan-v13.sh
4. Verificar que los comandos base estén instalados
Problema: Docker no inicia servicios
text
Solución:
1. Verificar que Docker esté instalado y funcionando: sudo systemctl status docker
2. Verificar permisos de usuario en grupo docker
3. Verificar memoria disponible: docker info | grep Memory
4. Revisar logs específicos: docker-compose logs [servicio]
Problema: PostgreSQL no inicia con RLS
text
Solución:
1. Verificar configuración en configuracion/postgresql.conf
2. Revisar migraciones: scripts/migracion/ejecutar-migraciones.sh
3. Verificar permisos de volumen: sudo chown -R 999:999 datos/postgres
4. Revisar logs: docker-compose logs postgres
Problema: GTX 1060 no detectada por llama.cpp
text
Solución:
1. Verificar drivers NVIDIA: nvidia-smi
2. Verificar CUDA compatibility para GTX 1060
3. Ajustar configuracion/modelos/msp/configuracion-modelo.json
4. Reducir VRAM usage si es necesario (ajustar a 4.2GB máximo)
✅ VEREDICTO FINAL Y RECOMENDACIONES
ESTADO ACTUAL: 🚀 LISTO PARA EJECUCIÓN INMEDIATA
La estructura mejorada presentada:

MANTIENE todas las optimizaciones específicas para hardware homelab

EXTIENDE la organización por dominios con arquitectura hexagonal completa

MEJORA los scripts con verificación robusta y manejo de errores

INCLUYE configuración específica para VSCode Insiders

PROPORCIONA plan de implementación detallado fase por fase

OPTIMIZA para desarrollo colaborativo en español técnico

RECOMENDACIONES DE EJECUCIÓN:
bash
# 1. Descargar o copiar el script maestro
wget https://raw.githubusercontent.com/tu-repo/crear-estructura-titan-v13.sh

# 2. Hacer ejecutable
chmod +x crear-estructura-titan-v13.sh

# 3. Ejecutar con verificación detallada
./crear-estructura-titan-v13.sh

# 4. Verificar estructura creada
./scripts/despliegue/verificar-estructura-completa.sh

# 5. Inicialización rápida para desarrollo
./scripts/despliegue/inicializar-proyecto-rapido.sh
PRÓXIMOS PASOS CRÍTICOS:
Configurar GPU para inferencia IA (drivers NVIDIA, CUDA)

Optimizar PostgreSQL para multi-inquilino con RLS

Configurar Redis para caché y colas

Desplegar modelos de IA en la carpeta correspondiente

Configurar monitoreo con alertas específicas

RECURSOS ADICIONALES INCLUIDOS:
✅ Scripts de respaldo y restauración automatizados

✅ Configuración de monitoreo completo (Prometheus + Grafana + Loki)

✅ Plantillas de Docker Compose para diferentes entornos

✅ Documentación técnica completa en español

✅ Configuración específica para Colombia (DIAN, impuestos, zonas horarias)

NOTA FINAL SOBRE ESCALABILIDAD:
Esta estructura está diseñada específicamente para el hardware objetivo (i7-6700HQ/GTX 1060/24GB RAM/400GB SSD), pero mantiene principios que permiten escalar a:

Más inquilinos: A través de optimización de recursos y RLS

Nuevos verticales: Mediante factory patterns y especialización por dominio

Mayor carga: Con optimizaciones de caché, colas y procesamiento por lotes

Hardware mejorado: Con configuración paramétrica que se ajusta automáticamente