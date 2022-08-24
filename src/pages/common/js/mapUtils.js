/**
 * 地图空间数据计算工具类
 */

/**
 * 根据起点终点计算相对坐标
 * @param {起点} g1 
 * @param {终点} g2 
 */
function calcPoint(g1, g2) {
    if (g1 == g2) return 0;

    // 差值、绝对值、绝对值半值
    var val_diff = g2 - g1;
    var val_abso = Math.abs(val_diff);
    var val_half = val_abso / 2;

    // 相对坐标标量
    var p = Math.sin(val_half);

    // 符号量
    var smbl = val_diff / val_abso;
    return smbl * p;
}

/**
 * 计算目标在向量AB的左右
 * 经度=longitude=lng
 * 纬度=latitude=lat
 * 
 * @param {起点纬度} latA 
 * @param {起点经度} lngA 
 * @param {终点纬度} latB 
 * @param {终点经度} lngB 
 * @param {目标纬度} latC 
 * @param {目标经度} lngC 
 */
function calcPosition(latA, lngA, latB, lngB, latC, lngC) {
    /**
     * 在平面坐标系内，有：
     * 起点A(x1,y1)
     * 终点B(x2,y2)
     * 目标C(x3,y3)
     * 
     * 计算S(A,B,C) = (x1-x3)*(y2-y3)-(y1-y3)*(x2-x3)
     * 如果S>0 C在AB左
     * 如果S<0 C在AB右
     * 如果S=0 C在AB上
     * 
     * 以A为平面坐标系原点，则A(0,0)
     * S等价于P=x2*y3-x3*y2
     * 
     */

    // B相对坐标
    var x2 = calcPoint(lngA, lngB);
    var y2 = calcPoint(latA, latB);

    // C相对坐标
    var x3 = calcPoint(lngA, lngC);
    var y3 = calcPoint(latA, latC);

    return x2 * y3 - x3 * y2;
}

/**
 * 计算点到线的距离
 * @param {*} pointA 
 * @param {*} pointB 
 * @param {*} pointT 
 */
function calcDistance(pointA, pointB, pointT) {
    // 相对坐标 A(0,0)
    var x_A = 0;
    var y_A = 0;

    var x_B = calcPoint(pointA[1], pointB[1]);
    var y_B = calcPoint(pointA[0], pointB[0]);

    var x_T = calcPoint(pointA[1], pointT[1]);
    var y_T = calcPoint(pointA[0], pointT[0]);

    // var cross = (x_B - x_A) * (x_T - x_A) + (y_B - y_A) * (y_T - y_A);
    // if (cross <= 0) return Math.sqrt((x_T - x_A) * (x_T - x_A) + (y_T - y_A) * (y_T - y_A));
    // if (cross <= 0) return undefined;

    // var d2 = (x_B - x_A) * (x_B - x_A) + (y_B - y_A) * (y_B - y_A);
    // if (cross >= d2) return Math.sqrt((x_T - x_B) * (x_T - x_B) + (y_T - y_B) * (y_T - y_B));
    // if (cross >= d2) return undefined;

    // var r = cross / d2;
    // var px = x_A + (x_B - x_A) * r;
    // var py = y_A + (y_B - y_A) * r;
    // return Math.sqrt((x_T - px) * (x_T - px) + (py - y_A) * (py - y_A));

    var l_AB = Math.sqrt(x_B * x_B + y_B * y_B);
    var l_AT = Math.sqrt(x_T * x_T + y_T * y_T);
    var l_BT = Math.sqrt((x_B - x_T) * (x_B - x_T) + (y_B - y_T) * (y_B - y_T));

    // if (Math.abs(x_T) > Math.abs(x_B) || Math.abs(y_T) > Math.abs(y_B)) return undefined;
    if (l_AT > l_AB || l_BT > l_AB) return undefined;
    // debugger;

    // 海伦公式
    var l_SH = (l_AB + l_AT + l_BT) / 2;
    if (Math.abs(l_SH - l_AB) < 0.00000000000000000001) l_SH = l_AB;

    var dist = 0;
    var is_in_line = false;
    if (l_SH == l_AB || l_SH == l_AT || l_SH == l_BT || (x_B == 0 && x_T == 0) || (y_B == 0 && y_T == 0)) {
        is_in_line = l_AT <= l_AB && l_BT <= l_AB;
    } else {
        var s = Math.sqrt(l_SH * (l_SH - l_AB) * (l_SH - l_AT) * (l_SH - l_BT));
        dist = 2 * s / l_AB;
    }

    var obj = new Object();
    obj.isInLine = is_in_line;
    obj.l_AT = l_AT;
    obj.dist = dist;
    return obj;
}

