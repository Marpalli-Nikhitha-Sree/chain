const analyzeAnomalies = ({ batch, transfers, conditions }) => {
  const anomalies = [];

  if (!batch?.exists) {
    anomalies.push("Batch not found on-chain.");
    return anomalies;
  }

  const transferTimestamps = transfers.map((t) => Number(t.timestamp || 0));
  for (let i = 1; i < transferTimestamps.length; i += 1) {
    if (transferTimestamps[i] < transferTimestamps[i - 1]) {
      anomalies.push("Inconsistent transfer timestamps detected.");
      break;
    }
  }

  if (transfers.length > 3) {
    anomalies.push("Transfer count exceeds expected flow (manufacturer → distributor → retailer → consumer)." );
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

  if (batch.expectedRoute?.length) {
    const expectedRoute = batch.expectedRoute.map((addr) => addr.toLowerCase());
    const visitedRoute = transfers.map((t) => String(t.to).toLowerCase());
    for (const stop of visitedRoute) {
      if (!expectedRoute.includes(stop)) {
        anomalies.push("Route deviation detected.");
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
