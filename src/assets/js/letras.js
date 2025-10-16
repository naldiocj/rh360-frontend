function SoLetras(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toString();
    letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÀÈÌÒÙÂÊÔÇÕÃ-abcdefghijklmnopqrstuvwxyzáéíóúàèìòùâêô"
    
    especiais = [8,13];
    tecla_epecial = false
    for(var i in especiais){
    if(key == especiais[i]){
    tecla_especiais = true;
    }
    }
    if(letras.indexOf(tecla) == -1 && !tecla_especial){
    alert("Digite apenas Letras");
    return false;
    }
    
    }