/**
 * 寻找目标点所在的相邻两点
 * 
 * @param {*} lineArray 
 * @param {*} pointT 
 */
function findAdjacent(lineArray, pointT) {
    var indexA = -1;
    var indexB = -1;
    var distAT = -1;
    var minDist = 1000000;
    for (let i = 1; i < lineArray.length; i++) {
        const pointA = lineArray[i - 1];
        const pointB = lineArray[i];

        var distObj = calcDistance(pointA, pointB, pointT);
        // console.log(dist);
        if (distObj == undefined) continue;

        if (distObj.dist == 0) {
            // 距离为0 共线
            if (distObj.isInLine) {
                minDist = 0;
                indexA = i - 1;
                indexB = i;
                distAT = distObj.l_AT;
            }
        } else {
            // 距离最小的 T在AB之间
            if (distObj.dist < minDist) {
                minDist = distObj.dist;
                indexA = i - 1;
                indexB = i;
                distAT = distObj.l_AT;
            }
        }
    }
    // console.log(indexA);
    // console.log(indexB);

    if (indexA == -1) return undefined;

    var obj = new Object();
    obj.indexA = indexA;
    obj.indexB = indexB;
    obj.point = pointT;
    obj.distAT = distAT;
    return obj;
}

/**
 * 对交点数组排序 与分割线的顺序一致
 * @param {*} lineArray 
 * @param {*} crossArray 
 */
function sortCrossPoint(lineArray, crossArray) {
    var indexArray = new Array();
    for (let c = 0; c < crossArray.length; c++) {
        const cross_point = crossArray[c];
        var indexObj = findAdjacent(lineArray, cross_point);
        if (indexObj == undefined) continue;
        indexArray.push(indexObj);
    }

    // 排序 坐标从小到大 点到A的距离从小到大
    var sortedIndexArray = indexArray.sort(function (a, b) {
        if (a.indexA == b.indexA) {
            return a.distAT - b.distAT;
        } else {
            return a.indexA - b.indexA;
        }
    });
    // console.log("排序的交点数组：");
    // console.log(sortedIndexArray);

    return sortedIndexArray;
}

/**
 * 将交点插入到分割线数组中
 * @param {*} lineArray 
 * @param {*} crossArray 
 */
function joinCrossPoint(lineArray, crossArray) {
    var indexArray = new Array();
    for (let c = 0; c < crossArray.length; c++) {
        const cross_point = crossArray[c];
        var indexObj = findAdjacent(lineArray, cross_point);
        if (indexObj == undefined) continue;
        indexArray.push(indexObj);
    }

    // 排序 坐标从大到小
    var sortedIndexArray = indexArray.sort(function (a, b) {
        return b.indexA - a.indexA;
    });
    // console.log("交点数组：");
    // console.log(sortedIndexArray);

    // 合并交点到线
    for (let i = 0; i < sortedIndexArray.length; i++) {
        const obj = sortedIndexArray[i];
        lineArray.splice(obj.indexB, 0, obj.point);
    }
    // console.log("合并后的数组：");
    // console.log(lineArray);

    // 返回第一个交点到最后一个交点之间的线段
    var length = sortedIndexArray.length;
    var start = sortedIndexArray[length - 1].indexB;
    var end = sortedIndexArray[0].indexA + length;
    var resultArray = lineArray.slice(start, end + 1);
    // console.log("第一个交点到最后一个交点之间的数组：");
    // console.log(resultArray);
    return resultArray;
}

