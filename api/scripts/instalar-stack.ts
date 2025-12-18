#!/usr/bin/env ts-node
import { exec as _exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const exec = promisify(_exec)

async function checkCmd(cmd: string) {
  try {
    const { stdout } = await exec(cmd)
    return stdout.trim()
  } catch (_e) {
    return null
  }
}

async function escribirCompose(raiz: string) {
  const contenido = `version: '3.8'
services:
  postgres:
    image: postgres:15.6
    environment:
      POSTGRES_USER: titan
      POSTGRES_DB: titan
      POSTGRES_PASSWORD: titan_pass
    ports:
      - "5433:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backup/postgres:/var/backups/postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U titan -d titan || exit 1"]
    restart: unless-stopped

  redis:
    image: redis:7.2.4
    command: ["redis-server", "--save", "900 1", "--appendonly", "yes"]
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  qdrant:
    image: qdrant/qdrant:1.9.0
    environment:
      QDRANT__storage__path: /qdrant/storage
    ports:
      - "6333:6333"
    volumes:
      - qdrant-data:/qdrant/storage
      - qdrant-dump:/qdrant/dump
    restart: unless-stopped

  dragonfly:
    # usar latest como fallback para evitar tags no disponibles en Docker Hub
    image: dragonflydb/dragonfly:latest
    ports:
      - "7379:7379"
    command: ["--maxmemory=2GB","--proactor_threads=4"]
    healthcheck:
      test: ["CMD-SHELL", "dragonfly --version || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    volumes:
      - dragonfly-data:/data
    restart: unless-stopped

  traefik:
    image: traefik:v3.0
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./config/traefik/traefik.yml:/etc/traefik/traefik.yml:ro
    restart: unless-stopped

  victoria-metrics:
    image: victoriametrics/victoria-metrics:latest
    ports:
      - "8428:8428"
    volumes:
      - victoria-data:/victoria
    restart: unless-stopped

  loki:
    image: grafana/loki:2.8.2
    ports:
      - "3100:3100"
    volumes:
      - loki-data:/loki
      - ./monitoring/loki-config.yaml:/etc/loki/local-config.yaml:ro
    command: -config.file=/etc/loki/local-config.yaml
    restart: unless-stopped

  minio:
    image: minio/minio:RELEASE.2024-10-15
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - "9000:9000"
    command: server /data --console-address ":9001"
    volumes:
      - minio-data:/data
    restart: unless-stopped

  nats:
    image: nats:2.11
    ports:
      - "4222:4222"
      - "8222:8222"
    restart: unless-stopped

  inference:
    # Placeholder service for local inference (llamafile/vLLM). Replace image with preferred inference image.
    image: ghcr.io/llamafile/llamafile:latest
    environment:
      - LLAMAFILE_GPU=0
    ports:
      - "8000:8000"
    volumes:
      - ./models:/models
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - prometheus-data:/prometheus
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.0.0
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    restart: unless-stopped

volumes:
  postgres-data:
  redis-data:
  dragonfly-data:
  qdrant-data:
  qdrant-dump:
  prometheus-data:
  grafana-data:
  victoria-data:
  loki-data:
  minio-data:
`
  const ruta = path.join(raiz, 'docker-compose.titan.yml')
  try {
    // pre-validación del nombre del archivo
    const { validarPreCreacion } = await import('../src/nucleo/hooks/validacion-precreacion')
    const pre = await validarPreCreacion('docker-compose.titan.yml', 'otro')
    console.log('Pre-validacion docker-compose:', pre)
  } catch (_e) {
    // no bloquear escritura por errores de validación
  }

  await fs.promises.writeFile(ruta, contenido, 'utf8')
  return ruta
}

async function main() {
  const argv = process.argv.slice(2)
  const raiz = argv[0] ? path.resolve(argv[0]) : process.cwd()
  const autoBun = argv.includes('--auto-bun-install') || argv.includes('-a')
  const writeCompose = argv.includes('--with-docker-compose') || argv.includes('-d')
  const startServices = argv.includes('--start') || argv.includes('-s')
  const dryRun = argv.includes('--dry-run') || argv.includes('-n')

  console.log('Instalador del stack TITAN - usando Bun (si está disponible)')

  const bunVersion = await checkCmd('bun --version')
  if (!bunVersion) {
    console.warn('Bun no está instalado en este sistema.')
    if (autoBun) {
      console.log('Instalación automática de Bun solicitada. Ejecutando script oficial...')
      if (!dryRun) {
        try {
          await exec('curl -fsSL https://bun.sh/install | bash')
          console.log('Instalación de Bun completada (reinicia la shell si es necesario).')
        } catch (e) {
          console.error('Fallo instalando Bun automáticamente:', e)
          process.exit(1)
        }
      } else {
        console.log('[dry-run] se habría ejecutado: curl -fsSL https://bun.sh/install | bash')
      }
    } else {
      console.log('Para instalar Bun manualmente: https://bun.sh/')
    }
  } else {
    console.log('Bun detectado:', bunVersion)
  }

  // Instalar dependencias JS con Bun
  if (!dryRun) {
    try {
      console.log('Instalando dependencias con Bun (bun install)...')
      await exec('bun install', { cwd: raiz })
      console.log('Dependencias instaladas con bun.')
    } catch (e) {
      console.error('Error ejecutando bun install:', e)
    }
  } else {
    console.log('[dry-run] bun install')
  }

  if (writeCompose) {
    const ruta = await escribirCompose(raiz)
    console.log('Archivo docker-compose generado en:', ruta)
  }

  if (startServices) {
    const docker = await checkCmd('docker --version')
    if (!docker) {
      console.error('Docker no parece instalado. No se pueden arrancar los servicios de infraestructura.')
      process.exit(1)
    }
    if (dryRun) {
      console.log('[dry-run] docker compose -f docker-compose.titan.yml up -d')
    } else {
      try {
        console.log('Arrancando servicios con docker compose -f docker-compose.titan.yml up -d')
        await exec('docker compose -f docker-compose.titan.yml up -d', { cwd: raiz })
        console.log('Servicios arrancados.')
      } catch (e) {
        console.error('Fallo arrancando servicios Docker:', e)
      }
    }
  }

  // Ejecutar revisión de idioma para validar integridad de español
  if (!dryRun) {
    try {
      console.log('Ejecutando revisión de idioma del repo (revisar-todo)...')
      await exec('node -r ts-node/register ./scripts/revisar-todo.ts .', { cwd: raiz })
      console.log('Revisión de idioma finalizada.')
    } catch (e) {
      console.error('Fallo ejecutando revisión de idioma:', e)
    }
  } else {
    console.log('[dry-run] se habría ejecutado: node -r ts-node/register ./scripts/revisar-todo.ts .')
  }

  console.log('Instalación completada. Revise los pasos y confirme acciones a aplicar.')
}

main().catch(e => { console.error('Error en instalar-stack:', e); process.exit(1) })
