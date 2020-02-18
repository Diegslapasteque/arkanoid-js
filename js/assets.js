const ASSETS = {
    player: {
        sX: 0,
        sY: 8,
        sWidth: 42,
        sHeight: 9,
    },
    playerBig: {
        sX: 42,
        sY: 8,
        sWidth: 56,
        sHeight: 9,
    },
    playerSmall: {
        sX: 98,
        sY: 8,
        sWidth: 33,
        sHeight: 9,
    },
    brick: { // To change the armor, you have to change sX like this : sX = sWidth * (ARMOR-1)
        sX: 0,
        sY: 0,
        sWidth: 16,
        sHeight: 8,
    },
    ball: {
        sX: 131,
        sY: 8,
        sWidth: 6,
        sHeight: 6,
    },
    missile: {
        sX: 137,
        sY: 8,
        sWidth: 5,
        sHeight: 9,
    },
    canon: {
        sX: 142,
        sY: 8,
        sWidth: 6,
        sHeight: 8,
    },
    background: {
        sX: 0,
        sY: 28,
        sWidth: 391,
        sHeight: 393,
    },

    // POWERUPS
    increasePlayerWidth: {
        sX: 84,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    tripleBalls: {
        sX: 0,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    increasePlayerSpeed: {
        sX: 147,
        sY: 17,
        sWidth: 17,
        sHeight: 11
    },
    playerShoot: {
        sX: 21,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    decreasePlayerWidth: {
        sX: 105,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    reverseControls: {
        sX: 63,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    decreasePlayerSpeed: {
        sX: 42,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    increaseBallSpeed: {
        sX: 126,
        sY: 17,
        sWidth: 21,
        sHeight: 11
    },
    bomb: {
        src: [
            {
                sX: 164,
                sY: 12,
                sWidth: 16,
                sHeight: 16
            },
            {
                sX: 180,
                sY: 12,
                sWidth: 16,
                sHeight: 16
            },
            {
                sX: 196,
                sY: 12,
                sWidth: 16,
                sHeight: 16
            },
            {
                sX: 212,
                sY: 12,
                sWidth: 16,
                sHeight: 16
            },
        ],
        frameSpeed: 0.25
    }
};
