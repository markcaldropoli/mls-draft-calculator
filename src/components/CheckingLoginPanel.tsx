const CheckingLoginPanel: React.FC = () => {
    return (
        <div className="App d-flex align-items-center justify-content-center min-vh-100">
            <div className="card shadow-sm text-center" style={{ maxWidth: 420, width: '100%' }}>
                <div className="card-body">
                    <div className="spinner-border text-primary mb-3" role="status" aria-hidden="true"></div>
                    <h5 className="card-title" style={{ color: "#1f2d4f" }}>Checking login…</h5>
                    <p className="text-muted mb-0">Connecting to Kickbase</p>
                </div>
            </div>
        </div>
    );
};

export default CheckingLoginPanel;