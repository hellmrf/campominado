var field = [];
var open = [];
var gameOver = false;
const STATE_COVERED = 0;
const STATE_OPEN = 1;
const STATE_FLAGGED = 2;
const STATE_QUESTION = 3;
var print_panel_int = null;
var flags = 0;
var num_cells_open = 0;
//Function called by HTML.
function minesweeper(reff, matrix_width,matrix_height,bombs_num){
    window.ref = reff;
    window.matrix_height = matrix_height;
    window.matrix_width = matrix_width;
    window.bombs_num = bombs_num;
    init();
}

//init the game
function init(){
    field = [];
    open = [];
    gameOver = false;   
    campo = generate_bombs(matrix_width,matrix_height,bombs_num);
    matrix = evaluate_fields(campo);
    print(matrix);
    print_panel();
};

//Populate the panel with bombs and the clock
function print_panel(){
    document.getElementById('panel').style.display = 'block';
    clk = document.getElementById('panel_clock');
    bmb = document.getElementById('panel_bombs');
    clk.innerHTML = "0:00";
    bmb.innerHTML = window.bombs_num;
    flags = 0;
    stop_clock();
    start_clock();
}
function stop_clock(){
    clearInterval(print_panel_int);
    print_panel_int = null;
}
//write in the panel the number of bombs remaining 
function print_bombs(){
    document.getElementById('panel_bombs').innerHTML = bombs_num-flags;
}
function start_clock(){
    time = 0;
    print_panel_int = setInterval(function(){
        time++;
        min = Math.floor(time/60);
        sec = (time%60 >=10)? time%60 :"0"+time%60 ;
        clock = min+":"+sec;
        document.getElementById('panel_clock').innerHTML = clock;
    },1000);
}
//Print game according to "open" state.
function print(matrix){
    html = "";
    for(a = 0; a<matrix.length; a++){
        html+="<tr>";
        for(b = 0; b<matrix[a].length; b++){
            state = open[a][b];
            if(state==STATE_OPEN){
                c = (matrix[a][b]==0)?"":matrix[a][b];
                html+="<td data-index='"+a+","+b+"' class='open'>"+c+"</td>";
            }
            else if(state == STATE_FLAGGED){
                html+="<td data-index='"+a+","+b+"' class='flagged' oncontextmenu=\"right_clicked('"+a+","+b+"'); return false;\" onclick=\"clicked('"+a+","+b+"')\"></td>";
            }
            else if(state == STATE_QUESTION){
                html+="<td data-index='"+a+","+b+"' class='question' oncontextmenu=\"right_clicked('"+a+","+b+"'); return false;\" onclick=\"clicked('"+a+","+b+"')\"></td>";
            }
            else{
                html+="<td data-index='"+a+","+b+"' oncontextmenu=\"right_clicked('"+a+","+b+"'); return false;\" onclick=\"clicked('"+a+","+b+"')\"></td>";
            }
        }
        html+="</tr>";
    }
    ref.innerHTML = html;
}
//Write the whole matrix, including the numbers and bombs, independent of state.
//Called when game overs.
function print_elements(matrix){//TODO: remove this function
    html = "";
    for(a = 0; a<matrix.length; a++){
        html+="<tr>";
        for(b = 0; b<matrix[a].length; b++){
            if(matrix[a][b]=="*"){
                // html+="<td class='bomb open' onclick=\"clicked('"+a+","+b+"')\" data-index='"+a+","+b+"'>☼";
                html+="<td class='bomb open' onclick=\"clicked('"+a+","+b+"')\" data-index='"+a+","+b+"'>☼";
            }else if(matrix[a][b]==0){
                html+="<td class='empty open' onclick=\"clicked('"+a+","+b+"')\" data-index='"+a+","+b+"'>";
            }else{
                html+="<td class='open' onclick=\"clicked('"+a+","+b+"')\" data-index='"+a+","+b+"'>";
                html+= matrix[a][b];
            }
            html+="</td>";
        }
        html+="</tr>";
    }
    ref.innerHTML = html;
}

//Init a 0-filled matrix with sizes given and save in window.field.
function initiate_matrix(matrix_width,matrix_height){
    campo = [];
    open = [];
    for(a = 0; a<matrix_height; a++){
        campo[a] = [];
        open[a] = [];
        for(b = 0; b<matrix_width; b++){
            campo[a][b] = 0; 
            open[a][b] = STATE_COVERED;
        }
    }
    field = campo;
    return campo;
}

