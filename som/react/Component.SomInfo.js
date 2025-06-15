const SomInfo = ({ modalTitle, modalContent }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Button
                type="text"
                icon={<span role="img" aria-label="info">ℹ️</span>}
                onClick={showModal}
            />
            <Modal
                title={modalTitle}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Close
                    </Button>
                ]}
            >
                <div dangerouslySetInnerHTML={{ __html: modalContent }} />
            </Modal>
        </>
    );
};