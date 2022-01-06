let inputArr = process.argv.slice(2);
console.log(inputArr);          //user will enter the command

let command = inputArr[0];
switch(command){
    case "tree":
        break;
    case "organize":
        break;
    case "help":
        break;
    default:
        console.log("Please enter a valid command");
}