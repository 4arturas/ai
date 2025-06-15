const FEATURE_NAMES = ["Size", "Legs", "Wings", "Tail", "Fur", "Aquatic", "Speed", "Aggression", "Intelligence"];
const ENTITIES = [
    { name: "Eagle",    features: [0.8, 2, 1, 1, 0.7, 0, 0.9, 0.6, 0.8] },
    { name: "Lion",     features: [0.9, 4, 0, 1, 1,   0, 0.8, 0.9, 0.7] },
    { name: "Dolphin",  features: [0.9, 0, 0, 1, 0,   1, 0.9, 0.3, 0.9] },
    { name: "Spider",   features: [0.1, 8, 0, 0, 0,   0, 0.3, 0.1, 0.2] },
    { name: "Chicken",  features: [0.4, 2, 1, 1, 0.8, 0, 0.4, 0.2, 0.3] },
    { name: "Octopus",  features: [0.6, 8, 0, 0, 0,   1, 0.5, 0.4, 0.8] },
    { name: "Elephant", features: [1,   4, 0, 1, 0.3, 0, 0.6, 0.5, 0.8] },
    { name: "Butterfly",features: [0.2, 6, 1, 0, 0,   0, 0.3, 0,   0.1] },
    { name: "Shark",    features: [0.9, 0, 0, 1, 0,   1, 0.9, 0.8, 0.5] },
    { name: "Giraffe",  features: [0.9, 4, 0, 1, 0.5, 0, 0.6, 0.3, 0.6] },
    { name: "Ant",      features: [0.1, 6, 0, 0, 0,   0, 0.2, 0.1, 0.2] },
    { name: "Penguin",  features: [0.5, 2, 1, 1, 0.7, 0.5, 0.5, 0.2, 0.6] }
];
// Normalized training data
const TRAINING_DATA = ENTITIES.map(entity => {
    const maxLegs = 8, maxWings = 1, maxTail = 1;
    return [
        entity.features[0],                     // size (0-1)
        entity.features[1] / maxLegs,           // legs
        entity.features[2] / maxWings,          // wings
        entity.features[3] / maxTail,           // tail
        entity.features[4],                     // fur (0-1)
        entity.features[5],                     // aquatic (0-1)
        entity.features[6],                     // speed (0-1)
        entity.features[7],                     // aggression (0-1)
        entity.features[8]                      // intelligence (0-1)
    ];
});