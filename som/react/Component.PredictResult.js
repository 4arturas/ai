const PredictResult = () => {
    const { predictedResult } = React.useContext(AppContext);

    return (
        <div>
            <h3>Prediction Result</h3>
            {predictedResult ? (
                <div>
                    <p>Predicted Entity:</p>
                    <Button style={{ height: "30px", backgroundColor: predictedResult.color, color: 'white' }}>
                        {predictedResult.name}
                    </Button>
                </div>
            ) : (
                <p>No prediction yet.</p>
            )}
        </div>
    );
};