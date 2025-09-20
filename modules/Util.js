function clockWiseDiff(start, end) {
    let diff = start - end;
    if (diff < 0) diff = diff + 2 * Math.PI;
    return diff;
}

export const Util = {clockWiseDiff};