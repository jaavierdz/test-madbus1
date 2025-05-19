import { useState } from 'react';

export default function Home() {
  const [stopId, setStopId] = useState('608');
  const [line, setLine] = useState('');
  const [data, setData] = useState(null);
  const [rawRequest, setRawRequest] = useState('');
  const [rawResponse, setRawResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchArrivals() {
    setLoading(true);
    setError(null);
    setData(null);
    setRawResponse('');
    try {
      let url = `/api/arrivals?stopId=${stopId}`;
      if (line.trim() !== '') {
        url += `&line=${line.trim()}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        setError(json.error || 'Error desconocido');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  // Caja de texto para request manual
  async function handleRawRequest() {
    setLoading(true);
    setError(null);
    setRawResponse('');
    try {
      // Evaluar la request manual como JSON con stopId y opcional line
      const req = JSON.parse(rawRequest);
      if (!req.stopId) throw new Error('Falta stopId en la request manual');

      let url = `/api/arrivals?stopId=${req.stopId}`;
      if (req.line) {
        url += `&line=${req.line}`;
      }

      const res = await fetch(url);
      const text = await res.text(); // Raw text
      if (res.ok) {
        setRawResponse(text);
      } else {
        setError(text || 'Error desconocido en request manual');
      }
    } catch (e) {
      setError('Request manual inválida: ' + e.message);
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 900, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>EMT Madrid - Tiempos de llegada</h1>

      <label>
        Parada (stopId):{' '}
        <input value={stopId} onChange={e => setStopId(e.target.value)} />
      </label>{' '}
      <label>
        Línea (opcional):{' '}
        <input value={line} onChange={e => setLine(e.target.value)} />
      </label>{' '}
      <button onClick={fetchArrivals} disabled={loading}>
        Consultar
      </button>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {data && (
        <section style={{ marginTop: 20 }}>
          <h2>Parada: {stopId}</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: 10, borderRadius: 6 }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </section>
      )}

      <section style={{ marginTop: 40 }}>
        <h2>Request manual (JSON)</h2>
        <textarea
          rows={6}
          cols={60}
          value={rawRequest}
          onChange={e => setRawRequest(e.target.value)}
          placeholder='Ejemplo: {"stopId":608,"line":27}'
          style={{ fontFamily: 'monospace', fontSize: 14 }}
        />
        <br />
        <button onClick={handleRawRequest} disabled={loading}>
          Enviar request manual
        </button>

        {rawResponse && (
          <pre style={{ whiteSpace: 'pre-wrap', background: '#e8e8e8', padding: 10, borderRadius: 6, marginTop: 10 }}>
            {rawResponse}
          </pre>
        )}
      </section>
    </main>
  );
}