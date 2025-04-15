export const setNewOffset  = (card, mouseMoveDir = {x:0, y:0}) =>{
    const offsetLeft = card.offsetLeft - mouseMoveDir.x
    const offsetTop = card.offsetTop - mouseMoveDir.y

    return {
        x:offsetLeft <0 ? 0:offsetLeft,
        
        x:offsetTop <0 ? 0:offsetTop,
    }
};
export const bodyParser = (value) => {
    try{
return JSON.parse(value)
    }catch(error){
return value;
    }
}