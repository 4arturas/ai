const MyReactComponent = () => {
    const [count, setCount] = useState(0);
    return (
        <div className="text-center">
            <p className="text-white text-lg font-bold">Count: {count}</p>
            <Button type="primary" onClick={() => setCount(count + 1)}>Increment</Button>
        </div>
    );
};