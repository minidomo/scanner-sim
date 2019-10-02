const time = {
    async pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

export default time;