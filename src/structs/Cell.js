function Cell({ value, empty, skipped, read }) {
    if (value === '\n') {
        value = '\\n';
    }

    if (!value || empty) {
        value = ' ';
    }

    function getBackgroundColor() {
        if (skipped) {
            return '#F7AEF8';
        }

        if (read) {
            return '#8093F1';
        }

        if (empty) {
            return '#4D5061';
        }

        return '#677DB7';
    }

    return (
        <div className="col">
            <div className="cell" style={{ backgroundColor: getBackgroundColor() }}>
                {value}
            </div>
        </div>
    );
}

export default Cell;