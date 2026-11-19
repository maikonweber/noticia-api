"use client";

import { useEffect, useState } from "react";
import {
  fetchManagedOfferGroups,
  fetchWhatsAppPeerGroups,
  fetchWhatsAppSession,
  publishOfferGroupsNow,
  registerOfferGroup,
  startWhatsAppSession,
  stopWhatsAppSession,
} from "@/lib/api/client";
import type {
  OfferGroup,
  WhatsAppPeerGroup,
  WhatsAppSession,
} from "@/lib/api/types";

const TOKEN_KEY = "notice-runner-token";

export function WhatsAppOfferAdmin() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [peers, setPeers] = useState<WhatsAppPeerGroup[]>([]);
  const [managed, setManaged] = useState<OfferGroup[]>([]);
  const [lastPublish, setLastPublish] = useState<string | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(TOKEN_KEY) || "";
    setToken(stored);
  }, []);

  const persistToken = (value: string) => {
    setToken(value);
    window.localStorage.setItem(TOKEN_KEY, value);
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha na API");
    } finally {
      setBusy(false);
    }
  };

  const refresh = () =>
    run(async () => {
      const next = await fetchWhatsAppSession(token);
      setSession(next);
      if (next.status === "connected") {
        const [wa, groups] = await Promise.all([
          fetchWhatsAppPeerGroups(token),
          fetchManagedOfferGroups(token),
        ]);
        setPeers(wa.items);
        setManaged(groups.items);
      }
    });

  return (
    <section className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          WhatsApp · Grupos de Ofertas
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Conecte o número com QR (Baileys, igual ao BarberSync). Depois
          escolha os grupos que recebem o ranking Shopee.
        </p>
      </div>

      <label className="block text-sm font-medium">
        Runner token
        <input
          type="password"
          value={token}
          onChange={(e) => persistToken(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="X-Runner-Token"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !token}
          onClick={() => run(async () => setSession(await startWhatsAppSession(token)))}
          className="rounded-xl bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-fg)] disabled:opacity-50"
        >
          Gerar / renovar QR
        </button>
        <button
          type="button"
          disabled={busy || !token}
          onClick={refresh}
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50"
        >
          Atualizar status
        </button>
        <button
          type="button"
          disabled={busy || !token}
          onClick={() =>
            run(async () => {
              await stopWhatsAppSession(token);
              setSession(null);
              setPeers([]);
            })
          }
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50"
        >
          Desconectar
        </button>
        <button
          type="button"
          disabled={busy || !token}
          onClick={() =>
            run(async () => {
              const result = (await publishOfferGroupsNow(token)) as {
                enqueued?: number;
                processed?: number;
              };
              setLastPublish(
                `Fila ${result.enqueued ?? 0} · enviados ${result.processed ?? 0}`,
              );
            })
          }
          className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm disabled:opacity-50"
        >
          Publicar ranking agora
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {lastPublish && (
        <p className="text-sm text-[var(--muted)]">{lastPublish}</p>
      )}

      {session && (
        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          {session.qrcode && session.status !== "connected" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.qrcode}
              alt="QR Code WhatsApp"
              className="h-48 w-48 rounded-xl border border-[var(--border)] bg-white"
            />
          )}
          <div className="text-sm">
            <p>
              Status: <strong>{session.status}</strong>
            </p>
            {session.phone && <p>Número: {session.phone}</p>}
            <p className="mt-2 text-[var(--muted)]">
              Abra o WhatsApp → Aparelhos conectados → Conectar com QR.
            </p>
          </div>
        </div>
      )}

      {peers.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Grupos neste WhatsApp</h3>
          <ul className="space-y-2">
            {peers.map((group) => (
              <li
                key={group.jid}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2 text-sm"
              >
                <span>
                  {group.name}{" "}
                  <span className="text-[var(--muted)]">({group.size})</span>
                </span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(async () => {
                      await registerOfferGroup(token, {
                        jid: group.jid,
                        name: group.name,
                      });
                      const groups = await fetchManagedOfferGroups(token);
                      setManaged(groups.items);
                    })
                  }
                  className="shrink-0 rounded-lg bg-[var(--elevated)] px-2 py-1 text-xs font-medium"
                >
                  Usar como Grupo de Ofertas
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {managed.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Grupos publicados no site</h3>
          <ul className="space-y-1 text-sm text-[var(--muted)]">
            {managed.map((group) => (
              <li key={group.id}>
                {group.name}
                {group.inviteLink ? " · convite ativo" : " · sem convite"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
