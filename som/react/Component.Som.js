const SOM = () =>
{
    const { setError, setCurrentEpoch, setSomManager, animateCircle, somManager } = React.useContext(AppContext);

    const canvasRef = useRef();
    const somManagerRef = useRef(null);
    const somDrawingRef = useRef(null);

    const [isUMatrixMode, setIsUMatrixMode] = useState(false);

    useEffect(() => {
        if (somManager) {
            somManagerRef.current = somManager;
            somDrawingRef.current = somDrawingTemplate.init(canvasRef.current, somManager.GRID_SIZE);
            if (!isUMatrixMode) {
                somDrawingRef.current.drawWeights(somManager.nodes);
            } else {
                somDrawingRef.current.drawUMatrix(somManager.nodes);
            }
        }
    }, [somManager, isUMatrixMode]);


    const handleInitClick = () => {
        somManagerRef.current = somManagerTemplate.init(20, ENTITIES, TRAINING_DATA);
        somDrawingRef.current = somDrawingTemplate.init(canvasRef.current, somManagerRef.current.GRID_SIZE);
        setSomManager(somManagerRef.current);
        setError(0);
        setCurrentEpoch(0);
        setIsUMatrixMode(false); // Switch back to weights when training
        trainSOM();
    };

    const trainSOM = () => {
        if (!somManagerRef.current || somManagerRef.current.currentEpoch >= somManagerRef.current.totalEpochs) {
            return;
        }

        const currentInputIndex = Math.floor( somManagerRef.current.trainingData.length * Math.random() );
        const currentInput = somManagerRef.current.trainingData[currentInputIndex];

        if (animateCircle) {
            animateCircle("infoReality", "somNode", 1000, `rgb(${weightsToColors(currentInput).join(',')})`);
        }

        somManagerRef.current.trainEpoch();
        somDrawingRef.current.drawWeights( somManagerRef.current.nodes );
        const error = somManagerRef.current.calculateError().toFixed(4);
        setError(error);
        setCurrentEpoch(somManagerRef.current.currentEpoch);
        setTimeout( trainSOM, 16 );
    };

    const handleShowUMatrix = () => {
        if (!somManagerRef.current) {
            Modal.warn({ title: "SOM Not Initialized", content: "Please train the SOM first to view the U-Matrix." });
            return;
        }
        setIsUMatrixMode(true);
        somDrawingRef.current.drawUMatrix(somManagerRef.current.nodes);
    };

    const txtInfoBlankSlate = "This concept, similar to John Locke's \"blank slate,\" describes the Self-Organizing Map's <strong>initial state</strong> before any training. The SOM's nodes begin with <strong>random weights</strong> and gradually learn to represent the input data through an <strong>unsupervised learning process</strong>.";

    return <table>
        <thead>
        <tr>
            <th>
                SOM
                <SomInfo modalTitle="What is a Blank Slate?" modalContent={txtInfoBlankSlate} />
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>
                <canvas
                    ref={canvasRef}
                    style={{border:"1px solid black"}}
                    width="200" height="200">
                </canvas>
            </td>
        </tr>
        <tr>
            <td>
                <Button onClick={handleInitClick}>
                    Train
                </Button>
                <Button onClick={handleShowUMatrix} style={{ marginLeft: '10px' }}>
                    Show U-Matrix
                </Button>
            </td>
        </tr>
        </tbody>
    </table>;
}