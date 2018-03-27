const getCandidates = (candidates) => ({
    type: "GET_CANDIDATES",
    payload: candidates
});

export const updateTestScore = (newData) => ({
    type: "UPDATE_TEST_SCORE",
    payload: newData
});

export const updateL1Score = (newData) => ({
    type: "UPDATE_L1_SCORE",
    payload: newData
});

export const updateL1Status = (newData) => ({
    type: "UPDATE_L1_STATUS",
    payload: newData
});

export const updateGKScore = (newData) => ({
    type: "UPDATE_GK_SCORE",
    payload: newData
});

export const updateGKStatus = (newData) => ({
    type: "UPDATE_GK_STATUS",
    payload: newData
});

export default getCandidates;