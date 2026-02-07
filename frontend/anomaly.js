const analyzeAnomalies = ({ batch, transfers, conditions, batchIds }) => {
  const anomalies = [];

  if (!batch?.exists) {
    anomalies.push("Batch not found on-chain.");
    return anomalies;
  }

  const transferTimestamps = transfers.map((t) => Number(t.timestamp || 0));
  const createdAt = Number(batch.createdAt || 0);
  const timeline = [createdAt, ...transferTimestamps].filter((t) => t > 0);
  for (let i = 1; i < timeline.length; i += 1) {
    if (timeline[i] < timeline[i - 1]) {
      anomalies.push("Timeline goes backwards (timestamp order violated).");
      break;
    }
  }

  if (transfers.length > 3) {
    anomalies.push("Transfer count exceeds expected flow (manufacturer → distributor → retailer → consumer).");
  }

  if (transfers.length >= 1 && transfers[0].from?.toLowerCase() !== batch.manufacturer?.toLowerCase()) {
    anomalies.push("First transfer not initiated by the manufacturer.");
  }


  const transferFingerprints = new Set();
  for (const transfer of transfers) {
    const fingerprint = `${transfer.from}-${transfer.to}-${transfer.timestamp}-${transfer.location}`;
    if (transferFingerprints.has(fingerprint)) {
      anomalies.push("Duplicate transfer record detected.");
      break;
    }
    transferFingerprints.add(fingerprint);
  }

  if (Array.isArray(batchIds)) {
    const matches = batchIds.filter((id) => id === batch.batchId).length;
    if (matches > 1) {
      anomalies.push("Duplicate batch ID detected (possible fake product).");
    }
  }

  if (batch.expectedRoute?.length) {
    const expectedRoute = batch.expectedRoute.map((addr) => addr.toLowerCase());
    const visitedRoute = transfers.map((t) => String(t.to).toLowerCase());

    if (visitedRoute.length > expectedRoute.length) {
      anomalies.push("Route deviation detected (extra hops).");
    }

    for (let i = 0; i < visitedRoute.length; i += 1) {
      if (expectedRoute[i] && visitedRoute[i] !== expectedRoute[i]) {
        anomalies.push("Route deviation detected (stage order mismatch).");
        break;
      }
    }
  }

  for (const condition of conditions) {
    const observedAt = Number(condition.observedAt || 0);
    const recordedAt = Number(condition.recordedAt || 0);
    if (observedAt > recordedAt) {
      anomalies.push("Condition timestamp is in the future relative to recording.");
      break;
    }
  }

  return anomalies;
};
