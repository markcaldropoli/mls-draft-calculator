const LoadingPlayersPanel: React.FC = () => {
    return (
        <div className="App d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#1f2e4f' }}>
            <div
                className="card text-center shadow-sm"
                style={{
                    maxWidth: 540,
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)'
                }}
            >
                <div className="card-body text-white">
                    <div
                        className="spinner-border text-white mb-3"
                        role="status"
                        aria-hidden="true"
                        style={{ width: '3.5rem', height: '3.5rem' }}
                    />
                    <h5 className="card-title mb-1" style={{ fontWeight: 600, color: '#fff' }}>Loading players…</h5>
                    <p className="card-text text-white-50 small mb-0">Fetching player data from Kickbase</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingPlayersPanel;