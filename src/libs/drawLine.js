/* drawLine 绘制关系连线 */
function drawLine (canvas, start, end) {
    /* 获取元素坐标 */
    function getXY (obj) {
        let x = 0,y = 0;
        if (obj.getBoundingClientRect) {
            let box = obj.getBoundingClientRect();
            let D = document.documentElement;
            x = box.left + Math.max(D.scrollLeft, document.body.scrollLeft) - D.clientLeft ;
            y = box.top + Math.max(D.scrollTop, document.body.scrollTop) - D.clientTop

            //x = box.left
            //x2 = box.right
            // y = box.top + box.height / 2

        }
        else{
            for (; obj != document.body; x += obj.offsetLeft, y += obj.offsetTop, obj = obj.offsetParent) {}
        }
        return {
            x: x,
            y: y,
        }
    }
    /* 元素相对画布位置 */
    function getPosition (obj) {
        let x = getXY(obj).x - getXY(canvas).x
        let y = getXY(obj).y - getXY(canvas).y
        return {
            x:  x,
            y : y
        }
    }
    /* 获取画笔起始位置 */
    function getLineStart(obj) {
        // console.log(obj.getBoundingClientRect().width)
        let x = getPosition(obj).x + obj.getBoundingClientRect().width
        let y = getPosition(obj).y + obj.getBoundingClientRect().height / 2
        return {
            x: x,
            y: y
        }
    }
    /* 获取画笔结束位置 */
    function getLineEnd(obj) {
        let x = getPosition(obj).x - 10
        let y = getPosition(obj).y + obj.getBoundingClientRect().height / 2
        return {
            x: x,
            y: y
        }
    }
    let c = document.getElementById('canvas');
    let ctx = c.getContext("2d");
    ctx.beginPath();

    ctx.moveTo(getLineStart(start).x, getLineStart(start).y); // 创建起点


    let r = (getLineEnd(end).x - getLineStart(start).x)/2
    let x1 = getLineStart(start).x + r
    let y1 = getLineStart(start).y
    let x2 = x1
    let y2 = y1 + r

    let x3, y3, x4, y4
    x3 = x1
    y3 = getLineEnd(end).y
    x4 = getLineEnd(end).x
    y4 = y3

    if ( getLineStart(start).y === getLineEnd(end).y ) { // 水平连线时
        ctx.lineTo(getLineEnd(end).x, getLineEnd(end).y);
    } else {
        ctx.arcTo(x1, y1, x2, y2, r);   // 创建一个弧
        ctx.lineTo(x1, getLineEnd(end).y - r);           // 继续垂直线
        ctx.arcTo(x3, y3, x4, y4, r);   // 创建一个弧
    }

    ctx.strokeStyle="#e5e5e5";
    ctx.lineWidth=3;
    ctx.stroke();


}
export default drawLine
