const character = {
    isWhitespace(value) {
        return value === ' ' || value === '\n';
    },
    isLineTerminator(value) {
        return value === '\n';
    }
};

export default character;