/**
 * 将交点插入到圈圈数组中
 * @param {*} circleArray 
 * @param {*} lineArray 
 * @param {*} crossArray 
 */
function joinCrossPointToCircle(circleArray, lineArray, crossArray) {
    var indexArray = new Array();
    for (let c = 0; c < crossArray.length; c++) {
        const cross_point = crossArray[c];
        var indexObj = findAdjacent(circleArray, cross_point);
        if (indexObj == undefined) continue;
        indexArray.push(indexObj);
    }
    if (indexArray.length < 2) return undefined;

    // 排序 坐标从大到小
    var sortedIndexArray = indexArray.sort(function (a, b) {
        return b.indexA - a.indexA;
    });
    // console.log("交点数组：");
    // console.log(sortedIndexArray);

    // 合并交点到线
    for (let i = 0; i < sortedIndexArray.length; i++) {
        const obj = sortedIndexArray[i];
        circleArray.splice(obj.indexB, 0, obj.point);
    }
    // console.log("合并后的数组：");
    // console.log(circleArray);
    // 返回第一个交点到最后一个交点之间的两个线段
    var length = sortedIndexArray.length;
    
    // 第一个交点、最后一个交点 在circleArray上的下标
    var start = sortedIndexArray[length - 1].indexB;
    var end = sortedIndexArray[0].indexA + length;
    
    // 入射向量 以分割线顺序为准的前两个交点
    // cross_point_1为起点，cross_point_2为终点的向量
    var sortedCrossPointOrderByLine = sortCrossPoint(lineArray, crossArray);
    var cross_point_1 = sortedCrossPointOrderByLine[0].point;
    var cross_point_2 = sortedCrossPointOrderByLine[1].point;

    // circleArray上第一个交点到最后一个交点之间的数组
    let resultArray = circleArray.slice(start, end + 1);
    // console.log("第一个交点到最后一个交点之间的数组：");
    // console.log(resultArray);

    // CircleArray上紧随第一个交点之后的点 相对对入射向量的方向判定
    var point2 = circleArray[start + 1];
    var p = calcPosition(cross_point_1[0], cross_point_1[1], cross_point_2[0], cross_point_2[1], point2[0], point2[1]);
    // point2在resultArray内 p>0说明point2在入射向量左 p<0说明point2在入射向量右

    // 位置变量 标记结果线段在入射向量的哪一侧
    var resultPositionFlag = "";
    var otherPositionFlag = "";
    if (p > 0) {
        var resultPositionFlag = "left";
        var otherPositionFlag = "right";
    } else {
        var resultPositionFlag = "right";
        var otherPositionFlag = "left";
    }

    // circleArray上第一个交点到最后一个交点另一侧的数组
    let otherArray = new Array();
    var otherLength = circleArray.length - resultArray.length + 1;
    for (let o = 0; o < otherLength; o++) {
        var otherIndex = start - o;
        if (otherIndex < 0) otherIndex = otherIndex + circleArray.length - 1;
        const other_point = circleArray[otherIndex];
        otherArray.push(other_point);
    }
    // console.log("第一个交点到最后一个交点另一侧的数组：");
    // console.log(otherArray);

    let resultObject = new Object();
    resultObject[resultPositionFlag] = resultArray;
    resultObject[otherPositionFlag] = otherArray;

    // console.log("入射向量左右的结果数组：");
    // console.log(resultObject);

    return resultObject;
}

export default {
    sortCrossPoint,
    joinCrossPoint,
    joinCrossPointToCircle
}
