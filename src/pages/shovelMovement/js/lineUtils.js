
import mapUtils from "../../common/js/mapUtils";
import { point,lineString,lineToPolygon,lineIntersect,getCoord,getCoords,booleanPointInPolygon } from '@turf/turf'
import  '../js/leaflet.geometryutil';


/**
 * 生成路径
 * @param {*} map 
 * @param {*} lineArea 
 * @param {*} startDistance 
 * @param {*} startPoint 
 * @param {*} startAngle 
 * @param {*} startDirection 
 */
function getPath(map, lineArea, startDistance, startPoint, startAngle, startDirection){
    // 生成路径
    let lineNew = [];
    let crossNew = [];

    //起始点
    let line = lineString(lineArea);
    let pt = point(startPoint);
    // console.log(line,pt)

    // 起始点在区域内，不能规划路径
    let pointInArea = booleanPointInPolygon(pt,lineToPolygon(line));
    if(pointInArea){
      return null;
    }

    // 起始点与方向所在的线段与区域的交点
    let firstPts = getCoord(pt);
    let firstPt =  L.latLng(firstPts);
    let nextPt = L.GeometryUtil.destination(firstPt, startAngle, startDistance);
    let nextPts = [nextPt.lat,nextPt.lng];
    let checkLinesObject = getCrossLine(line,firstPts,nextPts,startAngle,startDistance);
    let checkLine = checkLinesObject.line;
    let checkCross = checkLinesObject.cross;
    // 没有交点，不能规划路径
    if(checkCross.length == 0){
      return null;
    }

    // // 起始点距离区域最近的第一个点
    // let firstPoint = L.GeometryUtil.closest(map,lineArea,getCoord(pt));
    // let firstPoints = [firstPoint.lat,firstPoint.lng];
    // let nextPoint = L.GeometryUtil.destination(firstPoint, startAngle, startDistance);
    // let nextPoints = [nextPoint.lat,nextPoint.lng];
    // // 找到与区域相交的第一段线
    // let firstLinesObject = getCrossLine(line,firstPoints,nextPoints,startAngle,startDistance,true);
    // let firstLines = firstLinesObject.line;
    // let firstCross = firstLinesObject.cross;
    // lineNew.push(firstLines);
    // crossNew.push(firstCross);

    // 起始点与方向所在的线段与区域的第一个交点
    let checkPointSort = mapUtils.sortCrossPoint(checkLine,checkCross);
    let firstCross = checkPointSort.map(v=>v.point);
    let firstPoints = firstCross[0];

    // 找到与区域相交的第一段线
    lineNew.push(checkLine);
    crossNew.push(firstCross);
    // console.log(checkLine,checkCross,firstCross);

    // 找到其他的平行线
    let count = 1;
    let countMax = 100;
    while(true){
      let nextLinesNewObject = getParallelLine(line,firstPoints,startAngle,startDirection,startDistance,startDistance * count);
      let nextLinesNew = nextLinesNewObject.line;
      let nextCrossNew = nextLinesNewObject.cross;
      if(nextLinesNew.length == 0){
         break;
      }
      let intersects  = lineIntersect(line,lineString(nextLinesNew));
      if(intersects.features.length < 1 || count > countMax){
        break;
      } 
      count++;
      lineNew.push(nextLinesNew);
      crossNew.push(nextCrossNew);
    }
    // console.log(crossNew,lineNew);

    // 连线实现z字形，线的排序规则为：偶数正序、奇数倒序
    let crossNew2 = crossNew.map((v,i)=>{
        if(i % 2 != 0){
          return v.reverse();
        }
        return v;
    });
    let cross = crossNew2.flat();
    return {
      cross:cross,
      line:lineNew,
      firstLine: checkLine
    };
  }
  
  /**
   * 生成相交线
   * @param {*} line 
   * @param {*} firstPoints 
   * @param {*} nextPoints 
   * @param {*} startAngle 
   * @param {*} startDistance 
   * @param {*} isFirst 
   */
  function getCrossLine(line, firstPoints, nextPoints, startAngle, startDistance,isFirst=false){
    // 根据初始点、角度、距离确定方向上最小的第一段线段
    let firstLine = lineString([firstPoints,nextPoints]);
    let firstLines = getCoords(firstLine);

    // 找到与区域相交的第一段线
    let intersects  = lineIntersect(line,firstLine);
    let count = 2;
    let countMax = 100;
    while(true){
      let nextPoint = L.GeometryUtil.destination(L.latLng(firstPoints), startAngle, startDistance * count);
      let nextPoints2 = [nextPoint.lat,nextPoint.lng];
      firstLines.push(nextPoints2);
      let strLine = lineString(firstLines);
      intersects  = lineIntersect(line,strLine);
      count++;
      if(count > countMax){
        if(intersects.features.length < 1){
          // 没有交点，返回原始的线
          firstLines = getCoords(firstLine);
          intersects  = lineIntersect(line,firstLine);
        }
        break;
      }
    }

    //排序后的交点坐标
    let crossPoint = [];
    if(intersects.features.length > 0){
      let intersectPoints = intersects.features.map(v=>v.geometry.coordinates);
      if(isFirst){
        intersectPoints.unshift(firstPoints);
      }
      let intersectPointsSort = mapUtils.sortCrossPoint(firstLines,intersectPoints);
      // console.log(firstLines,intersectPoints,intersectPointsSort);
      let startPoint = intersectPointsSort[0].point;
      let endPoint = intersectPointsSort[intersectPointsSort.length-1].point;
      crossPoint = intersectPoints.length > 1 ? [startPoint, endPoint] : [startPoint];
    }
    // console.log(intersects,crossPoint);

    return {
      line:firstLines,
      cross:crossPoint
    }
  }
  
  /**
   * 生成平行线
   * @param {*} line 
   * @param {*} firstPoints 
   * @param {*} startAngle 
   * @param {*} startDirection 
   * @param {*} startDistance 
   * @param {*} nextDistance 
   */
  function getParallelLine(line,firstPoints,startAngle,startDirection,startDistance,nextDistance){
    // 找到其他的平行线
    let angle = startAngle - 90;
    if(startDirection == 1){
      // 右边顺时针
      angle = startAngle + 90;
    }
    let nextPoint = L.GeometryUtil.destination(L.latLng(firstPoints), angle, nextDistance);
    let nextPoints = [nextPoint.lat,nextPoint.lng];
    let secondLinesNew = [];
    let secondCrossNew = [];
    let nextPoint2 = L.GeometryUtil.destination(nextPoint, startAngle, startDistance);
    let nextPoints2 = [nextPoint2.lat,nextPoint2.lng];
    let secondLinesObject = getCrossLine(line,nextPoints,nextPoints2,startAngle,startDistance);
    let secondLines = secondLinesObject.line;
    let secondCross = secondLinesObject.cross;

    // 反方向找到另一个交点
    let nextPoint3 = L.GeometryUtil.destination(L.latLng(nextPoints), startAngle + 180, startDistance);
    let nextPoints3 = [nextPoint3.lat,nextPoint3.lng];
    let secondLinesObject2 = getCrossLine(line,nextPoints,nextPoints3,startAngle + 180,startDistance);
    let secondLines2 = secondLinesObject2.line;
    let secondCross2 = secondLinesObject2.cross;
    secondLines2.reverse();
    secondCross2.reverse();

    // 按初始方向拼接的线
    secondLinesNew = [...secondLines2,...secondLines];
    secondCrossNew = [...secondCross2,...secondCross];
    // console.log(secondLinesObject2,secondLinesObject,secondCross2,secondCross,secondCrossNew);

    return {
      line:secondLinesNew,
      cross:secondCrossNew
    };
  }

  /**
   * 地图坐标点沿着某个中心点旋转角度后得到的位置点坐标
   * @param {*} map 
   * @param {*} latlngPoint 
   * @param {*} angleDeg 
   * @param {*} latlngCenter 
   */
  function rotatePoint(map, latlngPoint, angleDeg, latlngCenter){
    return L.GeometryUtil.rotatePoint(map,latlngPoint,angleDeg,latlngCenter);
  }

  export default {
      getPath,
      rotatePoint
  }