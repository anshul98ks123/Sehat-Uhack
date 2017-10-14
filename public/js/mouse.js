$(function(){

    var canvas=document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    var BB=canvas.getBoundingClientRect();
    var offsetX=BB.left;
    var offsetY=BB.top;

    var lastX,lastY;
    var isDown=false;
    
    console.log(localStorage.getItem('myStorage'));
    var Xcoordinate = [];
    var Xindex=0,Yindex=0,Xmean=0,Ymean=0;
    var Ycoordinate = [];
    
    canvas.onmousedown=handleMousedown;
    canvas.onmousemove=handleMousemove;
    canvas.onmouseup=handleMouseup;

    function handleMousedown(e){
         e.preventDefault();
         e.stopPropagation();
         lastX=e.clientX-offsetX;
         lastY=e.clientY-offsetY;
         isDown=true;
    }
    var arr = []
    var ctr=1,error = 0,index=0;
    var errorsum = 0;
    
    function handleMouseup(e){
         e.preventDefault();
         e.stopPropagation();
         isDown=false;
         console.log("Error = " + errorsum/ctr);

         var value = errorsum/ctr;
         if(value>100)
            value=100;
         obj = JSON.parse(localStorage.getItem('myStorage'));
         if(obj===null) obj = {};
         console.log(obj);
         if(obj['data'] == null){
            obj['data'] = [value];
         } else {
            obj['data'].push(value);
         }
         localStorage.setItem('myStorage',JSON.stringify(obj));
         
         $.post('mousejson',{arr: obj},function() {
            console.log("Written to JSON");
         });
         
         location.reload();
         //console.log(obj);
    }

    function handleMousemove(e){
         e.preventDefault();
         e.stopPropagation();

         if(!isDown){return;}

         var mouseX=e.clientX-offsetX;
         var mouseY=e.clientY-offsetY;

         ctx.beginPath();
         ctx.moveTo(lastX,lastY);
         ctx.lineTo(mouseX,mouseY);
         ctx.stroke();

         lastX=mouseX;
         lastY=mouseY;
         //console.log(lastX,lastY)
        //  if(lastX>100)
        //     lastX = 100;
        // if(lastY>100)
        //     lastY = 100;
         Xcoordinate[Xindex++] = lastX;
         Xmean+=lastX;
         Ycoordinate[Yindex++] = lastY;
         Ymean+=lastY;
         
         var y = lastX;
         var delta = Math.abs(lastY - y);
         var error = (2*delta/y)*100;
         errorsum+=error;
         ctr++;
    }
    
    function buildInitial() {
        console.log("hello")
        ctx.beginPath();
        ctx.lineWidth=5;
        ctx.moveTo(0,0);
        ctx.lineTo(250,250);
        ctx.stroke();
    }
    buildInitial();

for(let i=0;i<Xcoordinate.length;i++)
    Xmean+=Xcoordinate[i];

for(let i=0;i<Ycoordinate.length;i++)
    Ymean+=Ycoordinate[i];
ctr=Ycoordinate.length;


}); // end $(function(){})
