import moment from 'moment';

const timer = (startTime, endTime) => {
    let start = new moment(startTime);
    let end = new moment();

    if (endTime !== null && endTime.length !== 0) {
        end = new moment(endTime);
    }

    return end.diff(start, "minutes");
}

export const scoreValidation = (newValue, row, column) => {
    if (isNaN(newValue) || newValue < 1 || newValue > 5) {
        return {
            valid: false,
            message: 'The value should be number and in the range of 1 - 5'
        };
    } else {
        return true;
    }
}

export default timer;