//Generate bombs randomly according to "bombs_num" num and matrix size
function generate_bombs(matrix_width, matrix_height, bombs_num){
    if(matrix_width*matrix_height<bombs_num){
        return false;
    }
    bombs = initiate_matrix(matrix_width,matrix_height);
    c=0;
    while(c<bombs_num){
        i = Math.floor(Math.random()*(matrix_height));
        j = Math.floor(Math.random()*(matrix_width));
        if(bombs[i][j] == "*"){
            continue;
        }else{
            bombs[i][j] = "*";
            c++;
        }
    }
    return bombs;
}
//Count the number of bombs in the neighborhood to generate field numbers
function evaluate_fields(matrix){
    for(a = 0; a<matrix.length; a++){
        for(b = 0; b<matrix[a].length; b++){
            if(matrix[a][b]!="*") continue;
            for(d=-1; d<=1;d++){
                for(e=-1; e<=1; e++){
                    if(d==0 && e==0) continue;
                    if(typeof matrix[a+d] !== "undefined" && typeof matrix[a+d][b+e] == "number"){//TODO: test if number?
                        matrix[a+d][b+e] += 1;
                    }else continue;
                }
            }
        }
    }
    return matrix;
}
//Square clicked! Receives the "data-index" attr of the square, that means i and j of the matrix.
function clicked(data_index){
    if(gameOver===true){
        return false;
    }
    indexes = data_index.split(",");
    var t = reveal(Number(indexes[0]),Number(indexes[1]));
    if(t===false){return false;}
    else if(t==="bomb"){game_over();}
    else{
        verify_win();
        print(field);
    }

    return;
}
function right_clicked(data_index){
    var indexes = data_index.split(",");
    i = Number(indexes[0]);
    j = Number(indexes[1]);
    state = open[i][j];
    if(state == STATE_COVERED){
        $this = document.querySelector("td[data-index='"+i+","+j+"'");
        $this.classList.add('flagged');
        flags++;
        print_bombs();
        open[i][j] = STATE_FLAGGED;
    }else if(state == STATE_FLAGGED){
        $this = document.querySelector("td[data-index='"+i+","+j+"'");
        $this.classList.remove('flagged');
        $this.classList.add('question');
        flags--;
        print_bombs();
        open[i][j] = STATE_QUESTION;
    }else if(state == STATE_QUESTION){
        $this = document.querySelector("td[data-index='"+i+","+j+"'");
        $this.classList.remove('question');
        $this.innerHTML="";
        open[i][j] = STATE_COVERED;
    }
    return false;
}

//Revealing the square clicked and neighborhood
function reveal(i,j){
    if(open[i][j] == STATE_OPEN || open[i][j] == STATE_FLAGGED || open[i][j] == STATE_QUESTION) return false;
    m = field;
    c = m[i][j];
    if(c=="*"){
        return "bomb";
    }else if(c!=0){
        open[i][j]=STATE_OPEN; 
        num_cells_open++;
        return;
    }
    uncover_neighborhood(i,j);
}
//When empty cell is clicked, its neighborhood are uncovered.
function uncover_neighborhood(i,j){
    list = [[i,j]];
    for(a of list){
        k = a[0];
        l = a[1];
        if(typeof m[k] == "undefined" || typeof m[k][l] == "undefined" || open[k][l]!=STATE_COVERED) continue;
        var d=m[k][l];
        if(d=="*") continue;
        open[k][l]=STATE_OPEN;   
        num_cells_open++;     
        if(d!=0) continue;
        list.push([k+1,l+1]);
        list.push([k+1,l-1]);
        list.push([k+1,l]);
        list.push([k-1,l]);
        list.push([k-1,l+1]);
        list.push([k-1,l-1]);
        list.push([k,l-1]);
        list.push([k,l+1]);
    }
}
function verify_win(){
    var cells = matrix_width*matrix_height-bombs_num;
    if(cells==num_cells_open) win();
    else return;
}
function win(){
    stop_clock();
    alert('Parabéns! Você dominou o tabuleiro com um tempo de '+document.getElementById('panel_clock').innerHTML+'! Jogue novamente para atingir seu melhor tempo, ou escolha um nível mais difícil.');
}
function game_over(){
    gameOver = true;
    stop_clock();
    print_elements(field);
    alert("Que pena, você perdeu! Tente novamente.");
}