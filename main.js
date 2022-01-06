let fs = require("fs");
let path = require("path");

let types={
    media: ["mkv", "mp4"],
    documents: ["docx","txt","pdf","xlsx","ods"],
    app: ["exe","pkg"]
}

let inputArr = process.argv.slice(2);   //user will enter the command
let command = inputArr[0];
switch(command){
    case "tree":
        treeFn(inputArr[1]);
        break;
    case "organize":
        organizeFn(inputArr[1]);
        break;
    case "help":
        helpFn(inputArr[1]);
        break;
    default:
        console.log("Please enter a valid command");
        break;
}
function treeHelper(dirPath,indent){
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        console.log(indent+ "|--" + path.basename(dirPath));
    }
    else{
        console.log(indent + "|__" + path.basename(dirPath));
        let files = fs.readdirSync(dirPath);
        for(let i=0;i<files.length;i++){
            let filePath = path.join(dirPath,files[i]);
            treeHelper(filePath,indent+"\t");
        }
    }
}
function treeFn(directoryPath){
    if(directoryPath===undefined){          //directoryPath is given by the user
        console.log("Please enter a valid path");
        return;
    }
    let doesExist=fs.existsSync(directoryPath);
    if(doesExist){
        treeHelper(directoryPath,"");
    }
    else{
        console.log("Please enter a valid path");
        return;
    }
}
function organizeFn(directoryPath){
//steps
//1. take directory path input
//2. create an organized direcory
//3. check all the files and categorize them
//4. copy these files to the organized directory
    if(directoryPath===undefined){          //directoryPath is given by the user
        console.log("Please enter a valid path");
        return;
    }

    let doesExist=fs.existsSync(directoryPath);
    if(doesExist){
        let destPath = path.join(directoryPath,"organized_folder");             //user given path + organized folder
        if(fs.existsSync(destPath)===false)             //edge case, if the folder does not exist then only create it
            fs.mkdirSync(destPath);
        let filenames = fs.readdirSync(directoryPath);       //array of all the files at directory path given by the user
        for(let i=0;i<filenames.length;i++){
            let fileAddress = path.join(directoryPath,filenames[i]);    //getting the address of each file in the given directory
            let isFile = fs.lstatSync(fileAddress).isFile();
            if(isFile){
                let ext = path.extname(filenames[i]);
                ext  = ext.slice(1);        //since we don't want the dot in the extension name
                let category="others";
                for(let type in types){
                    let arr = types[type];
                    for(let i=0;i<arr.length;i++){
                        if(ext === arr[i]){
                            category=type;
                            break;
                        }
                    }
                }
                console.log(filenames[i],"belongs to",category);
                let categoryPath = path.join(destPath,category);    //user path + organized folder + category 
                if(fs.existsSync(categoryPath)===false){
                    fs.mkdirSync(categoryPath);
                }
                let fileName = path.basename(fileAddress);          //extracting the file name of each file from its path
                let desFilePath = path.join(categoryPath,fileName);     //user path + organized folder + category + filename
                fs.copyFileSync(fileAddress,desFilePath);
                //fs.unlinkSync(fileAddress);         //remove the file from the user directory
            }
        }
    }
    else{
        console.log("Please enter a valid path");
        return;
    }
}
function helpFn(directoryPath){
    console.log("Help command implemented for", directoryPath);
}