const getDistance = (vec1, vec2) => {
    let sumSq = 0;
    for (let i = 0; i < vec1.length; i++) {
        sumSq += (vec1[i] - vec2[i]) ** 2;
    }
    return Math.sqrt(sumSq);
};

const PredictPanel = () => {
    const { somManager, setPredictedResult } = React.useContext(AppContext);
    const [inputValues, setInputValues] = React.useState([]);

    React.useEffect(() => {
        if (somManager) {
            setInputValues(Array(somManager.inputDim).fill(0));
        }
    }, [somManager]);

    const handleInputChange = (index, e) => {
        const value = e.target.value;
        const newValues = [...inputValues];
        newValues[index] = parseInt(value, 10) === 1 ? 1 : 0;
        setInputValues(newValues);
    };

    const handleRandomWeights = () => {
        if (!somManager) {
            Modal.warn({ title: "SOM Not Initialized", content: "Please train the SOM first before generating random inputs." });
            return;
        }
        const randomValues = Array.from({ length: somManager.inputDim }, () => (Math.random()));
        setInputValues(randomValues);
    };

    const handlePredict = () => {
        if (!somManager) {
            Modal.warn({ title: "SOM Not Initialized", content: "Please train the SOM first before making predictions." });
            return;
        }

        const userInputVector = inputValues;
        const bmuForUserInput = somManager.findBMU(userInputVector);

        let closestEntityName = "Unknown";
        let closestEntityColor = "lightgray";
        let minBMUDistance = Infinity;

        for (let i = 0; i < somManager.trainingData.length; i++) {
            const trainingDataItem = TRAINING_DATA[i];
            const dist = getDistance(bmuForUserInput.weights, trainingDataItem);
            if (dist < minBMUDistance) {
                minBMUDistance = dist;
                closestEntityName = ENTITIES[i].name;
                closestEntityColor = `rgb(${weightsToColors(TRAINING_DATA[i]).join(',')})`;
            }
        }
        setPredictedResult({ name: closestEntityName, color: closestEntityColor });
    };

    return (
        <div>
            <h3>Predict</h3>
            {!somManager ? (
                <p>Train SOM to enable prediction inputs.</p>
            ) : (
                <>
                    {Array.from({ length: somManager.inputDim }).map((_, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <span style={{ marginRight: '5px', width: '20px' }}>F{index + 1}:</span>
                            <Input
                                type="number"
                                min={0}
                                max={1}
                                step={1}
                                value={inputValues[index]}
                                onChange={(e) => handleInputChange(index, e)}
                                style={{ width: '60px' }}
                            />
                        </div>
                    ))}
                    <Button type="default" onClick={handleRandomWeights} style={{ marginTop: '10px', marginRight: '10px' }}>
                        Random Inputs
                    </Button>
                    <Button type="primary" onClick={handlePredict} style={{ marginTop: '10px' }}>
                        Predict
                    </Button>
                </>
            )}
        </div>
    );
};