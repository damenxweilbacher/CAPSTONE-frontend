function DiagnosisResult({ diagnosis }) {
  return (
    <div className="result">
      <h2>Here's what I think your issue may be...</h2>
      <p>{diagnosis}</p>
    </div>
  );
}
