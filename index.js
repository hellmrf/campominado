//addEvenetListener for level buttons
for(i of document.getElementsByClassName('level')){
    i.addEventListener('click',function(ev){
        if(!ev.currentTarget.classList.contains('active')){
            for(i of document.getElementsByClassName('level')){
                i.classList.remove('active');
            }
            ev.currentTarget.classList.add('active');
        }
    });
}
reff = document.querySelector("#minesweeper");
function setLevel(level){
    switch(level){
        case 'easy':
            howto_close();
            document.getElementById('form').style.display = 'none';
            minesweeper(reff,9,9,10);
            break;
        case 'medium':
            howto_close();
            document.getElementById('form').style.display = 'none';
            minesweeper(reff,16,16,40);
            break;
        case 'hard':
            howto_close();
            document.getElementById('form').style.display = 'none';
            minesweeper(reff,30,15,99);
            break;
        default:
            howto_close();
            document.getElementById('form').style.display = 'block';
            break;
    }
}
//start the game in Custom mode
document.getElementById('form').addEventListener('submit',function(ev){
    ev.preventDefault();
    width = document.getElementById('width').value;
    height = document.getElementById('height').value;
    bombs = document.getElementById('bombs').value;
    minesweeper(reff,width,height,bombs);
    return false;
});

//init the tutorial
function howto(){
    document.getElementById('howto').style.display = "block";
}
function howto_close(){
    document.getElementById('howto').style.display = "none";
    document.getElementById('howto_button').style.display = 'none';
}