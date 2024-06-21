// src/config/GameConfig.js

export const GameConfig = {
    // General
    PLAY_AREA_WIDTH: 800,
    PLAY_AREA_HEIGHT: 600,
    GROUND_LEVEL: 550,
    SKY_LEVEL: 50,

    // Emojis
    EMOJIS: {
        BUSH: '🌺',
        TREE: '🌳',
        BUTTERFLY: '🦋',
        BIRD: '🐦',
        WORM: '🐛',
        NEST: '🥚'
    },

    // Butterfly
    BUTTERFLY_FLIGHT_SPEED: 30, // Slower for more natural movement
    BUTTERFLY_FLUTTER_AMPLITUDE: 3,
    BUTTERFLY_FLUTTER_FREQUENCY: 2,
    BUTTERFLY_DIRECTION_CHANGE_CHANCE: 0.02,
    BUTTERFLY_HUNGER_RATE: 2, // Slower hunger rate for balance
    BUTTERFLY_FEED_RATE: 10,
    BUTTERFLY_DETECTION_RADIUS: 150,
    BUTTERFLY_POLLINATION_RANGE: 30,
    POLLINATION_CHANCE: 0.05,

    // Bird
    BIRD_FLIGHT_SPEED: 60,
    BIRD_WALK_SPEED: 20,
    BIRD_DIRECTION_CHANGE_CHANCE: 0.01,
    BIRD_HUNGER_RATE: 1, // Slower hunger rate for balance
    BIRD_FEED_RATE: 15,
    BIRD_PERCH_CHANCE: 0.005,
    BIRD_LEAVE_PERCH_CHANCE: 0.02,
    BIRD_TREE_DETECTION_RANGE: 200,
    BIRD_WORM_DETECTION_RANGE: 100,
    BIRD_BUTTERFLY_DETECTION_RANGE: 80,
    BIRD_EATING_RANGE: 10,
    BIRD_BUTTERFLY_FEED_AMOUNT: 5,
    BIRD_FOOD_FOR_NEST: 100, // Reduced for more frequent nest creation
    BIRD_DESCEND_SPEED: 40,
    BIRD_ASCEND_SPEED: 40,

    // Worm
    WORM_WIGGLE_INTERVAL: 3000,
    WORM_WIGGLE_AMOUNT: 3,

    // Bush
    MIN_BUTTERFLIES_FOR_BUSH_HEALTH: 1,
    BUSH_HEALTH_DECAY_RATE: 0.5,
    BUSH_HEALTH_REGEN_RATE: 1,
    POLLINATION_THRESHOLD: 3,
    MAX_BUTTERFLIES_PER_BUSH: 3,

    // Tree
    MAX_NESTS_PER_TREE: 2,

    // Spawning
    BUTTERFLY_SPAWN_INTERVAL: 10000, // 10 seconds
    WORM_SPAWN_INTERVAL: 15000, // 15 seconds
    MAX_WORMS: 10,

    // Day/Night Cycle
    DAY_DURATION: 300000, // 5 minutes
    NIGHT_DURATION: 180000, // 3 minutes

    // UI
    MAX_EVENT_MESSAGES: 5,

    // Initial setup
    INITIAL_EMOJIS: [
        { id: 'bush', emoji: '🌺', disabled: false },
        { id: 'tree', emoji: '🌳', disabled: true }
    ],

    // Limits
    MAX_BUSHES: 5,
    MAX_TREES: 3,

    // Game balance
    INITIAL_BUTTERFLIES_PER_BUSH: 2,
    CHANCE_FOR_EXTRA_BUTTERFLY: 0.3
};
