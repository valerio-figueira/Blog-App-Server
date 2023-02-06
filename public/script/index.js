if(document.querySelector(".folder-container")){
    const folderBtn = document.querySelector(".folder-btn");
    const folderContent = document.querySelector(".folder-content");

    folderBtn.addEventListener("click", () => {
        if(!folderContent.matches(".open")){
            folderContent.classList.add("open");
        } else{
            folderContent.classList.remove("open");
        };
    });
};






if(document.querySelector(".elements-container")){
    const elements = document.querySelectorAll(".elements-container .element");
    const container = document.querySelector("#post-content");

    elements.forEach(element => {
        element.addEventListener("click", (e) => {
            if(e.target.id == "h2-tag"){
                container.value += '<h2></h2>'
            } else if(e.target.id == "h3-tag"){
                container.value += '<h3</h3>'
            } else if(e.target.id == "h4-tag"){
                container.value += '<h4></h4>'
            } else if(e.target.id == "h5-tag"){
                container.value += '<h5></h5>'
            } else if(e.target.id == "h6-tag"){
                container.value += '<h6></h6>'
            } else if(e.target.id == "p-tag"){
                container.value += '<p></p>'
            } else if(e.target.id == "img-tag"){
                container.value += '<img src="" alt="">'
            } else if(e.target.id == "anchor-tag"){
                container.value += '<a href="" rel="next" target="_blank" ></a>'
            } else if(e.target.id == "ul-tag"){
                container.value += `<ul><li></li></ul>`
            }
        })
    })
}