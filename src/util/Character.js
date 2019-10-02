const character = {
    isWhiteSpace(value) {
        return value === ' ' || value === '\n';
    },
    isLineTerminator(value) {
        return value === '\n';
    }
};

export default character;