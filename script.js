const getPoems = async () => {
    const url = "https://poetrydb.org/title";
    const response = await fetch(url);    
    if (response.status !== 200) {
        throw new Error('Oops... Something went wrong :(');
    }
    const poems = await response.json();
    if (poems.titles === undefined) {
        throw new Error('Oops... Something went wrong :(');
    }
    return poems.titles;
}

const selectTitle = async (titles) => {
    const title = titles[Math.floor(Math.random()*titles.length)];
    const url = "https://poetrydb.org/title/"+title;
    const response = await fetch(url);    
    if (response.status !== 200) {        
        throw new Error('Oops... Something went wrong :(');        
    }
    const poem = await response.json();
    if (poem[0] === undefined || (poem[0].lines.length > 42 && poem[0].lines.length >= 4)) return selectTitle(titles);
    else return poem[0];
}

const addBreaks = (lines) => {
    let poem = "";
    for (let i = 0; i < lines.length; i++) {
        poem += lines[i] + "<br>"
    }
    return poem;
}

let index = 0;
const typing = (poem, verses) => {    
    setTimeout(() => {
        if (index === poem.length) return;
        if (poem[index] === '<') index += 2;
        verses.innerHTML = poem.slice(0, index);
        index++;
        typing(poem, verses);
    }, 90);     
}

const author = document.getElementsByClassName("author")[0];
author.innerHTML = '<i class="fa-solid fa-scroll fa-2xl fa-fade"></i>'

getPoems()
    .then(titles => selectTitle(titles))
    .then(poem => {
        const title = document.getElementsByClassName("title")[0];
        title.innerHTML = poem.title;
        
        author.innerHTML = poem.author;
        const verses = document.getElementsByClassName("verses")[0];
        const lines = addBreaks(poem.lines);
        typing(lines, verses);
    })
    .catch(err => console.log(err.message))