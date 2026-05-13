export type ErrorType = 'js' | 'promise' | 'fetch' | 'console';

export interface ErrorEntry {
  id: string;
  type: ErrorType;
  message: string;
  source?: string;
  line?: number;
  col?: number;
  stack?: string;
  ts: string;
}

type Listener = () => void;

class ErrorMonitor {
  private errors: ErrorEntry[] = [];
  private listeners = new Set<Listener>();
  private installed = false;

  install() {
    if (this.installed || typeof window === 'undefined') return;
    this.installed = true;

    window.addEventListener('error', (e) => {
      this.push({
        type: 'js',
        message: e.message || 'Erreur JavaScript inconnue',
        source: e.filename,
        line: e.lineno,
        col: e.colno,
        stack: e.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      const msg =
        e.reason instanceof Error
          ? e.reason.message
          : String(e.reason ?? 'Promesse rejetée sans détail');
      this.push({ type: 'promise', message: msg, stack: e.reason?.stack });
    });

    const origConsoleError = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      origConsoleError(...args);
      const message = args
        .map((a) =>
          a instanceof Error
            ? a.message
            : typeof a === 'object'
            ? JSON.stringify(a)
            : String(a)
        )
        .join(' ');
      this.push({ type: 'console', message });
    };

    const origFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>): Promise<Response> => {
      const url =
        typeof args[0] === 'string'
          ? args[0]
          : args[0] instanceof URL
          ? args[0].href
          : args[0] instanceof Request
          ? args[0].url
          : String(args[0]);
      try {
        const res = await origFetch(...args);
        if (!res.ok) {
          this.push({
            type: 'fetch',
            message: `HTTP ${res.status} — ${res.statusText}`,
            source: url,
          });
        }
        return res;
      } catch (err) {
        this.push({
          type: 'fetch',
          message: `Réseau : ${err instanceof Error ? err.message : String(err)}`,
          source: url,
        });
        throw err;
      }
    };
  }

  private push(data: Omit<ErrorEntry, 'id' | 'ts'>) {
    const entry: ErrorEntry = {
      ...data,
      id: crypto.randomUUID(),
      ts: new Date().toISOString(),
    };
    this.errors = [entry, ...this.errors].slice(0, 60);
    this.listeners.forEach((fn) => fn());
  }

  getAll(): ErrorEntry[] {
    return this.errors;
  }

  clear() {
    this.errors = [];
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const errorMonitor = new ErrorMonitor();
